import { Request, Response, NextFunction } from 'express';
import User from './../models/userModel';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import * as factory from './handlerFactory';

const filterObj = (obj: { [key: string]: any }, ...allowedFields: string[]): { [key: string]: any } => {
  const newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    req.params.id = req.user.id; // TypeScript should now recognize req.user
  }
  next();
};

export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  if (req.user) {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } else {
    return next(new AppError('User not found', 404));
  }
});

export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};



export const getUser = factory.getOne(User);
export const getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
