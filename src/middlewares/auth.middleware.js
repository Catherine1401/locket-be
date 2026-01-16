const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = payload.userId;
  next();
};

export default { auth };
