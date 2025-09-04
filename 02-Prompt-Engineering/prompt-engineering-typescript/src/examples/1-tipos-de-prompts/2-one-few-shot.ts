import { ChatOpenAI } from "@langchain/openai";
import {
  loadEnvironment,
  getApiKey,
  getEndpoint,
  printLlmResult,
} from "../../utils/helpers";

// Carrega as variáveis de ambiente
loadEnvironment();

async function main(): Promise<void> {
  const msg1 = `
EXAMPLE:
Question: What's France's capital?
Response: Paris

Question: What's Brazil's capital?
Response: 
  `;

  const msg2 = `
Example:
Input: "Database connection lost at 10:34."
Output: ERROR

Now classify:
Input: "Disk usage at 85%."
Output:
  `;

  const msg3 = `
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
  `;

  const msg4 = `
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
  `;

  const model = new ChatOpenAI({
    model: "gpt-4o",
    configuration: {
      baseURL: getEndpoint("GITHUB_MODELS_ENDPOINT"),
      apiKey: getApiKey("GITHUB_MODELS_TOKEN"),
    },
  });

  const response1 = await model.invoke(msg1);
  const response2 = await model.invoke(msg2);
  const response3 = await model.invoke(msg3);
  const response4 = await model.invoke(msg4);

  printLlmResult(msg1, response1);
  printLlmResult(msg2, response2);
  printLlmResult(msg3, response3);
  printLlmResult(msg4, response4);
}

main();
