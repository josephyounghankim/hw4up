// se-01
//
// Goal:
// Implement is_circular function which can check whether a single linked list is circular or not
//
// This script can be run under nodejs 8.6 or higher

class Node {
  constructor(data, next) {
    this.data = data
    this.next = next
  }
  print() {
    console.log( `data:${this.data}, next:[${this.next ? 'data:' + this.next.data : undefined}]`)
  }
}

const is_circular = head => {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next        // 1 step
    fast = fast.next.next   // 2 steps
    if (slow === fast) return true  // circular!
  }
  return false
}

// base nodes
const aHead = new Node('Head')
const aNode1 = new Node('Node #1')
const aNode2 = new Node('Node #2')
const aNode3 = new Node('Node #3')

// Tests of sample single linked lists
// 1) Head → Node #1 → Node #2 → Node #3 → Tail일 경우 return false
aHead.next = aNode1
aNode1.next = aNode2
aNode2.next = aNode3
aNode3.next = null      // tail
console.log('Test #1:', is_circular(aHead))

// 2) Head →Node #1 →Node #2 →Node #3 →Node #1 일 경우 return true
aHead.next = aNode1
aNode1.next = aNode2
aNode2.next = aNode3
aNode3.next = aNode1    // circular
console.log('Test #2:', is_circular(aHead))

// 3) Head →Node #1 →Node #2 →Node #3 →Node #2일경우return true
aHead.next = aNode1
aNode1.next = aNode2
aNode2.next = aNode3
aNode3.next = aNode2    // circular
console.log('Test #3:', is_circular(aHead))
