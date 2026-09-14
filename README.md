# PawCare 🐾 - Mobile Application

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6oXxJ3IU)

<p align="center">
  <img src="https://img.icons8.com/color/120/000000/dog.png" alt="PawCare Logo" width="120px" style="border-radius: 20%;" />
</p>

<h1 align="center">PawCare 🐾</h1>

<p align="center">
  <strong>O ecossistema inteligente, moderno e completo para o gerenciamento da saúde, rotina médica, imunização e bem-estar do seu pet.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.86.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_SDK-57.0-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Navigation-6.x-6B52AE?style=for-the-badge&logo=react&logoColor=white" alt="React Navigation" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Firebase-REST_API-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

---

## 👥 Integrantes do Grupo
* **Thomas Fontes** - RM 562254
* **Gabriel Maciel** - RM 562795
* **Vitória Rodrigues** - RM 565160
* **Augusto Bonomo** - RM 565155
* **Matheus Molina** - RM 563399

---

## 🎥 Link para o Vídeo de Demonstração (Sprint 3)
> **[Clique aqui para assistir ao vídeo no YouTube](https://youtu.be/XCqrmXJfXec?si=MtY9EM8bCtT9PeAC)**

*(Vídeo narrado com duração máxima de 5 minutos demonstrando navegação, fluxo de autenticação e os dois CRUDs com dados reais em execução).*

---

## 🎯 Matriz de Atendimento aos Critérios Avaliativos (Sprint 3 - 100 Pontos)

| Critério do Edital | Pontos | Implementação no PawCare | Arquivos de Referência |
| :--- | :---: | :--- | :--- |
| **1. Navegação entre Telas** | **5 pts** | **8 telas distintas** (mínimo exigido: 6); uso de `@react-navigation/native`, `@react-navigation/stack` e `@react-navigation/bottom-tabs`; rotas tipadas com TypeScript sem substituição manual por condicionais/useState. | `src/routes/AppRoutes.tsx`<br>`src/routes/AuthRoutes.tsx`<br>`src/routes/index.tsx` |
| **2. Integração com API Backend HTTP** | **35 pts** | Integração 100% real com **Firebase Realtime Database REST API** via **Axios**; gerenciamento de estado assíncrono com **TanStack Query (`useQuery`, `useMutation`, `invalidateQueries`)**; zero dados mockados nos fluxos de dados; estados de carregamento explícitos (`ActivityIndicator`, `Loader`). | `src/services/api.ts`<br>`src/services/petService.ts`<br>`src/services/vaccineService.ts`<br>`src/hooks/usePets.ts`<br>`src/hooks/useVaccines.ts` |
| **3. CRUDs Completos na Interface** | *(incluso em API)* | **Dois CRUDs independentes e completos (Create, Read, Update, Delete)** integrados à interface: <br>1) **CRUD de Pets** (cadastro, listagem reativa, edição completa e exclusão com alerta).<br>2) **CRUD de Vacinas** (registro de imunização, filtros por status, edição e exclusão). | `src/screens/app/PetsScreen.tsx`<br>`src/screens/app/VaccinesScreen.tsx`<br>`src/components/PetModal.tsx`<br>`src/components/VaccineModal.tsx` |
| **4. Sistema de Autenticação (Login)** | **20 pts** | Autenticação real com **Firebase Authentication REST API** (signUp e signInWithPassword); validação de formulários; **persistência offline com AsyncStorage** (mantém a sessão ao fechar e reabrir o app); **proteção estrita de rotas**; **logout funcional** com bloqueio imediato. | `src/services/authService.ts`<br>`src/contexts/AuthContext.tsx`<br>`src/screens/auth/LoginScreen.tsx`<br>`src/screens/auth/RegisterScreen.tsx` |
| **5. Arquitetura e Organização** | **20 pts** | **Separação estrita de responsabilidades em camadas**:<br>• **Interface:** `screens/` e `components/`<br>• **Regra de Negócio / Hooks:** `hooks/`<br>• **Acesso a Dados / Network:** `services/`<br>• **Contextos Globais:** `contexts/`<br>Zero chamadas HTTP dentro dos componentes de tela; tipagem TypeScript 100% estrita sem erros de compilação. | `src/` (arquitetura modular em camadas) |
| **6. Documentação e Apresentação** | **20 pts** | README detalhado com descrição da solução, tecnologias, instruções de execução e link do vídeo narrado de até 5 minutos no YouTube. | `README.md`<br>`entrega.txt` |

---

## 📋 Sobre a Solução

O **PawCare** é um aplicativo mobile desenvolvido para suprir uma das maiores dores dos tutores modernos: a fragmentação das informações de saúde de seus animais de estimação. Frequentemente, carteirinhas de papel são perdidas, prazos de doses de reforço de vacinas são esquecidos e históricos médicos ficam espalhados entre diferentes clínicas.

O aplicativo resolve esse problema entregando:
1. **Centralização de Pets:** Cadastro individual com identificação completa (nome, raça, idade, peso, pelagem e microchip).
2. **Carteira Digital de Vacinação:** Controle das doses com status tripartite inteligente (**Aplicada** 🟢, **Pendente** 🟡 e **Atrasada** 🔴) e data da próxima aplicação.
3. **Dashboard Proativo:** Resumo instantâneo na Home com contadores em tempo real e destaque do pet ativo.
4. **Histórico Clínico e Guias:** Linha do tempo de consultas/exames e hub de recomendações preventivas.

---

## 🛠️ Tecnologias e Bibliotecas Utilizadas

* **React Native (0.86.3) & Expo SDK 57**: Plataforma base móvel com nova arquitetura habilitada.
* **TypeScript (~6.0.3)**: Tipagem estática rigorosa para contratos de API, navegação e componentes.
* **React 19 (19.2.3)**: Biblioteca reativa fundamental.
* **React Navigation (v6)**:
  * `@react-navigation/native`
  * `@react-navigation/stack` (rotas públicas de autenticação)
  * `@react-navigation/bottom-tabs` (rotas protegidas do app)
* **TanStack Query (v5.67.1)**: Gerenciamento inteligente de cache, sincronização de servidor em tempo real e mutações com invalidação atômica de queries.
* **Axios (1.8.1)**: Cliente HTTP para consumo dos serviços REST.
* **Firebase Authentication (REST API)**: Serviço externo e seguro para gerenciamento de contas de tutores.
* **Firebase Realtime Database (REST API)**: Banco de dados em nuvem estruturado em JSON com persistência 24/7.
* **AsyncStorage (2.2.0)**: Persistência local criptografada para token e sessão do usuário.
* **Ionicons (Expo Vector Icons 15.0)**: Iconografia padronizada e moderna.

---

## 🏛️ Arquitetura do Software em Camadas

O PawCare foi desenvolvido sob o princípio da **responsabilidade única**, eliminando qualquer acoplamento de chamadas de rede ou regras de negócio dentro dos componentes de tela:

```text
PawCare/
├── App.tsx                    # Ponto de entrada: SafeAreaProvider, QueryClientProvider, AuthProvider, NavigationContainer
├── index.ts                   # Registro oficial do componente raiz no Expo
├── app.json                   # Configuração e plugins do Expo SDK
├── entrega.txt                # Arquivo com informações oficiais da entrega FIAP
├── src/
│   ├── config/
│   │   └── firebase.ts        # Credenciais, configurações e endpoints da REST API Firebase
│   ├── types/
│   │   ├── auth.ts            # Interfaces de sessão (AuthUser, AuthResponse)
│   │   ├── pet.ts             # Modelos de dados e payloads de Pets
│   │   └── vaccine.ts         # Modelos de dados e payloads de Vacinas
│   ├── services/
│   │   ├── api.ts             # Instância configurada do Axios com baseURL do Firebase
│   │   ├── authService.ts     # Chamadas REST de Login, Registro e persistência com AsyncStorage
│   │   ├── petService.ts      # Camada HTTP REST (GET, POST, PUT, DELETE) de Pets
│   │   └── vaccineService.ts  # Camada HTTP REST (GET, POST, PUT, DELETE) de Vacinas
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexto global que gerencia o estado da sessão e restauração offline
│   ├── hooks/
│   │   ├── useAuth.ts         # Hook de consumo do contexto de autenticação
│   │   ├── usePets.ts         # Hook TanStack Query: useQuery e useMutation do CRUD de Pets
│   │   └── useVaccines.ts     # Hook TanStack Query: useQuery e useMutation do CRUD de Vacinas
│   ├── components/
│   │   ├── CustomInput.tsx    # Input controlado com suporte a ícones e tratamento de erros
│   │   ├── CustomButton.tsx   # Botão padronizado com indicador de carregamento (isPending)
│   │   ├── Loader.tsx         # Componente de feedback de carregamento centralizado
│   │   ├── PetModal.tsx       # Modal controlado para criação e edição de pets
│   │   └── VaccineModal.tsx   # Modal com seleção de status e máscara de datas (DD/MM/AAAA)
│   ├── theme/
│   │   └── Colors.ts          # Paleta de cores oficial e tokens de design do app
│   ├── routes/
│   │   ├── index.tsx          # Controle de acesso: chaveia entre AuthRoutes e AppRoutes
│   │   ├── AuthRoutes.tsx     # Pilha Stack de telas públicas (Login e Cadastro)
│   │   └── AppRoutes.tsx      # Navegador Bottom Tabs com as telas protegidas
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.tsx       # Tela de login com validação e autenticação Firebase
│       │   └── RegisterScreen.tsx    # Tela de cadastro de novos tutores
│       └── app/
│           ├── HomeScreen.tsx        # Dashboard com métricas reativas em tempo real
│           ├── PetsScreen.tsx        # CRUD 1: Gestão completa de animais
│           ├── VaccinesScreen.tsx    # CRUD 2: Carteira de vacinas com filtros por status
│           ├── HistoryScreen.tsx     # Linha do tempo clínica de procedimentos
│           ├── SpecialistsScreen.tsx # Catálogo de clínicas e veterinários parceiros
│           └── CareScreen.tsx        # Guia informativo de cuidados diários
```

---

## 🔗 Integração com o Backend (Firebase REST API)

A aplicação comunica-se com os serviços do Google Firebase através de requisições HTTP RESTful diretas via Axios:

### 1. Autenticação (Firebase Auth REST)
* **Cadastro:** `POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}`
* **Login:** `POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}`

### 2. CRUD 1: Gestão de Pets (`/users/{userId}/pets.json`)
* **Create:** `POST /users/{userId}/pets.json` — Adiciona um novo animal vinculado ao ID do usuário.
* **Read:** `GET /users/{userId}/pets.json` — Lista todos os animais cadastrados pelo usuário.
* **Update:** `PUT /users/{userId}/pets/{petId}.json` — Atualiza integralmente os dados do animal.
* **Delete:** `DELETE /users/{userId}/pets/{petId}.json` — Remove o animal do banco de dados.

### 3. CRUD 2: Carteira de Vacinas (`/users/{userId}/vaccines.json`)
* **Create:** `POST /users/{userId}/vaccines.json` — Registra uma nova dose de imunização.
* **Read:** `GET /users/{userId}/vaccines.json` — Obtém todas as vacinas do tutor.
* **Update:** `PUT /users/{userId}/vaccines/{vaccineId}.json` — Altera status, datas ou detalhes da vacina.
* **Delete:** `DELETE /users/{userId}/vaccines/{vaccineId}.json` — Exclui o registro de imunização.

---

## 📱 Telas Desenvolvidas (Total: 8 Telas)

1. **Login (`LoginScreen`):** Acesso com e-mail/senha com feedback de erros amigável e indicador de carregamento.
2. **Cadastro (`RegisterScreen`):** Criação de nova conta de tutor com validação de senha e persistência no AsyncStorage.
3. **Dashboard (`HomeScreen`):** Resumo numérico instantâneo de pets e vacinas com atalhos rápidos e destaque do pet ativo.
4. **Meus Pets (`PetsScreen` - CRUD 1):** Listagem em cards com foto, raça, idade e chip, com botões para cadastrar, editar e excluir pets.
5. **Carteira de Vacinas (`VaccinesScreen` - CRUD 2):** Controle de doses com chips de filtro rápido (*Todas*, *Aplicadas*, *Pendentes*, *Atrasadas*), cadastro com máscara de datas e ações de edição e exclusão.
6. **Histórico Clínico (`HistoryScreen`):** Linha do tempo médica com histórico de consultas, cirurgias, exames e valores.
7. **Especialistas (`SpecialistsScreen`):** Catálogo de veterinários conveniados com CRMV, especialidade e contato.
8. **Cuidados & Dicas (`CareScreen`):** Guia com orientações diárias de nutrição, higiene e passeios.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (versão 18.x ou superior recomendada)
* Gerenciador de pacotes **npm**
* Aplicativo **Expo Go** instalado no smartphone físico (iOS ou Android)

### Passo a Passo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/AntonioCarvalhoFIAP/challenge-1-thomasmfontes.git
   cd PawCare
   ```

2. **Instale as dependências do projeto:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start -c
   ```
   *(A flag `-c` limpa o cache do bundler para garantir inicialização sem resíduos).*

4. **Abra o aplicativo:**
   * **No smartphone:** Abra o app **Expo Go** e escaneie o QR Code exibido no terminal (no iOS, utilize o aplicativo nativo da Câmera).
   * **No emulador Android:** Pressione a tecla `a` no terminal.
   * **No emulador iOS:** Pressione a tecla `i` no terminal.

---

## 🔑 Como Testar a Aplicação

1. Na tela inicial de **Login**, toque em **"Criar conta"**.
2. Cadastre um usuário com qualquer e-mail válido (ex: `teste@pawcare.com`) e uma senha com no mínimo 6 dígitos.
3. O app criará o usuário diretamente no Firebase Authentication e entrará automaticamente no Dashboard.
4. Cadastre pets e vacinas para testar os CRUDs com persistência real em nuvem!