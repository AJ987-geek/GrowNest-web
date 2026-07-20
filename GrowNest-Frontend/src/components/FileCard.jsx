import { FileText, Image, Download, Eye, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/helpers.js';

const categoryColors = {
  'Birth Records': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'Vaccination': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Reports': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Prescription': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function FileCard({ file, onDelete }) {
  const isPdf = file.file_type === 'pdf'; 
  const Icon = isPdf ? FileText : Image;

  // The secret sauce: getting the file straight from your Express server!
  const fileUrl = `http://localhost:5000/uploads/${file.file_name}`;

  return (
    <div className="card-hover p-4 group">
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isPdf ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
          <Icon className={`w-6 h-6 ${isPdf ? 'text-red-500' : 'text-blue-500'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{file.name}</h4>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`badge ${categoryColors[file.category] || 'badge-info'}`}>{file.category}</span>
            <span className="text-xs text-gray-400">{file.file_size}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{formatDate(file.record_date)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 py-1.5 rounded-lg transition"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </a>
        <a 
          href={fileUrl} 
          download={file.name}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 py-1.5 rounded-lg transition"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </a>
        <button
          onClick={() => onDelete && onDelete(file.id)}
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
