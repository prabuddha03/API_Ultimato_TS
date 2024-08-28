import crypto from 'crypto';
import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IAddress {
  landmark?: string;
  state: string;
  city: string;
  zipcode: string;
  lat?: number;
  long?: number;
  locality: string;
}

interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  role: 'user' | 'moderator' | 'admin' | 'super-admin';
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: any;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;
  mobile?: string;
  createdOn: Date;
  modifiedOn: Date;
  address?: IAddress;

  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

const addressSchema = new mongoose.Schema<IAddress>({
  landmark: { type: String, default: '' },
  state: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  lat: { type: Number },
  long: { type: Number },
  locality: { type: String, required: true }
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: { type: String },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el: string) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  mobile: { type: String },
  createdOn: { type: Date, default: Date.now },
  modifiedOn: { type: Date, default: Date.now },
  address: addressSchema
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Pre-save middleware to update passwordChangedAt field
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Pre-find middleware to filter out inactive users
// userSchema.pre(/^find/, function(next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

// Instance methods
userSchema.methods.correctPassword = async function(candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = this.passwordChangedAt.getTime() / 1000; // already a number
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };
  

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User: Model<IUser> = mongoose.model('User', userSchema);

export default User;
