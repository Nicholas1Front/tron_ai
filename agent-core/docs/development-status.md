# Estado e objetivos de desenvolvimento do Agent Core

## Objetivo deste documento

Este documento acompanha a evolução do Agent Core do Tron AI.

A ideia é manter uma visão simples de:
- o que já foi construído;
- quais decisões já foram tomadas;
- quais contratos já existem;
- o que ainda falta desenvolver;
- qual é a ordem planejada das próximas etapas.

Este documento é um registro de desenvolvimento e pode ser atualizado conforme a arquitetura evoluir.

## O que já construímos

### Runtime local

O Agent Core roda localmente como uma aplicação Node.js + TypeScript.

Stack atual:
- Node.js;
- TypeScript;
- Fastify;
- Zod;
- SDK oficial `@google/genai`.

O Core possui `GET /health`, `POST /api/v1/agent/requests`, validação com Zod, processamento através de `AgentCore` e comunicação com Gemini através de `GeminiProvider`.

### Provider

Criamos o contrato `AIProvider`. O Agent Core conhece o contrato, e não os detalhes de uma API específica. Gemini é atualmente a primeira implementação concreta.

### Identidade e contexto

Os primeiros contratos de identidade e contexto já foram definidos:

```ts
type UserIdentity = {
  userId: string;
};

type AgentContext = {
  requestId: string;
  user: UserIdentity;
};
```

A autenticação real ainda não foi implementada.

### Contratos de AI

O Core já possui contratos para entrada de AI, chamadas de Tools, resposta textual e resposta que solicita uma Tool. O objetivo é normalizar diferenças entre Gemini, Claude, Grok, DeepSeek ou modelos locais.

### Contratos de Tools

Também foram definidos contratos para descrição de Tool, schema de entrada, nível de risco, contexto de execução e resultados de sucesso ou erro. Ainda não existe uma Tool real integrada ao Core.

## O que ainda não foi implementado

- Agent Context completo;
- Provider Manager;
- Credential Manager;
- Tool Manager;
- Permission Manager;
- Confirmation Manager;
- loop de Tool Calling;
- execução real de Tools;
- Skills;
- autenticação;
- usuários persistentes;
- armazenamento de credenciais;
- memória;
- configurações por usuário;
- providers adicionais;
- cliente Desktop;
- cliente Mobile.

## Objetivos de desenvolvimento

### 1. Fechar os contratos

Definir claramente identidade, contexto, AI Request, AI Response, Tool Call, Tool Definition, Tool Result, Provider, Provider Manager, Credential Manager, Tool, Tool Manager, Permission Manager e Confirmation Manager.

### 2. Criar o fluxo interno do agente

```text
Request
  ↓
UserIdentity
  ↓
AgentContext
  ↓
Provider Manager
  ↓
AI Provider
  ↓
Text ou Tool Call
  ↓
Se Tool Call:
  ├── localizar Tool
  ├── validar argumentos
  ├── verificar permissão
  ├── solicitar confirmação quando necessário
  ├── resolver credencial
  ├── executar Tool
  └── devolver Tool Result para a IA
  ↓
Resposta final
```

### 3. Provar a arquitetura

Antes de integrar serviços externos, criar uma Tool simples de teste. Ela deverá provar que o modelo pode solicitar uma Tool, o Core consegue validá-la, aplicar segurança, executá-la e devolver o resultado para a IA.

### 4. Autenticação e usuários

Depois que o fluxo interno estiver funcionando, implementar autenticação, usuários e `UserIdentity` baseado em uma sessão autenticada. Autenticação não deve ser confundida com credenciais dos providers.

### 5. Credenciais

Criar gerenciamento seguro de credenciais. Uma credencial deve pertencer a um usuário e a uma integração/provider. O Core não deve depender de uma única `GEMINI_API_KEY` global quando passar a trabalhar com credenciais por usuário.

### 6. Provider Manager

Implementar quando houver necessidade real de múltiplos providers. Ele deverá considerar preferência do usuário, configuração, disponibilidade, limites, quotas, cooldowns, capacidades, erros normalizados e política de fallback.

### 7. Skills e Tools reais

Depois que o loop de execução estiver estável, adicionar Skills gradualmente, como calculadora, arquivos, notas, calendário, GitHub e e-mail.

## Decisão sobre um segundo agente local

Não será criado um segundo agente de IA para administrar providers, credenciais, permissões ou Skills.

O próprio Agent Core será o runtime local responsável por essas regras. O modelo participa do raciocínio e pode solicitar Tools, mas não controla diretamente credenciais, permissões, confirmações, execução de código ou chamadas externas arbitrárias.

```text
AI Provider
  ↓
fornece inteligência

Agent Core
  ↓
controla o fluxo e as regras

Tool / Skill
  ↓
executa uma ação permitida
```

## Princípios

- Um contrato pode ser preparado para evolução, mas a implementação deve entrar quando existir necessidade real.
- Provider-neutral não significa comportamento idêntico entre providers.
- O Core é uma fronteira de segurança.
- O modelo não recebe API keys, tokens ou outros segredos como parte normal do contexto.
- Dados produzidos pelo modelo são tratados como entrada não confiável até serem validados.
- Quando uma informação pertence a um serviço externo, a Skill deve consultar a fonte de verdade quando necessário.

## Estado atual resumido

```text
Runtime local                 ✓
Fastify                       ✓
Zod                           ✓
Gemini Provider               ✓
AIProvider contract           ✓
UserIdentity contract         ✓
AgentContext contract         ✓
AI input/response contracts   ✓
Tool contracts                ✓

Provider Manager              → próximo
Credential Manager            → planejado
Tool Manager                  → planejado
Permission Manager            → planejado
Confirmation Manager          → planejado
Tool execution loop           → planejado
Authentication                → depois do Core interno
Users                         → depois da autenticação
Skills reais                  → depois do loop de Tools
```

## Próximo marco

O próximo marco técnico é fechar o contexto e o fluxo de execução interno do Agent Core, principalmente `AgentContext`, `AIRequest`, `AIResponse`, `AIToolCall`, `ToolDefinition`, `ToolResult`, Provider Manager, Tool Manager e Permission/Confirmation.

Somente depois disso devemos avançar para autenticação e persistência de usuários.