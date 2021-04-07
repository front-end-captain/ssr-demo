const fs = require("fs");
const express = require("express");
const { render } = require("./build/server");

// render({ path: "/index" }).then(({ document }) => {
//   fs.writeFile("result.html", document, { encoding: "utf-8" }, (err) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     console.log("render success");
//   });
// });

const app = express();

app.use(express.static("build"));

app.use(async (req, res) => {
  const path = req.path;

  const document = await render({ path });

  res.send(document.document);
});

app.listen(4000, () => {
  console.log("listening up");
});
