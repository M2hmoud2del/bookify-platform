export class MailDeliveryError extends Error {
  constructor(message = "Email delivery failed") {
    super(message);
    this.name = "MailDeliveryError";
    this.statusCode = 502;
  }
}
