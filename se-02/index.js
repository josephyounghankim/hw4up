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
    let indent = '                         '.substr(0, this.depth*4)
    console.log(`${indent}ast.${this.constructor.name}(${prop?(prop+"="+"'"+this[prop]+"'"):''})`)
    this[child] && this[child].print && this[child].print()
  }
}

// 주요 Node class들 정의
class Query extends Node {
  constructor(body) { super(), this.body = body, this.depth = 0 }
  print() { super.print(null,'body') }
}

class QueryExpr extends Node {
  constructor(expr) { super(), this.expr = expr, this.depth = 1 }
  print() { super.print(null,'expr') }
}

class BoolOp extends Node {
  constructor(op, values) {
    super()
    this.op = op
    this.values = values
    this.depth = 2
  }
  print() {
    super.print(null,'op')
    this.values && this.values.forEach(value => value && value.print && value.print())
  }
}

class And extends Node { constructor() { super(), this.depth = 3 } }
class Or extends Node { constructor() { super(), this.depth = 3 } }

class FieldAssign extends Node {
  constructor(field, expr) {
    super()
    this.field = field  // string
    this.expr = expr
    this.depth = 3
  }
  print() { super.print('field','expr') }
}

class Term extends Node {
  constructor(term, depth) { super(), this.term = term, this.depth = depth || 3 }
  print() { super.print('term') }
}

// Create AST1
const ast1 = new Query(
  new QueryExpr(
    new BoolOp(
      new Or(),
      [new Term('선데이토즈'), new Term('애니팡')]
    )
  )
)
console.log('AST #1 ========================')
ast1.print()

// a fake company DB
const companyList = ['구글','애플','선데이토즈']
const isCompany = (name) => companyList.indexOf(name) > -1

// AST transformation (in-place)
const convert = (query) => {
  // Query > QueryExpr > BoolOp 아래에 있는 Term node들만 변환 대상으로 한정함.
  if (!query.body.expr.values) return query  // BoolOp 아래에 child nodes가 없을 경우, 그냥 원래 ast 리턴

  let values = []
  query.body.expr.values.forEach(value => {
    // Term class instance 경우에만 변환 진행
    if (value.constructor.name === 'Term') {
      if (isCompany(value.term)) {
        // 해당 term이 회사일 경우에는 company, title 두가지의 FieldAssign node를 분할 생성한다.
        values.push(new FieldAssign('company', new Term(value.term, 4)))
        values.push(new FieldAssign('title', new Term(value.term, 4)))
      }
      else {
        // 해당 term이 일반 검색어 일 경우, content FieldAssign node를 하나만 생성한다.
        values.push(new FieldAssign('content', new Term(value.term, 4)))
      }
    }
  })
  // 기존 BoolOp node에 새로운 values를 세팅
  query.body.expr.values = values
  return query  // 변환된 ast 리턴
}

// Test
const ast2 = convert(ast1)
console.log('\n\nAST #2 ========================')
ast2.print()
