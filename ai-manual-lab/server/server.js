import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { parsePdf } from "./pdfParser.js";
import { askOpenAI } from "./openaiHandler.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

/** PDF解析エンドポイント */
app.post("/api/upload", async (req, res) => {
  try {
    const { base64 } = req.body;
    const text = await parsePdf(base64);
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** ChatGPT質問エンドポイント */
app.post("/api/ask", async (req, res) => {
  try {
    const { question, context } = req.body;
    const answer = await askOpenAI(question, context);
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
