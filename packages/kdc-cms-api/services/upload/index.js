import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

export const handler = async event => {
  const { S3_REGION: region, S3_UPLOAD: bucket } = process.env;

  if (!region || !bucket) {
    throw new Error('REGION and BUCKET environment variables are required!');
  }

  const S3 = new AWS.S3({ signatureVersion: 'v4', region });

  console.log(event);
  console.log(event.queryStringParameters);

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
    Key: filename,
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
      body: JSON.stringify({ signedUrl })
    };
  } catch (error) {
    console.log(error);

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
