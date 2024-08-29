// import { Request, Response, NextFunction } from 'express';
// import Review from './../models/reviewModel';
// import * as factory from './handlerFactory';
// // import catchAsync from './../utils/catchAsync';

// // Middleware to set tour and user IDs
// export const setTourUserIds = (req: Request, res: Response, next: NextFunction) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id; // Ensure req.user is typed correctly
//   next();
// };

// // Export functions from handlerFactory for Review model
// export const getAllReviews = factory.getAll(Review);
// export const getReview = factory.getOne(Review);
// export const createReview = factory.createOne(Review);
// export const updateReview = factory.updateOne(Review);
// export const deleteReview = factory.deleteOne(Review);