import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Progress, Media } from 'reactstrap';
import ReactS3Uploader from 'react-s3-uploader';
import api from '../../utils/api';

const RenderImage = ({ name, register, initialValue, setValue, setIsLoading }) => {
  const [image, setImage] = useState(null);
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
    register({ name });
    setImage(initialValue);
    setValue(name, initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  return (
    <Media>
      {image ? (
        <Media left href={image} className="mr-2">
          <Media object src={image} alt={name} style={{ maxWidth: '100px' }} />
        </Media>
      ) : null}

      <Media body>
        <ReactS3Uploader
          className="form-control-file"
          getSignedUrl={getSignedUrl}
          accept="image/*"
          onProgress={(p) => {
            setIsLoading(true);
            setProgress(p);
          }}
          onError={(e) => {
            // eslint-disable-next-line no-console
            console.log(e);
            setIsLoading(false);
          }}
          onFinish={(e) => {
            setValue(name, e.url);
            setImage(e.url);
            setIsLoading(false);
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
        ) : (
          <p className="small mt-2">Selecting a file will trigger auto upload.</p>
        )}
      </Media>
    </Media>
  );
};

RenderImage.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  setValue: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};

export default RenderImage;
