import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    status: String,
    avatar: String
});
const url = 'mongodb://127.0.0.1:27017/study';
const connection = mongoose.createConnection(url, { maxPoolSize: 10 })
const User = connection.model('User', userSchema);

export {User}