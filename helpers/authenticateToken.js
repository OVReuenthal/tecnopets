import jwt from "jsonwebtoken";
import { request, response } from "express";

export function authenticateToken(req = request, res = response, next) {
  const token = req.cookies.jwt;

  if (!token) return res.status(401), json({ msg: "Unauthorized" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: "Forbidden" });
    req.user = user;
    next();
  });
}
