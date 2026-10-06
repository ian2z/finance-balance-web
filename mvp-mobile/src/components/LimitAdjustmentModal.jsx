import { useState } from "react";
import { X, Sliders, Check } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export default function LimitAdjustmentModal({ card, onClose, onSave }) {
  const [currentLimit, setCurrentLimit] = useState(card?.limitTotal || 15000);
  const maxPossibleLimit = 25000;
  const minPossibleLimit = card?.limitUsed || 3000;

  if (!card) return null;

  const handleConfirm = () => {
    if (onSave) {
      onSave(card.id, currentLimit);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
              <Sliders className="w-5 h-5 text-[#f97316]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#fafafa]">Ajustar Limite</h3>
              <p className="text-xs text-[#a1a1aa]">
                {card.brand} {card.variant} • Final {card.lastFour}
              </p>
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
        <div className="py-6 space-y-6">
          <div className="text-center">
            <span className="text-xs text-[#a1a1aa] uppercase tracking-wider font-semibold">
              Novo Limite Total
            </span>
            <div className="text-3xl font-extrabold text-[#fafafa] mt-1 text-[#f97316]">
              {formatCurrency(currentLimit)}
            </div>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Disponível para compras:{" "}
              <strong className="text-[#fafafa]">
                {formatCurrency(Math.max(0, currentLimit - card.limitUsed))}
              </strong>
            </p>
          </div>

          <div>
            <input
              type="range"
              min={minPossibleLimit}
              max={maxPossibleLimit}
              step={500}
              value={currentLimit}
              onChange={(e) => setCurrentLimit(Number(e.target.value))}
              className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
            />
            <div className="flex justify-between items-center text-[11px] text-[#a1a1aa] mt-2 font-medium">
              <span>Mínimo: {formatCurrency(minPossibleLimit)}</span>
              <span>Pré-aprovado: {formatCurrency(maxPossibleLimit)}</span>
            </div>
          </div>

          <div className="bg-[#27272a]/40 border border-[#27272a] rounded-xl p-3 text-xs text-[#a1a1aa] space-y-1.5">
            <div className="flex justify-between">
              <span>Valor já utilizado:</span>
              <span className="text-[#fafafa] font-semibold">{formatCurrency(card.limitUsed)}</span>
            </div>
            <div className="flex justify-between">
              <span>Limite anterior:</span>
              <span className="text-[#fafafa] font-semibold">{formatCurrency(card.limitTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-[#121214] font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#f97316]/10"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Novo Limite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
