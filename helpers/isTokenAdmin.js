import jwt from "jsonwebtoken";

export function isAdmin(req = request, res = response, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        error: "Usted no tiene un token de acceso",
      });
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!decode.isAdmin) {
      return res.status(401).json({
        error: "Usted no es administrador, no puede realizar esta operación",
      });
    }

    console.log(decode.isAdmin);
    next();
  } catch (error) {
    res.status(401).json({
      error: "Usted no es administrador",
    });
  }
}
