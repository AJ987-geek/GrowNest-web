import { useState, useEffect } from 'react';
import { Send, Heart, MessageCircle, Trash2, User } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's ID
  const currentUserId = localStorage.getItem('userId');

  const fetchPosts = async () => {
    try {
      const res = await fetch('https://grownest-backend-5xa2.onrender.com/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !currentUserId) return;

    try {
      await fetch('https://grownest-backend-5xa2.onrender.com/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, content: newPost })
      });
      setNewPost('');
      fetchPosts(); // Refresh feed immediately
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUserId) return;
    try {
      await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId })
      });
      fetchPosts(); // Refresh to update like count
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}`, {
        method: 'DELETE'
      });
      fetchPosts(); // Refresh feed immediately
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading community feed...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Parent Community</h1>
        <p className="text-gray-500 text-sm mt-1">Connect, share experiences, and learn together.</p>
      </div>

      {/* Create Post Box */}
      {currentUserId ? (
        <form onSubmit={handleCreatePost} className="card p-4 flex flex-col gap-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Ask a question or share a tip with other parents..."
            className="input w-full min-h-[100px] resize-none"
            required
          />
          <button type="submit" className="btn-primary self-end flex items-center gap-2">
            <Send className="w-4 h-4" /> Post
          </button>
        </form>
      ) : (
        <div className="card p-4 text-center text-gray-500">
          Log in to share a post with the community!
        </div>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="card p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {post.avatar ? <img src={post.avatar} className="w-full h-full rounded-full" alt="avatar" /> : <User className="text-primary-600 w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{post.name}</h3>
                  <p className="text-xs text-gray-500">@{post.username} • {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Delete Button (Only visible if the current user is the author) */}
              {post.user_id.toString() === currentUserId?.toString() && (
                <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm mb-4">
              {post.content}
            </p>

            <div className="flex gap-4 border-t dark:border-gray-700 pt-3">
              <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors group">
                <Heart className="w-4 h-4 group-hover:fill-current" /> {post.likes_count}
              </button>
              {/* We can build the Comments UI drop-down later if you want! */}
              <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary-500 transition-colors">
                <MessageCircle className="w-4 h-4" /> Reply
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center p-8 text-gray-400">No posts yet. Be the first to start the conversation!</div>
        )}
      </div>
    </div>
  );
}