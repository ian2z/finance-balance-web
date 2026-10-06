import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingDown,
  ArrowDownRight,
  PiggyBank,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";
import DonutChart from "../components/DonutChart";
import ProgressBar from "../components/ProgressBar";

export default function ReportsScreen({ budget, onSelectCategory }) {
  const months = ["Setembro 2024", "Outubro 2024", "Novembro 2024"];
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1); // "Outubro 2024"
  const [activeFilter, setActiveFilter] = useState("all");

  const filterOptions = [
    { id: "all", label: "Todos os Gastos" },
    { id: "fixos", label: "Fixos & Moradia", group: "Fixos & Moradia" },
    { id: "variaveis", label: "Variáveis & Lazer", group: "Variáveis & Lazer" },
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) setCurrentMonthIndex(currentMonthIndex - 1);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < months.length - 1)
      setCurrentMonthIndex(currentMonthIndex + 1);
  };

  const currentMonthName = months[currentMonthIndex];

  // Filter categories according to selected pill
  const filteredCategories = budget.categories.filter((cat) => {
    if (activeFilter === "all") return true;
    const filterObj = filterOptions.find((f) => f.id === activeFilter);
    return filterObj?.group === cat.filterGroup;
  });

  const totalFilteredSpent = filteredCategories.reduce(
    (acc, cat) => acc + cat.spent,
    0
  );

  return (
    <div className="flex flex-col gap-5 px-4 py-4 pb-20">
      {/* 1. Seletor de Período */}
      <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-2.5">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={currentMonthIndex === 0}
          className="p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#f97316]" />
          <span className="text-sm font-bold text-[#fafafa]">
            {currentMonthName}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          disabled={currentMonthIndex === months.length - 1}
          className="p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Filtros de Categoria (Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#f97316] text-[#121214] font-bold shadow-md shadow-[#f97316]/20"
                  : "bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* 3. Resumo do Mês */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
            <span className="font-medium">Total Gasto no Período</span>
            <div className="flex items-center gap-1 text-[#22c55e] font-bold bg-[#27272a] px-2 py-0.5 rounded-full border border-[#22c55e]/30 text-[11px]">
              <TrendingDown className="w-3 h-3" />
              <span>{formatPercent(budget.variationPercentage)} vs mês anterior</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-[#fafafa] mt-1.5">
            {formatCurrency(totalFilteredSpent)}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#27272a]">
          <div className="bg-[#27272a]/40 p-3 rounded-xl border border-[#27272a]">
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] mb-1">
              <PiggyBank className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Economia</span>
            </div>
            <p className="text-sm font-bold text-[#fafafa]">
              {formatCurrency(budget.savingsAbsolute)} poupados
            </p>
          </div>

          <div className="bg-[#27272a]/40 p-3 rounded-xl border border-[#27272a]">
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa] mb-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Média Diária</span>
            </div>
            <p className="text-sm font-bold text-[#fafafa]">
              {formatCurrency(budget.dailyAverage)} / dia
            </p>
          </div>
        </div>
      </div>

      {/* 4. Gráfico de Divisão Orçamentária (Donut Chart) */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#fafafa]">
            Divisão por Categorias
          </h3>
          <span className="text-xs text-[#a1a1aa] font-medium">
            {filteredCategories.length} categorias
          </span>
        </div>

        <DonutChart
          categories={filteredCategories}
          total={totalFilteredSpent}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* 5. Dica Financeira (Insight Card) */}
      <div className="bg-gradient-to-r from-[#201f21] to-[#18181b] border border-[#f97316]/30 rounded-xl p-4.5 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-[#f97316]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#fafafa]">
                {budget.financialTip.title}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">
                IA Insight
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">
              {budget.financialTip.description}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Detalhamento de Orçamento (Progress Bars) */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#fafafa]">
            Detalhamento do Teto de Gastos
          </h3>
          <span className="text-xs text-[#a1a1aa]">Metas do Mês</span>
        </div>

        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const percentageUsed = (category.spent / category.limit) * 100;
            const isNearLimit = percentageUsed > 85;

            return (
              <div key={category.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-semibold text-[#fafafa]">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#fafafa]">
                      {formatCurrency(category.spent)}
                    </span>
                    <span className="text-[#a1a1aa] font-normal">
                      {" "}de {formatCurrency(category.limit)}
                    </span>
                  </div>
                </div>

                <ProgressBar
                  current={category.spent}
                  max={category.limit}
                  color={category.color}
                  height="h-2"
                />

                <div className="flex items-center justify-between text-[11px] text-[#a1a1aa]">
                  <span
                    className={
                      isNearLimit ? "text-[#f59e0b] font-semibold" : ""
                    }
                  >
                    {percentageUsed.toFixed(1)}% utilizado
                  </span>
                  <span>
                    Resta:{" "}
                    <strong className="text-[#fafafa]">
                      {formatCurrency(Math.max(0, category.limit - category.spent))}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
