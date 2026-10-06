import { useState } from "react";
import { Bell, X, Check, ArrowLeft, User } from "lucide-react";

export default function Header({
  user,
  title,
  subtitle,
  showBack = false,
  onBack,
  onOpenNotifications,
}) {
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [notifications, setNotifications] = useState(user?.notifications || []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-md px-4 py-3.5 border-b border-[#27272a] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#fafafa] hover:border-[#3f3f46] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="relative w-10 h-10 rounded-full bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#fafafa] shrink-0">
              <User className="w-5 h-5 text-[#fafafa]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#121214]" />
            </div>
          )}

          <div className="min-w-0">
            {subtitle && (
              <span className="text-[11px] font-medium text-[#a1a1aa] block leading-tight">
                {subtitle}
              </span>
            )}
            <h1 className="text-base font-bold text-[#fafafa] truncate leading-tight">
              {title || `Olá, ${user?.shortName || "Ian"}`}
            </h1>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowNotificationList(true);
              if (onOpenNotifications) onOpenNotifications();
            }}
            className="relative w-9 h-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#fafafa] hover:border-[#3f3f46] transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4 text-[#fafafa]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f97316] text-[#121214] text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notifications Drawer / Modal */}
      {showNotificationList && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#fafafa]">Notificações</h3>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  {unreadCount > 0
                    ? `${unreadCount} nova(s) atualização(ões)`
                    : "Tudo em dia!"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs text-[#f97316] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3.5 h-3.5" /> Ler todas
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowNotificationList(false)}
                  className="w-8 h-8 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-[#27272a]/50">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`pt-2.5 first:pt-0 ${
                    !n.read ? "bg-[#27272a]/30 p-3 rounded-lg border border-[#f97316]/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[#fafafa]">{n.title}</h4>
                    <span className="text-[10px] text-[#a1a1aa] shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
                    {n.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[#27272a] bg-[#121214] text-center">
              <button
                type="button"
                onClick={() => setShowNotificationList(false)}
                className="w-full py-2 bg-[#27272a] text-[#fafafa] rounded-lg text-xs font-semibold hover:bg-[#3f3f46] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
