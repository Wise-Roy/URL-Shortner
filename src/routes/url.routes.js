import { Router } from "express";
import { createShortURL } from "../controllers/url.controller.js";

const router = Router();

router.post("/url-shortner", createShortURL);

export default router;
