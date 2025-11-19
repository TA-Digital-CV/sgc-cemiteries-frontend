##### Arquitetura TOGAF para o Sistema de Gestão de Cemitério (SGC)

## Índice de Navegação

1. [Visão e Contexto Arquitetural (Fase Preliminar e Fase A)](#1-visão-e-contexto-arquitetural-fase-preliminar-e-fase-a)
2. [Arquitetura de Negócio (Fase B)](#2-arquitetura-de-negócio-fase-b)
3. [Arquitetura de Dados (Fase C: Dados)](#3-arquitetura-de-dados-fase-c-dados)
4. [Arquitetura de Aplicações (Fase C: Aplicações)](#4-arquitetura-de-aplicações-fase-c-aplicações)
5. [Arquitetura de Tecnologia (Fase D)](#5-arquitetura-de-tecnologia-fase-d)

## 1. Visão e Contexto Arquitetural (Fase Preliminar e Fase A)

A visão arquitetural estabelece a motivação e os objetivos estratégicos para a transformação digital da gestão cemiterial em Cabo Verde.

###### Linha de Base (Arquitetura Atual)

O estado atual da gestão cemiterial na maioria dos municípios cabo-verdianos baseia-se em **processos manuais e registos em papel**, o que gera vários desafios:

* Dificuldade na localização e mapeamento de sepulturas.

* Perda de registos históricos devido à deterioração ou extravio de documentos.

* Complexidade e propensão a erros no controlo manual de concessões temporárias.

* Inexistência de integração com outros sistemas municipais (e.g., Registo Civil, Finanças).

###### Visão e Objetivos (Arquitetura Alvo)

O **Objetivo Principal do SGC é informatizar integralmente o ciclo de gestão cemiterial**, transformando processos manuais em fluxos de trabalho digitais otimizados.

O projeto está alinhado com as diretrizes nacionais para a modernização da administração pública, conforme o Plano Estratégico de Desenvolvimento Sustentável (PEDS), e visa alcançar:

1. **Modernização de Processos Operacionais** (utilização de códigos QR e dispositivos móveis).
2. **Melhoria da Experiência do Cidadão** (portal online, notificações automáticas por SMS/email).
3. **Otimização da Gestão de Recursos** (análise da capacidade cemiterial e apoio ao planeamento estratégico).

***

## 2. Arquitetura de Negócio (Fase B)

A Arquitetura de Negócio define as capacidades e os processos que o SGC deve suportar para atingir os seus objetivos, focando-se nos fluxos de trabalho e nos *stakeholders*.

###### Capacidades de Negócio Chave

As capacidades do SGC abrangem o ciclo completo das operações cemiteriais:

* Gestão de **Concessões** (temporárias e perpétuas), incluindo a gestão automática de prazos, notificações de renovação e processos de exumação em caso de expiração.

* Gestão de **Operações** (Inumações, Exumações e Trasladações intra e inter-cemiteriais).

* **Gestão Financeira** (cálculo automático de taxas e cobrança/liquidação automatizada através de integração).

* **Inteligência Espacial** e Mapeamento (permitindo planeamento dinâmico da capacidade e otimização de rotas).

###### Stakeholders e Perfis de Utilizador

O SGC foi projetado com base em múltiplos perfis de utilizador, cada um com necessidades específicas e permissões rigorosamente definidas através de **RBAC** (Controlo de Acesso Baseado em Papéis):

* **Administrador Municipal:** Focado na supervisão estratégica, dashboards executivos e configuração de parâmetros globais.

* **Gestor de Cemitério:** Responsável pela operação quotidiana, requer ferramentas de planeamento e acesso móvel para decisões no terreno .

* **Equipa Operacional:** Utiliza uma aplicação móvel simples, com **funcionalidade offline essencial**, para registar atividades e usar códigos QR para identificação de sepulturas .

* **Cidadãos e Famílias:** Acessam o sistema através de um portal público para submeter solicitações, consultar informações e efetuar pagamentos online .

###### Benefícios Esperados

A arquitetura do SGC visa gerar valor significativo :

* **Redução de Custos Operacionais** para a Administração Municipal, devido à eliminação da entrada manual de dados .

* **Aumento da Transparência** e conveniência dos serviços para os Cidadãos.

* Processos mais **eficientes e previsíveis** para Funerárias, através de agendamento em tempo real .

***

## 3. Arquitetura de Dados (Fase C: Dados)

A Arquitetura de Dados define a estrutura lógica e física da informação, essencial para a integridade e preservação do património .

###### Entidades de Dados Críticas

O modelo de dados do SGC é detalhado, focado na integridade e flexibilidade, incluindo as seguintes entidades principais :

* **Hierarquia Espacial:** Modelagem hierárquica completa do cemitério (incluindo cemetery, cemetery\_block, cemetery\_section, plot) . A tabela plot (sepultura) é crítica e inclui atributos como geo\_point (georreferenciamento) e qr\_code .

* **Pessoas:** A tabela person armazena dados de pessoas vivas (titulares) e falecidas (incluindo death\_date e death\_cause) .

* **Concessões:** A tabela concession gere o ciclo de vida, status e pagamentos associados ao direito de uso de uma sepultura .

* **Operações:** Entidades específicas (burial, exhumation, transfer) documentam detalhadamente cada ato operacional com evidência fotográfica geolocalizada e *timestamp*.

* **Finanças:** Estruturas para gerir taxas (fee\_schedule), cálculos (fee\_calculation) e pagamentos (payment) .

###### Qualidade e Segurança de Dados

A qualidade e a segurança dos dados são asseguradas por:

* **Integração com o Registo Civil** para validação automática e sincronização assíncrona de certidões de óbito, garantindo uma fonte de verdade consistente .

* **Conformidade Legal:** O sistema foi concebido em total conformidade com a Lei n.º 121/IX/2021 de Cabo Verde (inspirada no RGPD), incorporando ***privacy by design*** **e** ***privacy by default*** .

* **Criptografia:** Implementação de **AES-256** para dados em repouso e **TLS 1.3** para dados em trânsito .

***

## 4. Arquitetura de Aplicações (Fase C: Aplicações)

A Arquitetura de Aplicações define os principais componentes lógicos (serviços) e a forma como interagem.

###### Estilo Arquitetural

O SGC adota uma **Arquitetura de Microserviços** . Este estilo é escolhido para garantir:

* **Escalabilidade** (horizontal) .

* **Autonomia tecnológica** e isolamento de falhas .

* **Manutenibilidade** e a capacidade de evoluir independentemente .
  A arquitetura segue o **API-first design**, garantindo que toda a funcionalidade seja exposta através de contratos seguros e versionados para interoperabilidade .

###### Microserviços Centrais

O sistema é estruturado em três microserviços centrais, alinhados com o *Domain-Driven Design* (DDD) :

1. **Serviço de Gestão de Cemitérios (** *Cemetery Layout Service* **):** Gere a estrutura física, o cadastro hierárquico e as funcionalidades de georreferenciamento .
2. **Serviço de Gestão de Concessões (** *Concessions Service* **):** Gere todo o ciclo de vida das concessões (solicitação, renovação, transferência, expiração) .
3. **Serviço de Operações Cemiteriais (** *Operations Service* **):** Gere as operações de campo (inumações, exumações, trasladações) e o agendamento .

###### Integrações Sistémicas (Interoperabilidade)

A integração com sistemas externos é uma funcionalidade crucial :

* **Registo Civil:** Validação de certidões de óbito .

* **Plataformas de Pagamento:** Automatização do ciclo de cobrança e reconciliação.

* **iGRP 3.0 e Porton di Nôs Ilhas:** Utilização de *Single Sign-On* (SSO) para uma experiência de utilizador unificada no ecossistema digital do governo .

* **Plataformas GIS:** Suporte a funcionalidades avançadas de mapeamento e análise espacial, utilizando padrões como *Web Map Services* (WMS) .

***

## 5. Arquitetura de Tecnologia (Fase D)

A Arquitetura de Tecnologia define a pilha tecnológica e os requisitos de qualidade que suportam as aplicações e os dados.

###### Pilha Tecnológica (Technology Stack)

A seleção tecnológica foca-se em padrões abertos e modernos :

* **Backend:** IGRP 3.0 Spring Backend .

* **Base de Dados:** PostgreSQL 16 com a extensão **PostGIS** (essencial para o Georreferenciamento e Inteligência Espacial) .

* **Frontend:** IGRP 3.0 Next.js Frontend .

* **Mensageria:** RabbitMQ (para comunicação entre microserviços) .

###### Requisitos Não Funcionais (Qualidade do Serviço)

A robustez do sistema é definida por rigorosos requisitos não funcionais :

* **Performance:** Tempo de resposta para 90% das consultas **inferior a 2 segundos** .

* **Disponibilidade:** Disponibilidade mínima de **99.5%** .

* **Escalabilidade:** Suporte para pelo menos **1.000 utilizadores concorrentes por município** .

* **Segurança:** Implementação de uma arquitetura **Zero Trust** e Autenticação Multi-Fator (MFA) obrigatória para dados sensíveis .

###### Implantação e Geografia

O SGC é projetado com uma arquitetura que suporta a **operação multi-municipal** desde o início, embora a implementação comece com um projeto-piloto em Praia, São Vicente e Sal, com expansão progressiva para todos os 22 municípios de Cabo Verde. O sistema deve ser **adaptável** para acomodar variações nos regulamentos e taxas entre os municípios.
