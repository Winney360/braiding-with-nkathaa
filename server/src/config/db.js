import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to provided MONGODB_URI...');
      await mongoose.connect(uri);
      console.log('Connected successfully to MongoDB Atlas / Remote database.');
      return;
    } catch (err) {
      console.warn('Failed connecting to MONGODB_URI, falling back to embedded database:', err.message);
    }
  }

  // Try local mongod first if no explicit remote uri
  try {
    const localUri = 'mongodb://127.0.0.1:27017/braiding_nkathaa';
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 1500 });
    console.log('Connected successfully to local MongoDB instance.');
    return;
  } catch (err) {
    console.log('Local MongoDB not running. Initializing isolated embedded MongoDB server...');
  }

  // Fallback to MongoMemoryServer
  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`Connected to in-memory MongoDB instance at ${memUri}`);
  } catch (err) {
    console.error('Fatal: Could not initialize database connection', err);
    throw err;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
