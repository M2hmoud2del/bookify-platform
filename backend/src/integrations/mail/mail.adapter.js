import transporter from "./mail.client.js";
import { MailDeliveryError } from "./mail.errors.js";

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Bookify <no-reply@bookify.local>",
      to,
      subject,
      html,
      text
    });

    return {
      messageId: response.messageId,
      response
    };
  } catch (error) {
    throw new MailDeliveryError(error.message);
  }
};
