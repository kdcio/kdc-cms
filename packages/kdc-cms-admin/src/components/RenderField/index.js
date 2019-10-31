import React from 'react';
import { Col, FormGroup, Label, FormText, UncontrolledTooltip } from 'reactstrap';

import RenderText from './RenderText';
import RenderLongText from './RenderLongText';
import RenderDate from './RenderDate';
import RenderDateTime from './RenderDateTime';
import RenderImage from './RenderImage';
import RenderBoolean from './RenderBoolean';
import RenderSlug from './RenderSlug';
import FormError from '../formError';

const fieldTypeMap = {
  text: RenderText,
  'long-text': RenderLongText,
  date: RenderDate,
  datetime: RenderDateTime,
  image: RenderImage,
  bool: RenderBoolean,
  slug: RenderSlug,
};

const fieldTypeInfo = {
  slug: (
    <span>
      Hold <strong>SHIFT</strong> key for next word. (<em id="whatIsSlug">What is Slug?</em>)
      <UncontrolledTooltip target="whatIsSlug">
        Slug is a part of a URL which identifies a particular page on a website in a form readable
        by users.
      </UncontrolledTooltip>
    </span>
  ),
};

export const fieldTypes = Object.keys(fieldTypeMap);

const RenderField = (f) => {
  const { type, name, label, errors } = f;
  let field = null;
  if (fieldTypeMap[type]) {
    field = fieldTypeMap[type](f);
  }
  let info = null;
  if (fieldTypeInfo[type]) {
    info = fieldTypeInfo[type];
  }

  return (
    <FormGroup row key={name}>
      <Label sm={2}>{label}</Label>
      <Col sm={10}>
        {field}
        {info && <FormText color="muted">{info}</FormText>}
        <FormError errors={errors} name={name} />
      </Col>
    </FormGroup>
  );
};

export default RenderField;
