// Índices para localizar grupo/item/subitem e a regra (cor) de um lançamento.
export const buildLookup = (data) => {
  const rules = new Map(data.budget.rules.map((r) => [r.id, r]));
  const groups = new Map();
  const items = new Map();
  const subitems = new Map();
  data.groups.forEach((g) => {
    groups.set(g.id, g);
    g.items.forEach((i) => {
      items.set(i.id, i);
      i.subitems.forEach((s) => subitems.set(s.id, s));
    });
  });

  const describe = (tx) => {
    const group = groups.get(tx.groupId);
    const item = items.get(tx.itemId);
    const sub = tx.subitemId ? subitems.get(tx.subitemId) : null;
    const path = [group?.name, item?.name, sub?.name].filter(Boolean).join(" › ") || "Sem classificação";
    return { group, item, subitem: sub, path, color: rules.get(group?.ruleId)?.color || "#a1a1aa" };
  };

  return { rules, groups, items, subitems, describe };
};

export const countTransactions = (transactions, predicate) => transactions.filter(predicate).length;
