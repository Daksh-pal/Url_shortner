"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const shortUrl_Route_1 = __importDefault(require("./routes/shortUrl.Route"));
const auth_Route_1 = __importDefault(require("./routes/auth.Route"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("App running successfully!");
});
// Mount routes
app.use("/api/auth", auth_Route_1.default);
app.use('/', shortUrl_Route_1.default);
const PORT = process.env.PORT || 7005;
const MongoUri = process.env.MONGO_URI;
if (!MongoUri) {
    throw new Error("MONGO_URI is not defined");
}
const connectDb = async (uri) => {
    await mongoose_1.default.connect(uri);
    console.log("DB connected");
};
const startServer = async () => {
    try {
        await connectDb(MongoUri);
        app.listen(PORT, () => {
            console.log(`App running at port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
