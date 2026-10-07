import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createDemoData, createEmptyData } from "../data/seed";
import { uid } from "../utils/id";

// Protótipo navegável sem back-end: contas e dados ficam no localStorage do navegador.
// A senha é guardada em texto puro apenas para simular o fluxo de login.
const STORAGE_KEY = "finance-balance:v1";
const DEMO_EMAIL = "demo@financebalance.app";

const emptyState = { accounts: {}, sessionUserId: null };

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw);
    return parsed && parsed.accounts ? parsed : emptyState;
  } catch {
    return emptyState;
  }
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Armazenamento indisponível (aba anônima, cota cheia): segue só em memória.
    }
  }, [state]);

  const account = state.sessionUserId ? state.accounts[state.sessionUserId] || null : null;

  const findByEmail = useCallback(
    (email) => Object.values(state.accounts).find((a) => a.email === normalizeEmail(email)),
    [state.accounts]
  );

  const updateAccount = useCallback((fn) => {
    setState((prev) => {
      const current = prev.accounts[prev.sessionUserId];
      if (!current) return prev;
      return { ...prev, accounts: { ...prev.accounts, [current.id]: fn(current) } };
    });
  }, []);

  const updateData = useCallback(
    (fn) => updateAccount((acc) => ({ ...acc, data: fn(acc.data) })),
    [updateAccount]
  );

  // ---------- Autenticação ----------
  const signUp = ({ name, email, password }) => {
    const cleanName = String(name || "").trim();
    const cleanEmail = normalizeEmail(email);
    if (cleanName.length < 2) return { ok: false, error: "Informe seu nome." };
    if (!isValidEmail(cleanEmail)) return { ok: false, error: "E-mail inválido." };
    if (String(password || "").length < 6)
      return { ok: false, error: "A senha precisa ter ao menos 6 caracteres." };
    if (findByEmail(cleanEmail)) return { ok: false, error: "Já existe uma conta com este e-mail." };

    const id = uid("user");
    const newAccount = {
      id,
      name: cleanName,
      email: cleanEmail,
      password,
      createdAt: new Date().toISOString(),
      data: createEmptyData(),
    };
    setState((prev) => ({ accounts: { ...prev.accounts, [id]: newAccount }, sessionUserId: id }));
    return { ok: true };
  };

  const signIn = ({ email, password }) => {
    const found = findByEmail(email);
    if (!found || found.password !== password) return { ok: false, error: "E-mail ou senha incorretos." };
    setState((prev) => ({ ...prev, sessionUserId: found.id }));
    return { ok: true };
  };

  const signInDemo = () => {
    const existing = findByEmail(DEMO_EMAIL);
    if (existing) {
      setState((prev) => ({ ...prev, sessionUserId: existing.id }));
      return;
    }
    const id = uid("user");
    const demo = {
      id,
      name: "Visitante Demo",
      email: DEMO_EMAIL,
      password: "demo123",
      createdAt: new Date().toISOString(),
      data: createDemoData(),
    };
    setState((prev) => ({ accounts: { ...prev.accounts, [id]: demo }, sessionUserId: id }));
  };

  const signOut = () => setState((prev) => ({ ...prev, sessionUserId: null }));

  // ---------- Perfil ----------
  const updateProfile = ({ name, email }) => {
    const cleanName = String(name || "").trim();
    const cleanEmail = normalizeEmail(email);
    if (cleanName.length < 2) return { ok: false, error: "Informe seu nome." };
    if (!isValidEmail(cleanEmail)) return { ok: false, error: "E-mail inválido." };
    const owner = findByEmail(cleanEmail);
    if (owner && owner.id !== account?.id) return { ok: false, error: "E-mail já usado por outra conta." };
    updateAccount((acc) => ({ ...acc, name: cleanName, email: cleanEmail }));
    return { ok: true };
  };

  const changePassword = (current, next) => {
    if (!account || account.password !== current) return { ok: false, error: "Senha atual incorreta." };
    if (String(next || "").length < 6) return { ok: false, error: "A nova senha precisa ter ao menos 6 caracteres." };
    updateAccount((acc) => ({ ...acc, password: next }));
    return { ok: true };
  };

  const deleteAccount = () =>
    setState((prev) => {
      const accounts = { ...prev.accounts };
      delete accounts[prev.sessionUserId];
      return { accounts, sessionUserId: null };
    });

  const loadDemoData = () => updateData(() => createDemoData());
  const clearData = () => updateData(() => createEmptyData());

  const updateSettings = (patch) => updateData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));

  // ---------- Orçamento ----------
  const setIncome = (income) => updateData((d) => ({ ...d, budget: { ...d.budget, income } }));
  const setRules = (rules) => updateData((d) => ({ ...d, budget: { ...d.budget, rules } }));

  // ---------- Árvore de despesas ----------
  const mapGroup = (groupId, fn) => (d) => ({
    ...d,
    groups: d.groups.map((g) => (g.id === groupId ? fn(g) : g)),
  });
  const mapItem = (groupId, itemId, fn) =>
    mapGroup(groupId, (g) => ({ ...g, items: g.items.map((i) => (i.id === itemId ? fn(i) : i)) }));

  const addGroup = ({ name, ruleId, icon }) =>
    updateData((d) => ({ ...d, groups: [...d.groups, { id: uid("grp"), name, ruleId, icon, items: [] }] }));
  const updateGroup = (groupId, patch) => updateData(mapGroup(groupId, (g) => ({ ...g, ...patch })));
  const deleteGroup = (groupId) =>
    updateData((d) => ({
      ...d,
      groups: d.groups.filter((g) => g.id !== groupId),
      transactions: d.transactions.filter((t) => t.groupId !== groupId),
    }));

  const addItem = (groupId, { name, planned }) =>
    updateData(
      mapGroup(groupId, (g) => ({
        ...g,
        items: [...g.items, { id: uid("item"), name, planned, subitems: [] }],
      }))
    );
  const updateItem = (groupId, itemId, patch) => updateData(mapItem(groupId, itemId, (i) => ({ ...i, ...patch })));
  const deleteItem = (groupId, itemId) =>
    updateData((d) => ({
      ...mapGroup(groupId, (g) => ({ ...g, items: g.items.filter((i) => i.id !== itemId) }))(d),
      transactions: d.transactions.filter((t) => t.itemId !== itemId),
    }));

  const addSubitem = (groupId, itemId, { name, planned }) =>
    updateData(
      mapItem(groupId, itemId, (i) => ({
        ...i,
        subitems: [...i.subitems, { id: uid("sub"), name, planned }],
      }))
    );
  const updateSubitem = (groupId, itemId, subitemId, patch) =>
    updateData(
      mapItem(groupId, itemId, (i) => ({
        ...i,
        subitems: i.subitems.map((s) => (s.id === subitemId ? { ...s, ...patch } : s)),
      }))
    );
  // Lançamentos do subitem excluído continuam contando no item pai.
  const deleteSubitem = (groupId, itemId, subitemId) =>
    updateData((d) => ({
      ...mapItem(groupId, itemId, (i) => ({ ...i, subitems: i.subitems.filter((s) => s.id !== subitemId) }))(d),
      transactions: d.transactions.map((t) => (t.subitemId === subitemId ? { ...t, subitemId: null } : t)),
    }));

  // ---------- Lançamentos ----------
  const addTransaction = (tx) =>
    updateData((d) => ({ ...d, transactions: [{ ...tx, id: uid("tx") }, ...d.transactions] }));
  const updateTransaction = (txId, patch) =>
    updateData((d) => ({
      ...d,
      transactions: d.transactions.map((t) => (t.id === txId ? { ...t, ...patch } : t)),
    }));
  const deleteTransaction = (txId) =>
    updateData((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== txId) }));

  const value = {
    account,
    data: account?.data || null,
    isDemo: account?.email === DEMO_EMAIL,
    signUp, signIn, signInDemo, signOut,
    updateProfile, changePassword, deleteAccount, loadDemoData, clearData, updateSettings,
    setIncome, setRules,
    addGroup, updateGroup, deleteGroup,
    addItem, updateItem, deleteItem,
    addSubitem, updateSubitem, deleteSubitem,
    addTransaction, updateTransaction, deleteTransaction,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export const useAppStore = () => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore precisa estar dentro de <AppStoreProvider>");
  return ctx;
};
