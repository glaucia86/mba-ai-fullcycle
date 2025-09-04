from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import SecretStr
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from utils.prompt_helpers import print_llm_result

load_dotenv()

msg1 = """
EXAMPLE:
Question: What's France's capital?
Response: Paris

Question: What's Brazil's capital?
Response: 
"""

msg2 = """
Example:
Input: "Database connection lost at 10:34."
Output: ERROR

Now classify:
Input: "Disk usage at 85%."
Output:
"""


msg3 = """
Classify the log severity.

Example 1:
Input: "Database connection lost at 10:34."
Output: ERROR  

Example 2:
Input: "Disk usage at 85%."
Output: WARNING

Example 3:
Input: "Database response time is above the threshold at 30ms"
Output: WARNING  

Example 4:
Input: "User logged in successfully."
Output: INFO  

Now classify:
Input: "API response time is above threshold."
Output:
"""

msg4 = """
Classify the log severity.

Example 1:
Input: "Database connection lost at 10:34."
Output: ERROR  

Example 2:
Input: "Disk usage at 85%."
Output: WARNING  

Example 3:
Input: "User logged in successfully."
Output: INFO  

Example 4:
Input: "File not found: config.yaml"
Output: ERROR  

Example 5:
Input: "High memory usage detected: 75%"
Output: WARNING  

Example 6:
Input: "Background job finished"
Output: INFO  

Example 7:
Input: "Retrying request to payment gateway"
Output: ERROR  

Example 8:
Input: "Disk usage at 90%"
Output: ERROR   // ambíguo: poderia ser WARNING  

Example 9:
Input: "API latency is above threshold"
Output: WARNING  

Example 10:
Input: "Scheduled backup completed"
Output: INFO  

Example 11:
Input: "Low disk space: 15% left"
Output: WARNING  

Example 12:
Input: "Low disk space: 5% left"
Output: ERROR   // ambíguo: WARNING ou ERROR?  

Example 13:
Input: "Cache warming completed"
Output: INFO  

Example 14:
Input: "Connection timeout, retrying..."
Output: WARNING   // ambíguo: poderia ser ERROR  

Example 15:
Input: "Authentication failed for user admin"
Output: ERROR  

Now classify:
Input: "CPU usage is 95%."
Output:
"""

model = ChatOpenAI(
    model="gpt-4o",
    base_url=os.environ["GITHUB_MODELS_ENDPOINT"],
    api_key=SecretStr(os.environ["GITHUB_MODELS_TOKEN"])
)

response1 = model.invoke(msg1)
response2 = model.invoke(msg2)
response3 = model.invoke(msg3)
response4 = model.invoke(msg4)

print_llm_result(msg1, response1)
print_llm_result(msg2, response2)
print_llm_result(msg3, response3)
print_llm_result(msg4, response4)
