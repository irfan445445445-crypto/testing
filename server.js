const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// ⚠️ Don't hardcode in production, use process.env
const BOT_TOKEN = "8296310739:AAEA8Y4JObB3Qj2FY9ZbldKKEJAp7xozicw";
const CHAT_ID = "1214303092";

app.post("/send", async (req, res) => {
  const text = req.body.message;

  if (!text) return res.status(400).send({ error: "No message provided" });

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });
    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to send message" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
