import { LogOut, Scale } from "lucide-react";
import { COMING_SOON_TABS, MAIN_TABS, PROFILE_TAB } from "../navigation";

function NavButton({ tab, isActive, onClick, badge }) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
        isActive
          ? "bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30"
          : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]/60 border border-transparent"
      }`}
    >
      <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={isActive ? 2.4 : 1.8} />
      <span className="flex-1 text-left">{tab.label}</span>
      {badge}
    </button>
  );
}

export default function Sidebar({ activeTab, onTabChange, onComingSoon, account, onSignOut }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#18181b] border-r border-[#27272a] p-4">
      <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[#f97316] flex items-center justify-center">
          <Scale className="w-5 h-5 text-[#121214]" />
        </div>
        <div>
          <span className="text-sm font-extrabold text-[#fafafa] block leading-tight">Finance Balance</span>
          <span className="text-[11px] text-[#a1a1aa]">Gestão financeira pessoal</span>
        </div>
      </div>

      <nav className="space-y-1">
        {MAIN_TABS.map((tab) => (
          <NavButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => onTabChange(tab.id)} />
        ))}
      </nav>

      <div className="mt-6">
        <span className="px-3 text-[10px] uppercase tracking-wider font-bold text-[#71717a]">Em breve</span>
        <div className="space-y-1 mt-2 opacity-70">
          {COMING_SOON_TABS.map((tab) => (
            <NavButton
              key={tab.id}
              tab={tab}
              isActive={false}
              onClick={() => onComingSoon(tab.label)}
              badge={
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#27272a] text-[#a1a1aa] border border-[#3f3f46]">
                  EM BREVE
                </span>
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-[#27272a] space-y-1">
        <NavButton
          tab={{ ...PROFILE_TAB, label: account?.name || PROFILE_TAB.label }}
          isActive={activeTab === PROFILE_TAB.id}
          onClick={() => onTabChange(PROFILE_TAB.id)}
        />
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#27272a]/60 transition-colors cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
