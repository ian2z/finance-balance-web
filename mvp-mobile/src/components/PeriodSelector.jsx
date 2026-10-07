import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function PeriodSelector({ period, onChange }) {
  return (
    <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-2.5">
      <button
        type="button"
        onClick={() => onChange(period.offset - 1)}
        aria-label="Período anterior"
        className="p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center min-w-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#f97316] shrink-0" />
          <span className="text-sm font-bold text-[#fafafa] truncate">{period.label}</span>
        </div>
        {!period.isCurrent && (
          <button
            type="button"
            onClick={() => onChange(0)}
            className="text-[11px] text-[#f97316] font-semibold hover:underline cursor-pointer"
          >
            Voltar ao período atual
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(period.offset + 1)}
        aria-label="Próximo período"
        className="p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
