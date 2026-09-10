# PawCare 🐾 - Mobile Application

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6oXxJ3IU)

<p align="center">
  <img src="https://img.icons8.com/color/120/000000/dog.png" alt="PawCare Logo" width="120px" style="border-radius: 20%;" />
</p>

<h1 align="center">PawCare 🐾</h1>

<p align="center">
  <strong>O gerenciamento completo, inteligente e sofisticado da saúde, vacinação e bem-estar do seu animal de estimação.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Navigation-6B52AE?style=for-the-badge&logo=react&logoColor=white" alt="React Navigation" />
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

---

## 📋 Sobre a Solução (Sprint 3 - Consolidação Técnica)

O **PawCare** é um ecossistema mobile projetado para tutores e cuidadores que buscam centralizar, organizar e gerenciar a rotina médica e os cuidados diários de seus pets. 

Nesta **3ª Sprint**, a solução atingiu maturidade técnica profissional, implementando:
1. **Arquitetura em Camadas Estrita:** Desacoplamento total entre Views, Lógica de Negócio (Hooks) e Camada de Rede (Services).
2. **Navegação com React Navigation:** Roteamento explícito com Stack e Bottom Tabs dinâmicas e tipadas, com proteção de rotas nativa.
3. **Autenticação Real (Firebase Auth REST):** Cadastro e login integrados com persistência de sessão offline via `AsyncStorage` e fluxo de logout funcional.
4. **Integração Real com Backend (Firebase Realtime Database):** Consumo HTTP 100% real através de **Axios** e **TanStack Query** (`useQuery`, `useMutation`, `invalidateQueries`), com atualização instantânea da interface e zero dados mockados.
5. **Dois CRUDs Completos na Interface:** Gerenciamento total de **Pets** e **Carteira de Vacinas** (Create, Read, Update, Delete).

---

## 👥 Integrantes do Grupo
* **Thomas Fontes** - RM 562254
* **Gabriel Maciel** - RM 562795
* **Vitória Rodrigues** - RM 565160
* **Augusto Bonomo** - RM 565155
* **Matheus Molina** - RM 563399

---

## 🎥 Link para o Vídeo de Demonstração (Sprint 3)
> **[Clique aqui para assistir ao vídeo no YouTube]([INSERIR_LINK_DO_VIDEO_AQUI])**

---

## 🛠️ Tecnologias e Bibliotecas Utilizadas
* **React Native (0.81.5) & Expo SDK 54**: Base híbrida estável e de alto desempenho.
* **TypeScript (5.9.2)**: Tipagem estática rigorosa em toda a aplicação.
* **React Navigation (Native, Stack & Bottom Tabs)**: Navegação oficial com rotas declaradas e tipadas.
* **TanStack Query (v5)**: Gerenciamento reativo de estado de servidor, cacheamento inteligente e invalidação automática de mutações.
* **Axios (1.8.1)**: Cliente HTTP para comunicação REST com o Firebase.
* **Firebase Authentication (REST)**: Serviço externo e seguro para autenticação de tutores.
* **Firebase Realtime Database (REST)**: Banco de dados em nuvem 100% online 24/7 para persistência de dados.
* **AsyncStorage**: Persistência da sessão do usuário autenticado no dispositivo.
* **Ionicons (Expo Vector Icons)**: Ícones vetoriais dinâmicos de alta fidelidade.

---

## 🏛️ Arquitetura do Software em Camadas

O PawCare adota o padrão de separação de responsabilidades em camadas, eliminando qualquer lógica de negócio ou chamadas de rede das Views:

```text
PawCare/
├── App.tsx                    # Entry point com QueryClientProvider e NavigationContainer
├── index.ts                   # Registro oficial do componente raiz no Expo
├── entrega.txt                # Arquivo de entrega oficial (padrão FIAP)
├── src/
│   ├── config/
│   │   └── firebase.ts        # Credenciais e endpoints oficiais da API Firebase
│   ├── types/
│   │   ├── auth.ts            # Tipagens e interfaces de sessão do usuário
│   │   ├── pet.ts             # Tipagens de Pet e PetPayload
│   │   └── vaccine.ts         # Tipagens de Vacina e VaccinePayload
│   ├── services/
│   │   ├── api.ts             # Instância do Axios para o Realtime Database
│   │   ├── authService.ts     # Login, Cadastro e AsyncStorage (sessão)
│   │   ├── petService.ts      # Operações HTTP REST (GET, POST, PUT, DELETE) de Pets
│   │   └── vaccineService.ts  # Operações HTTP REST (GET, POST, PUT, DELETE) de Vacinas
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexto global com estado de sessão autenticada
│   ├── hooks/
│   │   ├── useAuth.ts         # Hook para acesso a login, registro, usuário e logout
│   │   ├── usePets.ts         # TanStack useQuery e useMutation para CRUD de Pets
│   │   └── useVaccines.ts     # TanStack useQuery e useMutation para CRUD de Vacinas
│   ├── components/
│   │   ├── CustomInput.tsx    # Input reutilizável com tratamento de erros
│   │   ├── CustomButton.tsx   # Botão estilizado com suporte a loading (isPending)
│   │   ├── Loader.tsx         # Indicador de carregamento padronizado
│   │   ├── PetModal.tsx       # Modal de criação e edição completa de Pets
│   │   └── VaccineModal.tsx   # Modal de criação e edição com status tripartite
│   ├── theme/
│   │   └── Colors.ts          # Design System e tokens de cores oficiais
│   ├── routes/
│   │   ├── index.tsx          # Proteção de rotas (chaveia AuthRoutes vs AppRoutes)
│   │   ├── AuthRoutes.tsx     # Stack de telas públicas (Login e Cadastro)
│   │   └── AppRoutes.tsx      # Bottom Tabs protegidas com as 6 telas
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.tsx       # Tela de Login com autenticação Firebase
│       │   └── RegisterScreen.tsx    # Tela de Cadastro de novos usuários
│       └── app/
│           ├── HomeScreen.tsx        # Dashboard com dados reativos e métricas
│           ├── PetsScreen.tsx        # CRUD 1: Gestão completa de Pets
│           ├── VaccinesScreen.tsx    # CRUD 2: Gestão de Vacinas tripartite
│           ├── HistoryScreen.tsx     # Linha do tempo e registros clínicos
│           ├── SpecialistsScreen.tsx # Catálogo de veterinários credenciados
│           └── CareScreen.tsx        # Hub de rotinas e cuidados de bem-estar
```

---

## 🔗 Integração com o Backend (Firebase REST API)

* **Autenticação Externa:**
  * Endpoint Sign-Up: `https://identitytoolkit.googleapis.com/v1/accounts:signUp`
  * Endpoint Sign-In: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`
* **Realtime Database (Armazenamento em Nuvem):**
  * Base URL: `https://pawcare-1db6c-default-rtdb.firebaseio.com/`
  * Pets: `/users/{userId}/pets.json` (GET, POST, PUT, DELETE)
  * Vacinas: `/users/{userId}/vaccines.json` (GET, POST, PUT, DELETE)

---

## 📱 Telas Desenvolvidas (Total: 8 Telas)

1. **Login (`LoginScreen`):** Acesso com e-mail/senha integrado ao Firebase com tratamento de erros e loading.
2. **Cadastro (`RegisterScreen`):** Registro de novo usuário com validação de senha e persistência no AsyncStorage.
3. **Dashboard (`HomeScreen`):** Resumo numérico em tempo real (pets, vacinas pendentes, vacinas aplicadas) e destaque do pet ativo.
4. **Gerenciador de Pets (`PetsScreen` - CRUD 1):** Listagem, inclusão, edição e exclusão de pets com atualização imediata de interface via `invalidateQueries`.
5. **Carteira de Vacinas (`VaccinesScreen` - CRUD 2):** Controle de imunização com filtros e status tripartite (Aplicada 🟢, Pendente 🟡, Atrasada 🔴), inclusão, edição e remoção.
6. **Histórico Clínico (`HistoryScreen`):** Timeline cronológica com registros de check-ups, exames e custos.
7. **Guia de Especialistas (`SpecialistsScreen`):** Catálogo de clínicas parceiras com status de disponibilidade e contato.
8. **Central de Cuidados (`CareScreen`):** Recomendações personalizadas de nutrição, higiene e prevenção.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (versão 18.x ou superior)
* Gerenciador de pacotes **npm**
* Aplicativo **Expo Go** instalado no smartphone físico (iOS ou Android)

### Passos:
1. Clone o repositório:
   ```bash
   git clone https://github.com/AntonioCarvalhoFIAP/challenge-1-thomasmfontes.git
   cd PawCare
   ```
2. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Inicie o servidor Expo:
   ```bash
   npx expo start
   ```
4. Escaneie o QR Code exibido no terminal utilizando o aplicativo **Expo Go** (Android) ou a câmera nativa (iOS).