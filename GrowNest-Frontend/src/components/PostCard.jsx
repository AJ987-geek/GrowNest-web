import { ArrowUp, MessageCircle, Pin, Tag } from 'lucide-react';
import { getInitials } from '../utils/helpers.js';

const categoryColors = {
  Nutrition: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Vaccination: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Parenting: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Growth: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Sleep: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  School: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function PostCard({ post, onUpvote }) {
  const avatarColors = ['from-primary-400 to-primary-600', 'from-teal-400 to-teal-600', 'from-purple-400 to-purple-600', 'from-orange-400 to-orange-600'];
  const color = avatarColors[post.id % avatarColors.length];

  return (
    <div className="card-hover p-5 group">
      {post.pinned && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mb-3">
          <Pin className="w-3.5 h-3.5" />
          Pinned Post
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Upvote */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <button
            onClick={() => onUpvote && onUpvote(post.id)}
            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group/upvote"
          >
            <ArrowUp className="w-4 h-4 group-hover/upvote:scale-125 transition-transform" />
            <span className="text-xs font-bold">{post.upvotes}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`badge ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{post.time}</span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1.5 cursor-pointer">
            {post.title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.content}</p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold`}>
                {getInitials(post.author)}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{post.author}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{post.comments}</span>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors cursor-pointer">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
