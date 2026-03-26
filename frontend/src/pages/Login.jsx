import { useState } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("userId", data.user.id);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
          <p className="text-center text-muted mb-4">Welcome back</p>

          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
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
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Logging in…" : "Log In"}
            </Button>
          </Form>

          <p className="text-center mt-3 mb-0 small">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="fw-semibold">
              Sign up
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
