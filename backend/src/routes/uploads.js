import express from "express";
import multer from "multer";
import { findUser } from "./user";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      //Error
      cb(new Error("Please upload JPG and PNG images only!"));
    }
    //Success
    cb(undefined, true);
  },
});

const uploadProfilePicture = async (req, res) => {
  res.user.profileImage = req.file.path;
  await res.user.save();

  return res.send({
    uploaded: true,
    file: req.file,
    value: req.file.path,
  });
};

export function uploadsRoutes() {
  const router = express.Router();
  router.post(
    "/:id/profile-picture",
    findUser,
    upload.single("profileImage"),
    uploadProfilePicture
  );

  return router;
}
