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

  let S3 = null;
  if (process.env.IS_OFFLINE === true || process.env.IS_OFFLINE === 'true') {
    S3 = new AWS.S3({
      signatureVersion: 'v4',
      region,
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER',
      endpoint: new AWS.Endpoint('http://localhost:8104')
    });
  } else if (process.env.DDB_REGION) {
    S3 = new AWS.S3({ signatureVersion: 'v4', region });
  }

  const params = {
    Bucket: bucket,
    Key: generateKey(filename),
    ContentType: type,
    Expires: 60,
    ACL: acl
  };

  try {
    const signedUrl = await S3.getSignedUrl('putObject', params);
    const [url] = signedUrl.split('?');
    return success({ signedUrl, url });
  } catch (error) {
    return failure(401, error);
  }
};

// 1572575649849
export default sign;
