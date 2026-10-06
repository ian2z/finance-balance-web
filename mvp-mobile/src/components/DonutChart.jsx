import { useState } from "react";
import { formatCurrency } from "../utils/formatters";

const computeSlices = (categories, totalCalculated, circumference) => {
  return categories.reduce(
    (acc, cat) => {
      const percent = totalCalculated > 0 ? cat.spent / totalCalculated : 0;
      const strokeDasharray = `${percent * circumference} ${circumference}`;
      const strokeDashoffset = -acc.offset * circumference;

      acc.slices.push({
        ...cat,
        percent: percent * 100,
        strokeDasharray,
        strokeDashoffset,
      });

      acc.offset += percent;
      return acc;
    },
    { slices: [], offset: 0 }
  ).slices;
};

export default function DonutChart({
  categories = [],
  total = 0,
  onSelectCategory,
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  if (!categories || categories.length === 0) return null;

  const totalCalculated = total || categories.reduce((acc, cat) => acc + cat.spent, 0);

  // SVG parameters
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const slices = computeSlices(categories, totalCalculated, circumference);
  const activeItem = hoveredCategory || slices[0];

  const handleSelect = (slice) => {
    setHoveredCategory(slice);
    if (onSelectCategory) {
      onSelectCategory(slice);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* SVG Donut */}
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Base background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          {/* Slices */}
          {slices.map((slice) => {
            const isHovered = activeItem?.id === slice.id;
            return (
              <circle
                key={slice.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                className="cursor-pointer transition-all duration-300 ease-out"
                onMouseEnter={() => handleSelect(slice)}
                onClick={() => handleSelect(slice)}
              />
            );
          })}
        </svg>

        {/* Center Text Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[11px] font-medium text-[#a1a1aa] truncate max-w-[110px]">
            {activeItem?.name || "Total"}
          </span>
          <span className="text-base font-bold text-[#fafafa] leading-tight">
            {formatCurrency(activeItem ? activeItem.spent : totalCalculated)}
          </span>
          <span
            className="text-[11px] font-semibold mt-0.5"
            style={{ color: activeItem?.color || "#f97316" }}
          >
            {activeItem?.percent.toFixed(1)}% do total
          </span>
        </div>
      </div>

      {/* Interactive Legend with Pills */}
      <div className="w-full grid grid-cols-2 gap-2 mt-5">
        {slices.map((slice) => {
          const isSelected = activeItem?.id === slice.id;
          return (
            <button
              key={slice.id}
              type="button"
              onClick={() => handleSelect(slice)}
              onMouseEnter={() => setHoveredCategory(slice)}
              className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#27272a] border-[#f97316]/50 shadow-sm"
                  : "bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-xs text-[#fafafa] font-medium truncate">
                  {slice.name}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#a1a1aa] shrink-0 ml-1">
                {slice.percent.toFixed(0)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
