/**
 * @typedef {Object} UploadImageOptions
 * @property {string} folder
 * @property {string} [publicId]
 * @property {Array<Record<string, string|number>>} [deliveryTransformation]
 * @property {Array<Record<string, string|number>>} [transformation]
 *
 * @typedef {Object} UploadImageResult
 * @property {string} url
 * @property {string} publicId
 * @property {number} width
 * @property {number} height
 * @property {string} format
 * @property {number} bytes
 * @property {"pending_review"|"approved"|"rejected"} moderationStatus
 *
 * @typedef {Object} ImageMetadata
 * @property {string} url
 * @property {string} publicId
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [format]
 * @property {number} [bytes]
 */

export {};
