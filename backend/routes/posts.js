const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const upload = require("../config/upload");

const router = express.Router();

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!text && !imageUrl) {
      return res
        .status(400)
        .json({ message: "Post must contain text or an image." });
    }

    const post = await Post.create({
      author: req.user.userId,
      text: text || "",
      imageUrl,
    });

    await post.populate("author", "username");

    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username");

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const userId = req.user.userId;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    await post.populate("author", "username");

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      userId: req.user.userId,
      username: req.user.username,
      text,
    });

    await post.save();
    await post.populate("author", "username");

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
