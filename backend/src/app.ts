import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    mode: "paper",
    message: "Robinhood Chain Token Analyzer is online",
  });
});

export default app;