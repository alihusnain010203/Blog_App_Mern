import mongoose from "mongoose";

const DBconnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        conn.connection.on("error", (err) => {
        console.log(`Mongoose default connection error: ${err}`);
        }
        );
        conn.connection.on("disconnected", () => {
        console.log("Mongoose default connection disconnected");
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
    };

export default DBconnect;