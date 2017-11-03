# Software Engineering HW #3

## 정의
Finding the best candidates

## 구현
- javascript(ES6) 사용

## 실행방법
- cd se-03
- node index.js [단어] [단어] [단어] ...

## 실행결과
```

```

## 논의
- best candidate 에서의 유사도(정확도)의 정의가 불분명함.
- 그래서, 유사도는 path에서 name이 가장 가깝게 위치한, 즉, name까지 도달하는 path 깊이(거리)가 가장 짧은 것이 높은 유사도를 갖고 있는 것으로 간주했음.
- 과제설명 pdf에 적힌 items의 맨 밑에서 세번째 항목에 `일별 주가수익률`이 있는데 중간에 공백문자가 하나가 있어서 제거해 사용함.
