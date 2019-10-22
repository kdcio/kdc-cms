import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RenderLongText = ({ name, register, initialValue, setValue }) => {
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    register({ name });
  }, [name, register]);

  return (
    <CKEditor
      editor={ClassicEditor}
      data={initialValue}
      onChange={() => {
        const data = editor.getData();
        setValue(name, data);
      }}
      onInit={(e) => {
        setEditor(e);
        // This will only be used for testing.
        window.CKEDITOR = e;
      }}
    />
  );
};

RenderLongText.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  setValue: PropTypes.func.isRequired,
};

export default RenderLongText;
