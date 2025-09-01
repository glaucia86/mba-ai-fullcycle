from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from pydantic import SecretStr
import os

load_dotenv()

model = init_chat_model(
    model="gpt-4o",
    model_provider="openai",
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

answer_model = model.invoke("Hello World!")
print(answer_model.content)