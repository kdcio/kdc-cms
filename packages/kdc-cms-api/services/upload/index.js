import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import crypto from 'crypto';

const generateKey = source => {
  const d = new Date();
  const yr = d.getFullYear();
  const mn = String(d.getMonth() + 1).padStart(2, 0);
  const dy = String(d.getDate()).padStart(2, 0);
  const id = crypto.randomBytes(8).toString('hex');
  const filename = source.replace(/[^a-z0-9.]/gi, '_').toLowerCase();

  return `${yr}/${mn}/${dy}/${id}-${filename}`;
};

export const handler = async event => {
  const { S3_REGION: region, S3_UPLOAD: bucket } = process.env;

  if (!region || !bucket) {
    throw new Error('REGION and BUCKET environment variables are required!');
  }

  const S3 = new AWS.S3({ signatureVersion: 'v4', region });

  const { filename, type, acl } = event.queryStringParameters;

  if (!filename || !type) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({
        message: 'Missing meta header(s) of the request.'
      })
    };
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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({
        signedUrl,
        url: `https://${bucket}.s3.amazonaws.com/${params.Key}`
      })
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify(error)
    };
  }
};

export default handler;
