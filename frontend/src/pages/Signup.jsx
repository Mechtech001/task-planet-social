import { useState } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/signup", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("userId", data.user.id);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", maxWidth: 440 }}
    >
      <Card className="w-100 border-0 shadow">
        <Card.Body className="p-4">
          <h3 className="text-center fw-bold mb-1">🪐 TaskPlanet Social</h3>
          <p className="text-center text-muted mb-4">Create your account</p>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Username</Form.Label>
              <Form.Control
                name="username"
                placeholder="Pick a username"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Sign Up"}
            </Button>
          </Form>

          <p className="text-center mt-3 mb-0 small">
            Already have an account?{" "}
            <Link to="/login" className="fw-semibold">
              Log in
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
