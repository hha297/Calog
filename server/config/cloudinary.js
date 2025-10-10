const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image string
 * @param {string} folder - Cloudinary folder name (default: 'calog/avatars')
 * @returns {Promise<object>} Upload result containing secure_url
 */
const uploadImage = async (base64Image, folder = 'calog/avatars') => {
        try {
                // Ensure the base64 string has the correct prefix
                const base64Data = base64Image.includes('base64,')
                        ? base64Image
                        : `data:image/jpeg;base64,${base64Image}`;

                const result = await cloudinary.uploader.upload(base64Data, {
                        folder: folder,
                        resource_type: 'image',
                        transformation: [
                                { width: 500, height: 500, crop: 'limit' },
                                { quality: 'auto:good' },
                                { fetch_format: 'auto' },
                        ],
                });

                return {
                        success: true,
                        url: result.secure_url,
                        publicId: result.public_id,
                };
        } catch (error) {
                console.error('Cloudinary upload error:', error);
                throw new Error('Failed to upload image to Cloudinary');
        }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<object>} Delete result
 */
const deleteImage = async (publicId) => {
        try {
                const result = await cloudinary.uploader.destroy(publicId);
                return {
                        success: result.result === 'ok',
                        result: result.result,
                };
        } catch (error) {
                console.error('Cloudinary delete error:', error);
                throw new Error('Failed to delete image from Cloudinary');
        }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} Public ID or null if not a valid Cloudinary URL
 */
const extractPublicId = (url) => {
        try {
                if (!url || !url.includes('cloudinary.com')) {
                        return null;
                }

                // Extract public ID from URL
                // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image_id.jpg
                const parts = url.split('/');
                const uploadIndex = parts.indexOf('upload');

                if (uploadIndex === -1) return null;

                // Get everything after 'upload' and version number
                const pathAfterUpload = parts.slice(uploadIndex + 2).join('/');

                // Remove file extension
                const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');

                return publicId;
        } catch (error) {
                console.error('Error extracting public ID:', error);
                return null;
        }
};

module.exports = {
        cloudinary,
        uploadImage,
        deleteImage,
        extractPublicId,
};
