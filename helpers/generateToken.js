import jwt from "jsonwebtoken";

export function generateAccessToken(id, role) {
  const payload = {
    id: id,
    role: role,
  };

  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "30d",
  });
}
