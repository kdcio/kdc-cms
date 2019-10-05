import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../../../utils/api';

const PagesForm = ({ id }) => {
  const { register, handleSubmit } = useForm();
  const [initialValues, setInitialValues] = useState({});
  const onSubmit = (data) => {
    const body = {};

    initialValues.fields.forEach((f) => {
      const { name } = f;
      if (data[name] && data[name].trim() === '') return;
      body[name] = data[name].trim();
    });

    api(`pages/${id}`, { body, method: 'PUT' }).then(() => navigate('/pages'));
  };

  useEffect(() => {
    if (!id) return;

    api(`pages/${id}`).then((data) => {
      setInitialValues(data);
    });
  }, [id]);

  const renderField = (f) => (
    <FormGroup row key={f.name}>
      <Label sm={2}>{f.name}</Label>
      <Col sm={10}>
        {f.type === 'long-text' ? (
          <Input
            type="textarea"
            name={f.name}
            innerRef={register}
            defaultValue={initialValues[f.name]}
          />
        ) : (
          <Input
            type="text"
            name={f.name}
            innerRef={register}
            defaultValue={initialValues[f.name]}
          />
        )}
      </Col>
    </FormGroup>
  );

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">{`Edit ${initialValues.name}`}</h3>
        <Link className="btn btn-sm btn-danger" to="/pages">
          Cancel
        </Link>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {initialValues && initialValues.fields
            ? initialValues.fields.map((f) => renderField(f))
            : null}

          <hr />
          <Button type="submit" color="primary">
            Save
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

PagesForm.propTypes = {
  id: PropTypes.string,
};

export default PagesForm;
