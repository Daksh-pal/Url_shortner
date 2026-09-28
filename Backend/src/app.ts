import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import shortUrlRouter from './routes/shortUrl.Route';
import authRouter from './routes/auth.Route';
import cors from 'cors';
import cookieParser from 'cookie-parser';
config();

const app = express();


app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("App running successfully!");
})

// Mount routes
app.use("/api/auth", authRouter);
app.use('/', shortUrlRouter);

const PORT = process.env.PORT || 7005;
const MongoUri = process.env.MONGO_URI;
if (!MongoUri) {
    throw new Error("MONGO_URI is not defined");
}

const connectDb = async (uri: string) => {
    await mongoose.connect(uri);
    console.log("DB connected");
}

const startServer = async () => {
    try {
        await connectDb(MongoUri);

        app.listen(PORT, () => {
            console.log(`App running at port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();