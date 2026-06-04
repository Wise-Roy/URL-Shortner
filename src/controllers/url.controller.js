import { nanoid } from "nanoid";
import { Url } from "../models/url.model.js";

export const createShortURL = async (req, res) => {
  try {
    const { originalURL } = req.body;
    if (!originalURL) {
      return res.status(400).json({
        success: false,
        message: "Original URL is required",
      });
    }

    const shortCode = nanoid(7);

    const url = await Url.create({
      originalURL,
      shortCode,
    });

    return res.status(201).json({
      success: true,
      data: {
        originalUrl: url.originalURL,
        shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
