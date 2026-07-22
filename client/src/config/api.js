// Centralized API & Asset Configuration for RentEase Production Deployment

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/**
 * Normalizes image URLs for Cloudinary, external URLs, or local backend static assets.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_BASE_URL}/images/${imagePath}`;
};
