import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';



// Enum for product categories specific to sheep farming
enum ProductCategory {
  MEAT = 'Meat',
  OTHER = 'Other'
}

// Interface for Product schema
interface IProduct extends Document {
  name: string;
  description: string;
  category: ProductCategory;
  quantity: number;
  stock: number;
  material: string;
  isTrending: boolean;
  cut?: string;
  width?: number;
  slug?: string;
  length?: number;
  height?: number;
  createdOn: Date;
  modifiedOn?: Date;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  priceDiscount?: number;
}

// Product schema definition
const productSchema: Schema<IProduct> = new Schema({
    name: {
      type: String,
      required: [true, 'A product must have a name']
    },
    description: {
      type: String,
      required: [true, 'A product must have a description']
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: [true, 'A product must have a category']
    },
    quantity: {
      type: Number,
      default: 1
    },
    stock: {
      type: Number,
      required: [true, 'A product must have a stock quantity']
    },
    material: {
      type: String,
      required: [true, 'A product must have a material']
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    cut: String,
    width: Number,
    length: Number,
    height: Number,
    slug: {
        type: String,
        unique: true // Optionally make it unique
    },
    createdOn: {
      type: Date,
      default: Date.now
    },
    modifiedOn: Date,
    ratingsAverage: {
      type: Number,
      default: 0
    },
    ratingsQuantity: {
      type: Number,
      default: 0,

    },
    priceDiscount: {
      type: Number,
      default: 0
    }
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
  
// Indexes
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ startLocation: '2dsphere' });

// // // Virtual populate
// productSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'product',
//   localField: '_id'
// });

// // DOCUMENT MIDDLEWARE: runs before .save() and .create()
// productSchema.pre('save', function(this: IProduct, next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });



// productSchema.post(/^find/, function(this: mongoose.Query<any, IProduct>, docs: IProduct[], next) {
//   console.log(`Query took ${Date.now() - (this as any).start} milliseconds!`);
//   next();
// });

// Create Product model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
