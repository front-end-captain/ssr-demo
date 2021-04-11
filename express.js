const express = require("express");
const { render } = require("./build/server");

const app = express();

app.use(express.static("build"));

app.use(async (req, res) => {
  const { document } = await render({ path: req.path });

  res.send(document);
});

app.listen(3000, () => {
  console.log("listening up at 3000");
});
