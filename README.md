# Finance Balance (Web MVP)

Protótipo navegável do aplicativo de finanças pessoais **Finance Balance**, focado em validação de experiência do usuário (UX/UI).

## 🚀 Stack Tecnológica

* **Framework:** React 19
* **Build Tool:** Vite
* **Estilização:** Tailwind CSS v4
* **Ícones:** Lucide React
* **Tipografia:** Plus Jakarta Sans

## 📱 Telas Desenvolvidas

Protótipo navegável **sem back-end**: contas e dados ficam salvos no `localStorage` do navegador. Layout responsivo — navegação inferior no celular e sidebar a partir de 1024px.

1. **Login / Cadastro:** criação de conta, login e acesso rápido com conta de demonstração (dados de exemplo).
2. **Visão Geral (Dashboard):**
   * Disponível no período (renda − realizado), com renda, previsto e realizado.
   * Alocação por regra percentual (teto × previsto × realizado).
   * Desvios do período e projeção de fechamento.
   * Gastos por grupo (gráfico de rosca), gastos dos últimos 7 dias e últimos lançamentos.
3. **Orçamento & Regras:** renda base e regras percentuais customizáveis (devem somar 100%), com distribuição automática da renda.
4. **Estrutura de Despesas:** CRUD em árvore de Grupos › Itens › Subitens, cada nível com previsto × realizado e desvio.
5. **Lançamentos:** registro, edição e exclusão de gastos classificados na árvore, com busca e filtro por grupo.
6. **Perfil:** dados da conta, troca de senha, dia de início do período (ciclo financeiro definido pelo usuário) e gestão dos dados do protótipo.

Os módulos **Metas** e **Investir** (simulador com API externa) aparecem como "em breve" e estão fora do escopo deste MVP.

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
