from langchain_core.runnables import RunnableLambda
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import SecretStr
import os
import re

load_dotenv()

def extract_and_analyze_text(text: str) -> dict:
    """
    Função prática que analisa um texto e extrai informações úteis
    para criar um resumo personalizado
    """
    
    # Extrair emails
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    
    # Contar palavras e sentenças
    words = text.split()
    sentences = text.split('.')
    
    # Identificar palavras-chave importantes
    keywords = ['projeto', 'reunião', 'prazo', 'urgente', 'importante', 'deadline']
    found_keywords = [word for word in keywords if word.lower() in text.lower()]
    
    # Determinar nível de urgência
    urgent_words = ['urgente', 'asap', 'imediatamente', 'crítico', 'emergência']
    urgency_level = sum(1 for word in urgent_words if word.lower() in text.lower())
    
    return {
        "original_text": text,
        "word_count": len(words),
        "sentence_count": len([s for s in sentences if s.strip()]),
        "emails": emails,
        "keywords": found_keywords,
        "urgency_score": urgency_level,
        "text_length": "curto" if len(words) < 20 else "médio" if len(words) < 50 else "longo",
        "has_contact": len(emails) > 0,
        "summary": f"Texto {len(words)} palavras com {len(found_keywords)} palavras-chave importantes"
    }
    
def main():
    print("=== EXEMPLO PRÁTICO: ANÁLISE DE TEXTO COM RUNNABLE LAMBDA COM LANGCHAIN ===\n")
    
    # Criar RunnableLambda para análise de texto
    analyze_runnable = RunnableLambda(extract_and_analyze_text)
    
    # Template que usa os dados analisados
    template = PromptTemplate(
        input_variables=["summary", "keywords", "urgency_score", "text_length"],
        template="""
            Baseado na análise do texto:

            Resumo: {summary}
            Palavras-chave encontradas: {keywords}
            Nível de urgência: {urgency_score}
            Tamanho do texto: {text_length}

            Crie um resumo executivo deste texto e sugira qual a melhor forma de responder ou agir sobre ele.
            """.strip()
    )
    
    # Modelo
    model = ChatOpenAI(
        model="gpt-4o", 
        temperature=0.5,
        #max_completion_tokens=300,
        base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
        api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
    )
    
    # Chain: análise -> template -> modelo
    analysis_chain = analyze_runnable | template | model
    
    # Texto de exemplo realista
    sample_text = """
        Prezado João,
        
        Preciso urgentemente do relatório do projeto para a reunião de amanhã.
        O prazo é crítico e o cliente estará presente. Por favor, envie para 
        joao.silva@empresa.com até as 14h de hoje.
        
        É muito importante que inclua os dados de performance e o cronograma atualizado.
        
        Obrigada!   
    """
    
    print("Texto para análise:")
    print(sample_text)
    print("\n" + "="*60 + "\n")
    
    # Executar apenas a análise primeiro
    print("Resultado da análise:")
    analysis_response = analyze_runnable.invoke(sample_text)
    
    for key, value in analysis_response.items():
        if key != "original_text": # Não imprimir o texto original
            print(f"{key}: {value}")
    
    print("\n" + "="*60 + "\n")
    
    # Executar a chain completa
    print("Resumo Executivo gerado pelo LLM:")
    try:
        response = analysis_chain.invoke(sample_text)
        print(response.content)
    except Exception as e:
        print(f"Erro ao gerar o resumo executivo: {e}")
    
if __name__ == "__main__":
    main()
    
    