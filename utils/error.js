const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DEFAULT = 500;

// const errorHandler = (req, res, next) => {
//   res.error = (err) => {
//     if (err.status === BAD_REQUEST) {
//       return res.status(BAD_REQUEST).send({ message: "Invalid request", err });
//     }
//     if (err.status === NOT_FOUND) {
//       return res
//         .status(NOT_FOUND)
//         .send({ message: "Requested info is not found", err });
//     }
//     if (err.status === DEFAULT) {
//       return res.status(DEFAULT).send({ message: "Server error", err });
//     }
//   };
//   next();
// };

module.exports = { BAD_REQUEST, NOT_FOUND, DEFAULT };
