import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = ({ className = "", ...props }: SkeletonProps) => (
  <div
    className={`animate-pulse bg-black/[0.06] ${className}`}
    {...props}
  />
);

export default Skeleton;
