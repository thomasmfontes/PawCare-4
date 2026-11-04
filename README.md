# PawCare 🐾 - Mobile Application


<p align="center">
  <img src="https://img.icons8.com/color/120/000000/dog.png" alt="PawCare Logo" width="120px" style="border-radius: 20%;" />
</p>

<h1 align="center">PawCare 🐾 (Sprint 4 - Versão Final)</h1>

<p align="center">
  <strong>O ecossistema inteligente, moderno e completo para o gerenciamento da saúde, rotina médica, imunização e bem-estar do seu pet.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.86.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_SDK-57.0-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Expo_Notifications-57.0-4630EB?style=for-the-badge&logo=expo&logoColor=white" alt="Expo Notifications" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Firebase_App_Distribution-Ready-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase App Distribution" />
</p>

---

## 👥 Integrantes do Grupo (FIAP)
* **Thomas Fontes** - RM 562254
* **Gabriel Maciel** - RM 562795
* **Vitória Rodrigues** - RM 565160
* **Augusto Bonomo** - RM 565155
* **Matheus Molina** - RM 563399

---

## 🎥 Vídeo de Apresentação e Demonstração
* **Vídeo Final (Sprint 4):** [Assista no YouTube](https://youtu.be/eGbsz0p_vHw)

---

## 🎯 Matriz de Atendimento aos Critérios Avaliativos (Sprint 4 - 100 Pontos)

| Requisito do Edital | Pontos | Implementação no PawCare | Arquivos de Referência |
| :--- | :---: | :--- | :--- |
| **1. Telas Funcionais** | **20 pts** | **Todas as telas são 100% funcionais** com utilidade prática:<br>• **Home:** Métricas em tempo real e atalhos rápidos.<br>• **Pets:** CRUD completo com persistência no Firebase.<br>• **Vacinas:** CRUD e controle de status de imunização.<br>• **Histórico:** Prontuário médico interativo com adição de eventos clínicos e filtros.<br>• **Cuidados:** Checklist de hábitos diários com progresso e persistência.<br>• **Veterinários:** Agendamento rápido de consultas, chamadas e mapas.<br>• **Sobre:** Dados da publicação e hash do commit. | `src/screens/app/` (Todas as telas funcionais) |
| **2. Publicação do Aplicativo** | **20 pts** | • Compilação do APK nativo via EAS Build (`preview`).<br>• Publicação no **Firebase App Distribution** com convite de tester enviado ao professor (`profantonio.neto@fiap.com.br`) e [link direto da release](https://appdistribution.firebase.google.com/testerapps/1:147878385359:android:b6f9a59732ca548459c9ba/releases/304k3fpl5d5v0?utm_source=firebase-console).<br>• **Tela "Sobre o App"** exibindo explicitamente o **Hash do Commit** (`c39ae65`) de referência da versão publicada, dados da equipe e RMs. | `src/screens/app/AboutScreen.tsx`<br>`src/config/appInfo.ts`<br>`eas.json` |
| **3. Notificações (Locais Reais)** | **20 pts** | Notificações de sistema reais com `expo-notifications` disparadas por eventos do sistema:<br>• Confirmação e agendamento de dose ao cadastrar vacina.<br>• Lembretes de cuidados diários.<br>• Confirmação de agendamento veterinário.<br>• Navegação direta (deep linking) ao tocar na notificação. | `src/services/notificationService.ts`<br>`src/hooks/useNotifications.ts`<br>`App.tsx` |
| **4. Arquitetura e Organização** | **20 pts** | Separação estrita em camadas:<br>• **UI:** `screens/` e `components/`<br>• **Regras de Negócio e Hooks:** `hooks/`<br>• **Camada de Dados / APIs:** `services/`<br>• **Contextos Globais:** `contexts/`<br>TanStack Query isolado da camada de apresentação; tipagem TypeScript 100% estrita sem erros. | `src/` (Arquitetura modular em camadas) |
| **5. Suporte a Tema Claro / Escuro** | *(Penalidade VI)* | Implementação de `ThemeContext` completo com persistência (`AsyncStorage`), suporte aos modos **Claro**, **Escuro** e **Sistema**, e alternador dinâmico na interface. | `src/contexts/ThemeContext.tsx`<br>`src/theme/Colors.ts`<br>`src/hooks/useTheme.ts` |
| **6. Repositório Oficial do Projeto** | *(Critério de Entrega)* | Código-fonte versionado no GitHub com histórico estruturado de commits e documentação completa. | [GitHub PawCare-4](https://github.com/thomasmfontes/PawCare-4) |

---

## 🏛️ Arquitetura do Software em Camadas

```text
PawCare/
├── App.tsx                     # Ponto de entrada: SafeAreaProvider, QueryClient, ThemeProvider, AuthProvider, Notificações
├── app.json                    # Configuração Expo, plugins (notifications, image-picker) e tema automático
├── eas.json                    # Perfis de build para geração do APK no EAS
├── entrega.txt                 # Documento formal com integrantes, repositórios e links
├── src/
│   ├── config/
│   │   ├── firebase.ts         # Credenciais da REST API do Firebase Realtime Database e Auth
│   │   └── appInfo.ts          # Metadados do app, integrantes, RMs e Hash do Commit publicado
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Gerenciamento de sessão, autenticação e persistência do usuário
│   │   └── ThemeContext.tsx    # Controle dinâmico do Tema Claro / Escuro / Sistema com persistência
│   ├── hooks/
│   │   ├── useAuth.ts          # Hook do contexto de autenticação
│   │   ├── useTheme.ts         # Hook para leitura e alternância do tema
│   │   ├── useNotifications.ts # Hook com disparos de notificações em eventos reais
│   │   ├── usePets.ts          # TanStack Query: CRUD de Pets
│   │   └── useVaccines.ts      # TanStack Query: CRUD de Vacinas
│   ├── services/
│   │   ├── api.ts              # Instância Axios com baseURL do Firebase
│   │   ├── authService.ts      # Chamadas HTTP de login e registro
│   │   ├── petService.ts       # Serviços REST do CRUD de Pets
│   │   ├── vaccineService.ts   # Serviços REST do CRUD de Vacinas
│   │   └── notificationService.ts # Configuração de canais, permissões e agendamentos de notificação
│   ├── components/
│   │   ├── CustomInput.tsx     # Input estilizado adaptado ao tema atual
│   │   ├── CustomButton.tsx    # Botão com suporte a variantes e estados de carregamento
│   │   ├── Loader.tsx          # Feedback de carregamento padronizado
│   │   ├── PetModal.tsx        # Modal de criação e edição de pets
│   │   └── VaccineModal.tsx    # Modal de criação e edição de vacinas
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx       # Autenticação de tutores
│   │   │   └── RegisterScreen.tsx    # Cadastro com persistência
│   │   └── app/
│   │       ├── HomeScreen.tsx        # Dashboard com alternador de tema e atalhos rápidos
│   │       ├── PetsScreen.tsx        # CRUD de Pets com fotos e identificação
│   │       ├── VaccinesScreen.tsx    # CRUD de Vacinas com disparo de lembrete de notificação
│   │       ├── HistoryScreen.tsx     # Prontuário clínico interativo com adição de eventos
│   │       ├── SpecialistsScreen.tsx # Contato, mapa e agendamento rápido com notificações
│   │       ├── CareScreen.tsx        # Checklist de rotina diária e guias preventivos
│   │       └── AboutScreen.tsx       # Tela "Sobre o App" com Hash do Commit e dados da equipe
│   └── routes/
│       ├── index.tsx           # Roteador com controle de sessão
│       ├── AuthRoutes.tsx      # Rotas públicas
│       └── AppRoutes.tsx       # Bottom Tabs protegidas com suporte ao tema
```

---

## 🔔 Sistema de Notificações Locais (`expo-notifications`)

As notificações foram desenvolvidas com base em cenários reais e com disparo automático atrelado a ações do usuário:

1. **Lembrete de Vacinas:** Ao cadastrar ou atualizar uma vacina, o app agenda um alerta local para o dia da aplicação e emite confirmação imediata.
2. **Agendamento de Consultas:** Ao confirmar uma consulta com um especialista na aba "Vets", uma notificação é gerada e o evento é automaticamente registrado na linha do tempo do Histórico.
3. **Rotina de Cuidados:** Ao concluir tarefas diárias na aba "Cuidados", notificações de reforço positivo e lembretes periódicos são configurados.
4. **Interatividade e Deep Linking:** Ao tocar no banner da notificação de sistema, o app captura o evento via listener em `App.tsx` e direciona diretamente para a tela de interesse.

---

## 🌓 Modo Claro e Modo Escuro (Dark Mode)

O aplicativo conta com suporte nativo a múltiplos modos de exibição:
* **Modo Claro (Light):** Superfícies claras, alto contraste e paleta azul clássica.
* **Modo Escuro (Dark):** Superfícies em tons Slate Dark com contraste acessível para uso noturno.
* **Modo Automático (Sistema):** Acompanha a preferência global do sistema operacional.
* **Persistência:** A preferência é salva no `AsyncStorage` e mantida entre sessões.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (versão 18.x ou superior)
* **npm**
* Smartphone físico com **Expo Go** ou emulador Android/iOS

### Passo a Passo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/thomasmfontes/PawCare-4.git
   cd PawCare
   ```

2. **Instale as dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start -c
   ```

4. **Abra o aplicativo:**
   * **No smartphone:** Escaneie o QR Code no app **Expo Go**.
   * **No emulador Android:** Pressione a tecla `a`.
