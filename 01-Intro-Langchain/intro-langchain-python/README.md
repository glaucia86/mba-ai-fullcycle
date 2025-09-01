# LangChain Python Examples

Este projeto contém exemplos práticos de uso do LangChain em Python.

## 🚀 Setup

### 1. **Ambiente Virtual**
O projeto possui seu próprio ambiente virtual isolado na pasta `.venv/`

### 2. **Dependências** 
Instale as dependências usando:
```bash
pip install -r requirements.txt
```

### 3. **Configuração de API Keys**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas chaves reais
```

## 📁 Estrutura do Projeto

```
intro-langchain-python/
├── .env.example          # Template de configuração
├── .env                  # Suas configurações (não commitado)
├── .vscode/             # Configurações VS Code
├── .gitignore           # Arquivos ignorados pelo Git
├── README.md            # Este arquivo
├── requirements.txt     # Dependências Python
├── examples/            # Exemplos práticos
│   └── 01_basic/        # Exemplos básicos
│       └── hello_world.py
├── utils/               # Utilitários compartilhados
│   ├── __init__.py
│   └── helpers.py
└── resources/           # Recursos (PDFs, textos, etc.)
```

## 🔧 Como Executar

### **Opção 1: Da pasta do projeto**
```bash
cd intro-langchain-python
python examples/01_basic/hello_world.py
```

### **Opção 2: Da raiz do workspace**
```bash
cd intro-langchain-python
python examples/01_basic/hello_world.py
```

## 📚 Dependências Principais

- `langchain==0.3.27` - Framework principal
- `langchain-openai==0.3.31` - Integração com OpenAI  
- `langchain-google-genai==2.1.9` - Integração com Google AI
- `python-dotenv==1.1.1` - Carregamento de variáveis de ambiente
- `beautifulsoup4==4.13.5` - Web scraping
- `pypdf==6.0.0` - Processamento de PDFs

## 🎯 Próximos Passos

1. Configure suas API keys no arquivo `.env`
2. Execute o exemplo básico para testar
3. Explore os utilitários em `utils/`
4. Crie novos exemplos organizados por categoria

## 📚 Currículo de Exemplos

- [x] **Setup e Configuração**
    - [x] Ambiente de desenvolvimento
    - [x] Configuração de API Keys
    - [x] Primeiro exemplo funcional

- [ ] **Primeiros Passos**
    - [ ] Configurando ambiente de desenvolvimento
    - [ ] Criando API Keys
    - [ ] Chamando LLM pela primeira vez
    - [ ] PromptTemplate

- [ ] **Chains e Processamento**
    - [ ] Iniciando com Chains
    - [ ] Chains como decorators
    - [ ] Runnable Lambdas
    - [ ] Criando Pipeline com mais etapas
    - [ ] Iniciando com sumarização
    - [ ] TextSpliter e Sumarização
    - [ ] Sumarização com map e reduce
    - [ ] Criando pipeline customizado de sumarização

- [ ] **Desenvolvimento de agentes de ReAct**
    - [ ] Agentes e ReAct
    - [ ] Criando Tools
    - [ ] Desenvolvendo Agente
    - [ ] Usando Hub para Prompts prontos

- [ ] **Gerenciamento de memória**
    - [ ] Introdução a memória
    - [ ] Armazenamento do histórico de conversas
    - [ ] Histórico baseado em sliding window

- [ ] **Data loading e RAG**
    - [ ] Introdução a Data Loading e RAG
    - [ ] Chunking
    - [ ] Data loading com WebBasedLoader
    - [ ] Carregamento de PDF
    - [ ] Iniciando com PgVector
    - [ ] Enriquecendo documentos
    - [ ] Criando Store para o PGVector
    - [ ] Fazendo a ingestão dos documentos
    - [ ] Fazendo busca vetorial


