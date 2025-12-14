import { Skeleton } from "@/components/ui/skeleton";

export const LoadingGrid = () => {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};
