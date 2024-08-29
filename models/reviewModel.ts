// import mongoose, { Document, Schema } from 'mongoose';
// import Product from './productModel';

// // Interface for Review schema
// interface IReview extends Document {
//   review: string;
//   rating: number;
//   createdAt: Date;
//   product: mongoose.Types.ObjectId;
//   user: mongoose.Types.ObjectId;
// }

// // Review schema definition
// const reviewSchema: Schema<IReview> = new Schema({
//   review: {
//     type: String,
//     required: [true, 'Review cannot be empty!']
//   },
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: [true, 'Review must belong to a product.']
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Review must belong to a user']
//   }
// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Unique index for preventing duplicate reviews by the same user for the same product
// reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// // Pre-find middleware to populate user information
// reviewSchema.pre(/^find/, function(this: mongoose.Query<IReview[], IReview>, next) {
//     this.populate({
//       path: 'product',
//       select: '-__v' // Specify fields to select if needed
//     }).populate({
//       path: 'user',
//       select: '-__v -passwordChangedAt' // Specify fields to select if needed
//     });
  
//     next();
//   });
// // Static method to calculate average ratings
// reviewSchema.statics.calcAverageRatings = async function (productId: mongoose.Types.ObjectId) {
//   const stats = await this.aggregate([
//     {
//       $match: { product: productId }
//     },
//     {
//       $group: {
//         _id: '$product',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' }
//       }
//     }
//   ]);

//   if (stats.length > 0) {
//     await Product.findByIdAndUpdate(productId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating
//     });
//   } else {
//     await Product.findByIdAndUpdate(productId, {
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5
//     });
//   }
// };

// // Post-save middleware to update ratings after a review is saved
// reviewSchema.post('save', function () {
//   this.constructor.calcAverageRatings(this.product);
// });

// // Pre-findOneAnd middleware to get the review document
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   next();
// });

// // Post-findOneAnd middleware to update ratings after a review is updated or deleted
// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calcAverageRatings(this.r.product);
// });

// // Create Review model
// const Review = mongoose.model<IReview>('Review', reviewSchema);

// export default Review;
