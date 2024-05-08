"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const canvas_1 = require("canvas");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const generateRandomText = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
// Generate CAPTCHA
app.get('/captcha', (req, res) => {
    const width = 250;
    const height = 60;
    const canvas = (0, canvas_1.createCanvas)(width, height);
    const ctx = canvas.getContext('2d');
    const text = generateRandomText(6);
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '36px Arial';
    ctx.fillStyle = '#111';
    // Draw each character with a random rotation
    const startX = 10;
    let x = startX;
    const y = 40;
    const charWidth = 42; // Approximate width of each character
    text.split('').forEach(char => {
        const angleDeg = Math.random() * 60 - 30; // Random angle between -30 and 30 degrees
        const angleRad = angleDeg * Math.PI / 180;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angleRad);
        ctx.fillText(char, 0, 0);
        ctx.restore();
        x += charWidth; // Move to the next character position
    });
    const dataUrl = canvas.toDataURL();
    const saltRounds = 10;
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    const hashText = bcrypt_1.default.hashSync(text, salt);
    res.send({ image: dataUrl, text: hashText });
});
// Verify CAPTCHA
app.post('/verify', express_1.default.json(), (req, res) => {
    const { userInput, captchaText } = req.body;
    bcrypt_1.default.compare(userInput, captchaText, async (err, result) => {
        if (result)
            res.send({ message: "You are a human" });
        else
            res.send({ message: "You are a robot" });
    });
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
