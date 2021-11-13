import dotenv from 'dotenv';
dotenv.config();

const config={
    env: process.env.NODE_ENV,
    port: process.env.PORT || 8080,
    mongo_uri:  process.env.MONGODB_URI ||
    process.env.MONGO_HOST || 'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/image_uploader'
}

export default config;