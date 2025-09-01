from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.runnables import chain
from dotenv import load_dotenv
from pydantic import SecretStr
import os

load_dotenv()

@chain
def square(input_dict: dict) -> dict:
    x = input_dict["x"]
    return { "square_result": x * x }

question_template = PromptTemplate(
    input_variables=["square_result"],
    template="What is the square result?' {square_result}",
)

model = ChatOpenAI(
    model="gpt-4o",
    temperature=0.5,
    max_completion_tokens=100,
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

chain = square | question_template | model

response = chain.invoke({ "x": 10 })
print(response.content)