"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const urlSchema = new mongoose_1.default.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    originalUrl: {
        type: String,
        required: true,
        unique: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true
});
exports.Url = mongoose_1.default.model("Url", urlSchema);
