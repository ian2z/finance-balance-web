export default function LayoutBase({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] flex justify-center text-[#fafafa] selection:bg-[#f97316] selection:text-[#121214]">
      {/* Mobile container simulating native app view */}
      <div className="w-full max-w-md min-h-screen bg-[#121214] border-x border-[#27272a] flex flex-col relative shadow-2xl overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
