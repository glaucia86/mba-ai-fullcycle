from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import SecretStr
import os
load_dotenv()

model = ChatOpenAI(
    model="gpt-4o", 
    temperature=0.5,
    max_completion_tokens=100,
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
    )

message = model.invoke("Hello World!")
print(message.content)