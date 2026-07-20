import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const borders = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
};

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 border-l-4 ${borders[toast.type] || borders.info} animate-slide-in-right max-w-sm`}
        >
          {icons[toast.type] || icons.info}
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
