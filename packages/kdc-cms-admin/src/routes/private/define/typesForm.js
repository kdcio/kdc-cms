/* eslint-disable operator-linebreak */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import kebabCase from 'lodash.kebabcase';
import camelCase from 'lodash.camelcase';
import startCase from 'lodash.startcase';
import find from 'lodash.find';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../../../utils/api';
import LoadingOverlay from '../../../components/loadingOverlay';
import FormError from '../../../components/formError';
import { fieldTypes } from '../../../components/RenderField';

const createArrayWithNumbers = (length) => Array.from({ length }, (_, k) => k);

const TypesForm = ({ id }) => {
  const { register, handleSubmit, watch, errors, setError } = useForm();
  const [size, setSize] = useState(0);
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ name, description, field, type, sortKey }) => {
    const body = {
      name: name.trim(),
      id: id || kebabCase(name),
      fields: [],
      fieldCount: 0,
      sortKey,
    };
    setIsLoading(true);

    if (description.trim() !== '') {
      body.description = description.trim();
    }

    field.forEach((v, k) => {
      if (v.trim() === '') return;
      body.fields.push({ label: v.trim(), name: camelCase(v), type: type[k] });
      body.fieldCount += 1;
    });

    // check if sort key exists
    if (!find(body.fields, { name: sortKey })) {
      setError('sortKey', 'required', 'Sort field not found');
      setIsLoading(false);
      return;
    }

    if (id) {
      api(`define/contents/${id}`, { body, method: 'PUT' })
        .then(() => navigate('/define/types'))
        .catch((e) => {
          setError('name', e.error, e.message);
          setIsLoading(false);
        });
    } else {
      api('define/contents', { body })
        .then(() => navigate('/define/types'))
        .catch((e) => {
          setError('name', e.error, e.message);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!id) {
      setSize(1);
      return;
    }
    setIsLoading(true);
    api(`define/contents/${id}`)
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

  const { fields: initialFields } = initialValues;
  const field = watch('field');
  const sortKey = find(initialValues.fields, { name: initialValues.sortKey });

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h3 className="m-0">{id ? 'Edit Type' : 'Add Type'}</h3>
          <Link className="btn btn-sm btn-danger" to="/define/types">
            Cancel
          </Link>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Label sm={2}>Name</Label>
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
            {createArrayWithNumbers(size).map((number) => {
              let defName = '';
              let defType = 'text';

              if (initialFields && initialFields[number]) {
                defName = initialFields[number].label;
                defType = initialFields[number].type;
              }

              return (
                <FormGroup key={number} row>
                  <Label sm={2}>Field Name</Label>
                  <Col sm={6}>
                    <Input
                      type="text"
                      name={`field[${number}]`}
                      innerRef={register}
                      defaultValue={defName}
                    />
                  </Col>
                  <Label sm={2}>Field Type</Label>
                  <Col sm={2}>
                    <Input
                      type="select"
                      name={`type[${number}]`}
                      innerRef={register}
                      defaultValue={defType}
                    >
                      {fieldTypes.map((t) => (
                        <option key={t} value={t}>
                          {startCase(t)}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>
              );
            })}
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
            <FormGroup row>
              <Label sm={2}>Sort by</Label>
              <Col sm={4}>
                {id ? (
                  <>
                    <Input
                      type="hidden"
                      name="sortKey"
                      innerRef={register}
                      defaultValue={initialValues.sortKey}
                      invalid={errors.sortKey !== undefined}
                      readOnly
                    />
                    {sortKey && (
                      <Input
                        plaintext
                        defaultValue={sortKey.label}
                        invalid={errors.sortKey !== undefined}
                        readOnly
                      />
                    )}

                    <FormError errors={errors} name="sortKey" />
                  </>
                ) : (
                  <>
                    <Input
                      type="select"
                      name="sortKey"
                      innerRef={register}
                      defaultValue={initialValues.sortKey}
                      invalid={errors.sortKey !== undefined}
                    >
                      {field &&
                        field.map((v) => {
                          if (v.trim() === '') return null;
                          return (
                            <option key={v} value={camelCase(v)}>
                              {v}
                            </option>
                          );
                        })}
                    </Input>
                    <FormError errors={errors} name="sortKey" />
                  </>
                )}
              </Col>
            </FormGroup>
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

TypesForm.propTypes = {
  id: PropTypes.string,
};

export default TypesForm;
