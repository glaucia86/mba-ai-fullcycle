from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import SecretStr
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from utils.prompt_helpers import print_llm_result

load_dotenv()

message1 = """
Classify the log severity.

Input: "Disk usage at 85%."
Answer only with INFO, WARNING, or ERROR.
"""

message2 = """
Classify the log severity.

Input: "Disk usage at 85%."
Think step by step about why this is INFO, WARNING, or ERROR. 
At the end, give only the final answer after "Answer:".
"""

message3 = """
Question: How many "r" are in the word "strawberry"?
Answer only with the number of "r".
"""

message4 = """
Question: How many "r" are in the word "strawberry"?
Explain step by step by breaking down each letter in bullet points, pointing out the "r" before giving the final answer. 
Give the final result after "Answer:".
"""

model = ChatOpenAI(
    model="gpt-4o",
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

response1 = model.invoke(message1)
response2 = model.invoke(message2)
response3 = model.invoke(message3)
response4 = model.invoke(message4)

print_llm_result(message1, response1)
print_llm_result(message2, response2)
print_llm_result(message3, response3)
print_llm_result(message4, response4)