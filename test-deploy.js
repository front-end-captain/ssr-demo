const fs = require("fs");
const { render } = require("./build/server");

render({ path: "/about" }).then(({ document }) => {
  fs.writeFile("result.html", document, { encoding: "utf-8" }, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("render success");
  });
});
