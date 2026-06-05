import { nanoid } from "nanoid";
import { Url } from "../models/url.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const generateUniqueShortCode = async (maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    const shortCode = nanoid(7);
    const existing = await Url.findOne({ shortCode });
    if (!existing) return shortCode;
  }
  throw new ApiError(500, "Failed to generate a unique short code. Please try again.");
};

export const createShortURL = async (req, res, next) => {
  try {
    const { originalURL } = req.body;

    if (!originalURL) {
      throw new ApiError(400, "Original URL is required");
    }

    if (typeof originalURL !== "string") {
      throw new ApiError(400, "Original URL must be a string");
    }

    if (!isValidUrl(originalURL.trim())) {
      throw new ApiError(400, "Invalid URL. Must be a valid HTTP or HTTPS URL");
    }

    const shortCode = await generateUniqueShortCode();

    const url = await Url.create({
      originalURL: originalURL.trim(),
      shortCode,
    });

    const response = new ApiResponse(201, "Short URL created successfully", {
      originalUrl: url.originalURL,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
      shortCode: url.shortCode,
    });

    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    if (error.code === 11000) {
      return next(new ApiError(409, "Short code collision. Please try again."));
    }
    return next(new ApiError(500, "Internal server error"));
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode || typeof shortCode !== "string") {
      throw new ApiError(400, "Short code is required");
    }

    const url = await Url.findOne({ shortCode });

    if (!url) {
      throw new ApiError(404, "URL not found");
    }

    if (!url.isActive) {
      throw new ApiError(410, "This short URL has been deactivated");
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new ApiError(410, "This short URL has expired");
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalURL);
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(500, "Internal server error"));
  }
};
