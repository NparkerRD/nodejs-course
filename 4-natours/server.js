const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

/*
App Flow:

1. Request is recieved in server.js (linked to app.js)
2. Enter router, (e.g tourRouter)
3. Execute controller (e.g tourController)
4. Response is sent and response request cycle is complete

*/
