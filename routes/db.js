import mongoose from 'mongoose';

const DB_URI = process.env.DB_URI;
mongoose
  .connect(DB_URI)
  .then(() => console.log('Database connection is successfully'))
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });
