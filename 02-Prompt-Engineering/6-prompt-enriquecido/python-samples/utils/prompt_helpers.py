"""
Funções auxiliares para Prompt Engineering
"""

import os
from pydantic import SecretStr
import os
from typing import Dict, List, Any
from dotenv import load_dotenv

from rich.console import Console
from rich.text import Text

def load_environment():
    """Carrega as variáveis de ambiente do arquivo .env"""
    load_dotenv()
    print("✅ Variáveis de ambiente carregadas")

def get_github_models_config() -> Dict[str, str]:
    """Retorna configuração do GitHub Models"""
    return {
        "token": os.environ.get("GITHUB_MODELS_TOKEN", ""),
        "endpoint": os.environ.get("GITHUB_MODELS_ENDPOINT", ""),
    }

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

def print_llm_result(prompt, response):
    """
    Print LLM prompt, response and token usage with colored formatting
    """
    console = Console()
    
    # Print prompt
    console.print(Text("USER PROMPT:", style="bold green"))
    console.print(Text(prompt, style="bold blue"), end="\n\n")
    
    # Print response
    console.print(Text("LLM RESPONSE:", style="bold green"))
    console.print(Text(response.content, style="bold blue"), end="\n\n")
    
    # Print token usage
    usage = response.response_metadata['token_usage']
    console.print(f"[bold white]Input tokens:[/bold white] [bright_black]{usage['prompt_tokens']}[/bright_black]")
    console.print(f"[bold white]Output tokens:[/bold white] [bright_black]{usage['completion_tokens']}[/bright_black]")
    console.print(f"[bold white]Total tokens:[/bold white] [bright_black]{usage['total_tokens']}[/bright_black]")
    console.print(f"[yellow]{'-'*50} [/yellow]")

def display_result(title: str, content: Any, separator: str = "="):
    """Exibe resultado formatado"""
    print(f"\n{separator * 60}")
    print(f"🎯 {title}")
    print(f"{separator * 60}")
    # Converte o conteúdo para string se necessário
    content_str = str(content) if not isinstance(content, str) else content
    print(content_str)
    print(f"{separator * 60}\n")

def create_few_shot_examples(examples: List[Dict[str, str]]) -> str:
    """Cria string formatada para exemplos few-shot"""
    formatted_examples = []
    for i, example in enumerate(examples, 1):
        formatted_examples.append(f"Exemplo {i}:")
        formatted_examples.append(f"Input: {example['input']}")
        formatted_examples.append(f"Output: {example['output']}")
        formatted_examples.append("")
    
    return "\n".join(formatted_examples)