import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import kebabCase from 'lodash.kebabcase';
import { Card, CardBody, CardHeader, Form, Button } from 'reactstrap';
import { useContentTypeList } from '../../../context/contentTypeList';
import api from '../../../utils/api';
import LoadingOverlay from '../../../components/loadingOverlay';
import FormError from '../../../components/formError';
import RenderField from '../../../components/RenderField';

const ContentsForm = ({ typeId, contentId }) => {
  const { getType, fetchList: fetchTypeList } = useContentTypeList();
  const { register, handleSubmit, setValue, errors, setError } = useForm();
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const type = getType(typeId);

  const onSubmit = (data) => {
    const body = {};
    const { fields, sortKey } = type;
    setIsLoading(true);

    fields.forEach(({ name, type: fType }) => {
      let value = data[name];
      if (value && fType !== 'bool') {
        value = value.trim();
      }
      if (!value || value === '') return;

      if (fType === 'image') {
        body[name] = {
          src: value,
          type: 'image',
        };
      } else {
        body[name] = value;
      }
    });

    if (!body[sortKey]) {
      setError(sortKey, 'required');
      setIsLoading(false);
      return;
    }

    const handleApiError = (e) => {
      if (e.error === 'SortKeyInvalid') {
        setError(sortKey, e.error, e.message);
      } else if (e.error === 'UniqueExists') {
        setError(e.uniqueKey, e.error, e.message);
      } else {
        setError('api', e.error, e.message);
      }

      setIsLoading(false);
    };

    if (typeId && contentId) {
      api(`contents/${typeId}/${contentId}`, { body, method: 'PUT' })
        .then(() => {
          navigate(`/contents/${typeId}`);
        })
        .catch(handleApiError);
    } else {
      api(`contents/${typeId}`, { body })
        .then(async () => {
          await fetchTypeList();
          navigate(`/contents/${typeId}`);
        })
        .catch(handleApiError);
    }
  };

  useEffect(() => {
    if (!typeId || !contentId) return;
    setIsLoading(true);

    api(`contents/${typeId}/${contentId}`)
      .then((data) => {
        setInitialValues(data);
      })
      .then(() => setIsLoading(false))
      .catch((e) => {
        setError('loading', e.error, e.message);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeId, contentId]);

  if (!type) return null;
  const { fields } = type;

  const onNameChange = (e) => {
    const Name = e.target.value;
    if (Name && Name.length > 0) {
      const Slug = kebabCase(Name);
      setValue('Slug', Slug);
    }
  };

  let fieldInputs = null;
  if (fields) {
    fieldInputs = fields.map((f) => (
      <RenderField
        key={f.name}
        name={f.name}
        label={f.label}
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
          <h3 className="m-0">{typeId && contentId ? `Edit ${type.name}` : `Add ${type.name}`}</h3>
          <Link className="btn btn-sm btn-danger" to={`/contents/${typeId}`}>
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
  typeId: PropTypes.string,
  contentId: PropTypes.string,
};

export default ContentsForm;
