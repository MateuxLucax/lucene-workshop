# Apache Lucene Workshop

## What is Lucene?

Lucene is an Information Retrieval system that offers search capabilities to applications. It is a library that can be embedded in applications to provide search capabilities. Lucene is not a standalone application, but a library that can be embedded in applications to provide search capabilities.

## Core

### Inverted index


```js
const a = "I like piza"
const b = "I hate pizza"
const c = "free pizza"

const index = {
  "like" = [a],
  "hate" = [b],
  "free" = [c],
  "I" = [a, b],
  "pizza" = [a, b, c]
}
```

## Basic lucene flow

```mermaid
graph LR
  A[document] -- analysis --> B[tokens]
  B -- indexing --> C[inverted index]
```

```mermaid
graph LR
  A[documento] -- analise --> B[tokenização]
  B -- indexação --> C[indíce invertido]
```

### Search

```mermaid
graph LR
  A[query] -- analysis --> B[tokens]
  B -- search --> C[inverted index]
```

```mermaid
graph LR
  A[consulta] -- analise --> B[tokenização]
  B -- busca --> C[indíce invertido]
  C -- ranking --> D[resultados]
```

#### Example

```mermaid
graph LR
  A[black hole] -- tokenization --> B[black \n position: 0 \n offset: 0 \n length: 5]
  A -- tokenization --> C[hole \n position: 1 \n offset: 6 \n length: 4]
```

## Stemming

Stemming is the process of reducing inflected (or sometimes derived) words to their word stem, base or root form—generally a written word form. The stem need not be identical to the morphological root of the word; it is usually sufficient that related words map to the same stem, even if this stem is not in itself a valid root.

```mermaid
graph LR
  A[running] -- stemming --> B[run]
  C[runs] -- stemming --> B
  D[run] -- stemming --> B
```

```mermaid
graph LR
  A[correndo] -- análise --> B[corre]
  C[correr] -- análise --> B
  D[correu] -- análise --> B
```

#### RSLP (Removedor de Sufixos da Lingua Portuguesa)

```mermaid
flowchart
  A[Begin] --> B{Word ends in s?}
  B -- Yes --> C[Plural Reduction]
  C --> D{Word ends in a or ã?}
  B -- No --> D
  D -- Yes --> E[Feminine Reduction]
  D -- No --> F[Augmentative Reduction]
  E --> F
  F --> G[Adverb Reduction]
  G --> H[Noun Reduction]
  H --> I{Suffix Removed?}
  I -- Yes --> J[Remove Accents]
  I -- No --> K[Verb Reduction]
  K --> L{Suffix Removed?}
  L -- Yes --> J
  L -- No --> M[Remove Vowel]
  J --> N[End]
  M --> J
```