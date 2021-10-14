import express, { Router } from "express";
import currentUser from "./workspace/current.user";
import signOut from "./workspace/signOut";
import { signUp, signUpValidator } from "./workspace/signUp";
import { signIn, signInValidator } from "./workspace/signIn";
import {
  validateRequest,
  currentUserMiddleware,
} from "@jvtickets22/common-node-express";

const router: Router = express.Router();

router.get("/users/currentuser", currentUserMiddleware, currentUser);
router.post("/users/signin", signInValidator, validateRequest, signIn);
router.post("/users/signup", signUpValidator, validateRequest, signUp);
router.post("/users/signout", signOut);

export default router;
