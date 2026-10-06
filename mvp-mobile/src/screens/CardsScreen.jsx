import { useState } from "react";
import {
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  ShieldCheck,
  CreditCard as CreditCardIcon,
  Check,
  Wifi,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import ProgressBar from "../components/ProgressBar";
import TransactionItem from "../components/TransactionItem";

export default function CardsScreen({
  cards,
  transactions,
  onAdjustLimit,
  onPayInvoice,
  onShowToast,
}) {
  const [activeTab, setActiveTab] = useState("virtual"); // 'virtual' | 'physical'
  const [showCvv, setShowCvv] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardBlockedStates, setCardBlockedStates] = useState({
    card_1: false,
    card_2: false,
  });

  const activeCard =
    cards?.find((c) => c.type === activeTab) || cards?.[0] || null;

  if (!activeCard) return null;

  const isBlocked = cardBlockedStates[activeCard.id] || false;

  const handleCopyCard = () => {
    navigator.clipboard?.writeText(activeCard.numberMasked.replace(/•/g, "4"));
    setCopied(true);
    if (onShowToast) {
      onShowToast("Número do cartão copiado!", "success");
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBlockCard = () => {
    const newState = !isBlocked;
    setCardBlockedStates((prev) => ({
      ...prev,
      [activeCard.id]: newState,
    }));
    if (onShowToast) {
      onShowToast(
        newState ? "Cartão bloqueado temporariamente!" : "Cartão desbloqueado!",
        newState ? "info" : "success"
      );
    }
  };

  const handleTemporaryCard = () => {
    if (onShowToast) {
      onShowToast(
        "Novo cartão temporário gerado para compras seguras!",
        "success"
      );
    }
  };

  // Filter transactions restricted to this card
  const filteredTransactions = transactions?.filter(
    (t) => t.cardId === activeCard.id || (!t.cardId && activeTab === "virtual")
  );

  return (
    <div className="flex flex-col gap-5 px-4 py-4 pb-20">
      {/* 1. Controle de Abas (Tabs) */}
      <div className="bg-[#18181b] p-1 rounded-xl border border-[#27272a] grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => {
            setActiveTab("virtual");
            setShowCvv(false);
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "virtual"
              ? "bg-[#f97316] text-[#121214] shadow-md"
              : "text-[#a1a1aa] hover:text-[#fafafa]"
          }`}
        >
          Cartão Virtual
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("physical");
            setShowCvv(false);
          }}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "physical"
              ? "bg-[#f97316] text-[#121214] shadow-md"
              : "text-[#a1a1aa] hover:text-[#fafafa]"
          }`}
        >
          Cartão Físico
        </button>
      </div>

      {/* 2. Mockup do Cartão */}
      <div className="relative w-full aspect-[1.58/1] rounded-2xl p-5 bg-gradient-to-br from-[#27272a] via-[#18181b] to-[#121214] border border-[#3f3f46] shadow-xl overflow-hidden flex flex-col justify-between">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fafafa_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

        {/* Blocked overlay */}
        {isBlocked && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
            <Lock className="w-10 h-10 text-[#f97316] mb-2" />
            <h4 className="text-sm font-bold text-[#fafafa]">Cartão Bloqueado</h4>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Toque no botão &quot;Desbloquear&quot; abaixo para reativar.
            </p>
          </div>
        )}

        {/* Top card row: Brand and variant badge */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center">
              <CreditCardIcon className="w-4 h-4 text-[#f97316]" />
            </div>
            <div>
              <span className="text-xs font-extrabold tracking-wider text-[#fafafa] uppercase">
                {activeCard.brand}
              </span>
              <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30">
                {activeCard.variant}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#a1a1aa] rotate-90" />
            <span className="text-xs font-semibold text-[#a1a1aa] capitalize">
              {activeCard.type}
            </span>
          </div>
        </div>

        {/* Center: Chip & Card Number */}
        <div className="my-auto relative z-10 space-y-2">
          {/* Chip */}
          <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-[#ca8a04] via-[#eab308] to-[#fef08a] border border-[#a16207] shadow-inner flex items-center justify-center opacity-90">
            <div className="w-6 h-4 border border-[#854d0e]/60 rounded-xs" />
          </div>

          {/* Number & Copy */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold tracking-widest text-[#fafafa]">
              {activeCard.numberMasked}
            </span>
            <button
              type="button"
              onClick={handleCopyCard}
              className="p-1.5 rounded-lg bg-[#27272a]/80 hover:bg-[#3f3f46] text-[#fafafa] transition-colors flex items-center gap-1 text-[11px]"
              title="Copiar número"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#22c55e]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#a1a1aa]" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom: Holder, Expiry & CVV */}
        <div className="flex items-end justify-between relative z-10 text-xs">
          <div>
            <span className="text-[10px] text-[#a1a1aa] block uppercase tracking-wider font-semibold">
              Titular
            </span>
            <span className="font-bold text-[#fafafa] tracking-wide">
              {activeCard.cardHolder}
            </span>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] text-[#a1a1aa] block uppercase tracking-wider font-semibold">
                Validade
              </span>
              <span className="font-mono font-bold text-[#fafafa]">
                {activeCard.expiry}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#a1a1aa] block uppercase tracking-wider font-semibold">
                CVV
              </span>
              <span className="font-mono font-bold text-[#fafafa]">
                {showCvv ? activeCard.cvv : "•••"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ações do Cartão */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={toggleBlockCard}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] hover:bg-[#201f23] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            {isBlocked ? (
              <Unlock className="w-4 h-4 text-[#22c55e]" />
            ) : (
              <Lock className="w-4 h-4 text-[#ef4444]" />
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#fafafa]">
            {isBlocked ? "Desbloquear" : "Bloquear"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowCvv(!showCvv)}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] hover:bg-[#201f23] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            {showCvv ? (
              <EyeOff className="w-4 h-4 text-[#f59e0b]" />
            ) : (
              <Eye className="w-4 h-4 text-[#f59e0b]" />
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#fafafa]">
            {showCvv ? "Ocultar CVV" : "Ver CVV"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onAdjustLimit) onAdjustLimit(activeCard);
          }}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] hover:bg-[#201f23] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Sliders className="w-4 h-4 text-[#f97316]" />
          </div>
          <span className="text-[11px] font-semibold text-[#fafafa]">
            Ajustar Limite
          </span>
        </button>

        <button
          type="button"
          onClick={handleTemporaryCard}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] hover:bg-[#201f23] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-[#a855f7]" />
          </div>
          <span className="text-[11px] font-semibold text-[#fafafa]">
            Temporário
          </span>
        </button>
      </div>

      {/* 4. Barra de Progresso de Limite */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#a1a1aa] font-medium">
            Progresso do Limite
          </span>
          <span className="text-xs font-bold text-[#f97316]">
            {((activeCard.limitAvailable / activeCard.limitTotal) * 100).toFixed(0)}% livre
          </span>
        </div>

        <ProgressBar
          current={activeCard.limitAvailable}
          max={activeCard.limitTotal}
          color="#f97316"
          height="h-2.5"
        />

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-[#27272a]/50 p-2 rounded-lg border border-[#27272a]">
            <span className="text-[10px] text-[#a1a1aa] block">Disponível</span>
            <span className="text-xs font-bold text-[#fafafa]">
              {formatCurrency(activeCard.limitAvailable)}
            </span>
          </div>
          <div className="bg-[#27272a]/50 p-2 rounded-lg border border-[#27272a]">
            <span className="text-[10px] text-[#a1a1aa] block">Utilizado</span>
            <span className="text-xs font-bold text-[#fafafa]">
              {formatCurrency(activeCard.limitUsed)}
            </span>
          </div>
          <div className="bg-[#27272a]/50 p-2 rounded-lg border border-[#27272a]">
            <span className="text-[10px] text-[#a1a1aa] block">Total</span>
            <span className="text-xs font-bold text-[#fafafa]">
              {formatCurrency(activeCard.limitTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Card de Fatura */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-[#a1a1aa] font-medium">
              Fatura Atual
            </span>
            <h3 className="text-2xl font-extrabold text-[#fafafa] mt-0.5">
              {formatCurrency(activeCard.invoiceCurrent)}
            </h3>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#27272a] text-[#f59e0b] border border-[#f59e0b]/40">
            {activeCard.invoiceStatus}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-y border-[#27272a] text-xs">
          <div>
            <span className="text-[#a1a1aa] block">Vencimento</span>
            <strong className="text-[#fafafa]">{activeCard.invoiceDueDate}</strong>
          </div>
          <div className="text-right">
            <span className="text-[#a1a1aa] block">Melhor dia de compra</span>
            <strong className="text-[#f97316]">Dia {activeCard.bestBuyDay}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onPayInvoice) onPayInvoice(activeCard);
          }}
          className="w-full py-3.5 bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.99] text-[#121214] font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#f97316]/10"
        >
          <span>Pagar Fatura</span>
        </button>
      </div>

      {/* 6. Aviso de Segurança */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#27272a]/40 border border-[#27272a]">
        <ShieldCheck className="w-5 h-5 text-[#22c55e] shrink-0" />
        <div className="text-xs">
          <p className="font-semibold text-[#fafafa]">
            Proteção Antifraude Ativa
          </p>
          <p className="text-[#a1a1aa] mt-0.5">
            Monitoramento de transações em tempo real com validação instantânea.
          </p>
        </div>
      </div>

      {/* 7. Últimos Lançamentos Filtrados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#fafafa]">
            Lançamentos no Cartão
          </h3>
          <span className="text-xs text-[#a1a1aa] font-medium">
            {filteredTransactions?.length || 0} compras
          </span>
        </div>

        <div className="space-y-2">
          {filteredTransactions && filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <div className="text-center py-6 text-xs text-[#a1a1aa] bg-[#18181b] rounded-xl border border-[#27272a]">
              Nenhuma transação recente neste cartão.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
