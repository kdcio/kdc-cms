import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import slugify from 'slugify';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../../../utils/api';

const createArrayWithNumbers = (length) => Array.from({ length }, (_, k) => k);

const TypesForm = ({ id }) => {
  const { register, handleSubmit } = useForm();
  const [size, setSize] = useState(1);
  const [initialValues, setInitialValues] = useState({});
  const onSubmit = ({ name, description, field, type }) => {
    const body = {
      name: name.trim(),
      id: id || slugify(name, { lower: true }),
      fields: [],
      fieldCount: 0,
    };

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

    if (id) {
      api(`content-definition/${id}`, { body, method: 'PUT' }).then(() => {
        navigate('/define/types');
      });
    } else {
      api('content-definition', { body }).then(() => navigate('/define/types'));
    }
  };

  useEffect(() => {
    if (!id) return;

    api(`content-definition/${id}`).then((data) => {
      setInitialValues(data);
      setSize(data.fieldCount);
    });
  }, [id]);

  return (
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
            <Label sm={2}>Type Name</Label>
            <Col sm={4}>
              <Input
                type="text"
                name="name"
                innerRef={register}
                defaultValue={initialValues.name}
              />
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
                />
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
  );
};

TypesForm.propTypes = {
  id: PropTypes.string,
};

export default TypesForm;
