import { Router } from "express";
import { createShortURL, redirectUrl } from "../controllers/url.controller.js";

const router = Router();

router.post("/url-shortner", createShortURL);
router.get("/:shortCode", redirectUrl);


export default router;
