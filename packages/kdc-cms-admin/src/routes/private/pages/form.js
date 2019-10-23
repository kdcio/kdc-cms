import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import { Card, CardBody, CardHeader, Form, Button } from 'reactstrap';
import api from '../../../utils/api';
import LoadingOverlay from '../../../components/loadingOverlay';
import FormError from '../../../components/formError';
import RenderField from '../../../components/RenderField';

const PagesForm = ({ id }) => {
  const { register, handleSubmit, errors, setError, setValue } = useForm();
  const [initialValues, setInitialValues] = useState({});
  const [fields, setFields] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    const body = {};
    setIsLoading(true);

    fields.forEach(({ name }) => {
      if (!data[name] || data[name].trim() === '') return;
      body[name] = data[name].trim();
    });

    api(`pages/${id}`, { body, method: 'PUT' })
      .then(() => navigate('/pages'))
      .catch((e) => {
        setError('api', e.error, e.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api(`define/pages/${id}`)
      .then((data) => setFields(data.fields))
      .then(() => api(`pages/${id}`))
      .then((data) => setInitialValues(data))
      .then(() => setIsLoading(false))
      .catch((e) => {
        setError('loading', e.error, e.message);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  let fieldInputs = null;
  if (fields) {
    fieldInputs = fields.map((f) => (
      <RenderField
        key={f.name}
        name={f.name}
        type={f.type}
        register={register}
        initialValue={initialValues[f.name]}
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
          <h3 className="m-0">{initialValues.name ? `Edit ${initialValues.name}` : 'Loading'}</h3>
          <Link className="btn btn-sm btn-danger" to="/pages">
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

PagesForm.propTypes = {
  id: PropTypes.string,
};

export default PagesForm;
