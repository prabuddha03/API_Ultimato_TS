import { Request, Response, NextFunction } from 'express';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import APIFeatures from './../utils/apiFeatures';
import { Model, Document, Query } from 'mongoose';

// Define a generic type for Mongoose models
type ModelType<T extends Document> = {
  findByIdAndDelete: (id: string) => Promise<T | null>;
  findByIdAndUpdate: (id: string, update: Partial<T>, options: object) => Promise<T | null>;
  create: (doc: Partial<T>) => Promise<T>;
  findById: (id: string) => Query<T | null, T>;
  find: (filter: object) => Query<T[], T>;
};

interface PopOptions {
  path: string;
  select?: string;
}

// Delete a document by ID
export const deleteOne = (Model: ModelType<Document>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

// Update a document by ID
export const updateOne = (Model: ModelType<Document>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// Create a new document
export const createOne = (Model: ModelType<Document>) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// Get a single document by ID with optional population
export const getOne = (Model: ModelType<Document>, popOptions?: PopOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// Get all documents with filtering, sorting, and pagination
export const getAll = (Model: ModelType<Document>) =>
  catchAsync(async (req: Request, res: Response) => {
    // To allow for nested GET reviews on product (hack)
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };

    const features = new APIFeatures(Model.find(filter), req.query as any)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.getQuery();

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
