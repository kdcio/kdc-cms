import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';

const renderText = (f) => (
  <Input
    type="text"
    name={f.name}
    innerRef={f.register}
    defaultValue={f.initialValue}
    onChange={f.onChange}
  />
);

const renderLongText = (f) => (
  <Input
    type="textarea"
    name={f.name}
    innerRef={f.register}
    defaultValue={f.initialValue}
    onChange={f.onChange}
  />
);

const renderDate = (f) => (
  <Input
    type="date"
    name={f.name}
    innerRef={f.register}
    defaultValue={f.initialValue}
    onChange={f.onChange}
  />
);

const renderDateTime = (f) => (
  <Input
    type="datetime-local"
    name={f.name}
    innerRef={f.register}
    defaultValue={f.initialValue}
    onChange={f.onChange}
  />
);

const RenderField = (f) => {
  let field = null;
  if (f.type === 'text') field = renderText(f);
  if (f.type === 'long-text') field = renderLongText(f);
  if (f.type === 'date') field = renderDate(f);
  if (f.type === 'datetime') field = renderDateTime(f);

  return (
    <FormGroup row key={f.name}>
      <Label sm={2}>{f.name}</Label>
      <Col sm={10}>{field}</Col>
    </FormGroup>
  );
};

export default RenderField;
