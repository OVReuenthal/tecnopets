import jwt from "jsonwebtoken";

export function generateAccessToken(id, rol) {
  const payload = {
    id: id,
    isAdmin: rol,
  };

  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "30d",
  });
}
