const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;




app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
  console.log("OpenAI API Response:", data);

const reply = data?.choices?.[0]?.message?.content 
            || data?.error?.message 
            || "Sorry, no response.";


    res.json({ reply });
  } catch (err) {
    res.json({ reply: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
