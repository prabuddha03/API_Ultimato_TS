import { Request, Response, NextFunction } from 'express';
import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import * as factory from './handlerFactory';
import AppError from '../utils/appError';



export const getAllProducts = factory.getAll(Product);
export const getProduct = factory.getOne(Product, { path: 'reviews' });
export const createProduct = factory.createOne(Product);
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);

// Controller to get product statistics (e.g., average ratings)
// export const getProductStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const stats = await Product.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } }
//     },
//     {
//       $group: {
//         _id: { $toUpper: '$category' },
//         numProducts: { $sum: 1 },
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' }
//       }
//     },
//     {
//       $sort: { avgPrice: 1 }
//     }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       stats
//     }
//   });
// });

