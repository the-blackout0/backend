const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

require("./routes/nfts.routes")(app);

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
