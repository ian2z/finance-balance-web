import { useState } from "react";
import {
  Eye,
  EyeOff,
  Plus,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Circle,
  ReceiptText,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import ProgressBar from "../components/ProgressBar";
import DonutChart from "../components/DonutChart";
import SpendingChart from "../components/SpendingChart";
import TransactionItem from "../components/TransactionItem";
import PeriodSelector from "../components/PeriodSelector";
import EmptyState from "../components/EmptyState";

const card = "bg-[#18181b] border border-[#27272a] rounded-xl";

function SectionTitle({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-[#fafafa]">{title}</h3>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center text-xs text-[#f97316] font-semibold hover:translate-x-0.5 transition-transform cursor-pointer"
        >
          {action}
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      )}
    </div>
  );
}

// Insight calculado a partir dos próprios dados (sem IA): compara quanto do período
// já passou com quanto do previsto já foi usado e estima o fechamento, assumindo que
// cada item gastará ao menos o previsto (ou o que já ultrapassou).
const buildInsight = (summary, period) => {
  if (summary.totalPlanned <= 0) return null;
  if (period.isCurrent && period.elapsedDays > 0) {
    const timeShare = (period.elapsedDays / period.totalDays) * 100;
    const usedShare = (summary.totalSpent / summary.totalPlanned) * 100;
    const estimate = summary.groups.reduce(
      (acc, g) => acc + g.items.reduce((a, i) => a + Math.max(i.actual, i.planned), 0),
      0
    );
    const excess = estimate - summary.totalPlanned;
    const pace = `${timeShare.toFixed(0)}% do período passou e você já usou ${usedShare.toFixed(0)}% do previsto.`;
    if (excess > 0) {
      return {
        tone: "warning",
        title: "Fechamento acima do previsto",
        text: `${pace} Pelos desvios atuais, o período deve fechar em ${formatCurrency(estimate)} — ${formatCurrency(excess)} acima do planejado.`,
      };
    }
    return {
      tone: usedShare > timeShare + 15 ? "warning" : "success",
      title: usedShare > timeShare + 15 ? "Ritmo de gastos acelerado" : "Ritmo dentro do previsto",
      text: `${pace} Nenhum item ultrapassou o previsto até agora.`,
    };
  }
  const used = (summary.totalSpent / summary.totalPlanned) * 100;
  return {
    tone: used > 100 ? "warning" : "success",
    title: period.offset < 0 ? "Fechamento do período" : "Período ainda não iniciado",
    text:
      period.offset < 0
        ? `Você realizou ${used.toFixed(0)}% do previsto (${formatCurrency(summary.totalSpent)} de ${formatCurrency(summary.totalPlanned)}).`
        : `O previsto para este período é de ${formatCurrency(summary.totalPlanned)}.`,
  };
};

export default function DashboardScreen({
  summary,
  period,
  onChangePeriod,
  lookup,
  onNavigate,
  onAddTransaction,
  onEditTransaction,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const hide = (value) => (isVisible ? formatCurrency(value) : "••••••");

  const steps = [
    { done: summary.income > 0, label: "Defina sua renda base e as regras percentuais", tab: "budget" },
    { done: summary.groups.some((g) => g.items.length > 0), label: "Monte sua estrutura de despesas", tab: "expenses" },
    { done: summary.transactions.length > 0, label: "Registre seus primeiros gastos", tab: "transactions" },
  ];
  const showOnboarding = !steps[0].done || !steps[1].done;
  const insight = buildInsight(summary, period);
  const spentPercent = summary.income > 0 ? (summary.totalSpent / summary.income) * 100 : 0;
  const groupSlices = summary.groups
    .filter((g) => g.actual > 0)
    .map((g) => ({
      id: g.id,
      name: g.name,
      spent: g.actual,
      color: summary.rules.find((r) => r.id === g.ruleId)?.color || "#a1a1aa",
    }))
    .sort((a, b) => b.spent - a.spent);

  return (
    <div className="flex flex-col gap-5">
      <PeriodSelector period={period} onChange={onChangePeriod} />

      {showOnboarding && (
        <div className={`${card} p-5 border-[#f97316]/30`}>
          <h3 className="text-sm font-bold text-[#fafafa]">Primeiros passos</h3>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Configure seu orçamento para ver a visão geral completa.</p>
          <div className="mt-4 space-y-2">
            {steps.map((step) => (
              <button
                key={step.tab}
                type="button"
                onClick={() => onNavigate(step.tab)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#27272a]/40 border border-[#27272a] hover:border-[#3f3f46] text-left cursor-pointer transition-colors"
              >
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#71717a] shrink-0" />
                )}
                <span className={`text-xs font-semibold flex-1 ${step.done ? "text-[#71717a] line-through" : "text-[#fafafa]"}`}>
                  {step.label}
                </span>
                <ChevronRight className="w-4 h-4 text-[#71717a]" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Saldo do período */}
        <div className={`${card} p-5 shadow-sm relative overflow-hidden lg:col-span-2`}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent" />
          <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-2 font-medium">
            <div className="flex items-center gap-2">
              <span>Disponível no Período</span>
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="text-[#a1a1aa] hover:text-[#fafafa] p-1 transition-colors cursor-pointer"
                aria-label="Alternar visibilidade dos valores"
              >
                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#27272a] border border-[#f59e0b]/40 text-[#f59e0b] text-[11px] font-semibold">
              {spentPercent.toFixed(0)}% da renda gasta
            </span>
          </div>

          <h2 className={`text-3xl font-extrabold tracking-tight ${summary.available < 0 ? "text-[#ef4444]" : "text-[#fafafa]"}`}>
            {hide(summary.available)}
          </h2>
          <p className="text-[11px] text-[#a1a1aa] mt-1 font-medium">
            Renda {hide(summary.income)} − gastos realizados {hide(summary.totalSpent)}
          </p>

          <ProgressBar
            current={summary.totalSpent}
            max={summary.income}
            color={spentPercent > 100 ? "#ef4444" : "#f97316"}
            height="h-2.5"
            className="mt-4"
          />

          <div className="grid grid-cols-3 gap-2 pt-4 text-center">
            {[
              { label: "Renda", value: summary.income },
              { label: "Previsto", value: summary.totalPlanned },
              { label: "Realizado", value: summary.totalSpent },
            ].map((s) => (
              <div key={s.label} className="bg-[#27272a]/50 p-2 rounded-lg border border-[#27272a]">
                <span className="text-[10px] text-[#a1a1aa] block">{s.label}</span>
                <span className="text-xs sm:text-sm font-bold text-[#fafafa]">{hide(s.value)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddTransaction}
            className="mt-4 w-full py-3 bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.99] text-[#121214] font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#f97316]/10"
          >
            <Plus className="w-4 h-4" />
            Novo Lançamento
          </button>
        </div>

        {/* Insight + desvios */}
        <div className="flex flex-col gap-5">
          {insight && (
            <div className="bg-gradient-to-r from-[#201f21] to-[#18181b] border border-[#f97316]/30 rounded-xl p-4.5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-5 h-5 text-[#f97316]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-[#fafafa]">{insight.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        insight.tone === "warning"
                          ? "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30"
                          : "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30"
                      }`}
                    >
                      Projeção
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            </div>
          )}

          <div className={`${card} p-4.5 flex-1`}>
            <SectionTitle title="Desvios do Período" action="Ver estrutura" onAction={() => onNavigate("expenses")} />
            {summary.deviations.filter((d) => d.level !== "group").length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                Nenhum item acima do previsto.
              </div>
            ) : (
              <div className="space-y-2">
                {summary.deviations
                  .filter((d) => d.level !== "group")
                  .slice(0, 4)
                  .map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertCircle className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold text-[#fafafa] block truncate">{d.name}</span>
                          <span className="text-[10px] text-[#71717a] block truncate">{d.path}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#ef4444] shrink-0">+{formatCurrency(d.excess)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Alocação por regra */}
        <div className={`${card} p-5`}>
          <SectionTitle title="Alocação por Regra" action="Ajustar regras" onAction={() => onNavigate("budget")} />
          <div className="space-y-4">
            {summary.rules.map((rule) => {
              const over = rule.actual > rule.target && rule.target > 0;
              return (
                <div key={rule.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: rule.color }} />
                      <span className="font-semibold text-[#fafafa] truncate">{rule.name}</span>
                      <span className="text-[10px] text-[#a1a1aa] font-bold">{rule.percent}%</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`font-bold ${over ? "text-[#ef4444]" : "text-[#fafafa]"}`}>
                        {formatCurrency(rule.actual)}
                      </span>
                      <span className="text-[#a1a1aa]"> de {formatCurrency(rule.target)}</span>
                    </div>
                  </div>
                  <ProgressBar current={rule.actual} max={rule.target} color={over ? "#ef4444" : rule.color} height="h-2" />
                  <div className="flex justify-between text-[11px] text-[#71717a]">
                    <span>Previsto nos grupos: {formatCurrency(rule.planned)}</span>
                    <span className={rule.planned > rule.target ? "text-[#f59e0b] font-semibold" : ""}>
                      {rule.planned > rule.target ? "Previsto acima da regra" : `Livre: ${formatCurrency(Math.max(0, rule.target - rule.planned))}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gastos por grupo */}
        <div className={`${card} p-5`}>
          <SectionTitle title="Gastos por Grupo" />
          {groupSlices.length > 0 ? (
            <DonutChart categories={groupSlices} total={summary.totalSpent} />
          ) : (
            <p className="text-xs text-[#a1a1aa] py-6 text-center">Nenhum gasto registrado neste período.</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SpendingChart transactions={summary.transactions} period={period} />

        <section>
          <SectionTitle
            title="Últimos Lançamentos"
            action={summary.transactions.length > 0 ? "Ver todos" : undefined}
            onAction={() => onNavigate("transactions")}
          />
          {summary.transactions.length === 0 ? (
            <EmptyState
              icon={<ReceiptText className="w-5 h-5 text-[#f97316]" />}
              title="Sem lançamentos no período"
              description="Registre seus gastos para acompanhar o realizado."
            />
          ) : (
            <div className="space-y-2">
              {summary.transactions.slice(0, 5).map((tx) => {
                const info = lookup.describe(tx);
                return (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    path={info.path}
                    group={info.group}
                    color={info.color}
                    onClick={() => onEditTransaction(tx)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
