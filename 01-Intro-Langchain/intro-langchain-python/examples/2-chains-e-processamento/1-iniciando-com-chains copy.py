from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import SecretStr
import os

load_dotenv()

question_template = PromptTemplate(
    input_variables=["name"],
    template="Hi, I'm {name}! Tell me a joke about yourself.",
)

model = ChatOpenAI(
    model="gpt-4o",
    temperature=0.5,
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

chain = question_template | model

response = chain.invoke({"name": "Glaucia"})
print(response.content)