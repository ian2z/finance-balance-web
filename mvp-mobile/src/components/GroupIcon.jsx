import {
  Home,
  Utensils,
  Bus,
  Sparkles,
  ShoppingBag,
  PiggyBank,
  HeartPulse,
  GraduationCap,
  Dog,
  Gift,
  Plane,
  Folder,
} from "lucide-react";

export const GROUP_ICONS = {
  home: { label: "Moradia", icon: Home },
  food: { label: "Alimentação", icon: Utensils },
  transport: { label: "Transporte", icon: Bus },
  leisure: { label: "Lazer", icon: Sparkles },
  shopping: { label: "Compras", icon: ShoppingBag },
  savings: { label: "Reserva", icon: PiggyBank },
  health: { label: "Saúde", icon: HeartPulse },
  education: { label: "Educação", icon: GraduationCap },
  pets: { label: "Pets", icon: Dog },
  gifts: { label: "Presentes", icon: Gift },
  travel: { label: "Viagens", icon: Plane },
  other: { label: "Outros", icon: Folder },
};

export default function GroupIcon({ name, color = "#f97316", className = "w-4 h-4" }) {
  const Icon = (GROUP_ICONS[name] || GROUP_ICONS.other).icon;
  return <Icon className={className} style={{ color }} />;
}
