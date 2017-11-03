# Software Engineering HW #2

## 정의
AST(Abstract Syntax Tree) 변환 함수 구현

## 구현
- javascript(ES6) 사용

## 실행결과
```
AST #1 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.Or()
            ast.Term(term='선데이토즈')
            ast.Term(term='애니팡')


AST #2 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.Or()
            ast.FieldAssign(field='company')
                ast.Term(term='선데이토즈')
            ast.FieldAssign(field='title')
                ast.Term(term='선데이토즈')
            ast.FieldAssign(field='content')
                ast.Term(term='애니팡')
```

## 논의
- 제출한 과제물은 ast.BoolOp 아래 ast.Term instance들만 변환했음.
- 이를 보다 일반화 시키는 것이 원래 과제 목적이라면 다시 작성해야 함.
- 보기 좋은 console.log 출력을 위해 instance에 depth 값을 갖도록 함.
