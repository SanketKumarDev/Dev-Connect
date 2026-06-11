import { useState, useEffect } from "react";
import { getAllPosts } from "../utils/api";
import PostCard from "../components/posts/PostCard";
import toast from "react-hot-toast";
import "./ExplorePage.css";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (p = 1) => {
    try {
      const res = await getAllPosts(p);
      if (p === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
      setHasMore(p < res.data.pages);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPosts(next);
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h2>Explore</h2>
        <p>Discover what developers are building and sharing</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
          ))}
          {hasMore && (
            <button className="btn btn-outline load-more" onClick={loadMore}>
              Load more
            </button>
          )}
        </>
      )}
    </div>
  );
}
