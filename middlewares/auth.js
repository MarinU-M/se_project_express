const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("./error-handler");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // check the header exists and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
    // return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // verify the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
    // return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  req.user = payload;
  return next();
};

module.exports = { auth };
