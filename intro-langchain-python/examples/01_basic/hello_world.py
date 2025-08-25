"""
Exemplo 01: Hello World com LangChain
Demonstra o uso básico do LangChain com OpenAI
"""

import sys
import os

# Adiciona o diretório utils ao path para importar os helpers
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from utils import load_environment, get_api_key, display_result
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

def main():
    """Exemplo básico de chat com OpenAI"""
    
    print("🚀 LangChain Hello World")
    print("========================")
    
    # Carrega variáveis de ambiente
    if not load_environment():
        return
    
    try:
        # Obtém a chave da API
        api_key = get_api_key('openai')
        
        # Inicializa o modelo
        llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.7,
            api_key=api_key
        )
        
        # Cria uma mensagem
        message = HumanMessage(content="Olá! Explique em uma frase o que é LangChain.")
        
        # Faz a chamada
        print("💭 Enviando pergunta para o modelo...")
        response = llm.invoke([message])
        
        # Exibe o resultado
        display_result(response.content, "Resposta do ChatGPT")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        print("💡 Verifique se sua OPENAI_API_KEY está configurada corretamente")

if __name__ == "__main__":
    main()