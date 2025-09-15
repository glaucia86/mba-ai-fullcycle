from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from pydantic import SecretStr
import os

load_dotenv()

template_translate = PromptTemplate(
  input_variables=["initial_text"],
  template="Translate the following text to English:\n ```{initial_text}```"
)

template_summary = PromptTemplate(
  input_variables=["text"],
  template="Summarize the following text in 4 words:\n ```{text}```"
)

llm_en = ChatOpenAI(
        model="gpt-4o", 
        temperature=0.5,
        #max_completion_tokens=300,
        base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
        api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
    )

translate = template_translate | llm_en | StrOutputParser()
pipeline = {"text": translate} | template_summary | llm_en | StrOutputParser()

result = pipeline.invoke({"initial_text": "LangChain é um framework para desenvolvimento de aplicações de IA" })
print(result)