# Review Assignment Due Date
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6oXxJ3IU)

<p align="center">
  <img src="https://img.icons8.com/color/120/000000/dog.png" alt="PawCare Logo" width="120px" style="border-radius: 20%;" />
</p>

<h1 align="center">PawCare 🐾</h1>

<p align="center">
  <strong>O gerenciamento completo, inteligente e sofisticado da saúde, vacinação e bem-estar do seu melhor amigo.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo_SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Plataformas-Android%20%7C%20iOS%20%7C%20Web-2F6BFF?style=for-the-badge" alt="Platforms" />
</p>

---

## 📋 Sobre o Projeto

O **PawCare** é um aplicativo mobile de alta fidelidade desenvolvido para tutores que buscam centralizar e organizar todos os aspectos da saúde, cuidados e acompanhamento veterinário dos seus animais de estimação. 

Projetado com uma interface moderna de padrão premium e navegação extremamente fluida, o PawCare foi construído como parte da entrega do **Challenge 1 de Mobile na FIAP**. A solução utiliza **React Native** com o ecossistema moderno do **Expo SDK 54**, roteamento nativo estruturado e forte consistência tipada com **TypeScript**, focando em entregar um produto estável, performático e visualmente impecável.

---

## ✨ Funcionalidades em Detalhes

O aplicativo possui navegação modular dividida em seis seções integradas que cobrem todas as necessidades da rotina do pet:

### 🏠 1. Dashboard (Início)
* **Status Instantâneo do Pet:** Apresenta na tela inicial um resumo de identificação do pet ativo (**Luna**, uma Golden Retriever fêmea de 5 anos), com exibição direta de idade, peso atual e padrão de pelagem.
* **Sinalização de Saúde:** Um badge dinâmico que indica a estabilidade geral da saúde e a data do último check-up de rotina.
* **Resumo de Métricas (Quick Stats):** Três indicadores numéricos em tempo real no topo para consulta instantânea:
  * Vacinas pendentes ou atrasadas;
  * Quantidade total de eventos registrados no histórico;
  * Número de especialistas médicos disponíveis na rede.
* **Próximas Atividades:** Lista ordenada por data exibindo as atividades agendadas (próximas vacinas, banho e tosa e consultas agendadas).
* **Dica Inteligente do Dia:** Card educativo dinâmico com recomendações específicas baseadas na raça e porte do pet (como a frequência ideal de escovação para pelos dourados).

### 🐩 2. Perfil do Pet (Ficha Técnica)
* **Cadastro Completo:** Registro de nome do animal, raça, idade, peso exato, gênero, data de aniversário e pelagem.
* **Registro de Segurança:** Espaço dedicado para o ID do Microchip do pet (`985112004567890`), facilitando a localização e trâmites de viagem.
* **Responsável:** Vínculo direto de propriedade apontando o tutor do pet (**Thomas Fontes**).
* **Padronização Estética:** Header unificado com altura de 140px, proporcionando estabilidade geométrica entre abas e um visual premium.

### 💉 3. Painel de Imunização (Vacinas)
* **Status Tripartite Dinâmico:** Organização ágil de vacinas em três categorias visuais com base na situação atual:
  * 🟢 **Aplicada (Concluída):** Com registros da data de aplicação, veterinário encarregado e clínica onde ocorreu.
  * 🟡 **Pendente:** Próximas doses programadas para manter o pet imunizado.
  * 🔴 **Atrasada (Urgente):** Alertas em vermelho para reforços que já passaram do prazo recomendado de aplicação.
* **Filtros e Detalhes:** Histórico de vacinas fundamentais como V10 (Décupla), Antirrábica, Giárdia, Gripe Canina, Leishmaniose e Leptospirose, acompanhadas de notas clínicas relevantes (ex: *"Recomendada para cães que frequentam parques"*).

### ⏳ 4. Linha do Tempo Clínico (Histórico)
* **Histórico Completo de Eventos:** Timeline cronológica detalhada registrando consultas de rotina, vacinações, exames de sangue, exames de imagem (Ultrassom Abdominal), banhos e cuidados de higiene.
* **Ficha Financeira:** Registro de despesas individuais para cada evento ou consulta médica, fornecendo um controle de gastos veterinários integrado diretamente na interface do tutor.
* **Laudos e Descrições:** Descrição textual detalhada das observações e diagnósticos dos especialistas para consultas passadas.

### 🧑‍⚕️ 5. Guia de Especialistas (Vets & Clínicas)
* **Catálogo de Especialidades:** Busca inteligente englobando Clínica Geral, Dermatologia Veterinária, Ortopedia Veterinária, Diagnóstico por Imagem, Nutrição Animal e Cardiologia Veterinária.
* **Ficha de Contato Veterinário:** Exibe foto de perfil, tempo de experiência profissional do médico, clínica parceira afiliada, endereço completo e telefone direto.
* **Avaliação Geral:** Sistema de rating em escala de estrelas baseado no feedback de outros tutores.
* **Badge de Disponibilidade:** Sinalizador dinâmico atualizado em tempo real sobre a disponibilidade do veterinário para consultas no dia.

### 💖 6. Central de Cuidados e Rotina
* **Guias de Cuidados Categorizados:** Divisão por cards interativos cobrindo os pilares do bem-estar animal: Alimentação, Banho e Higiene, Exercícios Físicos, Saúde Preventiva, Bem-estar Mental e Descanso.
* **Instruções Personalizadas:** Listas detalhadas de cuidados específicos, indicando gramatura diária de ração recomendada para o peso do pet, orientações de higiene auricular, frequência ideal de caminhadas e técnicas de adestramento positivo.

---

## 🎨 Design System e Identidade Visual

O PawCare adota uma paleta de cores altamente harmônica baseada em padrões de interface hospitalar e de cuidados premium, aplicando técnicas de *glassmorphism*, sombras suaves (`elevation`) e transições visuais consistentes:

| Cor | Nome Técnico | Código Hexadecimal | Finalidade e Uso Principal |
| :---: | :--- | :--- | :--- |
| 🔵 | `primary` | `#2F6BFF` | Cor da marca, botões de ação e abas selecionadas. |
| 🌑 | `darkBlue` | `#0D2B52` | Cabeçalhos principais (headers), fontes primárias e fundo superior das telas. |
| 🟢 | `success` | `#10B981` | Status de vacinação aplicada, saúde em dia e cards informativos estáveis. |
| 🟡 | `warning` | `#F59E0B` | Alertas de atividades pendentes e banners educativos ("Dica do Dia"). |
| 🔴 | `danger` | `#EF4444` | Destaques cruciais de vacinas e medicamentos com atraso crítico. |
| 🟣 | `purple` | `#8B5CF6` | Categorias e cards de bem-estar e cuidados. |
| 🌐 | `teal` | `#0EA5C9` | Destaque de clínicas parceiras e rotinas de higiene. |
| ⚪ | `background`| `#F4F5F7` | Cor principal de fundo do aplicativo (cinza claro neutro ultra-limpo). |

---

## 📂 Estrutura de Diretórios

A arquitetura do projeto segue o padrão nativo moderno do **Expo Router**, mantendo uma separação rígida entre rotas de exibição e arquivos de configuração global:

```text
PawCare/
├── .expo/                   # Diretório de cache e metadados de execução do Expo
├── app/                     # Roteamento baseado em arquivos (Expo Router)
│   ├── _layout.tsx          # Layout de inicialização e rotas de topo
│   └── src/                 # Telas principais do aplicativo
│       ├── _layout.tsx      # Configuração estética e tab-bar de abas
│       ├── index.tsx        # Dashboard principal / Início
│       ├── perfil-pet.tsx   # Ficha detalhada do pet ativo
│       ├── vacinas.tsx      # Gerenciador de imunização e vacinas
│       ├── historico.tsx    # Linha do tempo de consultas e registros clínicos
│       ├── especialistas.tsx# Guia e filtros de profissionais veterinários
│       └── cuidados.tsx     # Hub com rotinas de cuidados diários
├── assets/                  # Mídias locais, splash screens e ícone adaptativo
├── constants/               # Arquivos estáticos de configuração estrutural
│   ├── Colors.ts            # Ficha técnica do Design System de cores oficiais
│   └── MockData.ts          # Banco de dados simulado altamente estruturado
├── tsconfig.json            # Configuração do ambiente TypeScript
├── package.json             # Definição de scripts e dependências do Node
└── babel.config.js          # Configurações do compilador Babel
```

---

## 🛠️ Especificações Técnicas e Dependências

O PawCare foi desenvolvido com o estado da arte do desenvolvimento móvel multiplataforma:

* **React Native (0.81.5)** & **React (19.1.0):** Frameworks base para a compilação nativa de alta performance.
* **Expo SDK 54 (54.0.34):** Ecossistema adotado para automação de build, suporte a API de fontes nativas e facilidade de testes.
* **Expo Router v3 (6.0.23):** Controle de rotas nativas com transições nativas fluídas.
* **TypeScript (5.9.2):** Garantia de consistência lógica de dados, com interfaces explícitas para entidades do sistema (`Vaccine`, `Specialist`, `HistoryEvent`, `CareCard`).
* **AsyncStorage (2.2.0):** Armazenamento de chave-valor offline ideal para persistência local rápida.
* **Expo Constants & Status Bar:** Integração estética com o topo do aparelho e a barra de status nativa.
* **Ionicons (Vector Icons):** Conjunto tipográfico de ícones profissionais que mudam esteticamente dependendo do foco da aba.

---

## 🚀 Instalação e Execução

Para rodar o PawCare em sua máquina local de desenvolvimento e testar no seu celular, siga as instruções abaixo:

### Pré-requisitos
* Ter o **Node.js** (versão 18.x ou superior) instalado em sua máquina.
* Ter o gerenciador de pacotes **npm** instalado (já vem por padrão com o Node.js).
* Instalar o aplicativo **Expo Go** em seu dispositivo móvel físico (disponível gratuitamente na [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) e na [Apple App Store](https://apps.apple.com/us/app/expo-go/id984029708)).

### Instruções Passo a Passo

1. **Clonar este repositório:**
   ```bash
   git clone https://github.com/AntonioCarvalhoFIAP/challenge-1-thomasmfontes.git
   cd PawCare
   ```

2. **Instalar as dependências do projeto:**
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento do Expo:**
   ```bash
   npm start
   ```
   * *Dica: Se preferir, você também pode usar `npm run android`, `npm run ios` ou `npm run web` para iniciar direcionando diretamente a plataformas específicas.*

4. **Conectar e Testar:**
   * **No Celular Físico:** Abra o aplicativo **Expo Go** em seu smartphone. 
     * No Android, clique em "Scan QR Code" e aponte para o QR Code gerado no terminal.
     * No iOS, abra a câmera nativa do celular, aponte para o QR Code e clique no link de redirecionamento para o Expo Go.
   * **No Emulador de Computador:** Pressione a tecla `a` no teclado do terminal para rodar no emulador Android ativo, ou a tecla `i` para rodar no simulador de iOS (requer macOS e Xcode).
   * **No Navegador Web:** Pressione a tecla `w` para compilar e visualizar a versão Web adaptada direto no seu navegador padrão.

---

## 🎓 Contexto de Desenvolvimento

* **Instituição:** FIAP (Faculdade de Informática e Administração Paulista)
* **Curso:** Challenge 1 - Desenvolvimento Mobile Avançado
* **Desenvolvedor:** Thomas Fontes (Aluno FIAP e tutor orgulhoso da Luna)
* **Objetivos Alcançados:** 
  * Integração completa de navegação em abas aninhada e dinâmica via Expo Router.
  * Criação de UI premium baseada em paleta de cores própria e responsividade de tela.
  * Tipagem estrita de dados estáticos para garantir segurança contra falhas em produção.
  * Padronização estrutural dos cabeçalhos das telas para consistência durante a navegação.