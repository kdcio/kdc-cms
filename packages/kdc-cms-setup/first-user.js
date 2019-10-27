require("./env");
const createUser = require("./lib/create-user");

createUser().catch(e => console.log(e));
