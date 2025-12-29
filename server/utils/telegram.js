const axios = require('axios');

const sendAdminNotification = async text => {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.MY_TELEGRAM_CHAT_ID;

  // Check karein tokens hain ya nahi
  if (!token || !chatId) {
    return console.log('Telegram credentials missing in .env');
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      },
      {
        timeout: 3000 // Agar 3 seconds mein connect na ho toh cancel kar do
      }
    );
    console.log('✅ Telegram notification sent!');
  } catch (error) {
    // Sirf console mein error dikhayein, user ka order na rokein
    console.error('❌ Telegram Blocked/Timeout:', error.message);
  }
};

module.exports = sendAdminNotification;
