from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from pydantic import SecretStr
import os

load_dotenv()

system = ("system", "You are an assistant that answers questions in a {style} style")
user = ("user", "{question}")

chat_prompt = ChatPromptTemplate([system, user])
messages = chat_prompt.format_messages(style="funny", question="Who is Alan Turing?")

print("=== MENSAGENS FORMATADAS ===")
for msg in messages:
    print(f"{msg.type}: {msg.content}")

print("\n" + "="*50 + "\n")
   
model = ChatOpenAI(
    model="gpt-4o",
    temperature=0.5,
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)


response = model.invoke(messages)
print("=== RESPOSTA DO MODELO ===")
print(response.content)