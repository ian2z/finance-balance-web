import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";
import { addDays, parseISODate, toISODate } from "../utils/period";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Gasto diário dos últimos 7 dias do período (ou até hoje, se o período estiver em andamento).
export default function SpendingChart({ transactions, period }) {
  const days = useMemo(() => {
    const today = toISODate(new Date());
    const lastIso = period.end < today ? period.end : today < period.start ? period.start : today;
    const last = parseISODate(lastIso);
    return Array.from({ length: 7 }, (_, idx) => {
      const date = addDays(last, idx - 6);
      const iso = toISODate(date);
      const total = transactions.filter((t) => t.date === iso).reduce((acc, t) => acc + t.amount, 0);
      return {
        iso,
        day: WEEKDAYS[date.getDay()],
        date: `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`,
        total,
        inPeriod: iso >= period.start && iso <= period.end,
      };
    });
  }, [transactions, period]);

  const [selectedIso, setSelectedIso] = useState(null);
  const selected = days.find((d) => d.iso === selectedIso) || days[days.length - 1];
  const maxVal = Math.max(...days.map((d) => d.total), 1);
  const weekTotal = days.reduce((acc, d) => acc + d.total, 0);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4.5 h-full">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <span className="text-xs text-[#a1a1aa] font-medium block">Gastos dos Últimos 7 Dias</span>
          <p className="text-sm font-bold text-[#fafafa] mt-0.5">
            {selected.day} ({selected.date}): {formatCurrency(selected.total)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#a1a1aa] block">Total na semana</span>
          <span className="text-sm font-bold text-[#f97316]">{formatCurrency(weekTotal)}</span>
        </div>
      </div>

      <div className="w-full flex items-end justify-between gap-2 pt-2 pb-1 border-b border-[#27272a]/60">
        {days.map((item) => {
          const isSelected = selected.iso === item.iso;
          const heightPercent = item.total > 0 ? Math.max(8, (item.total / maxVal) * 100) : 3;
          return (
            <button
              key={item.iso}
              type="button"
              onClick={() => setSelectedIso(item.iso)}
              aria-label={`${item.day} ${item.date}: ${formatCurrency(item.total)}`}
              className={`flex-1 flex flex-col items-center group cursor-pointer focus:outline-none ${
                item.inPeriod ? "" : "opacity-40"
              }`}
            >
              <div className="w-full max-w-[28px] h-[140px] flex flex-col justify-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isSelected ? "bg-[#f97316]" : "bg-[#f59e0b]/70 group-hover:bg-[#f59e0b]"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
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
    </div>
  );
}
