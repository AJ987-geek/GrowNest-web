import { useState, useEffect } from 'react';
import { Send, MessageSquare, Trash2, User, ArrowBigUp } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  // Comment states
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [newComment, setNewComment] = useState({});

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
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleLike = async (postId) => {
    if (!currentUserId) return;
    try {
      await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId })
      });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}`, {
        method: 'DELETE'
      });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const toggleComments = async (postId) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded && !commentsData[postId]) {
      // Fetch comments if opening for the first time
      try {
        const res = await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}/comments`);
        const data = await res.json();
        setCommentsData(prev => ({ ...prev, [postId]: data }));
      } catch (err) { console.error(err); }
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const commentText = newComment[postId];
    if (!commentText?.trim() || !currentUserId) return;

    try {
      await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, content: commentText })
      });

      setNewComment(prev => ({ ...prev, [postId]: '' }));

      // Refresh just this post's comments
      const res = await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}/comments`);
      const data = await res.json();
      setCommentsData(prev => ({ ...prev, [postId]: data }));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading community feed...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Parent Community</h1>
        <p className="text-gray-500 text-sm mt-1">Connect, share experiences, and learn together.</p>
      </div>

      {currentUserId ? (
        <form onSubmit={handleCreatePost} className="card p-4 flex flex-col gap-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Create a post..."
            className="input w-full min-h-[100px] resize-none"
            required
          />
          <button type="submit" className="btn-primary self-end flex items-center gap-2">
            <Send className="w-4 h-4" /> Post
          </button>
        </form>
      ) : (
        <div className="card p-4 text-center text-gray-500">Log in to share a post!</div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="card overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors flex">

            {/* Reddit-Style Left Column for Upvotes */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 flex flex-col items-center gap-1 border-r border-gray-100 dark:border-gray-700 w-16 shrink-0">
              <button onClick={() => handleLike(post.id)} className="text-gray-400 hover:text-orange-500 transition-colors">
                <ArrowBigUp className="w-7 h-7" />
              </button>
              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{post.likes_count}</span>
            </div>

            {/* Right Column for Content */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    {post.avatar ? <img src={post.avatar} className="w-full h-full rounded-full" alt="avatar" /> : <User className="text-primary-600 w-3 h-3" />}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-xs">{post.name}</span>
                  <span className="text-xs text-gray-500">@{post.username} • {new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                {post.user_id.toString() === currentUserId?.toString() && (
                  <button onClick={() => handleDelete(post.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm mb-4">
                {post.content}
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Comments
                </button>
              </div>

              {/* Expanding Comments Section */}
              {expandedComments[post.id] && (
                <div className="mt-4 border-t dark:border-gray-700 pt-4 space-y-4">

                  {/* List of comments */}
                  {commentsData[post.id]?.length > 0 ? (
                    <div className="space-y-3">
                      {commentsData[post.id].map(comment => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">{comment.name}</span>
                            <span className="text-[10px] text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No comments yet. Be the first!</p>
                  )}

                  {/* Add Comment Form */}
                  {currentUserId && (
                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Write a reply..."
                        className="input flex-1 text-sm py-1.5"
                        required
                      />
                      <button type="submit" className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                        Reply
                      </button>
                    </form>
                  )}
                </div>
              )}

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