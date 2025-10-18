# Evaluation Comparativa

## Precision/Recall/F1

### Precision

- De tudo que o modelo detectou, quanto estava correto?
  Ex.: de 10 bugs em um sistema o modelo detectou 5

- FP (False Positive): quando o modelo detecta algo errado.
  Ex.: Classificou algo que NÃO era bug como um bug

- Fórmula:
  Precision = True Positives (TP) / (True Positives + (FP) False Positives)
  Exemplo: temos 20 logs no sistema, onde 10 deles realmente são Bugs. O sistema identificou os 8 bugs, porém também identificou mais 5 logs como bug (e que não eram de fato bug)
  Precision = 8 / (8 + 5) = 0.615 ou 61.5%

- Alta precisão: baixo índice de FP
- Baixa precisão: alto índice de FP

### Recall

- De tudo o que deveria ser detectado, quanto o modelo encontrou?
  Ex.: de 10 bugs encontrou apenas 7

- (FN) Falso Negativos: 3 falsos negativos, pois 3 bugs não foram detectados.

- Fórmula:
  Recall = True Positives / (True Positives + False Negatives)
  Recall = 7 / (7 + 3) = 0.7 ou 70%

- Alto recall: encontra a maioria dos bugs (poucos escapam)
- Baixo recall: perde muitos bugs (deixa passar problemas)

### F1 (F-measure ou F-score)

- Combinação de Precisão e Recall em um único número.
- Mostra o equilíbrio entre acertar bem e não deixar passar casos importantes.

- Fórmula:
  F1 = 2 _ (Precision _ Recall) / (Precision + Recall)
  Exemplo: Se um modelo tem precisão de 80% (0.8) e recall de 60% (0.6):
  F1 = 2 _ (0.8 _ 0.6) / (0.61 + 0.7) = 0.65 ou 65%

- F1 alto: bom equilíbrio (encontra bugs sem muitos falsos positivos)
- F1 baixo: desequilíbrio (perde bugs, ou inventa bugs)
