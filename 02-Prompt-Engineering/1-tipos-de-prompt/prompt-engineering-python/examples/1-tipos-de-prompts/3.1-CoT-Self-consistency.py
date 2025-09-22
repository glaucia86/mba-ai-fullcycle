from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import SecretStr
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from utils.prompt_helpers import print_llm_result

load_dotenv()

message1 = """
  Question: In an API endpoint that returns a list of users and their posts, the developer wrote:

  users := db.FindAllUsers()
  for _, u := range users {
    u.Posts = db.FindPostsByUserID(u.ID)
  }

  How many database queries will this code execute if there are N users?

  Generate 3 different reasoning paths step by step.
  At the end, summarize the answers and choose the most consistent one, ignoring outliers.
  If there are 3 different answers, ONLY reply: "I can't find a consistent answer".
"""

model = ChatOpenAI(
    model="gpt-4o",
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

response1 = model.invoke(message1)
print_llm_result(message1, response1)