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
Conversion Test 1 (CompanyNameResolver)


ast1 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.And()
            ast.Term(term='선데이토즈')
            ast.BoolOp()
                ast.Or()
                ast.Term(term='애니팡')
                ast.Term(term='사천성')


ast2 ========================
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


*****************************
Conversion Test 2 (SomeResolver)


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
            ast.Or()
            ast.Term(term='즈토이데선')
            ast.BoolOp()
                ast.And()
                ast.Term(term='팡니애')
                ast.Term(term='성천사')


*****************************
Conversion Test 3 (CompanyNameResolver, SomeResolver)


ast5 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.And()
            ast.Term(term='선데이토즈')
            ast.BoolOp()
                ast.Or()
                ast.Term(term='애니팡')
                ast.Term(term='사천성')
                ast.OtherOp()
                    ast.And()
                    ast.Term(term='슈퍼맨')
                    ast.Term(term='배트맨')


ast6 ========================
ast.Query()
    ast.QueryExpr()
        ast.BoolOp()
            ast.Or()
            ast.FieldAssign(field='company')
                ast.Term(term='즈토이데선')
            ast.FieldAssign(field='title')
                ast.Term(term='즈토이데선')
            ast.BoolOp()
                ast.And()
                ast.FieldAssign(field='content')
                    ast.Term(term='팡니애')
                ast.FieldAssign(field='content')
                    ast.Term(term='성천사')
                ast.OtherOp()
                    ast.Dummy()
                    ast.FieldAssign(field='content')
                        ast.Term(term='맨퍼슈')
                    ast.FieldAssign(field='content')
                        ast.Term(term='맨트배')
```

## 설명 및 논의
- 보기 좋은 console.log 출력을 위해 instance에 depth 값을 갖도록 함.
- 특정 term이 회사인지 아닌지는 가상의 db 검색을 가정함.
- Visitor Pattern을 이용하여 두가지 Resolver를 마련함.
  1. CompanyNameResolver (문제지에서 요구한 변환)
    * Term을 FieldAssign-Term으로 변환
    * 회사명 Term 경우는 두개의 FieldAssign-Term으로 변환
  2. SomeResolver (임의로 창작한 변환)
    * BoolOp에서 And <-> Or 토글 맞교환.
    * OtherOp에서 And, Or -> Dummy로 강제 변환
    * Term에서 term 문자열 거꾸로 변환
- 3가지 변환 테스트 실행
  1. CompanyNameResolver
  2. SomeResolver
  3. CompanyNameResolver + SomeResolver
  
