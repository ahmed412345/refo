/* Created by Ahmed Eltahan - 2026 */
const wrapperFun = (func) => (req, res, next) =>
  func(req, res, next).catch(next);
export { wrapperFun };
