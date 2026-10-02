# Runtime do Agent Core

## Primeira entrega

O runtime inicial disponibiliza o Agent Core como um processo local que pode receber requisições e devolver respostas estruturadas.

Até aqui foram implementados:

- AI Provider inicial baseado na Gemini API;
- contrato provider-neutral para comunicação com o modelo;
- UserIdentity;
- AgentContext;
- contratos de AI input/response;
- AIToolCall;
- ToolDefinition;
- ToolContext;
- ToolResult.

Ainda não existem implementações completas de:

- Tool Calling;
- Skills;
- memória;
- banco de dados;
- autenticação;
- permissões;
- confirmações;
- credenciais;
- voz;
- Provider Manager;
- Tool Manager.

Os contratos estão sendo definidos antes das implementações para manter responsabilidades separadas e evitar acoplamento desnecessário.

## Stack inicial

- Node.js: runtime.
- TypeScript: linguagem e tipagem.
- Fastify: servidor HTTP local.
- Zod: validação dos dados recebidos.
- `@google/genai`: SDK oficial do Google GenAI para o provider Gemini.

A API Interactions do Gemini é utilizada para a primeira integração. A documentação atual do Google recomenda essa API para novos projetos e agentes.

## Configuração

O Agent Core utiliza:

- `GEMINI_API_KEY`: chave da Gemini API;
- `GEMINI_MODEL`: modelo utilizado pelo Gemini Provider.

O modelo padrão inicial é `gemini-3.8-flash`. O acesso e os limites de uso dependem das cotas e condições atuais do projeto.

As variáveis são carregadas a partir do arquivo `.env` durante o desenvolvimento.

O arquivo `.env` não deve ser versionado.

## Comunicação inicial

O Core fica disponível localmente por HTTP.

Endpoint de saúde:

`GET /health`

Endpoint inicial do agente:

`POST /api/v1/agent/requests`

Exemplo de entrada:

```json
{
  "userId": "user-123",
  "input": {
    "type": "text",
    "content": "Olá, Tron."
  }
}
```

A resposta possui o formato:

```json
{
  "message": "Agent request processed.",
  "data": {
    "requestId": "uuid",
    "userId": "user-123",
    "content": "Resposta gerada pelo AI Provider."
  }
}
```

## Por que HTTP local?

Mesmo rodando na mesma máquina do Desktop, o Core fica separado da interface.

Isso cria uma fronteira clara:

```text
Desktop
   ↓ HTTP local
Agent Core
```

Posteriormente poderemos avaliar IPC nativo do Electron, WebSocket ou outro mecanismo caso exista uma necessidade real. A decisão não é definitiva nesta etapa.

## Decisão sobre o runtime local

O Agent Core será o runtime local responsável por orquestrar providers, Tools, Skills, credenciais, permissões e confirmações.

Não será criado um segundo agente de IA para administrar essas responsabilidades. O modelo fornece inteligência; o Core mantém o controle determinístico da execução.

## Provider Manager

O Provider Manager ainda não faz parte da implementação atual.

Quando houver múltiplos providers, ele deverá:

- receber estados normalizados dos adapters;
- considerar disponibilidade, limites e cooldowns;
- aplicar uma política explícita de seleção;
- evitar fallback indiscriminado;
- impedir que um provider pago seja utilizado acidentalmente quando a política estiver configurada para uso gratuito.

As regras específicas de cada provider permanecerão nos respectivos adapters.

## Próximo passo

A próxima etapa técnica é implementar o fluxo interno de Tool Calling usando os contratos já definidos. Depois disso, serão avaliados autenticação, usuários e credenciais.

Depois de validar a primeira chamada real ao Gemini, a próxima evolução do provider deverá tratar especificamente os erros, limites e retry documentados pela Gemini API.

Somente depois de existir mais de um provider fará sentido implementar o Provider Manager.
