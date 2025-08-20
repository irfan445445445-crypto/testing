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

  // Get IP address from headers (works on Vercel)
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "Unknown IP";

  // Get timestamp
  const timestamp = new Date().toLocaleString("en-GB", {
    timeZone: "UTC",
    hour12: false,
  });

  try {
    const telegramURL = `https://api.telegram.org/bot${token}/sendMessage`;
    const telegramRes = await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `📩 *New message received*\n\n💬 Message: ${message}\n🌍 IP: ${ip}\n🕒 Time: ${timestamp} UTC`,
        parse_mode: "Markdown"
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
