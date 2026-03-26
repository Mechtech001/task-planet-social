import { Navbar as BsNavbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <BsNavbar
      bg="dark"
      variant="dark"
      sticky="top"
      className="shadow-sm mb-4"
    >
      <Container style={{ maxWidth: 600 }}>
        <BsNavbar.Brand
          href="/feed"
          className="fw-bold"
          style={{ letterSpacing: "0.5px" }}
        >
          🪐 TaskPlanet Social
        </BsNavbar.Brand>

        <div className="d-flex align-items-center gap-3">
          {username && (
            <span className="text-light opacity-75 small">@{username}</span>
          )}
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Container>
    </BsNavbar>
  );
}
