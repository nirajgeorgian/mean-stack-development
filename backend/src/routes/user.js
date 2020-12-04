import express from "express";
import { upload } from "../start";
import User from "../models/user";

export const findUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user == null) {
    res.status(404).json({ message: "cannot find user" });
  }

  res.user = user;
  next();
};

const createUser = async (req, res) => {
  const user = new User({
    ...req.body,
  });
  const newUser = await user.save();
  return res.status(201).json({ newUser });
};

const findAll = async (req, res) => {
  const users = await User.find().lean();
  return res.json(users);
};

const findOne = (req, res) => {
  res.json(res.user);
};

const updateUser = async (req, res) => {
  if (req.body.firstName !== null) {
    res.user.firstName = req.body.firstName;
  }
  if (req.body.lastName !== null) {
    res.user.lastName = req.body.lastName;
  }
  if (req.body.email !== null) {
    res.user.email = req.body.email;
  }
  if (req.body.phoneNumber !== null) {
    res.user.phoneNumber = req.body.phoneNumber;
  }
  const updatedUser = await res.user.save();
  return res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  await res.user.deleteOne();
  res.json({ message: "User deleted successfully" });
};

export function userRoutes() {
  const router = express.Router();
  router.get("/", findAll);
  router.post("/", createUser);
  router.get("/:id", findUser, findOne);
  router.put("/:id", findUser, updateUser);
  router.delete("/:id", findUser, deleteUser);

  return router;
}
