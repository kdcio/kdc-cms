import React, { useState } from 'react';
import { Link } from '@reach/router';
import useForm from 'react-hook-form';
import slugify from 'slugify';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../../../utils/api';

const createArrayWithNumbers = (length) => Array.from({ length }, (_, k) => k + 1);

const PagesForm = () => {
  const { register, handleSubmit } = useForm();
  const [size, setSize] = useState(1);
  const onSubmit = ({ name, description, field, type }) => {
    const body = { name, description, id: slugify(name, { lower: true }) };
    field.forEach((v, k) => {
      body[v] = type[k];
    });

    api('page-definition', { body });
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">Add Page</h3>
        <Link className="btn btn-sm btn-danger" to="../">
          Cancel
        </Link>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup row>
            <Label sm={2}>Page Name</Label>
            <Col sm={4}>
              <Input type="text" name="name" innerRef={register} />
            </Col>
            <Label sm={2}>Description</Label>
            <Col sm={4}>
              <Input type="text" name="description" innerRef={register} />
            </Col>
          </FormGroup>
          <hr />
          <h4>Fields</h4>
          {createArrayWithNumbers(size).map((number) => (
            <FormGroup key={number} row>
              <Label sm={2}>Field Name</Label>
              <Col sm={6}>
                <Input type="text" name={`field[${number}]`} innerRef={register} />
              </Col>
              <Label sm={2}>Field Type</Label>
              <Col sm={2}>
                <Input type="select" name={`type[${number}]`} innerRef={register}>
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

export default PagesForm;
