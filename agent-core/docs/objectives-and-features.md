# Objetivos e funcionalidades do Tron AI

## Objetivo

O Tron AI será um agente pessoal de inteligência artificial com arquitetura modular.

A primeira versão será focada em um aplicativo local, com o Agent Core executando na máquina do usuário e um AI Provider inicial baseado na Gemini API.

O projeto deverá permitir que diferentes pessoas utilizem o Tron, mantendo separadas suas preferências, memórias, permissões, conversas e integrações.

Este documento apresenta uma visão inicial. As funcionalidades, prioridades e detalhes técnicos serão definidos e revisados durante a implementação de cada módulo.

## Objetivos principais

- Criar um agente pessoal capaz de conversar por texto e, futuramente, por voz.
- Utilizar um sistema de AI Providers para permitir evolução e substituição do provedor de inteligência.
- Começar com a Gemini API no nível sem custo financeiro disponível.
- Executar o Agent Core localmente.
- Manter uma arquitetura modular baseada em Skills.
- Permitir que novas capacidades sejam adicionadas sem modificar todo o Core.
- Permitir diferentes clientes, começando pelo Desktop e posteriormente pelo Mobile.
- Permitir múltiplos usuários.
- Separar dados, memórias, preferências, permissões e credenciais por usuário.
- Criar mecanismos de confirmação para ações sensíveis ou críticas.
- Manter credenciais protegidas e separadas dos dados comuns da aplicação.
- Permitir que o agente consulte fontes de verdade, como calendários, arquivos e serviços externos, quando necessário.

## Estado atual do Agent Core

O Core já possui um runtime local, integração real com Gemini, contrato de AI Provider e os primeiros contratos de identidade, contexto, respostas de AI e Tools.

A próxima evolução é completar o fluxo interno de Tool Calling antes de avançar para autenticação, persistência e Skills reais.

## Arquitetura de execução

O Agent Core será o runtime local responsável pela orquestração.

Não será criado um segundo agente de IA para administrar providers, credenciais ou Tools.

O modelo fornece inteligência e pode solicitar uma Tool. O Core valida a solicitação, aplica permissões e confirmações, resolve credenciais e controla a execução.

```text
Cliente
   ↓
Agent Core
   ├── Context / Memory
   ├── Provider Manager
   ├── Credential Manager
   └── Tool Manager
           ↓
        Tool / Skill
```

## Contratos

Os contratos iniciais do Core devem separar:
- identidade do usuário;
- contexto da execução;
- comunicação com AI Providers;
- Tool Calls;
- definição e resultado de Tools;
- permissões;
- confirmações;
- credenciais.

Esses contratos devem permanecer pequenos e provider-neutral. Detalhes específicos de cada serviço devem ficar em seus adapters.

## Funcionalidades previstas

### Conversação

- Conversar com o usuário por texto.
- Suportar voz futuramente.
- Manter o contexto da conversa atual.
- Gerar respostas através do AI Provider selecionado.
- Permitir que o modelo utilize Skills quando necessário.

### AI Providers

O Tron deverá possuir uma camada de providers para separar o Agent Core dos SDKs e APIs específicos de cada serviço.

O primeiro provider será o Gemini.

Providers futuros poderão incluir:

- outros serviços comerciais;
- modelos locais;
- outros runtimes de IA.

Cada provider deverá ser implementado de acordo com sua documentação oficial. Limites, cotas, erros, retry, autenticação e recursos não devem ser presumidos como iguais entre providers.

Quando houver mais de um provider, um Provider Manager poderá realizar a orquestração e o fallback de acordo com estados normalizados e políticas explícitas.

### Skills

A arquitetura deverá permitir capacidades como:

- calculadora;
- notas;
- agenda/calendário;
- arquivos locais;
- e-mail;
- GitHub;
- outras APIs e serviços;
- integrações futuras que sejam consideradas úteis.

A lista não é definitiva.

### Memória

O Tron poderá possuir memória persistente para informações que sejam úteis em conversas futuras.

A memória deverá ser tratada separadamente do contexto temporário da conversa e dos dados pertencentes a serviços externos.

### Usuários

O sistema deverá permitir mais de um usuário.

Cada usuário poderá possuir suas próprias:

- preferências;
- conversas;
- memórias;
- permissões;
- credenciais;
- configurações de voz e interface.

### Personalização

O usuário poderá futuramente configurar aspectos como:

- idioma;
- voz;
- velocidade da voz;
- tema visual;
- escala ou aparência da interface;
- outras preferências do agente.

### Segurança

O Tron deverá possuir controles para evitar ações inesperadas.

Entre as possibilidades previstas estão:

- classificação de risco das Skills;
- permissões por usuário;
- confirmação de ações sensíveis;
- confirmação de ações críticas;
- proteção de credenciais;
- validação dos argumentos enviados para Skills;
- separação entre o que o modelo pode solicitar e o que o Core pode executar.

### Integrações

O Tron deverá poder se conectar a serviços externos através de Skills.

Cada integração poderá possuir seu próprio método de autenticação, como OAuth, tokens, chaves ou outros mecanismos disponibilizados pelo serviço.

O método de autenticação não será definido de forma genérica para todas as Skills.

### Desktop

O Desktop será o primeiro cliente principal.

A aplicação deverá futuramente oferecer:

- interface de conversação;
- entrada de voz;
- resposta por voz;
- visualização do estado do agente;
- confirmações;
- configurações;
- gerenciamento de Skills e integrações;
- gerenciamento de usuário.

### Mobile

O Mobile será desenvolvido posteriormente.

A intenção é que ele utilize o mesmo conceito de Agent Core e mantenha a experiência e os recursos compatíveis com o restante do sistema, respeitando as limitações específicas de dispositivos móveis.

## Fora do escopo inicial

Não serão tomadas decisões antecipadas sobre:

- todos os providers futuros;
- provider manager completo;
- banco de dados definitivo;
- sistema definitivo de memória;
- sistema definitivo de voz;
- mecanismo definitivo de autenticação;
- todas as Skills futuras;
- infraestrutura de servidor remoto;
- suporte a modelos de IA locais.

Esses pontos serão definidos quando o módulo correspondente for desenvolvido.

## Princípio de evolução

O Tron será desenvolvido por módulos.

Cada nova etapa deverá definir seus próprios requisitos, contratos, dependências, segurança e testes antes da implementação.

Para novos AI Providers, a documentação oficial do serviço deverá ser analisada antes da implementação, principalmente quanto a limites, cotas, erros, retry, autenticação e capacidades específicas.

Este documento representa apenas a visão inicial do projeto e pode ser atualizado conforme o Tron evoluir.
