export const inputClass =
  "w-full bg-[#27272a] border border-[#3f3f46] rounded-xl px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#f97316] transition-colors";

export function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1.5"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-[#ef4444] mt-1.5 font-medium">{error}</p>
      ) : (
        hint && <p className="text-[11px] text-[#71717a] mt-1.5">{hint}</p>
      )}
    </div>
  );
}

export function MoneyInput({ id, value, onChange, placeholder = "0,00", autoFocus }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#a1a1aa]">R$</span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pl-10 font-bold text-base`}
      />
    </div>
  );
}

export function PrimaryButton({ children, type = "button", onClick, disabled, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.99] text-[#121214] font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#f97316]/10 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, type = "button", onClick, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#3f3f46] ${className}`}
    >
      {children}
    </button>
  );
}
