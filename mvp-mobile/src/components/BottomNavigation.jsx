import {
  Home,
  CreditCard,
  PieChart,
  Target,
  TrendingUp,
} from "lucide-react";

export default function BottomNavigation({
  activeTab = "home",
  onTabChange,
  onComingSoon,
}) {
  const tabs = [
    { id: "home", label: "Início", icon: Home },
    { id: "cards", label: "Carteira", icon: CreditCard },
    { id: "reports", label: "Gastos", icon: PieChart },
    { id: "goals", label: "Metas", icon: Target, isComingSoon: true },
    { id: "invest", label: "Investir", icon: TrendingUp, isComingSoon: true },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-[#18181b]/95 backdrop-blur-md border-t border-[#27272a] px-2 py-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.isComingSoon) {
                  if (onComingSoon) onComingSoon(tab.label);
                } else if (onTabChange) {
                  onTabChange(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative group ${
                isActive ? "text-[#f97316]" : "text-[#a1a1aa] hover:text-[#fafafa]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#f97316]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-[#f97316] font-bold" : "text-[#a1a1aa]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
