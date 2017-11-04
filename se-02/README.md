# Software Engineering HW #2

## 정의
AST(Abstract Syntax Tree) 변환 함수 구현

## 환경
- javascript(ES6) 사용
- nodejs 8.6 이상

## 실행방법
- cd se-02
- node index.js

## 실행결과
```
*****************************
Conversion Test 1 (ast1 -> ast2)


ast1 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.Or()
            ast.Term(term='선데이토즈')
            ast.Term(term='애니팡')


ast2 ========================
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


*****************************
Conversion Test 2 (ast3 -> ast4)


ast3 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.And()
            ast.Term(term='선데이토즈')
            ast.BoolOp()
                ast.Or()
                ast.Term(term='애니팡')
                ast.Term(term='사천성')


ast4 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.And()
            ast.FieldAssign(field='company')
                ast.Term(term='선데이토즈')
            ast.FieldAssign(field='title')
                ast.Term(term='선데이토즈')
            ast.BoolOp()
                ast.Or()
                ast.FieldAssign(field='content')
                    ast.Term(term='애니팡')
                ast.FieldAssign(field='content')
                    ast.Term(term='사천성')
```

## 설명 및 논의
- 제출한 과제물은 ast.BoolOp 아래 있는 ast.Term instance들을 변환했음.
- ast.BoolOp 안에 자식 ast.BoolOp을 갖는 경우도 재귀적으로 변환됨.
- 보기 좋은 console.log 출력을 위해 instance에 depth 값을 갖도록 함.
- 특정 term이 회사인지 아닌지는 db 검색을 가정한 mock 함수 `isCompany`를 만들어 사용함.
