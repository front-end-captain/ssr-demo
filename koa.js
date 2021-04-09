const Koa = require("koa");
const static = require("koa-static");

const { render } = require("./build/server");

const app = new Koa();

app.use(static("build"))

app.use(async (ctx) => {
  const { document } = await render({ path: ctx.request.path });

  ctx.body = document;
});

app.listen(3000, () => {
  console.log("listening up at 3000");
});
