import React from 'react';
import { Col, FormGroup, Label } from 'reactstrap';

import RenderText from './RenderText';
import RenderLongText from './RenderLongText';
import RenderDate from './RenderDate';
import RenderDateTime from './RenderDateTime';
import RenderImage from './RenderImage';

const RenderField = (f) => {
  let field = null;
  if (f.type === 'text') field = RenderText(f);
  if (f.type === 'long-text') field = RenderLongText(f);
  if (f.type === 'date') field = RenderDate(f);
  if (f.type === 'datetime') field = RenderDateTime(f);
  if (f.type === 'image') field = RenderImage(f);

  return (
    <FormGroup row key={f.name}>
      <Label sm={2}>{f.name}</Label>
      <Col sm={10}>{field}</Col>
    </FormGroup>
  );
};

export default RenderField;
