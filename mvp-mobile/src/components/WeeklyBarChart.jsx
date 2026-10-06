import { useState } from "react";
import { formatCurrency } from "../utils/formatters";

export default function WeeklyBarChart({ data = [] }) {
  const [selectedDay, setSelectedDay] = useState(data[data.length - 1] || null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.total), 500);
  const chartHeight = 140;

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4.5">
      {/* Header with info and legends */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-[#a1a1aa] font-medium block">
            Resumo dos Últimos 7 Dias
          </span>
          <p className="text-sm font-bold text-[#fafafa] mt-0.5">
            {selectedDay
              ? `${selectedDay.day} (${selectedDay.date}): ${formatCurrency(selectedDay.total)}`
              : "Toque em um dia"}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1 items-end text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316]" />
            <span className="text-[#a1a1aa]">Débito & Pix</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]" />
            <span className="text-[#a1a1aa]">Crédito</span>
          </div>
        </div>
      </div>

      {/* SVG Bars Chart */}
      <div className="w-full flex items-end justify-between gap-2 pt-2 pb-1 border-b border-[#27272a]/60">
        {data.map((item) => {
          const isSelected = selectedDay?.day === item.day;
          const totalHeightPercent = (item.total / maxVal) * 100;
          const debitPixHeightPercent = (item.debitPix / item.total) * 100;
          const creditHeightPercent = 100 - debitPixHeightPercent;

          return (
            <button
              key={item.day}
              type="button"
              onClick={() => setSelectedDay(item)}
              className="flex-1 flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              {/* Bar container */}
              <div
                className="w-full max-w-[28px] flex flex-col justify-end rounded-t-md overflow-hidden transition-all duration-300"
                style={{
                  height: `${chartHeight}px`,
                }}
              >
                <div
                  className={`w-full flex flex-col justify-end rounded-t-md overflow-hidden transition-transform ${
                    isSelected ? "scale-105" : "group-hover:scale-102 opacity-90"
                  }`}
                  style={{
                    height: `${Math.max(12, totalHeightPercent)}%`,
                  }}
                >
                  {/* Credit portion (top) */}
                  <div
                    className="w-full bg-[#f59e0b] transition-all"
                    style={{ height: `${creditHeightPercent}%` }}
                    title={`Crédito: ${formatCurrency(item.credit)}`}
                  />
                  {/* Debit & Pix portion (bottom) */}
                  <div
                    className="w-full bg-[#f97316] transition-all"
                    style={{ height: `${debitPixHeightPercent}%` }}
                    title={`Débito/Pix: ${formatCurrency(item.debitPix)}`}
                  />
                </div>
              </div>

              {/* Day label */}
              <span
                className={`text-xs mt-2 font-semibold transition-colors ${
                  isSelected ? "text-[#f97316]" : "text-[#a1a1aa] group-hover:text-[#fafafa]"
                }`}
              >
                {item.day}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected day breakdown pill */}
      {selectedDay && (
        <div className="mt-3 pt-2 flex items-center justify-between text-xs text-[#a1a1aa] bg-[#27272a]/40 px-3 py-1.5 rounded-lg border border-[#27272a]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            <span>Débito & Pix: <strong className="text-[#fafafa]">{formatCurrency(selectedDay.debitPix)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            <span>Crédito: <strong className="text-[#fafafa]">{formatCurrency(selectedDay.credit)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
