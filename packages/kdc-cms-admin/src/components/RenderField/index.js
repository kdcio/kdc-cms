import React from 'react';
import { Col, FormGroup, Label } from 'reactstrap';

import RenderText from './RenderText';
import RenderLongText from './RenderLongText';
import RenderDate from './RenderDate';
import RenderDateTime from './RenderDateTime';
import RenderImage from './RenderImage';
import RenderBoolean from './RenderBoolean';
import FormError from '../formError';

const fieldTypeMap = {
  text: RenderText,
  'long-text': RenderLongText,
  date: RenderDate,
  datetime: RenderDateTime,
  image: RenderImage,
  bool: RenderBoolean,
};

export const fieldTypes = Object.keys(fieldTypeMap);

const RenderField = (f) => {
  const { type, name, label, errors } = f;
  let field = null;
  if (fieldTypeMap[type]) {
    field = fieldTypeMap[type](f);
  }

  return (
    <FormGroup row key={name}>
      <Label sm={2}>{label}</Label>
      <Col sm={10}>
        {field}
        <FormError errors={errors} name={name} />
      </Col>
    </FormGroup>
  );
};

export default RenderField;
