import { isInPeriod } from "./period";
import { formatCurrency } from "./formatters";

const sum = (list, fn) => list.reduce((acc, x) => acc + fn(x), 0);
const round2 = (v) => Math.round(v * 100) / 100;

// Previsto de um item: soma dos subitens quando existem, senão o valor do próprio item.
export const itemPlanned = (item) =>
  item.subitems.length > 0 ? sum(item.subitems, (s) => s.planned) : item.planned;

export const groupPlanned = (group) => sum(group.items, itemPlanned);

export const rulesPercentTotal = (rules) => round2(sum(rules, (r) => Number(r.percent) || 0));

// Consolida previsto x realizado em todos os níveis da árvore para um período.
export const buildBudgetSummary = (data, period) => {
  const { budget, groups, transactions } = data;
  const income = budget.income || 0;
  const periodTx = transactions.filter((t) => isInPeriod(t.date, period));

  const actualBy = { group: {}, item: {}, subitem: {} };
  periodTx.forEach((t) => {
    actualBy.group[t.groupId] = (actualBy.group[t.groupId] || 0) + t.amount;
    if (t.itemId) actualBy.item[t.itemId] = (actualBy.item[t.itemId] || 0) + t.amount;
    if (t.subitemId) actualBy.subitem[t.subitemId] = (actualBy.subitem[t.subitemId] || 0) + t.amount;
  });

  const deviations = [];
  const trackDeviation = (node, level, path) => {
    if (node.actual > node.planned && node.actual > 0) {
      deviations.push({
        id: node.id,
        level,
        name: node.name,
        path,
        planned: node.planned,
        actual: node.actual,
        excess: round2(node.actual - node.planned),
      });
    }
  };

  const groupSummaries = groups.map((group) => {
    const items = group.items.map((item) => {
      const subitems = item.subitems.map((sub) => {
        const s = { ...sub, actual: round2(actualBy.subitem[sub.id] || 0) };
        trackDeviation(s, "subitem", `${group.name} › ${item.name}`);
        return s;
      });
      const i = {
        ...item,
        subitems,
        planned: round2(itemPlanned(item)),
        actual: round2(actualBy.item[item.id] || 0),
      };
      trackDeviation(i, "item", group.name);
      return i;
    });
    const g = {
      ...group,
      items,
      planned: round2(sum(items, (i) => i.planned)),
      actual: round2(actualBy.group[group.id] || 0),
    };
    trackDeviation(g, "group", "");
    return g;
  });

  const rules = budget.rules.map((rule) => {
    const ruleGroups = groupSummaries.filter((g) => g.ruleId === rule.id);
    return {
      ...rule,
      target: round2((income * (Number(rule.percent) || 0)) / 100),
      planned: round2(sum(ruleGroups, (g) => g.planned)),
      actual: round2(sum(ruleGroups, (g) => g.actual)),
      groupCount: ruleGroups.length,
    };
  });

  const totalPlanned = round2(sum(groupSummaries, (g) => g.planned));
  const totalSpent = round2(sum(periodTx, (t) => t.amount));

  return {
    income,
    totalPlanned,
    totalSpent,
    available: round2(income - totalSpent),
    unallocated: round2(income - totalPlanned),
    percentTotal: rulesPercentTotal(budget.rules),
    rules,
    groups: groupSummaries,
    deviations: deviations.sort((a, b) => b.excess - a.excess),
    transactions: periodTx.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
  };
};

// Monta a lista de alertas exibida no sino do cabeçalho.
export const buildAlerts = (summary) => {
  const alerts = [];
  if (summary.income <= 0) {
    alerts.push({
      id: "no-income",
      title: "Renda não definida",
      description: "Informe sua renda base em Orçamento para distribuir o dinheiro entre as regras.",
      tone: "warning",
    });
  }
  if (summary.percentTotal !== 100) {
    alerts.push({
      id: "rules-total",
      title: "Regras percentuais incompletas",
      description: `As regras somam ${summary.percentTotal}% — ajuste para totalizar 100%.`,
      tone: "warning",
    });
  }
  summary.rules
    .filter((r) => r.planned > r.target && r.target > 0)
    .forEach((r) => {
      alerts.push({
        id: `rule-${r.id}`,
        title: `${r.name}: previsto acima da regra`,
        description: `O previsto nos grupos excede em ${formatCurrency(r.planned - r.target)} o teto de ${r.percent}% da renda.`,
        tone: "warning",
      });
    });
  summary.deviations
    .filter((d) => d.level !== "group")
    .slice(0, 5)
    .forEach((d) => {
      alerts.push({
        id: `dev-${d.id}`,
        title: `${d.name} acima do previsto`,
        description: `${d.path ? `${d.path} · ` : ""}gasto excede o previsto em ${formatCurrency(d.excess)}.`,
        tone: "danger",
      });
    });
  return alerts;
};
