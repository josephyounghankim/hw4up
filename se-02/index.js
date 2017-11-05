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

// Operator들의 base class, accept method를 가짐
class BaseOp extends Node {
  constructor() { super() }
  accept(visitor) { visitor.visit(this) }
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

// visitor pattern 활용
// visitor class 정의
class conversionVisitor {
  // visit method
  // java와는 달리 javascript에서는 인자의 type에 따른 동일 이름의 method를 만들 수가 없다.
  // 그러므로 하나의 visit 함수에서 분기 처리함.
  visit(anyOp) {
    if (!anyOp || !anyOp.values) return
    if (anyOp instanceof BoolOp) anyOp.values = this.convertAtBoolOp(anyOp)
    else if (anyOp instanceof OtherOp) anyOp.values = this.convertAtOtherOp(anyOp)
  }

  // BoolOp에 대한 변환
  convertAtBoolOp(boolOp) {
    let values = []
    boolOp.values.forEach(value => {
      if (value.constructor.name === 'Term') {
        if (['구글','애플','선데이토즈'].indexOf(value.term) > -1) {
          // value.term이 회사명이면
          values.push(new FieldAssign('company', new Term(value.term, value.depth+1), value.depth))
          values.push(new FieldAssign('title', new Term(value.term, value.depth+1), value.depth))
        }
        else {
          // value.term이 일반 단어라면
          values.push(new FieldAssign('content', new Term(value.term, value.depth+1), value.depth))
        }
      }
      else {
        // value는 중첩된 baseOp라면 일종의 재귀호출을 한다!
        value.accept(new conversionVisitor())
        values.push(value)
      }
    })
    return values  // 새로운 values를 리턴
  }

  // OtherOp에 대한 변환
  convertAtOtherOp(otherOp) {
    let values = []
    // 변환 내용은 operator에 따라 달라질 수 있음.
    // values = otherOp.values   // bypass (원래 내용 그대로 변환 없이 통과)

    // 만약 여러개의 term을 하나로 합치는 변환을 한다고 가정하면...
    let mergedTerm = ''
    otherOp.values.forEach(value => {
      if (value.constructor.name === 'Term') mergedTerm += value.term
      else {
        // value는 중첩된 baseOp라면 일종의 재귀호출을 한다!
        value.accept(new conversionVisitor())
        values.push(value)
      }
    })
    values.push(new Term(mergedTerm, otherOp.depth+1)) // 합쳐진 term

    return values  // 기존 Op node에 새로운 values를 세팅
  }

}

// AST transformation (in-place)
const convert = (query) => {
  // Query > QueryExpr 아래에 있는 BoolOp부터 시작함
  query.body.expr.accept(new conversionVisitor())
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
          ], 3
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



console.log('\n\n*****************************')


////////////////////////////////////////////////
// Conversion Test 3 (ast5 -> ast6)
console.log('Conversion Test 3 (ast5 -> ast6)\n\n')

// Create ast3  (숫자 인자는 node의 depth를 나타냄, 기본값과 다른 depth만 명시적으로 지정)
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
              new Dummy(5),
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

const ast6 = convert(ast5)   // convert!

console.log('\n\nast6 ========================')
ast6.print()
