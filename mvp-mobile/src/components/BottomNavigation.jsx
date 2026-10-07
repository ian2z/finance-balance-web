import { MAIN_TABS, PROFILE_TAB } from "../navigation";

export default function BottomNavigation({ activeTab = "home", onTabChange }) {
  const tabs = [...MAIN_TABS, PROFILE_TAB];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#18181b]/95 backdrop-blur-md border-t border-[#27272a] px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="flex items-center justify-around max-w-xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center py-1 px-1.5 min-w-0 rounded-xl transition-all cursor-pointer relative group ${
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
                className={`text-[10px] mt-1 font-medium transition-colors truncate ${
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
