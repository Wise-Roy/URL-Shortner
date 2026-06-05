import express from "express";
import cors from "cors";
import urlRouter from "./routes/url.routes.js";
import { redirectUrl } from "./controllers/url.controller.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8080/api/v1/url/url-shortner",
      "https://url-shortner-psi-five.vercel.app/",
    ],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1/url", urlRouter);
app.get("/:shortCode", redirectUrl);
app.get("/", (_req, res) => {
  res.send("URL shortner");
});

app.use((err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      error: err.error,
      data: err.data,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    data: null,
  });
});

export default app;
