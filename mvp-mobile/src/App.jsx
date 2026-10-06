import { useState } from "react";
import { mockData } from "./data/mockData";
import LayoutBase from "./components/LayoutBase";
import Header from "./components/Header";
import BottomNavigation from "./components/BottomNavigation";
import Toast from "./components/Toast";
import QuickActionModal from "./components/QuickActionModal";
import LimitAdjustmentModal from "./components/LimitAdjustmentModal";
import DashboardScreen from "./screens/DashboardScreen";
import CardsScreen from "./screens/CardsScreen";
import ReportsScreen from "./screens/ReportsScreen";

const generateTxId = () => `tx_${Math.random().toString(36).substring(2, 9)}`;

export default function App() {
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'cards' | 'reports'
  const [userData, setUserData] = useState(mockData.user);
  const [cardsData, setCardsData] = useState(mockData.cards);
  const [transactionsData, setTransactionsData] = useState(mockData.transactions);
  const budgetData = mockData.budget;

  // Modals & Feedback State
  const [quickActionType, setQuickActionType] = useState(null);
  const [editingLimitCard, setEditingLimitCard] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Quick Action Handler (Pix, Pagar, Guardar, Fatura)
  const handleQuickActionConfirm = (type, rawAmount) => {
    const numericAmount = parseFloat(
      String(rawAmount).replace(/\./g, "").replace(",", ".")
    ) || 100;

    const newId = generateTxId();

    if (type === "pix") {
      setUserData((prev) => ({
        ...prev,
        totalBalance: Math.max(0, prev.totalBalance - numericAmount),
      }));
      const newTx = {
        id: newId,
        title: "Transferência Pix Enviada",
        category: "Transferência",
        amount: -numericAmount,
        type: "Pix",
        cardId: null,
        dateFormatted: "Agora mesmo",
        dateIso: "2024-10-20T15:00:00",
        status: "Concluído",
      };
      setTransactionsData((prev) => [newTx, ...prev]);
      showToast(`Pix de R$ ${numericAmount.toFixed(2)} enviado!`, "success");
    } else if (type === "pagar") {
      setUserData((prev) => ({
        ...prev,
        totalBalance: Math.max(0, prev.totalBalance - numericAmount),
      }));
      const newTx = {
        id: newId,
        title: "Pagamento de Conta / Boleto",
        category: "Moradia & Contas",
        amount: -numericAmount,
        type: "Débito",
        cardId: null,
        dateFormatted: "Agora mesmo",
        dateIso: "2024-10-20T15:00:00",
        status: "Concluído",
      };
      setTransactionsData((prev) => [newTx, ...prev]);
      showToast(`Pagamento de R$ ${numericAmount.toFixed(2)} confirmado!`, "success");
    } else if (type === "guardar") {
      setUserData((prev) => ({
        ...prev,
        totalBalance: Math.max(0, prev.totalBalance - numericAmount),
        yieldAmount: prev.yieldAmount + numericAmount * 0.01,
      }));
      showToast(
        `R$ ${numericAmount.toFixed(2)} guardados rendendo a 102% CDI!`,
        "success"
      );
    } else if (type === "fatura") {
      handlePayInvoice(cardsData[0]);
    }
  };

  // Pay Invoice Handler
  const handlePayInvoice = (card) => {
    if (!card) return;
    const invoiceVal = card.invoiceCurrent;

    if (invoiceVal <= 0) {
      showToast("Esta fatura já se encontra liquidada!", "info");
      return;
    }

    setCardsData((prev) =>
      prev.map((c) =>
        c.id === card.id
          ? {
              ...c,
              invoiceCurrent: 0,
              invoiceStatus: "Paga",
              limitAvailable: c.limitTotal,
              limitUsed: 0,
            }
          : c
      )
    );

    setUserData((prev) => ({
      ...prev,
      totalBalance: Math.max(0, prev.totalBalance - invoiceVal),
    }));

    const newTx = {
      id: generateTxId(),
      title: `Pagamento de Fatura ${card.brand} ${card.variant}`,
      category: "Cartão",
      amount: -invoiceVal,
      type: "Débito",
      cardId: card.id,
      dateFormatted: "Hoje",
      dateIso: "2024-10-20T15:00:00",
      status: "Concluído",
    };

    setTransactionsData((prev) => [newTx, ...prev]);
    showToast(`Fatura de R$ ${invoiceVal.toFixed(2)} paga com sucesso!`, "success");
  };

  // Adjust Limit Handler
  const handleSaveLimit = (cardId, newLimit) => {
    setCardsData((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              limitTotal: newLimit,
              limitAvailable: Math.max(0, newLimit - c.limitUsed),
            }
          : c
      )
    );
    showToast("Limite atualizado com sucesso!", "success");
  };

  // Dynamic Header titles
  const getHeaderInfo = () => {
    switch (activeTab) {
      case "cards":
        return {
          title: "Meus Cartões",
          subtitle: "Gestão & Limites",
        };
      case "reports":
        return {
          title: "Gastos & Orçamento",
          subtitle: budgetData.month,
        };
      default:
        return {
          title: `Olá, ${userData.shortName}`,
          subtitle: "Bem-vindo de volta",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <LayoutBase>
      {/* Dynamic Header */}
      <Header
        user={userData}
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        showBack={activeTab !== "home"}
        onBack={() => setActiveTab("home")}
      />

      {/* Screen Views */}
      <main className="flex-1">
        {activeTab === "home" && (
          <DashboardScreen
            user={userData}
            cards={cardsData}
            transactions={transactionsData}
            weeklyExpenses={mockData.weeklyExpenses}
            onNavigateToCards={() => setActiveTab("cards")}
            onQuickAction={(type) => setQuickActionType(type)}
            onSelectTransaction={(tx) =>
              showToast(`Detalhes de "${tx.title}" selecionados.`, "info")
            }
          />
        )}

        {activeTab === "cards" && (
          <CardsScreen
            cards={cardsData}
            transactions={transactionsData}
            onAdjustLimit={(card) => setEditingLimitCard(card)}
            onPayInvoice={handlePayInvoice}
            onShowToast={showToast}
          />
        )}

        {activeTab === "reports" && (
          <ReportsScreen
            budget={budgetData}
            onSelectCategory={(cat) =>
              showToast(`Categoria ${cat.name} em foco`, "info")
            }
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
        onComingSoon={(label) =>
          showToast(`Funcionalidade "${label}" em breve no Finance Balance!`, "info")
        }
      />

      {/* Quick Action Modal */}
      {quickActionType && (
        <QuickActionModal
          type={quickActionType}
          onClose={() => setQuickActionType(null)}
          onConfirm={handleQuickActionConfirm}
        />
      )}

      {/* Limit Adjustment Modal */}
      {editingLimitCard && (
        <LimitAdjustmentModal
          card={editingLimitCard}
          onClose={() => setEditingLimitCard(null)}
          onSave={handleSaveLimit}
        />
      )}

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </LayoutBase>
  );
}
