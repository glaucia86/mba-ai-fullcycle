from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from pydantic import SecretStr
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from utils.prompt_helpers import print_llm_result

load_dotenv()

system = ("system", 
    """
    Você é um professor universitário de ciência da computação, muito técnico e explica conceitos
    com definições formais e pseudocódigo
    """          
)

system2 = ("system",
    """
    Você é um estudante do ensino médio que está começando a aprender programação.
    Você não é muito técnico e prefere explicar conceitos com palavras e exemplos simples.
    """          
)

user = ("user", "Explique recursão em 50 palavras.")

chat_prompt = ChatPromptTemplate([system, user])
chat_prompt2 = ChatPromptTemplate([system2, user])
messages = chat_prompt.format_messages()

model = ChatOpenAI(
    model="gpt-4o",
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)
response = model.invoke(messages)
print_llm_result(str(system), response)

response2 = model.invoke(chat_prompt2.format_messages())
print_llm_result(str(system2), response2)