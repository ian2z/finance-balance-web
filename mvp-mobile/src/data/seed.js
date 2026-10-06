import { uid } from "../utils/id";
import { addDays, getPeriod, parseISODate, toISODate } from "../utils/period";

export const RULE_COLORS = ["#f97316", "#f59e0b", "#22c55e", "#38bdf8", "#a855f7", "#e0c0b1", "#ef4444", "#d1c79e"];

export const PAYMENT_METHODS = ["Débito", "Crédito", "Pix", "Dinheiro", "Boleto"];

export const defaultRules = () => [
  { id: uid("rule"), name: "Essenciais", percent: 50, color: "#f97316" },
  { id: uid("rule"), name: "Estilo de Vida", percent: 30, color: "#f59e0b" },
  { id: uid("rule"), name: "Futuro & Reserva", percent: 20, color: "#22c55e" },
];

export const createEmptyData = () => ({
  settings: { periodStartDay: 1 },
  budget: { income: 0, rules: defaultRules() },
  groups: [],
  transactions: [],
});

const node = (name, planned = 0, subitems = []) => ({ id: uid("item"), name, planned, subitems });
const sub = (name, planned) => ({ id: uid("sub"), name, planned });

// Conta de demonstração: datas geradas relativas a hoje para que o período atual
// sempre tenha lançamentos, inclusive alguns desvios de previsto x realizado.
export const createDemoData = () => {
  const [essenciais, estilo, futuro] = defaultRules();

  const moradia = {
    id: uid("grp"), name: "Moradia", icon: "home", ruleId: essenciais.id,
    items: [
      node("Aluguel", 1200),
      node("Contas da Casa", 0, [sub("Energia", 160), sub("Água", 80), sub("Internet", 100)]),
    ],
  };
  const alimentacao = {
    id: uid("grp"), name: "Alimentação", icon: "food", ruleId: essenciais.id,
    items: [node("Mercado", 650), node("Padaria & Feira", 120)],
  };
  const transporte = {
    id: uid("grp"), name: "Transporte", icon: "transport", ruleId: essenciais.id,
    items: [node("Transporte Público", 180), node("Aplicativos", 80)],
  };
  const lazer = {
    id: uid("grp"), name: "Lazer", icon: "leisure", ruleId: estilo.id,
    items: [
      node("Restaurantes", 300),
      node("Assinaturas", 0, [sub("Streaming de Vídeo", 55.9), sub("Música", 21.9)]),
      node("Saídas & Eventos", 250),
    ],
  };
  const compras = {
    id: uid("grp"), name: "Compras", icon: "shopping", ruleId: estilo.id,
    items: [node("Roupas", 200), node("Cuidados Pessoais", 120)],
  };
  const reserva = {
    id: uid("grp"), name: "Reserva", icon: "savings", ruleId: futuro.id,
    items: [node("Reserva de Emergência", 600), node("Aportes", 400)],
  };

  const groups = [moradia, alimentacao, transporte, lazer, compras, reserva];
  const find = (group, itemName, subName) => {
    const item = group.items.find((i) => i.name === itemName);
    const subitem = subName ? item.subitems.find((s) => s.name === subName) : null;
    return { groupId: group.id, itemId: item.id, subitemId: subitem ? subitem.id : null };
  };

  const today = new Date();
  const todayIso = toISODate(today);
  const transactions = [];
  const add = (date, description, amount, ref, method) => {
    if (date > todayIso) return;
    transactions.push({ id: uid("tx"), description, amount, date, method, ...ref });
  };

  // Lançamentos recorrentes no início de cada período (atual e anterior).
  [0, -1].forEach((offset) => {
    const start = parseISODate(getPeriod(1, offset, today).start);
    const at = (d) => toISODate(addDays(start, d));
    add(at(4), "Aluguel do apartamento", 1200, find(moradia, "Aluguel"), "Boleto");
    add(at(9), "Conta de energia", offset === 0 ? 187.4 : 152.3, find(moradia, "Contas da Casa", "Energia"), "Boleto");
    add(at(9), "Conta de água", 74.2, find(moradia, "Contas da Casa", "Água"), "Boleto");
    add(at(2), "Internet fibra", 99.9, find(moradia, "Contas da Casa", "Internet"), "Débito");
    add(at(6), "Streaming de vídeo", 55.9, find(lazer, "Assinaturas", "Streaming de Vídeo"), "Crédito");
    add(at(6), "Streaming de música", 21.9, find(lazer, "Assinaturas", "Música"), "Crédito");
    add(at(5), "Aporte reserva de emergência", 600, find(reserva, "Reserva de Emergência"), "Pix");
  });

  // Gastos variáveis espalhados pelos últimos ~40 dias.
  const variable = [
    [0, "Supermercado", 186.4, find(alimentacao, "Mercado"), "Débito"],
    [1, "Jantar com amigos", 142.0, find(lazer, "Restaurantes"), "Crédito"],
    [1, "Recarga cartão de transporte", 60.0, find(transporte, "Transporte Público"), "Pix"],
    [2, "Padaria", 23.5, find(alimentacao, "Padaria & Feira"), "Dinheiro"],
    [3, "Corrida por aplicativo", 31.8, find(transporte, "Aplicativos"), "Crédito"],
    [4, "Hamburgueria", 89.9, find(lazer, "Restaurantes"), "Crédito"],
    [5, "Feira livre", 48.0, find(alimentacao, "Padaria & Feira"), "Pix"],
    [6, "Supermercado", 243.7, find(alimentacao, "Mercado"), "Débito"],
    [7, "Cinema", 64.0, find(lazer, "Saídas & Eventos"), "Crédito"],
    [8, "Farmácia", 57.3, find(compras, "Cuidados Pessoais"), "Débito"],
    [9, "Restaurante japonês", 118.0, find(lazer, "Restaurantes"), "Crédito"],
    [10, "Recarga cartão de transporte", 60.0, find(transporte, "Transporte Público"), "Pix"],
    [12, "Camiseta", 79.9, find(compras, "Roupas"), "Crédito"],
    [13, "Supermercado", 158.2, find(alimentacao, "Mercado"), "Débito"],
    [15, "Corrida por aplicativo", 27.4, find(transporte, "Aplicativos"), "Crédito"],
    [17, "Show", 120.0, find(lazer, "Saídas & Eventos"), "Pix"],
    [19, "Supermercado", 201.3, find(alimentacao, "Mercado"), "Débito"],
    [22, "Padaria", 31.2, find(alimentacao, "Padaria & Feira"), "Dinheiro"],
    [24, "Pizzaria", 96.0, find(lazer, "Restaurantes"), "Crédito"],
    [26, "Tênis", 249.9, find(compras, "Roupas"), "Crédito"],
    [28, "Supermercado", 312.6, find(alimentacao, "Mercado"), "Débito"],
    [31, "Recarga cartão de transporte", 120.0, find(transporte, "Transporte Público"), "Pix"],
    [34, "Bar", 87.5, find(lazer, "Saídas & Eventos"), "Crédito"],
    [37, "Supermercado", 228.9, find(alimentacao, "Mercado"), "Débito"],
  ];
  variable.forEach(([daysAgo, description, amount, ref, method]) =>
    add(toISODate(addDays(today, -daysAgo)), description, amount, ref, method)
  );

  return {
    settings: { periodStartDay: 1 },
    budget: { income: 5200, rules: [essenciais, estilo, futuro] },
    groups,
    transactions,
  };
};
