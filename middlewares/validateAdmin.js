import { request, response } from 'express';
import jwt from 'jsonwebtoken';

export const validateAdmin = (req = request, res = response, next) => {
  try {
    const token = req.cookies.jwt;

    console.log(token);

    if (!token) {
      return res.status(401).json({
        error: "Usted no tiene un token de acceso",
      });
    }
  
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);

    if (decode.role == 0){
        return res.status(403).json({
            error: 'Usted no tiene permisos para acceder a este recurso',
        });
    }

    // Añadir el user_id decodificado al body del request
    req.body.user_id = decode.id;

    // Continuar al siguiente middleware o controlador
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: 'Token inválido',
      message: error.message,
    });
  }
};
