import { useState } from "react";
import { ListGroup, Form, Button, InputGroup } from "react-bootstrap";
import api from "../utils/api";
import timeAgo from "../utils/timeAgo";

export default function CommentSection({ postId, comments, onCommentAdded }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post(`/api/posts/${postId}/comment`, {
        text: text.trim(),
      });
      onCommentAdded(data);
      setText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3">
      {comments.length > 0 && (
        <ListGroup variant="flush" className="mb-2">
          {comments.map((c) => (
            <ListGroup.Item
              key={c._id}
              className="px-0 py-2 border-bottom bg-transparent"
            >
              <div className="d-flex justify-content-between">
                <span>
                  <strong className="me-2" style={{ fontSize: 13 }}>
                    {c.username}
                  </strong>
                  <span style={{ fontSize: 13 }}>{c.text}</span>
                </span>
                <small className="text-muted" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                  {timeAgo(c.createdAt)}
                </small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Form onSubmit={handleSubmit}>
        <InputGroup size="sm">
          <Form.Control
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            type="submit"
            variant="outline-primary"
            disabled={!text.trim() || submitting}
          >
            {submitting ? "…" : "Reply"}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}
