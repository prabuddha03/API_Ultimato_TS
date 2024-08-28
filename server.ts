import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || ''
);

// const connectOptions: ConnectOptions = {
//   // Add other options here if needed, though the deprecated ones are no longer necessary
// };

if (DB) {
  mongoose
    .connect(DB)
    .then((con) => {
      console.log(con.connections);
      console.log('DB Connected!');
    })
    .catch((err) => {
      console.error('DB connection error:', err);
    });
} else {
  console.error('Database connection string is missing.');
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
