const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get(["/", "/index.html"], (req, res) => {
  res.send("Hello World!");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;