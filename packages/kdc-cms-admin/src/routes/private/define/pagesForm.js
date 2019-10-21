import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import slugify from 'slugify';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../../../utils/api';
import LoadingOverlay from '../../../components/loadingOverlay';
import FormError from '../../../components/formError';

const createArrayWithNumbers = (length) => Array.from({ length }, (_, k) => k);

const PagesForm = ({ id }) => {
  const { register, handleSubmit, errors, setError } = useForm();
  const [size, setSize] = useState(1);
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ name, description, field, type }) => {
    const body = {
      name: name.trim(),
      id: id || slugify(name, { lower: true }),
      fields: [],
      fieldCount: 0,
    };
    setIsLoading(true);

    if (description.trim() !== '') {
      body.description = description.trim();
    }

    field.forEach((v, k) => {
      if (v.trim() === '') return;
      body.fields.push({
        name: v.trim(),
        type: type[k],
      });
      body.fieldCount += 1;
    });

    if (body.fieldCount <= 0) {
      setError('field[0]', 'required', 'You need to define at least one field');
      setIsLoading(false);
      return;
    }

    if (id) {
      api(`define/pages/${id}`, { body, method: 'PUT' })
        .then(() => api(`pages/${id}`, { body: { name: body.name }, method: 'PUT' }))
        .then(() => navigate('/define/pages'))
        .catch((e) => {
          setError('name', e.error, e.message);
          setIsLoading(false);
        });
    } else {
      api('define/pages', { body })
        .then(() => api('pages', { body: { id: body.id } }))
        .then(() => navigate('/define/pages'))
        .catch((e) => {
          setError('name', e.error, e.message);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api(`define/pages/${id}`)
      .then((data) => {
        setInitialValues(data);
        setSize(data.fieldCount);
        setIsLoading(false);
      })
      .catch((e) => {
        setError('loading', e.error, e.message);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3 className="m-0">{id ? 'Edit Page' : 'Add Page'}</h3>
          <Link className="btn btn-sm btn-danger" to="/define/pages">
            Cancel
          </Link>
        </CardHeader>
        <CardBody>
          <Form id="pageForm" onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Label sm={2}>Page Name</Label>
              <Col sm={4}>
                <Input
                  type="text"
                  name="name"
                  innerRef={register({ required: true })}
                  defaultValue={initialValues.name}
                  invalid={errors.name !== undefined}
                />
                <FormError errors={errors} name="name" />
              </Col>
              <Label sm={2}>Description</Label>
              <Col sm={4}>
                <Input
                  type="text"
                  name="description"
                  innerRef={register}
                  defaultValue={initialValues.description}
                />
              </Col>
            </FormGroup>
            <hr />
            <h4>Fields</h4>
            {createArrayWithNumbers(size).map((number) => (
              <FormGroup key={number} row>
                <Label sm={2}>Field Name</Label>
                <Col sm={6}>
                  <Input
                    type="text"
                    name={`field[${number}]`}
                    innerRef={register}
                    defaultValue={
                      initialValues && initialValues.fields && initialValues.fields[number]
                        ? initialValues.fields[number].name
                        : ''
                    }
                    invalid={errors[`field[${number}]`] !== undefined}
                  />
                  <FormError errors={errors} name={`field[${number}]`} />
                </Col>
                <Label sm={2}>Field Type</Label>
                <Col sm={2}>
                  <Input
                    type="select"
                    name={`type[${number}]`}
                    innerRef={register}
                    defaultValue={
                      initialValues && initialValues.fields && initialValues.fields[number]
                        ? initialValues.fields[number].type
                        : ''
                    }
                  >
                    <option value="text">Text</option>
                    <option value="long-text">Long Text</option>
                  </Input>
                </Col>
              </FormGroup>
            ))}
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                color="success"
                className="mr-2"
                onClick={() => setSize(size + 1)}
              >
                Add
              </Button>
              <Button
                type="button"
                color="danger"
                onClick={() => (size > 1 ? setSize(size - 1) : null)}
              >
                Remove
              </Button>
            </div>
            <hr />
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
