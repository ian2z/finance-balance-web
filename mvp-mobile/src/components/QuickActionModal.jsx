import { useState } from "react";
import { X, Send, QrCode, FileText, PiggyBank, ArrowRight, CheckCircle2 } from "lucide-react";

export default function QuickActionModal({ type, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!type) return null;

  const getActionConfig = () => {
    switch (type) {
      case "pix":
        return {
          title: "Transferência Pix",
          subtitle: "Envio instantâneo sem taxas",
          icon: <QrCode className="w-5 h-5 text-[#22c55e]" />,
          placeholder: "Digite a chave Pix (CPF, e-mail, telefone)",
          actionLabel: "Transferir via Pix",
          defaultAmount: "150,00",
        };
      case "pagar":
        return {
          title: "Pagar Conta ou Boleto",
          subtitle: "Digite o código de barras ou linha digitável",
          icon: <FileText className="w-5 h-5 text-[#f97316]" />,
          placeholder: "Cole o código de barras de 47 dígitos",
          actionLabel: "Confirmar Pagamento",
          defaultAmount: "219,80",
        };
      case "guardar":
        return {
          title: "Guardar Dinheiro",
          subtitle: "Rendimento automático a 102% do CDI",
          icon: <PiggyBank className="w-5 h-5 text-[#f59e0b]" />,
          placeholder: "Valor a guardar no cofrinho",
          actionLabel: "Guardar na Reserva",
          defaultAmount: "500,00",
        };
      case "fatura":
        return {
          title: "Pagar Fatura do Cartão",
          subtitle: "Mastercard Black • Vencimento em 6 dias",
          icon: <Send className="w-5 h-5 text-[#f97316]" />,
          placeholder: "Valor do pagamento",
          actionLabel: "Pagar Total da Fatura",
          defaultAmount: "3.820,45",
        };
      default:
        return {
          title: "Ação Rápida",
          subtitle: "",
          icon: null,
          placeholder: "",
          actionLabel: "Confirmar",
          defaultAmount: "100,00",
        };
    }
  };

  const config = getActionConfig();

  const handleAction = () => {
    setIsSuccess(true);
    setTimeout(() => {
      if (onConfirm) {
        onConfirm(type, amount || config.defaultAmount);
      }
      if (onClose) {
        onClose();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
              {config.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#fafafa]">{config.title}</h3>
              <p className="text-xs text-[#a1a1aa]">{config.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-14 h-14 text-[#22c55e] mb-3" />
            <h4 className="text-lg font-bold text-[#fafafa]">Operação Concluída!</h4>
            <p className="text-xs text-[#a1a1aa] mt-1">
              {config.title} realizada com sucesso no valor simulado.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1.5">
                Valor da Operação
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#a1a1aa]">
                  R$
                </span>
                <input
                  type="text"
                  defaultValue={config.defaultAmount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl pl-10 pr-4 py-3 text-base font-bold text-[#fafafa] focus:outline-none focus:border-[#f97316] transition-colors"
                />
              </div>
            </div>

            {config.placeholder && (
              <div>
                <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1.5">
                  Identificador / Destino
                </label>
                <input
                  type="text"
                  placeholder={config.placeholder}
                  className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-4 py-2.5 text-xs text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#f97316] transition-colors"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAction}
                className="w-full py-3.5 bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.99] text-[#121214] font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#f97316]/10"
              >
                <span>{config.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
