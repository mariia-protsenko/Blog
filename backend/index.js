import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from "./validations.js";

import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

mongoose
  .connect(
    "mongodb+srv://mariiaprots:HuvwodMT8sewsy1X@cluster0.2qjmyqd.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is fine");
  })
  .catch((err) => {
    console.log("Error in DB", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", PostController.getLastTags);
app.get("/tags/:tag", PostController.getPostsWithTag);

app.get("/comments", CommentController.getComments);
app.get("/posts/:id/comments", CommentController.getPostComments);
app.post("/posts/:id/comments", checkAuth, CommentController.create);

app.get("/posts/sortBy/:sortValue", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(5555, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is fine");
});
