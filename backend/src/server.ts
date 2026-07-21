import app from "./app";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log("");
  console.log("=================================");
  console.log(" Robinhood Trader Backend");
  console.log("=================================");
  console.log(` Server running on port ${PORT}`);
  console.log("");
});