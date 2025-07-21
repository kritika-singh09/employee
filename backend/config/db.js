import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGOURL = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
 await mongoose.connect(MONGOURL);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
