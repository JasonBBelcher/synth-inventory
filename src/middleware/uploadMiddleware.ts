import fs from "fs";
import multer from "multer";
import path from "path";
import rimraf from "rimraf";

import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../ts-definitions";
const uploadsBase = path.join(__dirname, "../../uploads/images");

const uploadMiddleware = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  let imageName: any;
  let fileExt: string;
  const storage = multer.diskStorage({
    destination: uploadsBase,
    // tslint:disable-next-line: no-shadowed-variable
    filename: (req, file, cb) => {
      fileExt = path.extname(file.originalname);
      cb(null, (imageName = file.fieldname + "-" + Date.now() + fileExt));
    }
  });
  const upload = multer({ storage, limits: { fieldSize: 30 } });
  const uploadFile = upload.single("image");

  uploadFile(req, res, err => {
    if (req.file) {
      req.imageData = new Buffer(fs.readFileSync(req.file.path)).toString(
        "base64"
      );
    } else {
      return next({ status: 400, message: "file size is too large." });
    }
    req.imageType = `image/${fileExt.split(".")[1]}`;

    // tslint:disable-next-line:no-shadowed-variable
    rimraf("./uploads/images/*", err => {
      if (err) {
        console.error(err);
      } else {
        console.log("files removed after writing base64 image to db.");
      }
    });
    next();
  });
};

export default uploadMiddleware;
