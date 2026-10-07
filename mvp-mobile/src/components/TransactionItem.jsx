import { Pencil } from "lucide-react";
import { formatCurrency, formatTransactionDate } from "../utils/formatters";
import GroupIcon from "./GroupIcon";

const methodStyle = {
  Crédito: "text-[#f59e0b] border-[#f59e0b]/30",
  Pix: "text-[#22c55e] border-[#22c55e]/30",
  Boleto: "text-[#38bdf8] border-[#38bdf8]/30",
  Dinheiro: "text-[#d1c79e] border-[#d1c79e]/30",
};

// `path` descreve onde o lançamento está na árvore: Grupo › Item › Subitem.
export default function TransactionItem({ transaction, path, group, color, onClick }) {
  const content = (
    <>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <GroupIcon name={group?.icon} color={color} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#fafafa] truncate">{transaction.description}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#a1a1aa] min-w-0">
            <span className="shrink-0">{formatTransactionDate(transaction.date)}</span>
            <span>•</span>
            <span className="truncate">{path}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3 flex items-center gap-2">
        <div>
          <p className="text-sm font-bold text-[#fafafa]">-{formatCurrency(transaction.amount)}</p>
          <span
            className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-semibold rounded-full uppercase tracking-wider bg-[#27272a] border ${
              methodStyle[transaction.method] || "text-[#f97316] border-[#f97316]/30"
            }`}
          >
            {transaction.method}
          </span>
        </div>
        {onClick && <Pencil className="w-3.5 h-3.5 text-[#71717a] group-hover:text-[#f97316] transition-colors" />}
      </div>
    </>
  );

  const className =
    "w-full flex items-center justify-between p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] text-left transition-all group";

  if (!onClick) return <div className={className}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Editar lançamento ${transaction.description}`}
      className={`${className} hover:border-[#3f3f46] hover:bg-[#201f23] cursor-pointer`}
    >
      {content}
    </button>
  );
}
