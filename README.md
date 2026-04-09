# Hermes Control - Gestão de Controle de Mudanças (RFC)

Sistema full-stack para gestão de mudanças corporativas, inspirado no SoftExpert Change Control, construído com **NestJS**, **React** e **Firebase**.

## 🚀 Funcionalidades Principais

- **Ciclo de Vida RFC**: Rascunho, Avaliação, Aprovação CAB, Implementação e Fechamento.
- **Multi-tenancy**: Isolamento total de dados por tenant via Firestore Security Rules.
- **Auditoria**: Log automático de todas as ações de escrita e alteração de status.
- **Dashboard Real-time**: Gráficos dinâmicos que atualizam sem refresh de página.
- **Design Premium**: Interface moderna com Glassmorphism, Tailwind CSS e animações fluidas.

## 🛠️ Tecnologias

- **Backend**: NestJS, Firebase Admin SDK, Swagger, Zod.
- **Frontend**: React (Vite), Firebase SDK, Tailwind CSS, Lucide Icons, Recharts, React Hook Form.
- **Banco de Dados**: Google Cloud Firestore (NoSQL).
- **Auth**: Firebase Authentication (Baseado em JWT/Identity Platform).

## ⚙️ Configuração Local

### 1. Pré-requisitos
- Node.js v18+
- Projeto no Firebase Console (Firestore, Auth e Storage ativados).

### 2. Backend
```bash
cd backend
npm install
# 1. Crie um arquivo .env (veja .env.example)
# 2. Para produção, coloque o json da conta de serviço em: 
#    backend/firebase-adminsdk.json
npm run start:dev
```

### 3. Frontend
```bash
cd frontend
npm install
# Configure as variáveis VITE_FIREBASE_* no seu .env
npm run dev
```

### 4. Deploy de Regras
Copie o conteúdo de `firestore.rules` para a aba "Rules" do seu console Firestore.

## 📝 Documentação da API
Após iniciar o backend, acesse `http://localhost:3000/api` para visualizar o Swagger UI.

---
Desenvolvido com foco em conformidade e UX Premium.
