export default function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="w-16 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
      <div className="h-4 w-36 bg-gray-100 dark:bg-gray-800 rounded-lg" />
    </div>
  );
}
