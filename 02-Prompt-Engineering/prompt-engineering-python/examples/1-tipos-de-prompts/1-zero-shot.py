from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import SecretStr
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from utils.prompt_helpers import print_llm_result

load_dotenv()

message1 = "Qual é a capital do Brasil?"

message2 = """
  Encontre a intenção do usuário no texto a seguir: Estou procurando um
  restaurante na região de São Paulo que tenha uma boa avaliação para comida
  japonesa.
  """
  
message3 = "Qual é a capital do Brasil? Responda somente dando o nome da cidade."

model = ChatOpenAI(
    model="gpt-4o",
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

response1 = model.invoke(message1)
response2 = model.invoke(message2)
response3 = model.invoke(message3)

print_llm_result(message1, response1)
print_llm_result(message2, response2)
print_llm_result(message3, response3)