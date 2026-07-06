export class CloudinaryUploadError extends Error {
  constructor(message = "Image upload failed") {
    super(message);
    this.name = "CloudinaryUploadError";
    this.statusCode = 502;
  }
}

export class CloudinaryDeleteError extends Error {
  constructor(message = "Image delete failed") {
    super(message);
    this.name = "CloudinaryDeleteError";
    this.statusCode = 502;
  }
}
