import { User } from './../models/userModel'; // Adjust the path to match your project structure

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property to the Request interface
    }
  }
}
