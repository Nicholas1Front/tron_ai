# Contrato do Agent Core

## Objetivo

O Agent Core é o núcleo responsável por receber uma solicitação, preparar o contexto necessário, conversar com a OpenAI, controlar o uso de Skills e devolver a resposta ao usuário.

Este documento define o comportamento esperado do Core e sua relação com o restante do Tron AI. Ele é uma referência inicial e poderá ser alterado quando novas decisões forem tomadas durante o desenvolvimento.

## Fluxo de uma requisição

O fluxo esperado é:

```text
Entrada do usuário
    ↓
Identificação do usuário
    ↓
Criação do contexto da requisição
    ↓
Recuperação de contexto e memória relevante
    ↓
Disponibilização das Skills para a OpenAI
    ↓
Requisição para a OpenAI
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
    └── enviar o resultado novamente para a OpenAI
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
- disponibilizar as Skills para a OpenAI;
- enviar e receber mensagens da OpenAI;
- processar Tool Calls;
- validar Skills e argumentos;
- verificar permissões;
- controlar confirmações de ações sensíveis ou críticas;
- resolver credenciais necessárias para integrações;
- executar Skills através de seus contratos;
- devolver resultados das Skills para a OpenAI;
- entregar a resposta final ao cliente;
- controlar o ciclo de vida da requisição;
- persistir informações que realmente precisam sobreviver ao encerramento da requisição.

## O que não é responsabilidade do Core

O Core não deve:

- renderizar a interface do usuário;
- implementar a lógica específica de cada integração;
- permitir que a OpenAI execute código arbitrário diretamente;
- armazenar credenciais de serviços como texto comum no banco;
- deixar que a OpenAI ignore as regras de permissão;
- assumir que toda informação precisa virar memória;
- tratar uma integração externa como se fosse parte do próprio Core.

## OpenAI

A OpenAI será o motor de inteligência do Tron nesta primeira fase.

O modelo poderá decidir quando precisa utilizar uma Skill, mas não executará a Skill diretamente.

O fluxo será:

```text
OpenAI
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
OpenAI
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

> A OpenAI decide o que precisa ser feito; o Agent Core decide se e como isso pode ser feito; as Skills executam as ações.

Este princípio deve orientar as decisões de arquitetura do Tron AI.
