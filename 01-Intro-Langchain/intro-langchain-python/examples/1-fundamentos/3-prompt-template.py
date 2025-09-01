from langchain.prompts import PromptTemplate

template = PromptTemplate(
    input_variables=["name"],
    template="Hi, I'm {name}! Tell me a joke about yourself.",
)

text = template.format(name="Glaucia")
print(text)