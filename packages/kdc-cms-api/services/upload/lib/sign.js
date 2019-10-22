import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import crypto from 'crypto';
import { success, failure } from '../../../lib/response';

const generateKey = source => {
  const d = new Date();
  const yr = d.getFullYear();
  const mn = String(d.getMonth() + 1).padStart(2, 0);
  const dy = String(d.getDate()).padStart(2, 0);
  const id = crypto.randomBytes(8).toString('hex');
  const filename = source.replace(/[^a-z0-9.]/gi, '_').toLowerCase();

  return `${yr}/${mn}/${dy}/${id}-${filename}`;
};

const sign = async ({ region, bucket, filename, type, acl }) => {
  if (!filename || !type || !acl) {
    return failure(400, {
      error: 'MissingParam',
      message: 'Missing meta header(s) of the request.'
    });
  }

  const S3 = new AWS.S3({ signatureVersion: 'v4', region });

  const params = {
    Bucket: bucket,
    Key: generateKey(filename),
    ContentType: type,
    Expires: 60,
    ACL: acl
  };

  try {
    const signedUrl = await S3.getSignedUrl('putObject', params);

    return success({
      signedUrl,
      url: `https://${bucket}.s3.amazonaws.com/${params.Key}`
    });
  } catch (error) {
    return failure(401, error);
  }
};

export default sign;
