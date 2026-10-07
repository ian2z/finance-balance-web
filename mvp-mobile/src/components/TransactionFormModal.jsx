import { useState } from "react";
import { ReceiptText, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { Field, MoneyInput, PrimaryButton, inputClass } from "./FormControls";
import { PAYMENT_METHODS } from "../data/seed";
import { parseMoney, toMoneyInput } from "../utils/formatters";

export default function TransactionFormModal({ groups, transaction, defaultDate, onSave, onDelete, onClose }) {
  const isEditing = Boolean(transaction);
  const [description, setDescription] = useState(transaction?.description || "");
  const [amount, setAmount] = useState(transaction ? toMoneyInput(transaction.amount) : "");
  const [date, setDate] = useState(transaction?.date || defaultDate);
  const [groupId, setGroupId] = useState(transaction?.groupId || "");
  const [itemId, setItemId] = useState(transaction?.itemId || "");
  const [subitemId, setSubitemId] = useState(transaction?.subitemId || "");
  const [method, setMethod] = useState(transaction?.method || "Débito");
  const [errors, setErrors] = useState({});

  const group = groups.find((g) => g.id === groupId);
  const item = group?.items.find((i) => i.id === itemId);
  const groupsWithItems = groups.filter((g) => g.items.length > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseMoney(amount);
    const next = {};
    if (!description.trim()) next.description = "Descreva o gasto.";
    if (value === null || value <= 0) next.amount = "Informe um valor maior que zero.";
    if (!date) next.date = "Informe a data.";
    if (!group) next.groupId = "Escolha um grupo.";
    else if (!item) next.itemId = "Escolha um item do grupo.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      description: description.trim(),
      amount: value,
      date,
      groupId,
      itemId,
      subitemId: item.subitems.some((s) => s.id === subitemId) ? subitemId : null,
      method,
    });
    onClose();
  };

  return (
    <Modal
      title={isEditing ? "Editar Lançamento" : "Novo Lançamento"}
      subtitle="Registre um gasto realizado"
      icon={<ReceiptText className="w-5 h-5 text-[#f97316]" />}
      onClose={onClose}
    >
      {groupsWithItems.length === 0 ? (
        <p className="text-sm text-[#a1a1aa] leading-relaxed">
          Antes de lançar gastos, crie ao menos um grupo com um item na aba <strong className="text-[#fafafa]">Despesas</strong>.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label="Valor" htmlFor="tx-amount" error={errors.amount}>
            <MoneyInput id="tx-amount" value={amount} onChange={setAmount} autoFocus={!isEditing} />
          </Field>

          <Field label="Descrição" htmlFor="tx-desc" error={errors.description}>
            <input
              id="tx-desc"
              type="text"
              value={description}
              maxLength={80}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Supermercado"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data" htmlFor="tx-date" error={errors.date}>
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </Field>
            <Field label="Grupo" htmlFor="tx-group" error={errors.groupId}>
              <select
                id="tx-group"
                value={groupId}
                onChange={(e) => {
                  setGroupId(e.target.value);
                  setItemId("");
                  setSubitemId("");
                }}
                className={inputClass}
              >
                <option value="">Selecione</option>
                {groupsWithItems.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Item" htmlFor="tx-item" error={errors.itemId}>
              <select
                id="tx-item"
                value={itemId}
                disabled={!group}
                onChange={(e) => {
                  setItemId(e.target.value);
                  setSubitemId("");
                }}
                className={`${inputClass} disabled:opacity-50`}
              >
                <option value="">Selecione</option>
                {group?.items.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Subitem" htmlFor="tx-sub">
              <select
                id="tx-sub"
                value={subitemId}
                disabled={!item || item.subitems.length === 0}
                onChange={(e) => setSubitemId(e.target.value)}
                className={`${inputClass} disabled:opacity-50`}
              >
                <option value="">{item?.subitems.length ? "Nenhum" : "—"}</option>
                {item?.subitems.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Forma de pagamento">
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  aria-pressed={method === m}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    method === m
                      ? "bg-[#f97316] text-[#121214] font-bold"
                      : "bg-[#27272a] text-[#a1a1aa] border border-[#3f3f46] hover:text-[#fafafa]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>

          <div className="flex gap-2.5 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                aria-label="Excluir lançamento"
                className="px-4 rounded-xl bg-[#27272a] border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <PrimaryButton type="submit">{isEditing ? "Salvar Alterações" : "Adicionar Lançamento"}</PrimaryButton>
          </div>
        </form>
      )}
    </Modal>
  );
}
