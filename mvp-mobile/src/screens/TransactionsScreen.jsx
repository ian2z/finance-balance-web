import { useState } from "react";
import { Plus, Search, ReceiptText } from "lucide-react";
import PeriodSelector from "../components/PeriodSelector";
import TransactionItem from "../components/TransactionItem";
import EmptyState from "../components/EmptyState";
import { inputClass } from "../components/FormControls";
import { formatCurrency, formatTransactionDate } from "../utils/formatters";

export default function TransactionsScreen({ summary, lookup, period, onChangePeriod, onAdd, onEdit }) {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  const normalized = query.trim().toLowerCase();
  const filtered = summary.transactions.filter((tx) => {
    if (groupFilter !== "all" && tx.groupId !== groupFilter) return false;
    if (!normalized) return true;
    const info = lookup.describe(tx);
    return `${tx.description} ${info.path} ${tx.method}`.toLowerCase().includes(normalized);
  });
  const filteredTotal = filtered.reduce((acc, t) => acc + t.amount, 0);

  // Agrupa por dia para facilitar a leitura do extrato.
  const byDay = filtered.reduce((acc, tx) => {
    (acc[tx.date] ||= []).push(tx);
    return acc;
  }, {});
  const days = Object.keys(byDay).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="flex flex-col gap-5 max-w-3xl w-full mx-auto">
      <PeriodSelector period={period} onChange={onChangePeriod} />

      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4.5 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-[#a1a1aa] font-medium">
            {filtered.length} lançamento(s){groupFilter !== "all" || normalized ? " filtrados" : ""}
          </span>
          <h2 className="text-2xl font-extrabold text-[#fafafa] mt-0.5">{formatCurrency(filteredTotal)}</h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="px-4 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-[#121214] text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo
        </button>
      </div>

      <div className="grid sm:grid-cols-[1fr_200px] gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por descrição, grupo ou forma de pagamento"
            aria-label="Buscar lançamentos"
            className={`${inputClass} pl-10 py-2.5`}
          />
        </div>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          aria-label="Filtrar por grupo"
          className={`${inputClass} py-2.5`}
        >
          <option value="all">Todos os grupos</option>
          {summary.groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {days.length === 0 ? (
        <EmptyState
          icon={<ReceiptText className="w-5 h-5 text-[#f97316]" />}
          title={summary.transactions.length === 0 ? "Nenhum lançamento neste período" : "Nada encontrado"}
          description={
            summary.transactions.length === 0
              ? "Registre os gastos do dia a dia para comparar o realizado com o previsto."
              : "Tente outro termo de busca ou grupo."
          }
        />
      ) : (
        <div className="space-y-5">
          {days.map((day) => {
            const dayTotal = byDay[day].reduce((acc, t) => acc + t.amount, 0);
            return (
              <section key={day} className="space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-[#fafafa]">{formatTransactionDate(day)}</span>
                  <span className="text-[#a1a1aa]">{formatCurrency(dayTotal)}</span>
                </div>
                {byDay[day].map((tx) => {
                  const info = lookup.describe(tx);
                  return (
                    <TransactionItem
                      key={tx.id}
                      transaction={tx}
                      path={info.path}
                      group={info.group}
                      color={info.color}
                      onClick={() => onEdit(tx)}
                    />
                  );
                })}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
