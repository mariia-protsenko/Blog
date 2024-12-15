import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must contain at least 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Enter your name').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid URL address').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must contain at least 5 symbols').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Enter title for the post').isLength({ min: 3 }).isString(),
  body('text', 'Enter text for the post').isLength({ min: 3 }).isString(),
  body('tags', 'Invalid tags format').optional().isString(),
  body('imageUrl', 'Invalid image url address').optional().isString(),
];

export const commentCreateValidation = [
  body('text', 'Enter text for the comment').isLength({ min: 3 }).isString(),
];
