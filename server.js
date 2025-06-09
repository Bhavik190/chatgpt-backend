const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const openaiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lustrous-bavarois-8277cb.netlify.app", // 👈 update to your Netlify URL
        "X-Title": "Bhavik GPT"
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-32768", // ✅ FREE and good model
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
    console.log("OpenRouter Response:", data);

    const reply = data?.choices?.[0]?.message?.content || data?.error?.message || "Sorry, something went wrong.";
    res.json({ reply });
  } catch (err) {
    console.error("Error:", err.message);
    res.json({ reply: "Sorry, something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
