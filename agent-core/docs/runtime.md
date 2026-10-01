# Runtime do Agent Core

## Primeira entrega

O runtime inicial tem uma responsabilidade simples: disponibilizar o Agent Core como um processo local que pode receber requisições e devolver respostas estruturadas.

Nesta etapa ainda não existem:

- integração com a OpenAI;
- Skills;
- memória;
- banco de dados;
- permissões;
- credenciais;
- voz.

Esses recursos serão adicionados conforme seus contratos forem definidos.

## Stack inicial

- Node.js: runtime.
- TypeScript: linguagem e tipagem.
- Fastify: servidor HTTP local.
- Zod: validação dos dados recebidos.

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

A resposta inicial possui o formato:

```json
{
  "message": "Agent request processed.",
  "data": {
    "requestId": "uuid",
    "userId": "user-123",
    "content": "Agent Core inicializado. O processamento com a OpenAI será implementado nas próximas etapas."
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

## Próximo passo

O próximo módulo deverá substituir a resposta fixa pela integração com a OpenAI, mantendo o Core como responsável pela orquestração.
