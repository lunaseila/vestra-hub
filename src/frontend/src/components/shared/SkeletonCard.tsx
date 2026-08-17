interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        aspectRatio: "3/4",
        borderRadius: "4px",
        overflow: "hidden",
        background:
          "linear-gradient(90deg, var(--vestra-graphite) 25%, rgba(255,255,255,0.05) 50%, var(--vestra-graphite) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer-sweep 1.8s infinite",
        border: "1px solid var(--vestra-border)",
      }}
    />
  );
}
