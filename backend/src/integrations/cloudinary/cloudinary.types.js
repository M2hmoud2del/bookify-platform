/**
 * @typedef {Object} UploadImageOptions
 * @property {string} folder
 * @property {string} [publicId]
 * @property {Array<Record<string, string|number>>} [deliveryTransformation]
 *
 * @typedef {Object} UploadImageResult
 * @property {string} secureUrl
 * @property {string} publicId
 * @property {number} width
 * @property {number} height
 * @property {string} format
 * @property {number} bytes
 * @property {"pending_review"|"approved"|"rejected"} moderationStatus
 */

export {};
