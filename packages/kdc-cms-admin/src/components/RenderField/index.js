import React from 'react';
import { Col, FormGroup, Label } from 'reactstrap';

import RenderText from './RenderText';
import RenderLongText from './RenderLongText';
import RenderDate from './RenderDate';
import RenderDateTime from './RenderDateTime';
import RenderImage from './RenderImage';
import RenderBoolean from './RenderBoolean';
import FormError from '../formError';

const RenderField = (f) => {
  const { type, name, label, errors } = f;
  let field = null;
  if (type === 'text') field = RenderText(f);
  if (type === 'long-text') field = RenderLongText(f);
  if (type === 'date') field = RenderDate(f);
  if (type === 'datetime') field = RenderDateTime(f);
  if (type === 'image') field = RenderImage(f);
  if (type === 'bool') field = RenderBoolean(f);

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
