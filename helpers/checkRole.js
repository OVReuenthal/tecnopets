import jwt from 'jsonwebtoken';
import { request, response } from 'express';

export function checkRole(req = request, res = response, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        error: "Usted no tiene un token de acceso",
      });
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET);

    const { role } = decode;

    if (role === 0) {
      console.log("Usuario es Cliente");
      req.userRole = 'cliente'; // Puedes usar esta información en los siguientes middlewares o rutas
      next();
    } else if (role === 1) {
      console.log("Usuario es Administrador");
      req.userRole = 'administrador';
      next();
    } else if (role === 2) {
      console.log("Usuario es Distribuidor");
      req.userRole = 'distribuidor';
      next();
    } else {
      return res.status(401).json({
        error: "Rol no autorizado",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Token inválido o usted no está autorizado",
    });
  }
}
