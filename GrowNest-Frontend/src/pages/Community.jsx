import { useState, useEffect } from 'react';
import { Send, MessageSquare, Trash2, User, ArrowBigUp, X } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState([]);

  // Create Post States
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPost.trim() || !currentUserId) return;
    try {
      await fetch('https://grownest-backend-5xa2.onrender.com/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, title: newTitle, content: newPost })
      });
      setNewTitle('');
      setNewPost('');
      setIsPosting(false); // Close the form
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
      await fetch(`https://grownest-backend-5xa2.onrender.com/api/posts/${postId}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const toggleComments = async (postId) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded && !commentsData[postId]) {
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

      {/* Reddit Style Create Post Bar */}
      {currentUserId ? (
        <div className="card p-3 flex gap-3 items-center cursor-text" onClick={() => setIsPosting(true)}>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <User className="text-primary-600 w-5 h-5" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full rounded-md px-4 py-2.5 text-gray-400 text-sm border border-gray-200 dark:border-gray-700">
            Create Post
          </div>
        </div>
      ) : (
        <div className="card p-4 text-center text-gray-500">Log in to share a post!</div>
      )}

      {/* The Expanded Post Form */}
      {isPosting && (
        <form onSubmit={handleCreatePost} className="card p-4 flex flex-col gap-3 border-2 border-primary-500 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white">Create a Post</h3>
            <button type="button" onClick={() => setIsPosting(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="input w-full font-bold text-lg"
            maxLength={255}
            required
          />
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Text (optional)"
            className="input w-full min-h-[100px] resize-none"
            required
          />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setIsPosting(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Post</button>
          </div>
        </form>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="card overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors flex">

            {/* Upvotes Column */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 flex flex-col items-center gap-1 border-r border-gray-100 dark:border-gray-700 w-16 shrink-0">
              <button onClick={() => handleLike(post.id)} className="text-gray-400 hover:text-orange-500 transition-colors">
                <ArrowBigUp className="w-7 h-7" />
              </button>
              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{post.likes_count}</span>
            </div>

            {/* Content Column */}
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

              {/* NEW TITLE ELEMENT */}
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>

              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm mb-4">
                {post.content}
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {commentsData[post.id]?.length || 0} Comments
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="mt-4 border-t dark:border-gray-700 pt-4 space-y-4">
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

                  {currentUserId && (
                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="What are your thoughts?"
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