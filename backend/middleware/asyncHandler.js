const asyncHandler = fn => (req, res, next) => {
  console.log('asynchandler!')
  Promise.resolve(fn(req, res, next)).catch(next);
}

export default asyncHandler;