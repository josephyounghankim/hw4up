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
  accept(visitor) { visitor.visit(this) }
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

// Operator들의 base class, accept method를 가짐
class BaseOp extends Node {
  constructor() { super() }
}

// And, Or operation class
class BoolOp extends BaseOp {
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

// 가상의 다른 operator class
class OtherOp extends BaseOp {
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
class Dummy extends Node { constructor(depth) { super(), this.depth = depth || 3 } }

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


///////////////////////////////////////////////////////////////////////////
// visitor base class 정의
class NodeVisitor {
  visit(node) {
    if (!node) return null  // just in case

    // node에 자식 body node 있으면 여기에 대해 재귀호출
    if (node.body) node.body = this.visit(node.body)

    // node에 자식 expr node 있으면 여기에 대해 재귀호출
    if (node.expr) node.expr = this.visit(node.expr)

    // node에 values가 있으면 여기에 대해 재귀호출
    if (node.values) {
      let results = []
      node.values.forEach(v => results = results.concat(this.visit(v)))
      node.values = results
    }

    // node 자신에 대해 visit method 호출
    // node type에 알맞은 visit method가 존재하면 이를 호출한다.
    // visit method가 존재하지 않으면 원래 node를 리턴한다.
    let visit_type = `visit_${node.constructor.name}`
    return this[visit_type] ? this[visit_type](node) : node
  }
}

// CompanyNameResolver class 정의
class CompanyNameResolver extends NodeVisitor {
  // node type 별 visit method
  visit_Term(node) {
    let values = []
    if (['구글','애플','선데이토즈'].indexOf(node.term) > -1) {
      // node.term이 회사명이면
      values.push(new FieldAssign('company', new Term(node.term, node.depth+1), node.depth))
      values.push(new FieldAssign('title', new Term(node.term, node.depth+1), node.depth))
    }
    else {
      // node.term이 일반 단어라면
      values.push(new FieldAssign('content', new Term(node.term, node.depth+1), node.depth))
    }
    return values
  }
}

// SomeResolver class 정의
// 변환 기능:
// 1. BoolOp에서 And <-> Or 토글 맞교환.
// 2. OtherOp에서 And, Or -> Dummy로 강제 변환
// 3. Term에서 term 문자열 거꾸로 변환
class SomeResolver extends NodeVisitor {
  // node type 별 visit method
  visit_BoolOp(node) {
    // 1. BoolOp에서 And <-> Or 토글 맞교환.
    if (node.op instanceof And) node.op = new Or(node.op.depth)
    else if (node.op instanceof Or) node.op = new And(node.op.depth)
    return node
  }
  visit_OtherOp(node) {
    // 2. OtherOp에서 And, Or -> Dummy로 강제 변환
    if (node.op instanceof And || node.op instanceof Or) node.op = new Dummy(node.op.depth)
    return node
  }
  visit_Term(node) {
    // 3. Term에서 term 문자열 거꾸로 변환
    node.term = node.term.split('').reverse().join('')
    return node
  }
}

// AST transformation (in-place)
const convert1 = (query) => {
  query.accept(new CompanyNameResolver())
  return query  // 변환된 ast 리턴
}

// AST transformation (in-place)
const convert2 = (query) => {
  query.accept(new SomeResolver())
  return query  // 변환된 ast 리턴
}

// AST transformation (in-place)
const convert3 = (query) => {
  query.accept(new CompanyNameResolver())
  query.accept(new SomeResolver())
  return query  // 변환된 ast 리턴
}


//////////////////////////////////////////////
// 테스트 코드
console.log('\n\n*****************************')

////////////////////////////////////////////////
// Conversion Test 1 (ast1 -> ast2)
console.log('Conversion Test 1 (CompanyNameResolver)\n\n')

// Create ast1
const ast1 = new Query(
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
          ], 3
        )
      ]
    )
  )
)

console.log('ast1 ========================')
ast1.print()

const ast2 = convert1(ast1)  // convert!

console.log('\n\nast2 ========================')
ast2.print()

console.log('\n\n*****************************')


////////////////////////////////////////////////
// Conversion Test 2 (ast3 -> ast4)
console.log('Conversion Test 2 (SomeResolver)\n\n')

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
          ], 3
        )
      ]
    )
  )
)
console.log('ast3 ========================')
ast3.print()

const ast4 = convert2(ast3)   // convert!

console.log('\n\nast4 ========================')
ast4.print()


console.log('\n\n*****************************')


////////////////////////////////////////////////
// Conversion Test 3 (ast5 -> ast6)
console.log('Conversion Test 3 (CompanyNameResolver, SomeResolver)\n\n')

// Create ast5  (숫자 인자는 node의 depth를 나타냄, 기본값과 다른 depth만 명시적으로 지정)
const ast5 = new Query(
  new QueryExpr(
    new BoolOp(
      new And(),
      [
        new Term('선데이토즈'),
        new BoolOp(
          new Or(4),
          [
            new Term('애니팡',4),
            new Term('사천성',4),
            new OtherOp(
              new And(5),
              [
                new Term('슈퍼맨',5),
                new Term('배트맨',5)
              ], 4

            )
          ], 3
        )
      ]
    )
  )
)
console.log('ast5 ========================')
ast5.print()

const ast6 = convert3(ast5)   // convert!

console.log('\n\nast6 ========================')
ast6.print()
