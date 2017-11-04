// se-02
//
// Goal:
// Implement an AST Transform function
//
// This script can be run under nodejs 8.6 or higher

class Node {
  constructor() { this.depth = 0 }
  // AST 변환 이전, 이후를 눈으로 쉽게 비교하기 위한 class instance 내용 출력 함수
  // depth에 비례하여 들여쓰기 결정해서 보기 좋게 출력
  print(prop, child) {
    let indent = '                                  '.substr(0, this.depth*4)
    console.log(`${indent}ast.${this.constructor.name}(${prop?(prop+"="+"'"+this[prop]+"'"):''})`)
    this[child] && this[child].print && this[child].print()
  }
}

// 주요 Node class들 정의
class Query extends Node {
  constructor(body, depth) { super(), this.body = body, this.depth = depth || 0 }
  print() { super.print(null,'body') }
}

class QueryExpr extends Node {
  constructor(expr, depth) { super(), this.expr = expr, this.depth = depth || 1 }
  print() { super.print(null,'expr') }
}

class BoolOp extends Node {
  constructor(op, values, depth) {
    super()
    this.op = op
    this.values = values
    this.depth = depth || 2
  }
  print() {
    super.print(null,'op')
    this.values && this.values.forEach(value => value && value.print && value.print())
  }
}

class And extends Node { constructor(depth) { super(), this.depth = depth || 3 } }
class Or extends Node { constructor(depth) { super(), this.depth = depth || 3 } }

class FieldAssign extends Node {
  constructor(field, expr, depth) {
    super()
    this.field = field  // string
    this.expr = expr
    this.depth = depth || 3
  }
  print() { super.print('field','expr') }
}

class Term extends Node {
  constructor(term, depth) { super(), this.term = term, this.depth = depth || 3 }
  print() { super.print('term') }
}

// a fake company DB
const companyList = ['구글','애플','선데이토즈']
const isCompany = (name) => companyList.indexOf(name) > -1

// 하나의 BoolOp 아래에 있는 Terms를 변환해 주는 함수
const convertTermsUnderABoolOp = (boolOp) => {
  if (!boolOp || !boolOp.values || boolOp.constructor.name !== 'BoolOp') return

  let baseDepth = boolOp.depth  // output 출력을 예쁘게 하기 위해
  let values = []
  boolOp.values.forEach(value => {
    if (value.constructor.name === 'Term') {
      if (isCompany(value.term)) {
        // 해당 term이 회사일 경우에는 company, title 두가지의 FieldAssign node를 분할 생성한다.
        values.push(new FieldAssign('company', new Term(value.term, value.depth+1), value.depth))
        values.push(new FieldAssign('title', new Term(value.term, value.depth+1), value.depth))
      }
      else {
        // 해당 term이 일반 검색어 일 경우, content FieldAssign node를 하나만 생성한다.
        values.push(new FieldAssign('content', new Term(value.term, value.depth+1), value.depth))
      }
    }
    // 만약 자식 BoolOp 이 존재하면 본 함수를 재귀호출을 한다.
    else if (value.constructor.name === 'BoolOp') {
      values.push(value)  // 새로운 values에 기존 자식 BoolOp도 존재해야 하므로..
      convertTermsUnderABoolOp(value)  // 재귀호출!
    }
  })
  // 기존 BoolOp node에 새로운 values를 세팅
  boolOp.values = values
}

// AST transformation (in-place)
const convert = (query) => {
  // Query > QueryExpr 아래에 있는 BoolOp부터 시작함
  convertTermsUnderABoolOp(query.body.expr)
  return query  // 변환된 ast 리턴
}



//////////////////////////////////////////////
// 테스트 코드
console.log('\n\n*****************************')

////////////////////////////////////////////////
// Conversion Test 1 (ast1 -> ast2)
console.log('Conversion Test 1 (ast1 -> ast2)\n\n')

// Create ast1
const ast1 = new Query(
  new QueryExpr(
    new BoolOp(
      new Or(),
      [new Term('선데이토즈'), new Term('애니팡')]
    )
  )
)
console.log('ast1 ========================')
ast1.print()

const ast2 = convert(ast1)  // convert!

console.log('\n\nast2 ========================')
ast2.print()


console.log('\n\n*****************************')


////////////////////////////////////////////////
// Conversion Test 2 (ast3 -> ast4)
console.log('Conversion Test 2 (ast3 -> ast4)\n\n')

// Create ast3  (숫자 인자는 node의 depth를 나타냄, 기본값과 다른 depth만 명시적으로 지정)
const ast3 = new Query(
  new QueryExpr(
    new BoolOp(
      new And(),
      [
        new Term('선데이토즈'),
        new BoolOp(
          new Or(4),
          [
            new Term('애니팡',4),
            new Term('사천성',4)
          ],
          3
        )
      ]
    )
  )
)
console.log('ast3 ========================')
ast3.print()

const ast4 = convert(ast3)   // convert!

console.log('\n\nast4 ========================')
ast4.print()
