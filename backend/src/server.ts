import app from "./app.js";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log("");
  console.log("=================================");
  console.log(" Robinhood Chain Token Analyzer");
  console.log(" Mode: paper");
  console.log("=================================");
  console.log(` Server running on port ${PORT}`);
  console.log("");
});