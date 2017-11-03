// se-02
//
// Goal:
// Implement an AST Transform function
//
// This script can be run under nodejs 8.6 or higher

class Node {
  constructor() { this.depth = 0 }
  print(prop, child) {
    let indent = '                         '.substr(0, this.depth*4)
    console.log(`${indent}ast.${this.constructor.name}(${prop?(prop+"="+"'"+this[prop]+"'"):''})`)
    this[child] && this[child].print && this[child].print()
  }
}

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
  if (!query.body.expr.values) return query

  let values = []
  query.body.expr.values.forEach(value => {
    if (value.constructor.name === 'Term') {
      if (isCompany(value.term)) {
        values.push(new FieldAssign('company', new Term(value.term, 4)))
        values.push(new FieldAssign('title', new Term(value.term, 4)))
      }
      else {
        values.push(new FieldAssign('content', new Term(value.term, 4)))
      }
    }
  })
  query.body.expr.values = values
  return query
}

// Test
const ast2 = convert(ast1)
console.log('\n\nAST #2 ========================')
ast2.print()
