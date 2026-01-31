import { action } from "./_generated/server";
import { v } from "convex/values";

// Send a Telegram notification
export const sendTelegramNotification = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.log("Telegram notification skipped: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      return { success: false, error: "Telegram not configured" };
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: args.message,
            parse_mode: "Markdown",
          }),
        }
      );

      const result = await response.json();
      
      if (!result.ok) {
        console.error("Telegram API error:", result);
        return { success: false, error: result.description };
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
      return { success: false, error: String(error) };
    }
  },
});
