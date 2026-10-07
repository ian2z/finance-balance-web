import { useState } from "react";
import { FolderTree } from "lucide-react";
import Modal from "./Modal";
import { Field, MoneyInput, PrimaryButton, inputClass } from "./FormControls";
import { GROUP_ICONS } from "./GroupIcon";
import { parseMoney, toMoneyInput } from "../utils/formatters";

const LABELS = {
  group: { create: "Novo Grupo", edit: "Editar Grupo", placeholder: "Ex.: Moradia" },
  item: { create: "Novo Item", edit: "Editar Item", placeholder: "Ex.: Aluguel" },
  subitem: { create: "Novo Subitem", edit: "Editar Subitem", placeholder: "Ex.: Energia" },
};

// Formulário compartilhado para os três níveis da árvore: Grupo › Item › Subitem.
export default function NodeFormModal({ kind, initial, parentName, rules = [], hasSubitems = false, onSave, onClose }) {
  const labels = LABELS[kind];
  const [name, setName] = useState(initial?.name || "");
  const [planned, setPlanned] = useState(initial ? toMoneyInput(initial.planned) : "");
  const [ruleId, setRuleId] = useState(initial?.ruleId || rules[0]?.id || "");
  const [icon, setIcon] = useState(initial?.icon || "other");
  const [errors, setErrors] = useState({});

  const asksPlanned = kind !== "group" && !hasSubitems;

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = "Informe um nome.";
    let plannedValue = initial?.planned ?? 0;
    if (asksPlanned) {
      plannedValue = planned.trim() === "" ? 0 : parseMoney(planned);
      if (plannedValue === null || plannedValue < 0) next.planned = "Informe um valor válido (ou deixe em branco).";
    }
    if (kind === "group" && !ruleId) next.ruleId = "Escolha uma regra de orçamento.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (kind === "group") onSave({ name: name.trim(), ruleId, icon });
    else onSave(asksPlanned ? { name: name.trim(), planned: plannedValue } : { name: name.trim() });
    onClose();
  };

  return (
    <Modal
      title={initial ? labels.edit : labels.create}
      subtitle={parentName ? `Em ${parentName}` : "Estrutura de despesas"}
      icon={<FolderTree className="w-5 h-5 text-[#f97316]" />}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Nome" htmlFor="node-name" error={errors.name}>
          <input
            id="node-name"
            type="text"
            value={name}
            maxLength={40}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder={labels.placeholder}
            className={inputClass}
          />
        </Field>

        {kind === "group" && (
          <>
            <Field
              label="Regra de orçamento"
              htmlFor="node-rule"
              error={errors.ruleId}
              hint="O previsto do grupo consome o teto desta regra."
            >
              <select id="node-rule" value={ruleId} onChange={(e) => setRuleId(e.target.value)} className={inputClass}>
                {rules.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.percent}%)
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ícone">
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(GROUP_ICONS).map(([key, { label, icon: Icon }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    aria-label={label}
                    aria-pressed={icon === key}
                    title={label}
                    className={`aspect-square rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      icon === key
                        ? "bg-[#f97316]/20 border-[#f97316] text-[#f97316]"
                        : "bg-[#27272a] border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {kind !== "group" &&
          (asksPlanned ? (
            <Field label="Valor previsto por período" htmlFor="node-planned" error={errors.planned}>
              <MoneyInput id="node-planned" value={planned} onChange={setPlanned} />
            </Field>
          ) : (
            <p className="text-xs text-[#a1a1aa] bg-[#27272a]/40 border border-[#27272a] rounded-xl p-3 leading-relaxed">
              Este item possui subitens: o valor previsto é calculado pela soma deles.
            </p>
          ))}

        <PrimaryButton type="submit">{initial ? "Salvar Alterações" : "Adicionar"}</PrimaryButton>
      </form>
    </Modal>
  );
}
