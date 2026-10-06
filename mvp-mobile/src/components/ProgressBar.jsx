export default function ProgressBar({
  current = 0,
  max = 100,
  color = "#f97316",
  height = "h-2",
  showLabel = false,
  labelLeft = "",
  labelRight = "",
  className = "",
}) {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (current / max) * 100 : 0));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-[#a1a1aa]">{labelLeft}</span>
          <span className="text-[#fafafa] font-semibold">{labelRight || `${percentage.toFixed(0)}%`}</span>
        </div>
      )}
      <div className={`w-full bg-[#27272a] rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
