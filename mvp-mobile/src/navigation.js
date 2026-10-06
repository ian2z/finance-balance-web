import { LayoutDashboard, Wallet, ListTree, ReceiptText, Target, TrendingUp, User } from "lucide-react";

export const MAIN_TABS = [
  { id: "home", label: "Início", title: "Visão Geral", icon: LayoutDashboard },
  { id: "budget", label: "Orçamento", title: "Orçamento & Regras", icon: Wallet },
  { id: "expenses", label: "Despesas", title: "Estrutura de Despesas", icon: ListTree },
  { id: "transactions", label: "Lançamentos", title: "Lançamentos", icon: ReceiptText },
];

// Fora do escopo do MVP: aparecem na navegação apenas como "em breve".
export const COMING_SOON_TABS = [
  { id: "goals", label: "Metas", icon: Target },
  { id: "invest", label: "Investir", icon: TrendingUp },
];

export const PROFILE_TAB = { id: "profile", label: "Perfil", title: "Meu Perfil", icon: User };
