import React, { useEffect } from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RenderText = (f) => (
  <Input
    type="text"
    name={f.name}
    innerRef={f.register}
    defaultValue={f.initialValue}
    onChange={f.onChange}
  />
);

const RenderLongText = (f) => {
  useEffect(() => {
    f.register({ name: f.name });
  }, [f]);

  return (
    <CKEditor
      editor={ClassicEditor}
      data={f.initialValue}
      onChange={(event, editor) => {
        const data = editor.getData();
        f.setValue(f.name, data);
      }}
      onInit={(editor) => {
        // This will only be used for testing.
        window.CKEDITOR = editor;
      }}
    />
  );
};

const RenderDate = (f) => (
  <Input
    type="date"
    name={f.name}
    innerRef={f.register}
    defaultValue={f.initialValue}
    onChange={f.onChange}
  />
);

const RenderDateTime = (f) => (
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
  if (f.type === 'text') field = RenderText(f);
  if (f.type === 'long-text') field = RenderLongText(f);
  if (f.type === 'date') field = RenderDate(f);
  if (f.type === 'datetime') field = RenderDateTime(f);

  return (
    <FormGroup row key={f.name}>
      <Label sm={2}>{f.name}</Label>
      <Col sm={10}>{field}</Col>
    </FormGroup>
  );
};

export default RenderField;
