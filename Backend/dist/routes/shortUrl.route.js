"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shortUrl_controller_1 = require("../controllers/shortUrl.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/api/create", auth_middleware_1.authenticateToken, shortUrl_controller_1.createShortUrl);
router.get("/:shortId", shortUrl_controller_1.getRedirectUrl);
exports.default = router;
