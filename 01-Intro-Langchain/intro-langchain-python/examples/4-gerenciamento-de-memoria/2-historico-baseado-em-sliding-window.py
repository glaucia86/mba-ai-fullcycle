from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables import RunnableConfig, RunnableWithMessageHistory
from langchain_core.messages import trim_messages
from langchain_core.runnables import RunnableLambda
from dotenv import load_dotenv
from pydantic import SecretStr
import os

load_dotenv()

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}"),
])

chat_model = ChatOpenAI(
    model="gpt-4o", 
    temperature=0.9,
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

def prepare_inputs(payload: dict) -> dict:
  raw_history = payload.get("raw_history", [])
  trimmed = trim_messages(
    raw_history,
    token_counter=len,
    max_tokens=2,
    strategy="last",
    start_on="human",
    include_system=True,
    allow_partial=False
  )
  
  return { "input": payload.get("input", ""), "history": trimmed }

prepare = RunnableLambda(prepare_inputs)
chain = prepare | prompt | chat_model

session_store: dict[str, InMemoryChatMessageHistory] = {}

def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
  if session_id not in session_store:
    session_store[session_id] = InMemoryChatMessageHistory()
  return session_store[session_id]

conversational_chain = RunnableWithMessageHistory(
  chain,
  get_session_history,
  input_messages_key="input",
  history_messages_key="history",
)

config: RunnableConfig = {"configurable": {"session_id": "demo-session"}}

resp1 = conversational_chain.invoke({"input": "My name is Glaucia. Reply only with 'OK' and do not mention my name."}, config=config)
print("Assistant:", resp1.content)

resp2 = conversational_chain.invoke({"input": "Tell me a one-sentence fun fact. Do not mention my name."}, config=config)
print("Assistant:", resp2.content)

resp3 = conversational_chain.invoke({"input": "What is my name?"}, config=config)
print("Assistant:", resp3.content)

