"""
Utilitários compartilhados para os exemplos LangChain
"""

import os
from dotenv import load_dotenv
from pathlib import Path

def load_environment():
    """
    Carrega as variáveis de ambiente do arquivo .env
    """
    # Procura o arquivo .env na pasta do projeto
    env_path = Path(__file__).parent.parent / '.env'
    
    if env_path.exists():
        load_dotenv(env_path)
        print(f"✅ Arquivo .env carregado: {env_path}")
    else:
        print(f"⚠️  Arquivo .env não encontrado em: {env_path}")
        print("💡 Copie .env.example para .env e configure suas API keys")
    
    return env_path.exists()

def get_api_key(service: str) -> str:
    """
    Obtém a chave da API para um serviço específico
    
    Args:
        service: Nome do serviço ('openai', 'google', 'langchain')
    
    Returns:
        A chave da API ou None se não encontrada
    """
    key_mapping = {
        'openai': 'OPENAI_API_KEY',
        'google': 'GOOGLE_API_KEY', 
        'langchain': 'LANGCHAIN_API_KEY'
    }
    
    env_var = key_mapping.get(service.lower())
    if not env_var:
        raise ValueError(f"Serviço '{service}' não suportado. Use: {list(key_mapping.keys())}")
    
    api_key = os.getenv(env_var)
    if not api_key or api_key.startswith('your_'):
        raise ValueError(f"❌ {env_var} não configurada. Verifique seu arquivo .env")
    
    return api_key

def print_separator(title: str = "", char: str = "=", length: int = 50):
    """
    Imprime uma linha separadora com título opcional
    """
    if title:
        title_line = f" {title} "
        padding = (length - len(title_line)) // 2
        line = char * padding + title_line + char * padding
        if len(line) < length:
            line += char
    else:
        line = char * length
    
    print(line)

def display_result(result: str, title: str = "Resultado"):
    """
    Exibe o resultado de forma formatada
    """
    print_separator(title)
    print(result)
    print_separator()