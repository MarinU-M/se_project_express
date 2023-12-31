const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("./error-handler");

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
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    );
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
    // return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  req.user = payload;
  return next();
};

module.exports = { auth };
