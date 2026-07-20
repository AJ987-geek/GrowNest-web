import { Inbox, Search, Plus } from 'lucide-react';

const presets = {
  empty: {
    icon: Inbox,
    title: 'Nothing here yet',
    description: 'Get started by adding your first item.',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
};

export default function EmptyState({ type = 'empty', title, description, action, actionLabel }) {
  const preset = presets[type] || presets.empty;
  const Icon = preset.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title || preset.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">{description || preset.description}</p>
      {action && (
        <button onClick={action} className="btn-primary">
          <Plus className="w-4 h-4" />
          {actionLabel || 'Add New'}
        </button>
      )}
    </div>
  );
}
