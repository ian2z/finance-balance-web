export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4 bg-[#18181b] rounded-xl border border-dashed border-[#3f3f46]">
      {icon && (
        <div className="w-11 h-11 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-bold text-[#fafafa]">{title}</h4>
      {description && <p className="text-xs text-[#a1a1aa] mt-1 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
