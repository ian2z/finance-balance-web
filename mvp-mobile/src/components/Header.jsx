import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import Modal from "./Modal";

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

export default function Header({ account, title, subtitle, alerts = [], onOpenProfile }) {
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <>
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 bg-[#121214]/90 backdrop-blur-md border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label="Abrir perfil"
              className="lg:hidden relative w-10 h-10 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-sm font-bold text-[#fafafa] shrink-0 cursor-pointer hover:border-[#f97316]/60 transition-colors"
            >
              {initialsOf(account?.name)}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#121214]" />
            </button>

            <div className="min-w-0">
              {subtitle && (
                <span className="text-[11px] font-medium text-[#a1a1aa] block leading-tight truncate">{subtitle}</span>
              )}
              <h1 className="text-base lg:text-lg font-bold text-[#fafafa] truncate leading-tight">{title}</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAlerts(true)}
            className="relative w-9 h-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#fafafa] hover:border-[#3f3f46] transition-colors cursor-pointer shrink-0"
            aria-label={`Alertas do orçamento (${alerts.length})`}
          >
            <Bell className="w-4 h-4 text-[#fafafa]" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#f97316] text-[#121214] text-[10px] font-bold rounded-full flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {showAlerts && (
        <Modal
          title="Alertas do Orçamento"
          subtitle={alerts.length > 0 ? `${alerts.length} ponto(s) de atenção no período` : "Tudo em dia!"}
          icon={<Bell className="w-5 h-5 text-[#f97316]" />}
          onClose={() => setShowAlerts(false)}
        >
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 className="w-10 h-10 text-[#22c55e] mb-2" />
              <p className="text-sm text-[#a1a1aa]">Nenhum desvio entre previsto e realizado neste período.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-3 rounded-lg border bg-[#27272a]/30 ${
                    a.tone === "danger" ? "border-[#ef4444]/30" : "border-[#f59e0b]/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {a.tone === "danger" ? (
                      <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
                    )}
                    <h4 className="text-sm font-semibold text-[#fafafa]">{a.title}</h4>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">{a.description}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
