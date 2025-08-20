export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  try {
    const telegramURL = `https://api.telegram.org/bot${token}/sendMessage`;
    const telegramRes = await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `New message:\n${message}`
      }),
    });

    if (!telegramRes.ok) {
      throw new Error("Telegram API error");
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
