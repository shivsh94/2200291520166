const express = require("express");
const app = express();
const stockRoutes = require("./routes/stockRoutes");
require("dotenv").config();

app.use(express.json());
app.use("/api", stockRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
