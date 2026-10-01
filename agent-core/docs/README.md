# Contrato do Agent Core

## Objetivo

O Agent Core é o núcleo responsável por receber uma solicitação, preparar o contexto necessário, conversar com um **AI Provider**, controlar o uso de Skills e devolver a resposta ao usuário.

Este documento define o comportamento esperado do Core e sua relação com o restante do Tron AI. Ele é uma referência inicial e deverá ser atualizado quando novas decisões forem tomadas durante o desenvolvimento.

## Fluxo de uma requisição

```text
Entrada do usuário
    ↓
Identificação do usuário
    ↓
Criação do contexto da requisição
    ↓
Recuperação de contexto e memória relevante
    ↓
Seleção do AI Provider
    ↓
Envio da requisição ao modelo
    ↓
Resposta final ou Tool Call
    ↓
Se houver Tool Call:
    ├── validar a Skill
    ├── validar os argumentos
    ├── verificar permissões
    ├── solicitar confirmação quando necessário
    ├── resolver credenciais
    ├── executar a Skill
    └── enviar o resultado novamente ao AI Provider
    ↓
Resposta final
    ↓
Entrega ao cliente
```

Uma requisição pode utilizar várias Skills antes de chegar à resposta final.

## Responsabilidades do Core

O Core é responsável por:

- receber requisições dos clientes;
- identificar o usuário da requisição;
- criar e controlar o contexto da execução;
- recuperar informações de memória quando forem relevantes;
- disponibilizar as Skills ao AI Provider;
- enviar e receber mensagens através do AI Provider;
- processar Tool Calls;
- validar Skills e argumentos;
- verificar permissões;
- controlar confirmações de ações sensíveis ou críticas;
- resolver credenciais necessárias para integrações;
- executar Skills através de seus contratos;
- devolver resultados das Skills ao AI Provider;
- entregar a resposta final ao cliente;
- controlar o ciclo de vida da requisição;
- persistir informações que realmente precisam sobreviver ao encerramento da requisição.

## O que não é responsabilidade do Core

O Core não deve:

- renderizar a interface do usuário;
- implementar a lógica específica de cada integração;
- permitir que o modelo execute código arbitrário diretamente;
- armazenar credenciais de serviços como texto comum no banco;
- deixar que o modelo ignore as regras de permissão;
- assumir que toda informação precisa virar memória;
- tratar uma integração externa como se fosse parte do próprio Core;
- conhecer detalhes internos específicos de cada provedor de IA quando esses detalhes pertencem ao adapter do provider.

## AI Providers

Um **AI Provider** é a implementação responsável por conversar com um provedor externo ou local de inteligência.

Exemplos futuros:

- Gemini;
- OpenAI;
- modelos locais;
- outros provedores que sejam adicionados posteriormente.

O Agent Core não deve depender diretamente do SDK de um provider.

O Core deve depender de um contrato pequeno e provider-neutral, enquanto cada implementação concreta conhece as particularidades do seu próprio provedor.

### Princípio

```text
Agent Core
    ↓
AI Provider contract
    ↓
GeminiProvider / OpenAIProvider / LocalProvider / ...
    ↓
API ou runtime específico
```

A existência de um contrato comum **não significa que todos os providers terão o mesmo comportamento interno**.

Cada provider deverá ser analisado individualmente antes de sua implementação, utilizando sua documentação oficial para definir, quando aplicável:

- modelos disponíveis;
- limites de requisições;
- limites de tokens;
- cotas diárias;
- autenticação;
- códigos e formatos de erro;
- erros transitórios;
- erros permanentes;
- política de retry;
- backoff e jitter;
- tempo de espera ou cooldown;
- recursos de tool/function calling;
- estado de conversa;
- streaming;
- restrições específicas;
- informações necessárias para que o Core consiga interpretar corretamente seu estado.

Essas regras devem permanecer dentro do adapter do provider quando forem específicas daquele serviço.

### Contrato versus implementação

O contrato deve representar somente o comportamento comum que o Agent Core realmente precisa.

Não devemos criar um contrato genérico tentando esconder todas as diferenças entre providers.

Se um provider possuir uma capacidade que outro não possui, essa diferença deverá ser tratada explicitamente pela arquitetura quando a funcionalidade correspondente for implementada.

## Provider Manager

No futuro, quando existir mais de um AI Provider, o Core deverá possuir um **Provider Manager** responsável por orquestrar a escolha e a utilização dos providers.

O Provider Manager não deverá conhecer as regras internas de cada serviço.

A arquitetura esperada é:

```text
Agent Core
    ↓
Provider Manager
    ↓
┌──────────────────────────────────────────┐
│ GeminiProvider                            │
│ OpenAIProvider                            │
│ LocalProvider                             │
│ Outros providers                          │
└──────────────────────────────────────────┘
```

Cada provider deverá traduzir seu comportamento específico para estados que o Manager consiga compreender.

Exemplos de estados normalizados:

- `AVAILABLE`;
- `RATE_LIMITED`;
- `QUOTA_EXCEEDED`;
- `TEMPORARY_ERROR`;
- `AUTH_ERROR`;
- `INVALID_REQUEST`;
- `MODEL_UNAVAILABLE`.

O Manager poderá usar esses estados para decidir se deve:

- continuar usando o provider;
- aguardar um cooldown;
- tentar novamente;
- selecionar outro provider;
- interromper a execução;
- informar o usuário.

### Regra importante sobre fallback

O Provider Manager **não deve trocar de provider indiscriminadamente diante de qualquer erro**.

Exemplos:

- erro de autenticação pode indicar configuração inválida e não deve ser tratado automaticamente como simples indisponibilidade;
- solicitação inválida não deve ser repetida em outro provider sem que o Core corrija o problema;
- limite temporário de requisições pode permitir retry ou fallback, dependendo da política definida;
- cota diária excedida pode exigir cooldown até o reset ou outra decisão explícita;
- indisponibilidade temporária pode permitir retry e/ou fallback.

A decisão exata deverá ser definida com base no comportamento documentado de cada provider.

### Regra de evolução

Antes de adicionar um novo provider:

1. estudar sua documentação oficial;
2. identificar limites, cotas, erros, retry e recursos disponíveis;
3. definir o comportamento específico do adapter;
4. definir como os estados específicos serão normalizados;
5. somente então integrar o provider ao Manager.

O Manager deve ser genérico na **orquestração**, não genérico na interpretação de APIs que possuem comportamentos diferentes.

## Modelo de inteligência

O modelo pode decidir quando precisa utilizar uma Skill, mas não executará a Skill diretamente.

O fluxo será:

```text
AI Provider
  ↓
Tool Call
  ↓
Agent Core
  ↓
Permission / Credential checks
  ↓
Skill
  ↓
resultado
  ↓
Agent Core
  ↓
AI Provider
```

As regras de segurança e autorização pertencem ao Core e não podem ser substituídas pela decisão do modelo.

## Skills

Uma Skill representa uma capacidade executável do Tron.

Exemplos:

- calendário;
- arquivos;
- calculadora;
- notas;
- GitHub;
- e-mail;
- outras integrações.

O Core conhece o contrato das Skills, mas a implementação da integração pertence à própria Skill.

Uma Skill deve receber apenas o contexto e os dados necessários para executar sua operação e deve devolver um resultado estruturado.

## Contexto, memória, dados e estado

Esses conceitos não devem ser tratados como a mesma coisa.

### Contexto

Informações necessárias para processar a requisição atual.

Exemplos:

- usuário atual;
- mensagem atual;
- conversa atual;
- data e hora;
- Skills disponíveis;
- permissões aplicáveis.

### Memória

Informações persistentes que podem ser úteis em conversas futuras.

Nem toda informação produzida durante uma conversa deve virar memória.

### Dados

Informações pertencentes a uma fonte de verdade.

Exemplos:

- eventos do calendário;
- arquivos;
- dados do GitHub;
- e-mails.

Quando existir uma fonte externa de verdade, o Tron deve preferir consultá-la através da Skill em vez de duplicar todos os dados sem necessidade.

### Estado

Informações que precisam continuar existindo depois que uma requisição termina.

Exemplos:

- lembretes;
- configurações;
- permissões;
- preferências;
- tarefas pendentes.

## Usuários

Toda requisição deve estar associada a um usuário.

Isso permite separar:

- conversas;
- memórias;
- preferências;
- permissões;
- credenciais.

O fato de uma pessoa configurar uma integração não deve conceder automaticamente acesso a outro usuário.

## Permissões

Autenticação e autorização são conceitos diferentes.

Uma credencial permite que uma Skill acesse um serviço. A autorização define o que o Tron pode fazer usando esse acesso.

As ações poderão possuir diferentes níveis de risco. A classificação definitiva será definida durante a implementação das Skills.

Ações sensíveis ou críticas poderão exigir confirmação explícita do usuário.

A confirmação poderá futuramente ser feita pela interface ou por voz.

## Credenciais

Credenciais de serviços externos não devem ser armazenadas como dados comuns da aplicação.

O Core deverá utilizar um mecanismo próprio de gerenciamento de credenciais, preferencialmente apoiado pelo armazenamento seguro disponível no sistema operacional.

Uma Skill deve solicitar uma credencial pelo seu identificador lógico e não precisa conhecer onde ou como o segredo está armazenado.

## Cliente

Desktop e Mobile são clientes do Agent Core.

Eles são responsáveis pela experiência do usuário, como:

- interface;
- entrada de texto;
- entrada de voz;
- reprodução de voz;
- animações;
- apresentação de confirmações.

As regras centrais de execução, permissões e segurança devem permanecer no Core.

## Encerramento da requisição

Uma requisição possui começo, processamento e fim.

O Core não precisa manter uma execução contínua apenas para "lembrar" do que aconteceu.

Quando uma informação precisar ser recuperada posteriormente, o Tron deverá consultar a fonte apropriada, como uma Skill, memória ou armazenamento persistente.

## Princípio principal

> O AI Provider fornece inteligência; o Agent Core decide se e como uma ação pode ser executada; as Skills executam as ações.

Este princípio deve orientar as decisões de arquitetura do Tron AI.

## Documentação

- [Contrato do Agent Core](README.md) — responsabilidades, providers e fluxo do Core.
- [Objetivos e funcionalidades](objectives-and-features.md) — visão inicial do produto.
- [Runtime](runtime.md) — primeira implementação e comunicação local.
