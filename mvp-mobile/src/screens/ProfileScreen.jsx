import { useState } from "react";
import { User, KeyRound, CalendarRange, Database, LogOut, Trash2, Target, TrendingUp, Check } from "lucide-react";
import { Field, PrimaryButton, SecondaryButton, inputClass } from "../components/FormControls";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAppStore } from "../state/AppStore";
import { getPeriod } from "../utils/period";

const card = "bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4";

function CardTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#fafafa]">{title}</h3>
        {subtitle && <p className="text-xs text-[#a1a1aa]">{subtitle}</p>}
      </div>
    </div>
  );
}

function Feedback({ result }) {
  if (!result) return null;
  return (
    <p className={`text-xs font-medium ${result.ok ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
      {result.ok ? result.message : result.error}
    </p>
  );
}

export default function ProfileScreen({ onShowToast }) {
  const store = useAppStore();
  const { account, data } = store;

  const [profile, setProfile] = useState({ name: account.name, email: account.email });
  const [profileResult, setProfileResult] = useState(null);
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [passwordResult, setPasswordResult] = useState(null);
  const [startDay, setStartDay] = useState(data.settings.periodStartDay);
  const [confirm, setConfirm] = useState(null);

  const preview = getPeriod(startDay, 0);

  return (
    <div className="grid lg:grid-cols-2 gap-5 items-start">
      <div className="flex flex-col gap-5">
        <form
          className={card}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const result = store.updateProfile(profile);
            setProfileResult({ ...result, message: "Perfil atualizado." });
          }}
        >
          <CardTitle icon={<User className="w-5 h-5 text-[#f97316]" />} title="Dados do Perfil" subtitle="Como você aparece no app" />
          <Field label="Nome" htmlFor="pf-name">
            <input
              id="pf-name"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="E-mail" htmlFor="pf-email">
            <input
              id="pf-email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Feedback result={profileResult} />
          <PrimaryButton type="submit">
            <Check className="w-4 h-4" />
            Salvar Perfil
          </PrimaryButton>
        </form>

        <form
          className={card}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const result = store.changePassword(passwords.current, passwords.next);
            setPasswordResult({ ...result, message: "Senha alterada." });
            if (result.ok) setPasswords({ current: "", next: "" });
          }}
        >
          <CardTitle icon={<KeyRound className="w-5 h-5 text-[#f59e0b]" />} title="Alterar Senha" />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Senha atual" htmlFor="pf-pass">
              <input
                id="pf-pass"
                type="password"
                autoComplete="current-password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Nova senha" htmlFor="pf-newpass">
              <input
                id="pf-newpass"
                type="password"
                autoComplete="new-password"
                value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>
          <Feedback result={passwordResult} />
          <SecondaryButton type="submit">Atualizar Senha</SecondaryButton>
        </form>
      </div>

      <div className="flex flex-col gap-5">
        <div className={card}>
          <CardTitle
            icon={<CalendarRange className="w-5 h-5 text-[#22c55e]" />}
            title="Período de Organização"
            subtitle="Quando seu ciclo financeiro começa"
          />
          <Field label="Dia de início do período" htmlFor="pf-day" hint="Use o dia em que você recebe a renda (1 a 28).">
            <select
              id="pf-day"
              value={startDay}
              onChange={(e) => setStartDay(Number(e.target.value))}
              className={inputClass}
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Dia {d}
                  {d === 1 ? " (mês calendário)" : ""}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-[#a1a1aa]">
            Período atual ficaria: <strong className="text-[#fafafa]">{preview.label}</strong>
          </p>
          <PrimaryButton
            disabled={startDay === data.settings.periodStartDay}
            onClick={() => {
              store.updateSettings({ periodStartDay: startDay });
              onShowToast("Período de organização atualizado!");
            }}
          >
            <Check className="w-4 h-4" />
            Salvar Período
          </PrimaryButton>
        </div>

        <div className={card}>
          <CardTitle
            icon={<Database className="w-5 h-5 text-[#38bdf8]" />}
            title="Dados do Protótipo"
            subtitle="Salvos apenas neste navegador"
          />
          <div className="grid sm:grid-cols-2 gap-2.5">
            <SecondaryButton
              onClick={() =>
                setConfirm({
                  title: "Carregar dados de exemplo",
                  message: "Sua renda, regras, estrutura de despesas e lançamentos serão substituídos por dados de exemplo.",
                  confirmLabel: "Substituir",
                  onConfirm: () => {
                    store.loadDemoData();
                    onShowToast("Dados de exemplo carregados!");
                  },
                })
              }
            >
              Carregar exemplo
            </SecondaryButton>
            <SecondaryButton
              onClick={() =>
                setConfirm({
                  title: "Apagar dados financeiros",
                  message: "Renda, estrutura de despesas e todos os lançamentos serão apagados. Sua conta continua ativa.",
                  confirmLabel: "Apagar",
                  onConfirm: () => {
                    store.clearData();
                    onShowToast("Dados apagados.", "info");
                  },
                })
              }
            >
              Começar do zero
            </SecondaryButton>
          </div>
        </div>

        <div className={`${card} lg:hidden`}>
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#71717a]">Em breve</span>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Metas", icon: Target },
              { label: "Investir", icon: TrendingUp },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 p-3 rounded-xl bg-[#27272a]/40 border border-[#27272a] opacity-70">
                <Icon className="w-4 h-4 text-[#a1a1aa]" />
                <span className="text-xs font-semibold text-[#a1a1aa]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <SecondaryButton onClick={store.signOut}>
            <LogOut className="w-4 h-4" />
            Sair
          </SecondaryButton>
          <button
            type="button"
            onClick={() =>
              setConfirm({
                title: "Excluir conta",
                message: "Sua conta e todos os dados associados serão removidos deste navegador. Esta ação não pode ser desfeita.",
                confirmLabel: "Excluir conta",
                onConfirm: store.deleteAccount,
              })
            }
            className="w-full py-3 rounded-xl text-sm font-semibold text-[#ef4444] border border-[#ef4444]/40 hover:bg-[#ef4444]/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Excluir conta
          </button>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
