# Finance Balance (Web MVP)

Protótipo navegável do aplicativo de finanças pessoais **Finance Balance**, focado em validação de experiência do usuário (UX/UI).

## 🚀 Stack Tecnológica

* **Framework:** React 19
* **Build Tool:** Vite
* **Estilização:** Tailwind CSS v4
* **Ícones:** Lucide React
* **Tipografia:** Plus Jakarta Sans

## 📱 Telas Desenvolvidas

1. **Início / Dashboard:**
   * Card de saldo total com toggle de visibilidade e rendimento CDI.
   * Ações rápidas (*Pix*, *Pagar*, *Guardar*, *Fatura*) com modais interativos.
   * Widget de cartão com limite disponível e atalho rápido.
   * Resumo semanal em gráfico SVG com legenda para Débito & Pix e Crédito.
   * Extrato dos últimos lançamentos.

2. **Carteira de Cartões:**
   * Alternador entre cartão virtual (Black) e físico (Platinum).
   * Mockup do cartão com número mascarado, botão de copiar e validação de segurança.
   * Ações rápidas: Bloquear/Desbloquear, Ver CVV e Ajustar Limite com slider interativo.
   * Card de fatura com status e pagamento interativo.
   * Histórico filtrado de compras no cartão.

3. **Relatórios & Orçamento:**
   * Navegador mensal e filtros de categoria.
   * Resumo de gastos, economia do mês e média diária.
   * Gráfico de rosca (*Donut Chart*) em SVG interativo por categoria.
   * Card de IA com dicas financeiras personalizadas.
   * Detalhamento de metas e tetos de gastos com barras de progresso.

## 🛠️ Como Executar

### Pré-requisitos
* Node.js (v18+)
* npm

### Instalação e Execução

```bash
# Rodar em modo de desenvolvimento
npm run dev

# Rodar o linter
npm run lint

# Gerar build de produção
npm run build
```
