import expressJwt from 'express-jwt';

const jwt = () => {
  return expressJwt({ secret: process.env.JWT_SECRET }).unless({
    path: [
      // public routes that don't require authentication
      '/',
      '/users/authenticate'
    ]
  });
};

export default jwt;
