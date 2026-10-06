import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, CornerDownRight, ListTree } from "lucide-react";
import PeriodSelector from "../components/PeriodSelector";
import ProgressBar from "../components/ProgressBar";
import GroupIcon from "../components/GroupIcon";
import NodeFormModal from "../components/NodeFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/formatters";
import { useAppStore } from "../state/AppStore";

function IconButton({ label, onClick, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:bg-[#27272a] transition-colors cursor-pointer shrink-0 ${
        danger ? "hover:text-[#ef4444]" : "hover:text-[#fafafa]"
      }`}
    >
      {children}
    </button>
  );
}

// Previsto x realizado de um nó da árvore, com o desvio destacado.
function DeviationBadge({ planned, actual }) {
  if (actual > planned) {
    return <span className="text-[11px] font-bold text-[#ef4444]">+{formatCurrency(actual - planned)} acima</span>;
  }
  if (planned === 0) return <span className="text-[11px] text-[#71717a]">Sem previsto</span>;
  return <span className="text-[11px] text-[#22c55e] font-semibold">Resta {formatCurrency(planned - actual)}</span>;
}

function Amounts({ planned, actual, strong }) {
  return (
    <div className="text-right shrink-0">
      <span className={`${strong ? "text-sm" : "text-xs"} font-bold ${actual > planned ? "text-[#ef4444]" : "text-[#fafafa]"}`}>
        {formatCurrency(actual)}
      </span>
      <span className="text-[11px] text-[#a1a1aa]"> / {formatCurrency(planned)}</span>
    </div>
  );
}

export default function ExpensesScreen({ summary, rules, transactions, period, onChangePeriod, onShowToast }) {
  const store = useAppStore();
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [ruleFilter, setRuleFilter] = useState("all");
  const [form, setForm] = useState(null); // { kind, groupId?, itemId?, initial?, parentName?, hasSubitems? }
  const [confirm, setConfirm] = useState(null); // { title, message, onConfirm }

  const ruleById = Object.fromEntries(rules.map((r) => [r.id, r]));
  const groups = summary.groups.filter((g) => ruleFilter === "all" || g.ruleId === ruleFilter);
  const countTx = (predicate) => transactions.filter(predicate).length;

  const toggle = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const txWarning = (n) =>
    n > 0 ? ` ${n} lançamento(s) vinculado(s) também serão excluídos.` : "";

  const handleSave = (values) => {
    const { kind, groupId, itemId, initial } = form;
    if (kind === "group") {
      if (initial) store.updateGroup(initial.id, values);
      else store.addGroup(values);
    } else if (kind === "item") {
      if (initial) store.updateItem(groupId, initial.id, values);
      else store.addItem(groupId, values);
    } else if (initial) {
      store.updateSubitem(groupId, itemId, initial.id, values);
    } else {
      store.addSubitem(groupId, itemId, values);
    }
    onShowToast(initial ? "Alterações salvas!" : "Adicionado com sucesso!");
  };

  return (
    <div className="flex flex-col gap-5">
      <PeriodSelector period={period} onChange={onChangePeriod} />

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Previsto", value: summary.totalPlanned, color: "text-[#fafafa]" },
          {
            label: "Realizado",
            value: summary.totalSpent,
            color: summary.totalSpent > summary.totalPlanned ? "text-[#ef4444]" : "text-[#fafafa]",
          },
          {
            label: "Renda não alocada",
            value: summary.unallocated,
            color: summary.unallocated < 0 ? "text-[#ef4444]" : "text-[#22c55e]",
          },
        ].map((s) => (
          <div key={s.label} className="bg-[#18181b] border border-[#27272a] rounded-xl p-3">
            <span className="text-[10px] sm:text-xs text-[#a1a1aa] block truncate">{s.label}</span>
            <span className={`text-sm sm:text-lg font-extrabold ${s.color}`}>{formatCurrency(s.value)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {[{ id: "all", name: "Todas as regras" }, ...rules].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRuleFilter(r.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                ruleFilter === r.id
                  ? "bg-[#f97316] text-[#121214] font-bold shadow-md shadow-[#f97316]/20"
                  : "bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa]"
              }`}
            >
              {r.color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />}
              {r.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setForm({ kind: "group" })}
          className="px-4 py-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-[#121214] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo Grupo
        </button>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={<ListTree className="w-5 h-5 text-[#f97316]" />}
          title={summary.groups.length === 0 ? "Nenhum grupo de despesas" : "Nenhum grupo nesta regra"}
          description="Crie grupos (ex.: Moradia), itens (ex.: Aluguel) e subitens (ex.: Energia) com o valor previsto de cada um."
        />
      ) : (
        <div className="grid xl:grid-cols-2 gap-4 items-start">
          {groups.map((group) => {
            const rule = ruleById[group.ruleId];
            const isOpen = !collapsed.has(group.id);
            return (
              <div key={group.id} className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                {/* Grupo */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(group.id)}
                      aria-expanded={isOpen}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0">
                        <GroupIcon name={group.icon} color={rule?.color} className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#fafafa] truncate">{group.name}</h3>
                          <ChevronDown
                            className={`w-4 h-4 text-[#71717a] shrink-0 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                          />
                        </div>
                        <span
                          className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#27272a] border"
                          style={{ color: rule?.color, borderColor: `${rule?.color}55` }}
                        >
                          {rule?.name || "Sem regra"}
                        </span>
                      </div>
                    </button>
                    <Amounts planned={group.planned} actual={group.actual} strong />
                  </div>

                  <ProgressBar
                    current={group.actual}
                    max={group.planned}
                    color={group.actual > group.planned ? "#ef4444" : rule?.color || "#f97316"}
                    height="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <DeviationBadge planned={group.planned} actual={group.actual} />
                    <div className="flex items-center">
                      <IconButton label="Adicionar item" onClick={() => setForm({ kind: "item", groupId: group.id, parentName: group.name })}>
                        <Plus className="w-4 h-4" />
                      </IconButton>
                      <IconButton label="Editar grupo" onClick={() => setForm({ kind: "group", initial: group })}>
                        <Pencil className="w-3.5 h-3.5" />
                      </IconButton>
                      <IconButton
                        label="Excluir grupo"
                        danger
                        onClick={() =>
                          setConfirm({
                            title: "Excluir grupo",
                            message: `O grupo "${group.name}" e todos os seus itens e subitens serão excluídos.${txWarning(
                              countTx((t) => t.groupId === group.id)
                            )}`,
                            onConfirm: () => {
                              store.deleteGroup(group.id);
                              onShowToast("Grupo excluído.", "info");
                            },
                          })
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </IconButton>
                    </div>
                  </div>
                </div>

                {/* Itens */}
                {isOpen && (
                  <div className="border-t border-[#27272a] bg-[#121214]/40">
                    {group.items.length === 0 && (
                      <button
                        type="button"
                        onClick={() => setForm({ kind: "item", groupId: group.id, parentName: group.name })}
                        className="w-full p-4 text-xs text-[#a1a1aa] hover:text-[#f97316] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Adicionar o primeiro item
                      </button>
                    )}
                    {group.items.map((item) => (
                      <div key={item.id} className="border-b border-[#27272a]/60 last:border-b-0">
                        <div className="px-4 py-3 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-[#fafafa] truncate">{item.name}</span>
                            <Amounts planned={item.planned} actual={item.actual} />
                          </div>
                          <ProgressBar
                            current={item.actual}
                            max={item.planned}
                            color={item.actual > item.planned ? "#ef4444" : "#f59e0b"}
                            height="h-1.5"
                          />
                          <div className="flex items-center justify-between">
                            <DeviationBadge planned={item.planned} actual={item.actual} />
                            <div className="flex items-center -mr-1.5">
                              <IconButton
                                label="Adicionar subitem"
                                onClick={() =>
                                  setForm({ kind: "subitem", groupId: group.id, itemId: item.id, parentName: `${group.name} › ${item.name}` })
                                }
                              >
                                <CornerDownRight className="w-3.5 h-3.5" />
                              </IconButton>
                              <IconButton
                                label="Editar item"
                                onClick={() =>
                                  setForm({
                                    kind: "item",
                                    groupId: group.id,
                                    initial: item,
                                    parentName: group.name,
                                    hasSubitems: item.subitems.length > 0,
                                  })
                                }
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </IconButton>
                              <IconButton
                                label="Excluir item"
                                danger
                                onClick={() =>
                                  setConfirm({
                                    title: "Excluir item",
                                    message: `O item "${item.name}" e seus subitens serão excluídos.${txWarning(
                                      countTx((t) => t.itemId === item.id)
                                    )}`,
                                    onConfirm: () => {
                                      store.deleteItem(group.id, item.id);
                                      onShowToast("Item excluído.", "info");
                                    },
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </IconButton>
                            </div>
                          </div>
                        </div>

                        {/* Subitens */}
                        {item.subitems.length > 0 && (
                          <div className="pl-8 pr-4 pb-3 space-y-2">
                            {item.subitems.map((sub) => (
                              <div key={sub.id} className="flex items-center gap-2 text-xs">
                                <CornerDownRight className="w-3.5 h-3.5 text-[#3f3f46] shrink-0" />
                                <span className="text-[#d4d4d8] truncate flex-1 min-w-0">{sub.name}</span>
                                <Amounts planned={sub.planned} actual={sub.actual} />
                                <IconButton
                                  label="Editar subitem"
                                  onClick={() =>
                                    setForm({
                                      kind: "subitem",
                                      groupId: group.id,
                                      itemId: item.id,
                                      initial: sub,
                                      parentName: `${group.name} › ${item.name}`,
                                    })
                                  }
                                >
                                  <Pencil className="w-3 h-3" />
                                </IconButton>
                                <IconButton
                                  label="Excluir subitem"
                                  danger
                                  onClick={() =>
                                    setConfirm({
                                      title: "Excluir subitem",
                                      message: `O subitem "${sub.name}" será excluído. Os lançamentos dele continuarão contando no item "${item.name}".`,
                                      onConfirm: () => {
                                        store.deleteSubitem(group.id, item.id, sub.id);
                                        onShowToast("Subitem excluído.", "info");
                                      },
                                    })
                                  }
                                >
                                  <Trash2 className="w-3 h-3" />
                                </IconButton>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {form && (
        <NodeFormModal
          kind={form.kind}
          initial={form.initial}
          parentName={form.parentName}
          rules={rules}
          hasSubitems={form.hasSubitems}
          onSave={handleSave}
          onClose={() => setForm(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
