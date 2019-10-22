import sign from './lib/sign';
import parseParams from '../../lib/parseParams';
import { failure } from '../../lib/response';

export const handler = async event => {
  const { S3_REGION: region, S3_UPLOAD: bucket } = process.env;
  if (!region || !bucket) {
    throw new Error('REGION and BUCKET environment variables are required!');
  }

  const { httpMethod, pathParameters } = event;
  const params = parseParams(pathParameters, ['path']);
  console.log(params);

  if (httpMethod === 'GET' && params && params.path === 'sign') {
    const { filename, type, acl } = event.queryStringParameters;
    return sign({ region, bucket, filename, type, acl });
  }

  return failure(400, { error: 'Invalid request' });
};

export default handler;
