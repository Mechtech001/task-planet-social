import { useState } from "react";
import { Card, Button, Collapse } from "react-bootstrap";
import api from "../utils/api";
import timeAgo from "../utils/timeAgo";
import CommentSection from "./CommentSection";

const API_URL = import.meta.env.VITE_API_URL;

export default function PostCard({ post, onPostUpdated }) {
  const [showComments, setShowComments] = useState(false);
  const currentUserId = localStorage.getItem("userId");
  const isLiked = post.likes?.includes(currentUserId);

  const handleLike = async () => {
    const updatedLikes = isLiked
      ? post.likes.filter((id) => id !== currentUserId)
      : [...post.likes, currentUserId];

    onPostUpdated({ ...post, likes: updatedLikes });

    try {
      const { data } = await api.post(`/api/posts/${post._id}/like`);
      onPostUpdated(data);
    } catch (err) {
      onPostUpdated(post);
    }
  };

  const handleCommentAdded = (updatedPost) => {
    onPostUpdated(updatedPost);
  };

  const authorName = post.author?.username || "Unknown";
  const imageUrl = post.imageUrl
    ? `${API_URL}${post.imageUrl}`
    : null;

  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body className="pb-2">
        <div className="d-flex align-items-center mb-2">
          <div
            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold me-2"
            style={{ width: 36, height: 36, fontSize: 14 }}
          >
            {authorName[0]?.toUpperCase()}
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: 14, lineHeight: 1.2 }}>
              {authorName}
            </div>
            <small className="text-muted" style={{ fontSize: 11 }}>
              {timeAgo(post.createdAt)}
            </small>
          </div>
        </div>

        {post.text && <p className="mb-0" style={{ fontSize: 15 }}>{post.text}</p>}
      </Card.Body>

      {imageUrl && (
        <Card.Img
          src={imageUrl}
          alt="post"
          style={{ maxHeight: 300, objectFit: "cover", borderRadius: 0 }}
        />
      )}

      <Card.Body className="pt-2 pb-2">
        <div className="d-flex gap-3">
          <Button
            variant="link"
            className="text-decoration-none p-0 d-flex align-items-center gap-1"
            style={{ color: isLiked ? "#e0245e" : "#6c757d", fontSize: 14 }}
            onClick={handleLike}
          >
            {isLiked ? "♥" : "♡"} {post.likes?.length || 0}
          </Button>

          <Button
            variant="link"
            className="text-decoration-none p-0 d-flex align-items-center gap-1 text-secondary"
            style={{ fontSize: 14 }}
            onClick={() => setShowComments(!showComments)}
          >
            💬 {post.comments?.length || 0}
          </Button>
        </div>

        <Collapse in={showComments}>
          <div>
            <CommentSection
              postId={post._id}
              comments={post.comments || []}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}
