# PRD: Sistema de Gestão Digital Cemiterial

## Índice de Navegação

1. [Introdução e Visão Geral do Produto](#1-introdução-e-visão-geral-do-produto)
2. [Objetivos Estratégicos e Metas (OKRs)](#2-objetivos-estratégicos-e-metas-okrs)
3. [Análise de Stakeholders e Perfis de Utilizador](#3-análise-de-stakeholders-e-perfis-de-utilizador-personas)
4. [Requisitos Funcionais (Features & Epics)](#4-requisitos-funcionais-features--epics)
5. [Requisitos Não Funcionais](#5-requisitos-não-funcionais)
6. [Arquitetura Técnica](#6-arquitetura-técnica)
7. [Plano de Lançamento (Roadmap)](#7-plano-de-lançamento-roadmap)
8. [Métricas e KPIs (Acompanhamento)](#8-métricas-e-kpis-acompanhamento)

## Documento de Requisitos de Produto (PRD) - Sistema de Gestão Digital (SGD)

**Autor:** Tavares\&Alves **Versão:** 1.0 **Data:** 16 de Outubro de 2025

## 1. Introdução e Visão Geral do Produto

O Sistema de Gestão Digital (SGD) é uma plataforma tecnológica moderna projetada para informatizar integralmente o ciclo de gestão de cemitérios nos municípios de Cabo Verde. Atualmente, a gestão cemiterial enfrenta desafios significativos devido à dependência de processos manuais e registos em papel, o que resulta em ineficiência, morosidade, riscos de perda de dados históricos e dificuldades na localização de sepulturas.
O SGD visa transformar estes processos manuais em fluxos de trabalho digitais otimizados, proporcionando uma solução centralizada, segura e eficiente. O sistema será desenvolvido com uma **arquitetura de microserviços**, utilizando **Java/Spring Boot** para o backend e **Next.js** para o frontend, garantindo escalabilidade, manutenibilidade e uma experiência de utilizador moderna e responsiva.

## 2. Objetivos Estratégicos e Metas (OKRs)

**Objetivo Geral:** Modernizar e digitalizar integralmente a gestão cemiterial em Cabo Verde, melhorando a eficiência operacional e a qualidade do serviço prestado aos cidadãos.

| Key Results (Resultados-Chave)                                                                      | Métricas de Sucesso                                                                                              |
| :-------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **KR1:** Reduzir o tempo de processamento de solicitações de serviços cemiteriais em 60%            | Medir o tempo médio desde a submissão de um pedido (ex: concessão) até à sua conclusão.                          |
| **KR2:** Aumentar a taxa de utilização de canais digitais para 70% das interações com os cidadãos   | Percentagem de solicitações submetidas através do Portal do Cidadão em comparação com o atendimento presencial . |
| **KR3:** Alcançar uma taxa de precisão de dados de 99.9% nos registos cemiteriais digitais          | Taxa de erros identificados em documentos e registos gerados pelo sistema.                                       |
| **KR4:** Garantir 99.5% de disponibilidade do sistema para operações críticas                       | Medição do uptime do sistema (SLA) .                                                                             |
| **KR5:** Atingir um Net Promoter Score (NPS) superior a 50 entre os cidadãos utilizadores do portal | Pesquisas de satisfação periódicas realizadas com os utilizadores do Portal do Cidadão .                         |

## 3. Análise de Stakeholders e Perfis de Utilizador (Personas)

O sucesso do SGD depende da satisfação das necessidades de diversos stakeholders . Os principais perfis de utilizador incluem:

* **Administrador Municipal:** Responsável pela supervisão estratégica e configuração global do sistema . Necessita de dashboards executivos com KPIs, relatórios estratégicos e ferramentas de auditoria .

* **Gestor de Cemitério:** Responsável pela gestão operacional diária . Precisa de ferramentas visuais para gestão de capacidade (heat-maps), agendamento de operações e gestão de equipas .

* **Atendente/Secretaria:** Ponto de contacto com o cidadão . Necessita de interfaces intuitivas para registo de solicitações, cálculo automático de taxas e acesso rápido a informações .

* **Equipa Operacional:** Executa operações no terreno (inumações, exumações) . Requer uma **aplicação móvel (PWA com Next.js)** simples, com suporte offline, checklists digitais e identificação de sepulturas por QR code .

* **Cidadãos e Famílias:** Utilizadores finais dos serviços . Precisam de um **Portal do Cidadão** acessível para submeter solicitações, consultar informações, localizar sepulturas e efetuar pagamentos online .

* **Funerárias:** Parceiros externos que interagem frequentemente com o sistema . Necessitam de um portal dedicado para submeter e acompanhar solicitações de forma eletrónica .

## 4. Requisitos Funcionais (Features & Epics)

O sistema será estruturado em módulos (microserviços) que correspondem a domínios de negócio específicos.
**Épico 1: Gestão de Cadastro e Mapeamento Cemiterial (** *Cemetery Layout Service* **)**

* **User Story:** Como Gestor de Cemitério, quero registar a estrutura hierárquica completa dos cemitérios (setores, quadras, talhões) de forma flexível para refletir a organização física real .

* **Requisitos:**

  * Cadastro hierárquico de cemitérios, blocos, setores e sepulturas .

  * **Georreferenciamento (integração com PostGIS)** de todas as estruturas, permitindo a localização exata de cada sepultura em mapas interativos .

  * Visualização da taxa de ocupação em tempo real, com mapas de calor e projeções de capacidade .

  * Identificação única de sepulturas com **geração de QR Codes** .

**Épico 2: Gestão de Concessões e Direitos de Uso (** *Concessions Service* **)**

* **User Story:** Como Atendente, quero processar um pedido de concessão temporária, calculando taxas automaticamente e notificando o cidadão sobre o vencimento .

* **Requisitos:**

  * Suporte a múltiplos tipos de concessão (temporárias, perpétuas) com regras de negócio configuráveis por município .

  * Fluxo de trabalho digital para processamento de solicitações, incluindo validação de documentos e atribuição de sepulturas .

  * Gestão automatizada de prazos e renovações, com **notificações assíncronas (via RabbitMQ)** por SMS e email .

  * Gestão de transferências de titularidade .

**Épico 3: Gestão de Operações de Campo (** *Operations Service* **)**

* **User Story:** Como membro da Equipa Operacional, quero usar a aplicação móvel para receber ordens de serviço, localizar a sepultura via GPS e registar a conclusão da inumação com fotos .

* **Requisitos:**

  * Agendamento e coordenação de inumações, exumações e trasladações .

  * **Aplicação móvel (PWA)** para equipas de campo com funcionalidade offline, checklists e captura de evidências fotográficas .

  * Registo detalhado de todas as operações, gerando autos e certificados digitais automaticamente .

  * Gestão de exumações automáticas por fim de prazo de concessão .

**Épico 4: Gestão Financeira e Integração de Pagamentos (** *Finance & Payments Service* **)**

* **User Story:** Como Cidadão, quero pagar a taxa de renovação da minha concessão online através do Portal, usando métodos de pagamento digitais .

* **Requisitos:**

  * Cálculo automático de taxas com base em tabelas de emolumentos configuráveis .

  * **Integração com plataformas de pagamento municipais** para suportar múltiplos canais (online, presencial, etc.) .

  * Geração de guias de pagamento e reconciliação automática .

  * Gestão de pagamentos parcelados e controlo de inadimplência .

**Épico 5: Portal do Cidadão e Acessibilidade (** *Frontend Next.js Application* **)**

* **User Story:** Como cidadão, quero aceder ao portal, encontrar facilmente a sepultura de um familiar e iniciar um pedido de serviço sem precisar de ir à câmara municipal .

* **Requisitos:**

  * Interface web responsiva e acessível (WCAG 2.1 AA).

  * Submissão e acompanhamento de solicitações online .

  * Ferramenta de busca e localização de sepulturas em mapa interativo .

  * Integração com sistema de **Single Sign-On (SSO) do governo (iGRP 3.0/Porton di Nôs Ilhas)** para autenticação unificada .

## 5. Requisitos Não Funcionais

* **Performance:** Tempo de resposta inferior a 2 segundos para 90% das consultas. O sistema deve suportar 1.000 utilizadores concorrentes por município .

* **Escalabilidade:** A arquitetura de microserviços em containers (Docker/Kubernetes) deve permitir o escalonamento horizontal e independente de cada serviço.

* **Disponibilidade:** Uptime de 99.5%, com redundância e plano de recuperação de desastres (RPO 24h, RTO 8h) .

* **Segurança:**

  * Conformidade com regulamentos de proteção de dados (referência GDPR/LGPD) .

  * Controlo de acesso granular baseado em papéis (RBAC) .

  * Criptografia de dados em trânsito (TLS 1.3) e em repouso (AES-256) .

  * Logs de auditoria imutáveis para todas as operações críticas .

* **Usabilidade e Acessibilidade:** Design centrado no utilizador, seguindo uma abordagem *mobile-first* e garantindo conformidade com as diretrizes WCAG 2.1 nível AA .

## 6. Arquitetura Técnica

* **Padrão Arquitetural:** **Microserviços** , comunicando via APIs RESTful e mensageria assíncrona (RabbitMQ) .

* **Backend:** **IGRP 3.0 Spring Backend**.

* **Frontend:** IGRP 3.0 Next.js Frontend**.**

* **Base de Dados:** **PostgreSQL 16 com a extensão PostGIS** para capacidades geoespaciais .

* **Infraestrutura:** Deploy em containers **Docker** orquestrados por **Kubernetes**. Uso de um API Gateway para gestão centralizada de APIs.

* **Integrações Chave:**

  * Registo Civil  (RNI+SNIAC) (validação de certidões de óbito) .

  * Sistemas de Pagamento Municipais .

  * Plataforma Porton di Nôs Ilhas (SSO e acesso unificado) .

  * Sistemas GIS (para mapeamento avançado) .

## 7. Plano de Lançamento (Roadmap)

A implementação seguirá uma abordagem faseada para mitigar riscos e entregar valor incrementalmente .

* **Fase 1 (MVP - Meses 1-4):**

  * **Foco:** Funcionalidades essenciais para a operação básica e digitalização dos dados.

  * **Entregas:** Cadastro de cemitérios e sepulturas (com georreferenciamento), gestão básica de concessões e inumações, portal do cidadão para consulta.

  * **Municípios Piloto:** Praia, São Vicente e Sal .

* **Fase 2 (Operações Avançadas - Meses 5-8):**

  * **Foco:** Automatização de processos complexos e funcionalidades móveis.

  * **Entregas:** Gestão completa de exumações e trasladações, aplicação móvel para equipas de campo, sistema de notificações automáticas.

* **Fase 3 (Otimização e Integração Total - Meses 9-12):**

  * **Foco:** Inteligência de negócio, conformidade e integração total.

  * **Entregas:** Dashboards de BI, módulo de fiscalização, integração completa com todos os sistemas externos, funcionalidades avançadas de auditoria.

## 8. Métricas e KPIs (Acompanhamento)

O sucesso do projeto será medido continuamente através de um dashboard executivo que monitoriza KPIs operacionais, financeiros e de satisfação do cliente, conforme detalhado na secção de OKRs.

***

