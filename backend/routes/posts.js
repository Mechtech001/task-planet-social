const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const upload = require("../config/upload");

const router = express.Router();

// ─── POST /api/posts — Create a post (text, image, or both) ────────────────
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

    // Populate author username before returning
    await post.populate("author", "username");

    return res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// ─── GET /api/posts — Get all posts (public feed), newest first ─────────────
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username");

    return res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// ─── POST /api/posts/:id/like — Toggle like ────────────────────────────────
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const userId = req.user.userId;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId); // like
    } else {
      post.likes.splice(index, 1); // unlike
    }

    await post.save();
    await post.populate("author", "username");

    return res.json(post);
  } catch (err) {
    console.error("Like post error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// ─── POST /api/posts/:id/comment — Add comment ─────────────────────────────
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
    console.error("Comment error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
