import { useState } from "react";
import { Scale, LogIn, UserPlus, Play, Eye, EyeOff, ListTree, Percent, LayoutDashboard } from "lucide-react";
import { Field, PrimaryButton, SecondaryButton, inputClass } from "../components/FormControls";
import { useAppStore } from "../state/AppStore";

const highlights = [
  { icon: Percent, title: "Regras percentuais", text: "Distribua sua renda automaticamente entre áreas." },
  { icon: ListTree, title: "Despesas em árvore", text: "Grupos, itens e subitens com previsto vs. realizado." },
  { icon: LayoutDashboard, title: "Visão geral", text: "Acompanhe a alocação do seu dinheiro em tempo real." },
];

export default function AuthScreen() {
  const { signIn, signUp, signInDemo } = useAppStore();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = mode === "login" ? signIn(form) : signUp(form);
    if (!result.ok) setError(result.error);
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  return (
    <div className="min-h-screen w-full bg-[#121214] text-[#fafafa] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Apresentação */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#f97316] flex items-center justify-center">
              <Scale className="w-6 h-6 text-[#121214]" />
            </div>
            <span className="text-2xl font-extrabold">Finance Balance</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Organize suas finanças com <span className="text-[#f97316]">previsibilidade</span>.
          </h2>
          <p className="text-[#a1a1aa] mt-4 max-w-md">
            Defina sua renda, distribua por regras percentuais e acompanhe cada despesa do previsto ao realizado.
          </p>
          <div className="mt-8 space-y-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#18181b] border border-[#27272a] max-w-md">
                <div className="w-9 h-9 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#f97316]" />
                </div>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#f97316] flex items-center justify-center mb-3">
              <Scale className="w-7 h-7 text-[#121214]" />
            </div>
            <span className="text-2xl font-extrabold">Finance Balance</span>
            <span className="text-xs text-[#a1a1aa] mt-1">Gestão financeira pessoal</span>
          </div>

          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent" />

            <div className="bg-[#121214] p-1 rounded-xl border border-[#27272a] grid grid-cols-2 gap-1 mb-5">
              {[
                { id: "login", label: "Entrar" },
                { id: "signup", label: "Criar conta" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchMode(tab.id)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === tab.id ? "bg-[#f97316] text-[#121214] shadow-md" : "text-[#a1a1aa] hover:text-[#fafafa]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === "signup" && (
                <Field label="Nome" htmlFor="auth-name">
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Como devemos te chamar?"
                    className={inputClass}
                  />
                </Field>
              )}
              <Field label="E-mail" htmlFor="auth-email">
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="voce@email.com"
                  className={inputClass}
                />
              </Field>
              <Field
                label="Senha"
                htmlFor="auth-password"
                hint={mode === "signup" ? "Mínimo de 6 caracteres." : undefined}
              >
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={form.password}
                    onChange={update("password")}
                    placeholder="••••••"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#fafafa] p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              {error && (
                <p className="text-xs font-medium text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <PrimaryButton type="submit">
                {mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{mode === "login" ? "Entrar" : "Criar conta"}</span>
              </PrimaryButton>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#27272a]" />
              <span className="text-[11px] text-[#71717a] uppercase tracking-wider font-semibold">ou</span>
              <div className="flex-1 h-px bg-[#27272a]" />
            </div>

            <SecondaryButton onClick={signInDemo}>
              <Play className="w-4 h-4 text-[#f97316]" />
              <span>Explorar com conta de demonstração</span>
            </SecondaryButton>
          </div>

          <p className="text-[11px] text-[#71717a] text-center mt-4 leading-relaxed">
            Protótipo navegável: os dados ficam salvos apenas neste navegador.
          </p>
        </div>
      </div>
    </div>
  );
}
