# Software Engineering HW #1

## 정의
Single Linked List가 순환하는지 여부를 판단하는 is_circular() 함수 구현

## 환경
- javascript(ES6) 사용
- nodejs 8.6 이상

## 실행방법
- cd se-01
- node index.js

## 실행결과
```
Test #1: false
Test #2: true
Test #3: true
```

## 논의
- Floyd's cycle-finding algorithm 사용
  * https://en.wikipedia.org/wiki/Cycle_detection#Tortoise_and_hare
- 구현이 매우 간단함
