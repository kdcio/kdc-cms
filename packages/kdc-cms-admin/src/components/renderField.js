import React, { useEffect, useState } from 'react';
import { Col, FormGroup, Label, Input, Progress, Media } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactS3Uploader from 'react-s3-uploader';
import api from '../utils/api';

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
      onChange={(editor) => {
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

const RenderImage = (f) => {
  const [value, setValue] = useState(null);
  const [progress, setProgress] = useState(0);

  const getSignedUrl = (file, callback) => {
    api(`upload/sign?filename=${file.name}&type=${file.type}&acl=public-read`)
      .then((data) => {
        callback(data);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };

  useEffect(() => {
    f.register({ name: f.name });
    setValue(f.initialValue);
  }, [f]);

  return (
    <Media>
      {value ? (
        <Media left href={value} className="mr-2">
          <Media object src={value} alt={f.name} style={{ maxWidth: '100px' }} />
        </Media>
      ) : null}

      <Media body>
        <ReactS3Uploader
          className="form-control-file"
          getSignedUrl={getSignedUrl}
          accept="image/*"
          onProgress={(p) => {
            f.setIsLoading(true);
            setProgress(p);
          }}
          onError={(e) => {
            // eslint-disable-next-line no-console
            console.log(e);
            f.setIsLoading(false);
          }}
          onFinish={(e) => {
            f.setValue(f.name, e.url);
            f.setIsLoading(false);
          }}
          uploadRequestHeaders={{
            'x-amz-acl': 'public-read',
          }}
          contentDisposition="auto"
        />
        {progress > 0 ? (
          <div>
            <Progress value={progress} className="mt-2">
              {progress}%
            </Progress>
          </div>
        ) : null}
      </Media>
    </Media>
  );
};

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
