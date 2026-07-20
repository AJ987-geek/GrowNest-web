import { Users, Clock } from 'lucide-react';

export default function Community() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in text-center px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-xl mb-8 transform transition-transform hover:scale-105">
          <Users className="w-12 h-12 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
        Parent Community
      </h1>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6 border border-blue-200 dark:border-blue-800 shadow-sm">
        <Clock className="w-4 h-4" />
        Coming Soon
      </div>

      <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg leading-relaxed">
        We are building a beautiful, safe space for you to connect, share experiences, and learn from thousands of other parents.
        <br /><br />
        Stay tuned for the launch!
      </p>
    </div>
  );
}