import { useCallback, useMemo, useState } from "react";
import { AppStoreProvider, useAppStore } from "./state/AppStore";
import LayoutBase from "./components/LayoutBase";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BottomNavigation from "./components/BottomNavigation";
import Toast from "./components/Toast";
import TransactionFormModal from "./components/TransactionFormModal";
import AuthScreen from "./screens/AuthScreen";
import DashboardScreen from "./screens/DashboardScreen";
import BudgetScreen from "./screens/BudgetScreen";
import ExpensesScreen from "./screens/ExpensesScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { MAIN_TABS, PROFILE_TAB } from "./navigation";
import { buildAlerts, buildBudgetSummary } from "./utils/budget";
import { buildLookup } from "./utils/tree";
import { getPeriod, isInPeriod, todayISO } from "./utils/period";

function AuthenticatedApp() {
  const store = useAppStore();
  const { account, data } = store;

  const [activeTab, setActiveTab] = useState("home");
  const [periodOffset, setPeriodOffset] = useState(0);
  const [txModal, setTxModal] = useState(null); // { transaction?: object }
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => setToast({ message, type, key: Date.now() }), []);
  const closeToast = useCallback(() => setToast(null), []);

  const startDay = data.settings.periodStartDay;
  const period = useMemo(() => getPeriod(startDay, periodOffset), [startDay, periodOffset]);
  const summary = useMemo(() => buildBudgetSummary(data, period), [data, period]);
  const lookup = useMemo(() => buildLookup(data), [data]);
  const alerts = useMemo(() => buildAlerts(summary), [summary]);

  const navigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

  const today = todayISO();
  const defaultTxDate = isInPeriod(today, period) ? today : period.start;

  const handleSaveTransaction = (values) => {
    if (txModal?.transaction) {
      store.updateTransaction(txModal.transaction.id, values);
      showToast("Lançamento atualizado!");
    } else {
      store.addTransaction(values);
      showToast(
        isInPeriod(values.date, period)
          ? "Lançamento adicionado!"
          : "Lançamento adicionado em outro período.",
        isInPeriod(values.date, period) ? "success" : "info"
      );
    }
  };

  const tabInfo = [...MAIN_TABS, PROFILE_TAB].find((t) => t.id === activeTab);
  const firstName = account.name.split(" ")[0];
  const headerTitle = activeTab === "home" ? `Olá, ${firstName}` : tabInfo.title;
  const headerSubtitle =
    activeTab === "home" ? "Visão geral do seu orçamento" : activeTab === "profile" ? account.email : period.label;

  const periodProps = { period, onChangePeriod: setPeriodOffset };

  return (
    <LayoutBase
      sidebar={
        <Sidebar
          activeTab={activeTab}
          onTabChange={navigate}
          onComingSoon={(label) => showToast(`"${label}" chega em uma próxima versão do Finance Balance.`, "info")}
          account={account}
          onSignOut={store.signOut}
        />
      }
      header={
        <Header
          account={account}
          title={headerTitle}
          subtitle={headerSubtitle}
          alerts={alerts}
          onOpenProfile={() => navigate("profile")}
        />
      }
      bottomNav={<BottomNavigation activeTab={activeTab} onTabChange={navigate} />}
    >
      {activeTab === "home" && (
        <DashboardScreen
          {...periodProps}
          summary={summary}
          lookup={lookup}
          onNavigate={navigate}
          onAddTransaction={() => setTxModal({})}
          onEditTransaction={(transaction) => setTxModal({ transaction })}
        />
      )}

      {activeTab === "budget" && (
        <BudgetScreen
          key={JSON.stringify(data.budget.rules.map((r) => r.id))}
          income={data.budget.income}
          rules={data.budget.rules}
          summary={summary}
          onSaveIncome={store.setIncome}
          onSaveRules={store.setRules}
          onShowToast={showToast}
        />
      )}

      {activeTab === "expenses" && (
        <ExpensesScreen
          {...periodProps}
          summary={summary}
          rules={data.budget.rules}
          transactions={data.transactions}
          onShowToast={showToast}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsScreen
          {...periodProps}
          summary={summary}
          lookup={lookup}
          onAdd={() => setTxModal({})}
          onEdit={(transaction) => setTxModal({ transaction })}
        />
      )}

      {activeTab === "profile" && <ProfileScreen key={startDay} onShowToast={showToast} />}

      {txModal && (
        <TransactionFormModal
          groups={data.groups}
          transaction={txModal.transaction}
          defaultDate={defaultTxDate}
          onSave={handleSaveTransaction}
          onDelete={() => {
            store.deleteTransaction(txModal.transaction.id);
            showToast("Lançamento excluído.", "info");
          }}
          onClose={() => setTxModal(null)}
        />
      )}

      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={closeToast} />}
    </LayoutBase>
  );
}

function Root() {
  const { account } = useAppStore();
  if (!account) return <AuthScreen />;
  return <AuthenticatedApp key={account.id} />;
}

export default function App() {
  return (
    <AppStoreProvider>
      <Root />
    </AppStoreProvider>
  );
}
