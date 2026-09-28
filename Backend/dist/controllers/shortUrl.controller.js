"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedirectUrl = exports.createShortUrl = void 0;
const nanoid_1 = require("nanoid");
const url_Model_1 = require("../model/url.Model");
const createShortUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }
        // If URL already exists in database, return the existing record
        const existingRecord = await url_Model_1.Url.findOne({ originalUrl: url });
        if (existingRecord) {
            return res.status(200).json({ message: "Url fetched successfully", newRec: existingRecord });
        }
        const shortId = (0, nanoid_1.nanoid)(8);
        const newRec = await url_Model_1.Url.create({
            shortId,
            originalUrl: url
        });
        return res.status(200).json({ message: "Url generate successfully", newRec });
    }
    catch (error) {
        console.log("Error while creating short url", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};
exports.createShortUrl = createShortUrl;
const getRedirectUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        const record = await url_Model_1.Url.findOneAndUpdate({
            shortId
        }, { $inc: { clicks: 1 } });
        if (!record)
            return res.status(404).json({ message: "Not found" });
        return res.redirect(record.originalUrl);
    }
    catch (error) {
        console.error("Error while redirecting URL:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.getRedirectUrl = getRedirectUrl;
