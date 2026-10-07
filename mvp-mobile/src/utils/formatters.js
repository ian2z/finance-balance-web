export const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatPercent = (value, showSign = true) => {
  if (value === undefined || value === null || !Number.isFinite(value)) return "0%";
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
};

// Converte texto digitado no padrão brasileiro ("1.234,56", "1234.5", "R$ 80") em número.
// Retorna null quando o texto não representa um valor válido.
export const parseMoney = (raw) => {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  let text = String(raw).replace(/[R$\s]/g, "");
  if (!text) return null;
  if (text.includes(",")) {
    text = text.replace(/\./g, "").replace(",", ".");
  }
  if (!/^-?\d+(\.\d+)?$/.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
};

// Valor numérico -> texto editável no padrão brasileiro ("1234,5" -> "1.234,50").
export const toMoneyInput = (value) => {
  if (value === undefined || value === null || value === "") return "";
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const formatShortDate = (date) =>
  `${String(date.getDate()).padStart(2, "0")} ${MONTHS_SHORT[date.getMonth()]}`;

export const formatTransactionDate = (isoDate, today = new Date()) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((startToday - date) / 86400000);
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `${formatShortDate(date)}${y !== today.getFullYear() ? ` ${y}` : ""}`;
};
