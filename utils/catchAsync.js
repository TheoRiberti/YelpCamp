//the wrapper helper function:
//we return a function, that accepts a function and it executes that function, while catching any error and passing it to next

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e));
  };
};
