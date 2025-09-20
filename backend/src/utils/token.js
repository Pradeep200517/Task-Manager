import jwt from 'jsonwebtoken';

export const generateToken = (payload, options = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'change_me_in_prod', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    ...options,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'change_me_in_prod');
};


