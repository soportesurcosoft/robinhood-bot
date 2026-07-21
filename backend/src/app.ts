import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", routes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Robinhood Trader Backend Online",
  });
});

export default app;