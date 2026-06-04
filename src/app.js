import express from "express";
import cors from "cors"
import urlRouter from "./routes/url.routes.js"
import {redirectUrl} from "./controllers/url.controller.js"

const app = express();

app.use(cors())
app.use(express.json())

app.use("/api/v1/url",urlRouter);
app.get("/:shortCode", redirectUrl);
app.get("/",(req,res)=> {
    res.send("URL shortner")
})
export default app;