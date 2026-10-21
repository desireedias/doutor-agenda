<div align="center">

# 🩺 Doutor Agenda

**Gestão de clínicas simplificada: médicos, pacientes, agendamentos e métricas em um só lugar.**

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

<!-- 🔗 Adicione aqui o link do deploy: [Ver demonstração](https://seu-link.vercel.app) -->

</div>

---

## 📖 Sobre o projeto

O **Doutor Agenda** é uma aplicação **SaaS full stack** para gestão de clínicas médicas. Cada clínica tem seu próprio espaço, com cadastro de médicos e pacientes, agendamento de consultas com controle de horários disponíveis e um dashboard com os principais indicadores do negócio.

O acesso é feito por assinatura recorrente (Stripe) e a autenticação aceita login com Google ou e-mail e senha.

> Projeto desenvolvido durante o bootcamp **Full Stack Club**.

<!-- 📸 Adicione aqui capturas de tela do dashboard, da agenda e da lista de médicos -->

## ✨ Funcionalidades

- **Autenticação** com Google e e-mail/senha ([Better Auth](https://www.better-auth.com/))
- **Assinatura recorrente** com Stripe: checkout, webhook e portal do cliente
- **Onboarding guiado:** login, escolha do plano e cadastro da clínica
- **Médicos:** cadastro e edição com especialidade, valor da consulta e disponibilidade (dias da semana e horários)
- **Pacientes:** cadastro, edição e exclusão
- **Agendamentos:** seleção de data e horário mostrando só os horários livres do médico, com validação também no servidor
- **Dashboard** com filtro por período:
  - receita, total de consultas, pacientes e médicos
  - gráfico de consultas e faturamento por dia
  - ranking de médicos e de especialidades
  - agendamentos do dia
- **Multi-clínica:** os dados são isolados por clínica

## 🛠️ Tecnologias

| Área | Tecnologias |
| --- | --- |
| **Framework** | Next.js 15 (App Router), React 19 |
| **Linguagem** | TypeScript |
| **Banco de dados** | PostgreSQL (Neon), Drizzle ORM |
| **Autenticação** | Better Auth (Google OAuth e e-mail/senha) |
| **Pagamentos** | Stripe (Checkout, Webhooks, Customer Portal) |
| **Validação e formulários** | Zod, React Hook Form, next-safe-action |
| **Interface** | Tailwind CSS 4, shadcn/ui, Lucide |
| **Dados e gráficos** | TanStack Query, TanStack Table, Recharts |
| **Datas** | dayjs, date-fns, react-day-picker |
| **Qualidade** | ESLint, Prettier |

## 🧠 Decisões de arquitetura

- **Server Components e Server Actions:** os dados são buscados no servidor e as mutações usam actions validadas com Zod (`next-safe-action`), sem precisar de rotas de API para o CRUD.
- **Sessão customizada:** o plugin `customSession` do Better Auth adiciona o plano e a clínica do usuário à sessão, o que simplifica as regras de redirecionamento.
- **Rotas protegidas no servidor:** o layout da área logada redireciona quem não está autenticado ou não tem plano ativo.
- **Isolamento por clínica:** toda tabela de negócio tem `clinicId`, e as consultas filtram pela clínica da sessão.
- **Valores em centavos:** os preços são armazenados como inteiros para evitar erros de arredondamento.
- **Horários em UTC:** a disponibilidade dos médicos é guardada em UTC e convertida para o fuso local na exibição.
- **Dashboard em paralelo:** as consultas de métricas rodam com `Promise.all`, e as agregações são feitas no banco.
- **Webhook seguro:** a assinatura do evento é validada com `constructEvent`, e o `userId` viaja nos metadata da assinatura para vincular o pagamento ao usuário.

## 🗂️ Estrutura do projeto

```
src/
├── actions/        # Server Actions (médicos, pacientes, agendamentos, Stripe, clínica)
├── app/
│   ├── (protected)/   # Área logada: dashboard, médicos, pacientes, agendamentos, assinatura
│   ├── api/           # Rotas de auth (Better Auth) e webhook do Stripe
│   ├── authentication/  # Login e cadastro
│   ├── new-subscription/ # Primeiros passos
│   └── plans/         # Planos
├── components/ui/  # Componentes de interface (shadcn/ui)
├── data/           # Consultas ao banco reutilizáveis (ex.: get-dashboard)
├── db/             # Conexão e schema do Drizzle
├── helpers/        # Utilitários (moeda, horários)
├── hooks/
├── lib/            # Configuração de auth e safe-action
└── providers/      # React Query
```

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Um banco PostgreSQL (o projeto usa o [Neon](https://neon.tech/))
- Credenciais OAuth do [Google Cloud](https://console.cloud.google.com/)
- Conta no [Stripe](https://stripe.com/) e a [Stripe CLI](https://docs.stripe.com/stripe-cli)

### Passo a passo

1. **Clone o repositório e instale as dependências**

   ```bash
   git clone https://github.com/SEU-USUARIO/doutor-agenda.git
   cd doutor-agenda
   npm install
   ```

2. **Configure as variáveis de ambiente.** Crie um arquivo `.env` na raiz:

   ```env
   # Banco de dados
   DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"

   # Better Auth (recomendado definir um segredo)
   BETTER_AUTH_SECRET="gere-um-valor-aleatorio"

   # Google OAuth
   GOOGLE_CLIENT_ID="seu-client-id"
   GOOGLE_CLIENT_SECRET="seu-client-secret"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_ESSENTIAL_PLAN_PRICE_ID="price_..."
   NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL="https://billing.stripe.com/p/login/..."

   # URL da aplicação
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Crie as tabelas no banco**

   ```bash
   npx drizzle-kit push
   ```

4. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

5. **Escute os webhooks do Stripe** (em outro terminal)

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

   Copie o segredo `whsec_...` exibido para a variável `STRIPE_WEBHOOK_SECRET`.

### Configuração do Google OAuth

No Google Cloud Console, crie uma credencial **OAuth 2.0** e adicione a URI de redirecionamento autorizada:

```
http://localhost:3000/api/auth/callback/google
```

### Eventos do Stripe utilizados

| Evento | O que faz |
| --- | --- |
| `invoice.paid` | Ativa o plano do usuário e salva os IDs de cliente e assinatura |
| `customer.subscription.deleted` | Remove o plano e os IDs do usuário |


## 🗺️ Próximos passos

- [ ] Permitir que um usuário gerencie mais de uma clínica
- [ ] Cache da sessão customizada
- [ ] Testes automatizados
- [ ] Confirmação e cancelamento de consultas

## 👩‍💻 Autora

**Desireé Dias**, desenvolvedora Full Stack.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/desireedias)

---

<div align="center">

Feito com 💙 durante o bootcamp Full Stack Club.

</div>
