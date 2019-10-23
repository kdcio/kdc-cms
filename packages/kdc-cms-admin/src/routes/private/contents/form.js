import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import slugify from 'slugify';
import { Card, CardBody, CardHeader, Form, Button } from 'reactstrap';
import { useContentTypeList } from '../../../context/contentTypeList';
import api from '../../../utils/api';
import LoadingOverlay from '../../../components/loadingOverlay';
import FormError from '../../../components/formError';
import RenderField from '../../../components/RenderField';

const ContentsForm = ({ id, slug }) => {
  const { getType, fetchList: fetchTypeList } = useContentTypeList();
  const { register, handleSubmit, setValue, errors, setError } = useForm();
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const type = getType(id);

  const onSubmit = (data) => {
    const body = {};
    const { fields, sortKey } = type;
    setIsLoading(true);

    fields.forEach(({ name, ftype }) => {
      let value = data[name];
      if (value && ftype !== 'bool') {
        value = value.trim();
      }
      if (!value || value === '') return;
      body[name] = value;
    });

    if (!body.Name) {
      setError('Name', 'required');
      setIsLoading(false);
      return;
    }

    if (!body.Slug) {
      setError('Slug', 'required');
      setIsLoading(false);
      return;
    }

    if (!body[sortKey]) {
      setError(sortKey, 'required');
      setIsLoading(false);
      return;
    }

    if (id && slug) {
      api(`contents/${id}/${slug}`, { body, method: 'PUT' })
        .then(() => {
          navigate(`/contents/${id}`);
        })
        .catch((e) => {
          if (e.error === 'SortKeyInvalid') {
            setError(sortKey, e.error, e.message);
          } else {
            setError('api', e.error, e.message);
          }

          setIsLoading(false);
        });
    } else {
      api(`contents/${id}`, { body })
        .then(async () => {
          await fetchTypeList();
          navigate(`/contents/${id}`);
        })
        .catch((e) => {
          setError('api', e.error, e.message);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!id || !slug) return;
    setIsLoading(true);

    api(`contents/${id}/${slug}`)
      .then((data) => {
        setInitialValues(data);
      })
      .then(() => setIsLoading(false))
      .catch((e) => {
        setError('loading', e.error, e.message);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, slug]);

  if (!type) return null;
  const { fields } = type;

  const onNameChange = (e) => {
    const Name = e.target.value;
    if (Name && Name.length > 0) {
      const Slug = slugify(Name, { lower: true });
      setValue('Slug', Slug);
    }
  };

  let fieldInputs = null;
  if (fields) {
    fieldInputs = fields.map((f) => (
      <RenderField
        key={f.name}
        name={f.name}
        type={f.type}
        register={register}
        initialValue={initialValues[f.name]}
        onChange={f.name === 'Name' ? onNameChange : null}
        setValue={setValue}
        setIsLoading={setIsLoading}
        errors={errors}
      />
    ));
  }

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3 className="m-0">{id && slug ? `Edit ${type.name}` : `Add ${type.name}`}</h3>
          <Link className="btn btn-sm btn-danger" to={`/contents/${id}`}>
            Cancel
          </Link>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormError errors={errors} name="loading" />
            {fieldInputs}
            <hr />
            <FormError errors={errors} name="api" />
            <Button type="submit" color="primary">
              Save
            </Button>
          </Form>
        </CardBody>
      </Card>
    </LoadingOverlay>
  );
};

ContentsForm.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
};

export default ContentsForm;
