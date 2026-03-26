import { useState, useRef } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import api from "../utils/api";

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (image) formData.append("image", image);

      const { data } = await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPostCreated(data);
      setText("");
      removeImage();
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  const username = localStorage.getItem("username");

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold me-2"
            style={{ width: 36, height: 36, fontSize: 14 }}
          >
            {username?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="fw-semibold">{username}</span>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-3 border-0 bg-light"
            style={{ resize: "none" }}
          />

          {preview && (
            <div className="position-relative mb-3">
              <img
                src={preview}
                alt="preview"
                className="rounded w-100"
                style={{ maxHeight: 200, objectFit: "cover" }}
              />
              <Button
                variant="dark"
                size="sm"
                className="position-absolute top-0 end-0 m-2 rounded-circle"
                style={{ width: 28, height: 28, padding: 0 }}
                onClick={removeImage}
              >
                ✕
              </Button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <InputGroup style={{ width: "auto" }}>
              <Form.Control
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleImageChange}
                size="sm"
                className="border-0"
                style={{ maxWidth: 230 }}
              />
            </InputGroup>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={(!text.trim() && !image) || submitting}
              className="px-4"
            >
              {submitting ? "Posting…" : "Post"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
