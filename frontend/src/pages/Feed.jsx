import { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import api from "../utils/api";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await api.get("/api/posts");
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* Prepend new post without reload */
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  /* Update a post in-place (like / comment) */
  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  /* Sorted / filtered view */
  const visiblePosts = (() => {
    switch (tab) {
      case "liked":
        return [...posts].sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
      case "commented":
        return [...posts].sort(
          (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
        );
      default:
        return posts; // already newest-first from API
    }
  })();

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      <Navbar />

      <Container style={{ maxWidth: 600 }}>
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Filter tabs */}
        <Nav
          variant="tabs"
          activeKey={tab}
          onSelect={(k) => setTab(k)}
          className="mb-3"
        >
          <Nav.Item>
            <Nav.Link eventKey="all">All Posts</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="liked">Most Liked</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="commented">Most Commented</Nav.Link>
          </Nav.Item>
        </Nav>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : visiblePosts.length === 0 ? (
          <p className="text-center text-muted py-5">
            No posts yet — be the first to share something!
          </p>
        ) : (
          visiblePosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdated={handlePostUpdated}
            />
          ))
        )}
      </Container>
    </div>
  );
}
