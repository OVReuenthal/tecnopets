import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  loginUser,
  online,
  editUser,
  logOut,
} from "../Controllers/userControllers.js";
import { validateFields } from "../middlewares/validateFields.js";
import { check } from "express-validator";
import { validateUser } from "../middlewares/validateData.js";
import { authenticateToken } from "../Helpers/authenticateToken.js";

const routerUser = express.Router();

routerUser.post(
  "/user/login",
  [
    check("user_name", "error name").notEmpty().isLength({ max: 20 }), // this "check" are middlewares
    check("password", "error password").notEmpty().isLength({ max: 20 }),
    validateFields,
  ],
  loginUser
);

routerUser.post(
  "/user/create",
  [
    check("name_user", "error name").notEmpty().isLength({ max: 20 }),
    check("password", "error password").notEmpty().isLength({ max: 20 }),
    check("rol", "error rol").isBoolean().notEmpty(),
    validateFields,
  ],
  createUser
);

routerUser.patch(
  "/user/edit",
  [
    check("id_user", "user error").notEmpty().custom(validateUser),
    check("name_user", "error name").notEmpty().isLength({ max: 20 }),
    validateFields,
  ],
  editUser
);

routerUser.delete(
  "/user/delete",
  [
    check("id_user", "user error").notEmpty().custom(validateUser),
    validateFields,
  ],

  deleteUser
);

routerUser.get("/users", [validateFields, authenticateToken], getAllUser);

routerUser.get("/online", online);

routerUser.post("/logout", logOut);
export { routerUser };
