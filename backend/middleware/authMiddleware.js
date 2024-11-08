import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import asyncHandler from './asyncHandler.js';

const prisma = new PrismaClient();

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user =  await prisma.user.findById({
        where: {
          id: decoded.id
        },
        select: {
          id: true,
          divlog_name: true,
          email: true,
        },
      });
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized, token invalid');
    }
  } else {
    res.status(410);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
