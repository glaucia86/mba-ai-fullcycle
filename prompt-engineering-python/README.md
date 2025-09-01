# Prompt Engineering - Python

Este projeto contém exemplos práticos de **Prompt Engineering** usando LangChain em Python, focando em técnicas avançadas de criação e otimização de prompts.

## 🎯 Objetivo

Demonstrar técnicas de **Prompt Engineering** através de exemplos práticos:
- ✅ **Prompt Design** - Criação de prompts eficazes
- ✅ **Few-Shot Learning** - Aprendizado com poucos exemplos
- ✅ **Chain of Thought** - Raciocínio passo a passo
- ✅ **Prompt Templates** - Templates reutilizáveis
- ✅ **Role-Based Prompts** - Prompts baseados em papéis
- ✅ **Context Management** - Gerenciamento de contexto

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
# GITHUB_MODELS_TOKEN="seu_github_token_aqui"
# GITHUB_MODELS_ENDPOINT="https://models.inference.ai.azure.com"
```

## 📁 Estrutura do Projeto

```
prompt-engineering-python/
├── .venv/                    # Ambiente virtual
├── .vscode/                  # Configurações VS Code
│   └── settings.json
├── examples/                 # Exemplos organizados
│   ├── 1-fundamentos/       # Fundamentos de Prompt Engineering
│   │   ├── 1-basic-prompts.py
│   │   ├── 2-prompt-templates.py
│   │   ├── 3-role-based-prompts.py
│   │   └── 4-context-management.py
│   ├── 2-techniques/        # Técnicas Avançadas
│   │   ├── 1-few-shot-learning.py
│   │   ├── 2-chain-of-thought.py
│   │   ├── 3-prompt-chaining.py
│   │   └── 4-prompt-optimization.py
│   └── 3-advanced/          # Técnicas Avançadas
│       ├── 1-meta-prompting.py
│       ├── 2-prompt-injection-defense.py
│       └── 3-adaptive-prompts.py
├── utils/                   # Utilitários compartilhados
│   ├── __init__.py
│   └── prompt_helpers.py
├── .env                     # Variáveis de ambiente
├── .env.example            # Exemplo de configuração
├── .gitignore              # Arquivos ignorados
├── requirements.txt        # Dependências Python
└── README.md              # Documentação
```

## 📚 Exemplos Disponíveis

### 🎯 **1. Fundamentos**
| Exemplo | Descrição | Comando |
|---------|-----------|---------|
| **Basic Prompts** | Prompts básicos e estruturados | `python examples/1-fundamentos/1-basic-prompts.py` |
| **Prompt Templates** | Templates reutilizáveis | `python examples/1-fundamentos/2-prompt-templates.py` |
| **Role-Based** | Prompts baseados em papéis | `python examples/1-fundamentos/3-role-based-prompts.py` |
| **Context Management** | Gerenciamento de contexto | `python examples/1-fundamentos/4-context-management.py` |

### 🔧 **2. Técnicas**
| Exemplo | Descrição | Comando |
|---------|-----------|---------|
| **Few-Shot Learning** | Aprendizado com poucos exemplos | `python examples/2-techniques/1-few-shot-learning.py` |
| **Chain of Thought** | Raciocínio passo a passo | `python examples/2-techniques/2-chain-of-thought.py` |
| **Prompt Chaining** | Encadeamento de prompts | `python examples/2-techniques/3-prompt-chaining.py` |
| **Optimization** | Otimização de prompts | `python examples/2-techniques/4-prompt-optimization.py` |

### 🚀 **3. Avançado**
| Exemplo | Descrição | Comando |
|---------|-----------|---------|
| **Meta-Prompting** | Prompts que geram prompts | `python examples/3-advanced/1-meta-prompting.py` |
| **Injection Defense** | Defesa contra prompt injection | `python examples/3-advanced/2-prompt-injection-defense.py` |
| **Adaptive Prompts** | Prompts adaptativos | `python examples/3-advanced/3-adaptive-prompts.py` |

## 🛠️ Dependências Principais

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| **langchain** | ^0.3.27 | Framework principal do LangChain |
| **langchain-openai** | ^0.3.31 | Integração com OpenAI/GitHub Models |
| **langchain-google-genai** | ^2.1.9 | Integração com Google Generative AI |
| **python-dotenv** | ^1.1.1 | Carregamento de variáveis de ambiente |
| **beautifulsoup4** | ^4.13.5 | Processamento de HTML |
| **pypdf** | ^6.0.0 | Processamento de PDFs |

## 🎯 Como Executar

### **Executar Exemplo Específico**
```bash
# Fundamentos
python examples/1-fundamentos/1-basic-prompts.py

# Técnicas
python examples/2-techniques/1-few-shot-learning.py

# Avançado
python examples/3-advanced/1-meta-prompting.py
```

### **Execução Sequencial por Categoria**
```bash
# Todos os fundamentos
python examples/1-fundamentos/1-basic-prompts.py
python examples/1-fundamentos/2-prompt-templates.py
python examples/1-fundamentos/3-role-based-prompts.py
python examples/1-fundamentos/4-context-management.py

# Todas as técnicas
python examples/2-techniques/1-few-shot-learning.py
python examples/2-techniques/2-chain-of-thought.py
python examples/2-techniques/3-prompt-chaining.py
python examples/2-techniques/4-prompt-optimization.py
```

## 🧪 Desenvolvimento

### **Ativação do Ambiente Virtual**
```bash
# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate
```

### **Instalação de Dependências**
```bash
pip install -r requirements.txt
```

### **Configuração VS Code**
O projeto inclui configurações otimizadas para VS Code:
- ✅ **Interpretador Python** configurado para `.venv`
- ✅ **Variáveis de ambiente** carregadas automaticamente
- ✅ **Paths de análise** configurados
- ✅ **Exclusões** de cache e arquivos temporários

## 📝 Notas Importantes

- 🔑 **API Keys**: Configure suas chaves no arquivo `.env`
- 🌐 **GitHub Models**: Exemplos usam GitHub Models como provider principal
- 🔒 **Segurança**: Arquivo `.env` está no `.gitignore` por segurança
- 📊 **Logging**: Todos os exemplos incluem logs detalhados
- 🛡️ **Error Handling**: Tratamento robusto de erros implementado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.