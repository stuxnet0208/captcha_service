import express from 'express';
import cors from 'cors';
import { createCanvas } from 'canvas';
import bcrypt from "bcrypt";
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const generateRandomText = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

// Generate CAPTCHA
app.get('/captcha', (req, res) => {
    const width = 250;
    const height = 60;
    const canvas = createCanvas(width, height);
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
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    const hashText = bcrypt.hashSync(text, salt)

    res.send({ image: dataUrl, text: hashText });
});

// Verify CAPTCHA
app.post('/verify', express.json(), (req, res) => {
    const { userInput, captchaText } = req.body;
    bcrypt.compare(userInput, captchaText, async (err: Error | undefined, result: boolean) => {
        if (result) res.send({ message: "You are a human" });
        else res.send({ message: "You are a robot" });
    })
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
