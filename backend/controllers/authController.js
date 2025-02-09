import jwt from "jsonwebtoken";

const checkAuth = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userId: decoded.userId });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

export { checkAuth };