import { useState } from "react";
import {
  Eye,
  EyeOff,
  QrCode,
  FileText,
  PiggyBank,
  Send,
  CreditCard,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import ProgressBar from "../components/ProgressBar";
import WeeklyBarChart from "../components/WeeklyBarChart";
import TransactionItem from "../components/TransactionItem";

export default function DashboardScreen({
  user,
  cards,
  transactions,
  weeklyExpenses,
  onNavigateToCards,
  onQuickAction,
  onSelectTransaction,
}) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Active primary card
  const primaryCard = cards?.find((c) => c.type === "virtual") || cards?.[0];

  const quickActions = [
    { id: "pix", label: "Área Pix", icon: QrCode, color: "text-[#22c55e]" },
    { id: "pagar", label: "Pagar", icon: FileText, color: "text-[#f97316]" },
    { id: "guardar", label: "Guardar", icon: PiggyBank, color: "text-[#f59e0b]" },
    { id: "fatura", label: "Fatura", icon: Send, color: "text-[#fb923c]" },
  ];

  return (
    <div className="flex flex-col gap-5 px-4 py-4 pb-20">
      {/* 1. Card de Saldo */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-sm relative overflow-hidden">
        {/* Subtle decorative accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent" />

        <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
          <div className="flex items-center gap-2">
            <span>Saldo Total em Conta</span>
            <button
              type="button"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-[#a1a1aa] hover:text-[#fafafa] p-1 transition-colors cursor-pointer"
              aria-label="Alternar visibilidade do saldo"
            >
              {isBalanceVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Yield Badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#27272a] border border-[#f59e0b]/40 text-[#f59e0b] text-[11px] font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+{user?.yieldPercentage || 4.2}% CDI</span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="mt-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#fafafa]">
            {isBalanceVisible
              ? formatCurrency(user?.totalBalance || 0)
              : "••••••••"}
          </h2>
          <p className="text-[11px] text-[#a1a1aa] mt-1 font-medium">
            Rendimento este mês:{" "}
            <span className="text-[#fef3c7]">
              {isBalanceVisible ? formatCurrency(user?.yieldAmount || 0) : "••••"}
            </span>
          </p>
        </div>
      </div>

      {/* 2. Ações Rápidas (Quick Actions) */}
      <section>
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  if (onQuickAction) onQuickAction(action.id);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] hover:bg-[#201f23] transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-xs font-semibold text-[#fafafa] group-hover:text-[#f97316] transition-colors text-center leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Widget de Cartão */}
      {primaryCard && (
        <section>
          <div
            onClick={onNavigateToCards}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onNavigateToCards) onNavigateToCards();
            }}
            className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-xl p-4.5 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-[#f97316]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#fafafa] leading-tight">
                    Cartão Principal ({primaryCard.variant})
                  </h3>
                  <span className="text-[11px] text-[#a1a1aa] font-mono">
                    Final {primaryCard.lastFour}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-xs text-[#f97316] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Ver Cartão</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </div>

            {/* Limit summary */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa]">Limite Disponível</span>
                <span className="text-sm font-bold text-[#fafafa]">
                  {formatCurrency(primaryCard.limitAvailable)}
                </span>
              </div>

              <ProgressBar
                current={primaryCard.limitAvailable}
                max={primaryCard.limitTotal}
                color="#f97316"
                height="h-2"
              />

              <div className="flex items-center justify-between text-[11px] text-[#a1a1aa] font-medium pt-0.5">
                <span>Fatura Aberta: {formatCurrency(primaryCard.invoiceCurrent)}</span>
                <span>Total: {formatCurrency(primaryCard.limitTotal)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Resumo Semanal (Gráfico de Barras) */}
      <section>
        <WeeklyBarChart data={weeklyExpenses} />
      </section>

      {/* 5. Lista de Últimos Gastos */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#fafafa]">Últimos Lançamentos</h3>
          <span className="text-xs text-[#a1a1aa] font-medium">
            {transactions?.length || 0} movimentações
          </span>
        </div>

        <div className="space-y-2">
          {transactions?.slice(0, 5).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onClick={() => {
                if (onSelectTransaction) onSelectTransaction(transaction);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
