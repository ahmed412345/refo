const wrapperFun = func => (req, res, next) => func(req, res, next).catch(next);
export { wrapperFun };
