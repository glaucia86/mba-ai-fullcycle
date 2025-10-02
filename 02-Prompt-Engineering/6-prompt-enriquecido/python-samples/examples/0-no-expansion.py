from langchain.prompts import PromptTemplate
from langchain.chat_models import init_chat_model
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from pydantic import SecretStr
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from utils.prompt_helpers import print_llm_result

load_dotenv()

llm = init_chat_model(
    model="gpt-4o",
    temperature=0.7,
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

prompt = PromptTemplate(
  input_variables=["question"],
  template=(
    "You are a technology assistant. \n"
    "Answer the following question: \n\n"
    "{question}"
  ),
)

chain = prompt | llm | StrOutputParser()

question = (
  "Explain about the LangChain and LangGraph"
)

answer = chain.invoke({"question": question})

print(answer)
print(len(answer))