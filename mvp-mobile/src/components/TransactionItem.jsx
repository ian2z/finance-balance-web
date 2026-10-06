import {
  Utensils,
  Fuel,
  Music,
  ArrowDownLeft,
  Pill,
  ShoppingBag,
  Sparkles,
  Building,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "alimentação":
      return <Utensils className="w-4 h-4 text-[#f97316]" />;
    case "transporte":
      return <Fuel className="w-4 h-4 text-[#f59e0b]" />;
    case "assinaturas":
      return <Music className="w-4 h-4 text-[#fb923c]" />;
    case "renda":
      return <ArrowDownLeft className="w-4 h-4 text-[#22c55e]" />;
    case "saúde":
      return <Pill className="w-4 h-4 text-[#38bdf8]" />;
    case "lazer & cultura":
      return <Sparkles className="w-4 h-4 text-[#a855f7]" />;
    case "moradia & contas":
      return <Building className="w-4 h-4 text-[#eab308]" />;
    default:
      return <ShoppingBag className="w-4 h-4 text-[#a1a1aa]" />;
  }
};

export default function TransactionItem({ transaction, onClick }) {
  const isIncome = transaction.amount > 0;
  const formattedAmount = formatCurrency(Math.abs(transaction.amount));

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onClick) onClick();
      }}
      className="flex items-center justify-between p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] hover:bg-[#201f23] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {getCategoryIcon(transaction.category)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#fafafa] truncate">
            {transaction.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#a1a1aa]">
            <span>{transaction.dateFormatted}</span>
            <span>•</span>
            <span className="truncate">{transaction.category}</span>
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <p
          className={`text-sm font-bold ${
            isIncome ? "text-[#22c55e]" : "text-[#fafafa]"
          }`}
        >
          {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
        </p>
        <span
          className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-semibold rounded-full uppercase tracking-wider ${
            transaction.type === "Crédito"
              ? "bg-[#27272a] text-[#f59e0b] border border-[#f59e0b]/30"
              : transaction.type === "Pix"
              ? "bg-[#27272a] text-[#22c55e] border border-[#22c55e]/30"
              : "bg-[#27272a] text-[#f97316] border border-[#f97316]/30"
          }`}
        >
          {transaction.type}
        </span>
      </div>
    </div>
  );
}
