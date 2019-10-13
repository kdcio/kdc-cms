import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import useForm from 'react-hook-form';
import slugify from 'slugify';
import { Col, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useContentTypeList } from '../../../context/contentTypeList';
import api from '../../../utils/api';

const ContentsForm = ({ id, slug }) => {
  const { getType } = useContentTypeList();
  const { register, handleSubmit, setValue } = useForm();
  const [initialValues, setInitialValues] = useState({});
  const type = getType(id);

  const onSubmit = (data) => {
    const body = {};
    const { fields } = type;

    fields.forEach((v) => {
      if (data[v.name].trim() === '') return;
      body[v.name] = data[v.name].trim();
    });

    if (id && slug) {
      api(`contents/${id}/${slug}`, { body, method: 'PUT' }).then(() => {
        navigate(`/contents/${id}`);
      });
    } else {
      api(`contents/${id}`, { body }).then(() => navigate(`/contents/${id}`));
    }
  };

  useEffect(() => {
    if (!id || !slug) return;

    api(`contents/${id}/${slug}`).then((data) => {
      setInitialValues(data);
    });
  }, [id, slug]);

  if (!type) return null;
  const { fields } = type;
  const renderField = (f) => (
    <FormGroup row key={f.name}>
      <Label sm={2} className="text-capitalize">
        {f.name}
      </Label>
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
            onChange={(e) => {
              if (f.name !== 'Name') return;
              const Name = e.target.value;
              if (Name && Name.length > 0) {
                const Slug = slugify(Name, { lower: true });
                setValue('Slug', Slug);
              }
            }}
          />
        )}
      </Col>
    </FormGroup>
  );

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">{id && slug ? `Edit ${type.name}` : `Add ${type.name}`}</h3>
        <Link className="btn btn-sm btn-danger" to={`/contents/${id}`}>
          Cancel
        </Link>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((f) => renderField(f))}
          <hr />
          <Button type="submit" color="primary">
            Save
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

ContentsForm.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
};

export default ContentsForm;
