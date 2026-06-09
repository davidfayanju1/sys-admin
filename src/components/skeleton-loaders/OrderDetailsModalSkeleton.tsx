import Skeleton from "../UI/Skeleton";

export const TableSkeleton = () => (
  <div className="p-5 space-y-4">
    <div className="flex items-center gap-6 pb-3 border-b border-black/5">
      <Skeleton className="w-16 h-3 rounded-sm" />
      <Skeleton className="flex-1 h-3 rounded-sm max-w-[100px]" />
      <Skeleton className="w-8 h-3 rounded-sm" />
      <Skeleton className="w-14 h-3 rounded-sm" />
      <Skeleton className="w-16 h-3 rounded-sm" />
      <Skeleton className="w-16 h-3 rounded-sm" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-6">
        <Skeleton className="w-16 h-4 rounded-sm" />
        <Skeleton className="flex-1 h-4 rounded-sm max-w-[120px]" />
        <Skeleton className="w-8 h-4 rounded-sm" />
        <Skeleton className="w-16 h-4 rounded-sm" />
        <Skeleton className="w-20 h-4 rounded-sm" />
        <Skeleton className="w-20 h-5 rounded-sm" />
      </div>
    ))}
  </div>
);
