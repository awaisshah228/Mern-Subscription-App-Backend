import mongoose from "mongoose";

const dbConnect = () => {

    mongoose.connect(process.env.MONGO_URI);

    const connection = mongoose.connection;

    connection.on('connected', () => {
        console.log('connection to mongoDB is successful');
    });

    connection.on('error', (error) => {
        console.log(error);
    });

};


export { dbConnect };