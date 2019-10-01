const jwt = require("jsonwebtoken");
const DynamoDB = require("./dynamodb");
const ContentDefinition = require("./contentDefinition");

class Users extends DynamoDB {
  async authenticate({ email, password }) {
    // const user = users.find(
    //   u => u.username === username && u.password === password
    // );
    const user = {
      email: "ian@pogi.com"
    };

    if (user) {
      const token = jwt.sign({ sub: user.email }, process.env.JWT_SECRET);
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token
      };
    }
  }

  list() {
    return ["Melchor", "Gaspar", "Baltazar"];
  }
}

module.exports = new Users();
