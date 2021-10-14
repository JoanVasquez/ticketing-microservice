import User, { UserAttrs } from "./user.model";
import { throwError } from "@jvtickets22/common-node-express";
import bcrypt from "bcrypt";

export const signUpDao = async (data: UserAttrs) => {
  const { email } = data;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw throwError(400, "Email in use");
  }

  const user = User.build(data);
  await user.save();
  return user;
};

export const signInDao = async (data: UserAttrs) => {
  const { email, password } = data;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw throwError(400, "Invalid email");
  }

  const isPassword = await bcrypt.compare(password, existingUser.password);

  if (!isPassword) {
    throw throwError(400, "Invalid Password");
  }
  return existingUser;
};
