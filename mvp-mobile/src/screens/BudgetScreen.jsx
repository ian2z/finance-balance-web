import { useState } from "react";
import { Wallet, Percent, Plus, Trash2, Check, RotateCcw, Info } from "lucide-react";
import { Field, MoneyInput, PrimaryButton, inputClass } from "../components/FormControls";
import { RULE_COLORS } from "../data/seed";
import { formatCurrency, parseMoney, toMoneyInput } from "../utils/formatters";
import { rulesPercentTotal } from "../utils/budget";
import { uid } from "../utils/id";

const card = "bg-[#18181b] border border-[#27272a] rounded-xl";

export default function BudgetScreen({ income, rules, summary, onSaveIncome, onSaveRules, onShowToast }) {
  const [incomeText, setIncomeText] = useState(income > 0 ? toMoneyInput(income) : "");
  const [incomeError, setIncomeError] = useState("");
  const [draft, setDraft] = useState(rules);

  const draftIncome = parseMoney(incomeText) ?? 0;
  const total = rulesPercentTotal(draft);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(rules);
  const nameMissing = draft.some((r) => !r.name.trim());
  const canSave = isDirty && total === 100 && !nameMissing;
  const groupCountByRule = Object.fromEntries(summary.rules.map((r) => [r.id, r.groupCount]));
  const plannedByRule = Object.fromEntries(summary.rules.map((r) => [r.id, r.planned]));

  const updateRule = (id, patch) => setDraft((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const handleSaveIncome = (e) => {
    e.preventDefault();
    const value = parseMoney(incomeText);
    if (value === null || value < 0) {
      setIncomeError("Informe um valor válido.");
      return;
    }
    setIncomeError("");
    onSaveIncome(value);
    setIncomeText(toMoneyInput(value));
    onShowToast("Renda base atualizada!");
  };

  const addRule = () => {
    const used = new Set(draft.map((r) => r.color));
    const color = RULE_COLORS.find((c) => !used.has(c)) || RULE_COLORS[draft.length % RULE_COLORS.length];
    setDraft((prev) => [...prev, { id: uid("rule"), name: "Nova regra", percent: Math.max(0, 100 - total), color }]);
  };

  const cycleColor = (rule) => {
    const idx = RULE_COLORS.indexOf(rule.color);
    updateRule(rule.id, { color: RULE_COLORS[(idx + 1) % RULE_COLORS.length] });
  };

  return (
    <div className="grid lg:grid-cols-5 gap-5 items-start">
      {/* Renda base */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <form onSubmit={handleSaveIncome} className={`${card} p-5 space-y-4 relative overflow-hidden`} noValidate>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#f97316]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#fafafa]">Renda Base</h3>
              <p className="text-xs text-[#a1a1aa]">Salário ou renda líquida por período</p>
            </div>
          </div>
          <Field label="Valor da renda" htmlFor="income" error={incomeError}>
            <MoneyInput id="income" value={incomeText} onChange={setIncomeText} />
          </Field>
          <PrimaryButton type="submit" disabled={draftIncome === income}>
            <Check className="w-4 h-4" />
            Salvar Renda
          </PrimaryButton>
        </form>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#27272a]/40 border border-[#27272a]">
          <Info className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            A renda é distribuída automaticamente entre as regras. Cada grupo de despesas pertence a uma regra, e o
            previsto dos grupos deve caber no teto dela.
          </p>
        </div>
      </div>

      {/* Regras percentuais */}
      <div className={`${card} p-5 lg:col-span-3 space-y-4`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
              <Percent className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#fafafa]">Regras Percentuais</h3>
              <p className="text-xs text-[#a1a1aa]">Divisão da renda em áreas</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-full border bg-[#27272a] ${
              total === 100 ? "text-[#22c55e] border-[#22c55e]/40" : "text-[#f59e0b] border-[#f59e0b]/40"
            }`}
          >
            {total}% de 100%
          </span>
        </div>

        {/* Barra de distribuição */}
        <div className="w-full h-3 rounded-full bg-[#27272a] overflow-hidden flex">
          {draft.map((r) => (
            <div
              key={r.id}
              className="h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, Number(r.percent) || 0))}%`, backgroundColor: r.color }}
              title={`${r.name}: ${r.percent}%`}
            />
          ))}
        </div>

        <div className="space-y-3">
          {draft.map((rule) => {
            const target = (draftIncome * (Number(rule.percent) || 0)) / 100;
            const planned = plannedByRule[rule.id] || 0;
            const hasGroups = (groupCountByRule[rule.id] || 0) > 0;
            return (
              <div key={rule.id} className="p-3 rounded-xl bg-[#27272a]/40 border border-[#27272a] space-y-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cycleColor(rule)}
                    aria-label={`Trocar cor de ${rule.name}`}
                    title="Trocar cor"
                    className="w-8 h-8 rounded-lg border border-[#3f3f46] shrink-0 cursor-pointer"
                    style={{ backgroundColor: rule.color }}
                  />
                  <input
                    type="text"
                    value={rule.name}
                    maxLength={30}
                    aria-label="Nome da regra"
                    onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                    className={`${inputClass} py-2 px-3 min-w-0`}
                  />
                  <div className="relative w-[4.75rem] shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={rule.percent}
                      aria-label={`Percentual de ${rule.name}`}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          percent: e.target.value === "" ? "" : Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className={`${inputClass} py-2 pl-2 pr-7 text-right font-bold`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a1a1aa] font-bold">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft((prev) => prev.filter((r) => r.id !== rule.id))}
                    disabled={hasGroups || draft.length <= 1}
                    aria-label={`Excluir regra ${rule.name}`}
                    title={hasGroups ? "Mova os grupos desta regra antes de excluí-la" : "Excluir regra"}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#ef4444] disabled:opacity-30 disabled:hover:text-[#a1a1aa] disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-[#a1a1aa] px-1">
                  <span>
                    Teto: <strong className="text-[#fafafa]">{formatCurrency(target)}</strong>
                  </span>
                  <span className={planned > target ? "text-[#f59e0b] font-semibold" : ""}>
                    Previsto nos grupos: {formatCurrency(planned)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addRule}
          className="w-full py-2.5 rounded-xl border border-dashed border-[#3f3f46] text-xs font-semibold text-[#a1a1aa] hover:text-[#f97316] hover:border-[#f97316]/50 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar regra
        </button>

        {total !== 100 && (
          <p className="text-xs text-[#f59e0b] font-medium">
            As regras precisam somar exatamente 100% ({total > 100 ? `${total - 100}% acima` : `faltam ${100 - total}%`}).
          </p>
        )}
        {nameMissing && <p className="text-xs text-[#ef4444] font-medium">Toda regra precisa de um nome.</p>}

        <div className="flex gap-2.5">
          {isDirty && (
            <button
              type="button"
              onClick={() => setDraft(rules)}
              className="px-4 rounded-xl bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa] flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Descartar
            </button>
          )}
          <PrimaryButton
            disabled={!canSave}
            onClick={() => {
              onSaveRules(draft.map((r) => ({ ...r, name: r.name.trim(), percent: Number(r.percent) || 0 })));
              onShowToast("Regras percentuais salvas!");
            }}
          >
            <Check className="w-4 h-4" />
            Salvar Regras
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
