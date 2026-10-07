// Shell responsivo: sidebar fixa a partir de lg, cabeçalho + navegação inferior no celular.
export default function LayoutBase({ sidebar, header, bottomNav, children }) {
  return (
    <div className="min-h-screen w-full bg-[#121214] text-[#fafafa] flex selection:bg-[#f97316] selection:text-[#121214]">
      {sidebar}
      <div className="flex-1 min-w-0 flex flex-col">
        {header}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 pb-28 lg:pb-10">
          {children}
        </main>
      </div>
      {bottomNav}
    </div>
  );
}
