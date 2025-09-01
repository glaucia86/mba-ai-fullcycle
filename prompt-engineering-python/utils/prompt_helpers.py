"""
Funções auxiliares para Prompt Engineering
"""

import os
from typing import Dict, List, Any
from dotenv import load_dotenv

def load_environment():
    """Carrega as variáveis de ambiente do arquivo .env"""
    load_dotenv()
    print("✅ Variáveis de ambiente carregadas")

def display_result(title: str, content: Any, separator: str = "="):
    """Exibe resultado formatado"""
    print(f"\n{separator * 60}")
    print(f"🎯 {title}")
    print(f"{separator * 60}")
    # Converte o conteúdo para string se necessário
    content_str = str(content) if not isinstance(content, str) else content
    print(content_str)
    print(f"{separator * 60}\n")

def get_github_models_config() -> Dict[str, str]:
    """Retorna configuração do GitHub Models"""
    return {
        "token": os.environ.get("GITHUB_MODELS_TOKEN", ""),
        "endpoint": os.environ.get("GITHUB_MODELS_ENDPOINT", ""),
    }

def format_prompt_analysis(prompt: str, response: str, technique: str) -> str:
    """Formata análise de prompt para exibição"""
    return f"""
📝 TÉCNICA: {technique}

🔤 PROMPT USADO:
{prompt}

🤖 RESPOSTA:
{response}

📊 ANÁLISE:
- Técnica aplicada: {technique}
- Tamanho do prompt: {len(prompt)} caracteres
- Tamanho da resposta: {len(response)} caracteres
    """.strip()

def create_few_shot_examples(examples: List[Dict[str, str]]) -> str:
    """Cria string formatada para exemplos few-shot"""
    formatted_examples = []
    for i, example in enumerate(examples, 1):
        formatted_examples.append(f"Exemplo {i}:")
        formatted_examples.append(f"Input: {example['input']}")
        formatted_examples.append(f"Output: {example['output']}")
        formatted_examples.append("")
    
    return "\n".join(formatted_examples)

def validate_environment() -> bool:
    """Valida se todas as variáveis necessárias estão configuradas"""
    required_vars = ["GITHUB_MODELS_TOKEN", "GITHUB_MODELS_ENDPOINT"]
    missing_vars = []
    
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Variáveis de ambiente faltando: {', '.join(missing_vars)}")
        return False
    
    print("✅ Todas as variáveis de ambiente estão configuradas")
    return True