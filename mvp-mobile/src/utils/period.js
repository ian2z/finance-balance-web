// Períodos de orçamento definidos pelo usuário: um ciclo mensal que começa no
// "dia de início" escolhido no perfil (ex.: dia do salário). Datas trafegam como
// strings "AAAA-MM-DD" no fuso local para evitar deslocamentos de UTC.

const MONTHS_LONG = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const toISODate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const parseISODate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayISO = () => toISODate(new Date());

export const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

// offset 0 = período atual, -1 = anterior, +1 = próximo.
export const getPeriod = (startDay = 1, offset = 0, reference = new Date()) => {
  const day = Math.min(Math.max(Number(startDay) || 1, 1), 28);
  let year = reference.getFullYear();
  let month = reference.getMonth();
  if (reference.getDate() < day) month -= 1;
  month += offset;

  const start = new Date(year, month, day);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, day - 1);
  year = start.getFullYear();

  const label =
    day === 1
      ? `${MONTHS_LONG[start.getMonth()]} ${year}`
      : `${String(start.getDate()).padStart(2, "0")} ${MONTHS_SHORT[start.getMonth()]} – ${String(end.getDate()).padStart(2, "0")} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;

  const totalDays = Math.round((end - start) / 86400000) + 1;
  const todayStart = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  let elapsedDays;
  if (todayStart < start) elapsedDays = 0;
  else if (todayStart > end) elapsedDays = totalDays;
  else elapsedDays = Math.round((todayStart - start) / 86400000) + 1;

  return {
    offset,
    start: toISODate(start),
    end: toISODate(end),
    label,
    totalDays,
    elapsedDays,
    isCurrent: offset === 0,
  };
};

export const isInPeriod = (isoDate, period) => isoDate >= period.start && isoDate <= period.end;
