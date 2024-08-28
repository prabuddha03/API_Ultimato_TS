import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import productRouter from './routes/productRoutes';
//import userRouter from './routes/userRoutes';

// Define a type for request with custom properties
interface CustomRequest extends Request {
  requestTime?: string;
}

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/products', productRouter);
//app.use('/api/v1/users', userRouter);

export default app;
