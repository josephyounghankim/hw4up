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
  // 결과 확인을 위한 용도
  print() {
    console.log( `data:${this.data}, next:[${this.next ? 'data:' + this.next.data : undefined}]`)
  }
}

// Floyd's cycle-finding algorithm 구현
// 알고리즘 요약 설명:
//   두개의 node 포인터를 마련해서 처음에 동시에 head를 가리키게 하고,
//   하나는 거북이처럼 한 스텝씩, 다른 하나는 토끼처럼 두 스텝씩
//   빠르게 링크드 리스트 안의 node를 거쳐가다 보면,
//   만약 순환구조가 링크드 리스트 안에 존재하면 언제가는 그 순환고리 안에서 두 포인터가 한 node를 동일하게 가리키게 되고,
//   순환구조가 없다면 빠른 포인터(토끼)가 tail에 도달하게 된다는 점을 이용해서 구현함.
const is_circular = head => {
  let slow = head, fast = head

  // tail에 도달했는지 점검
  while (fast && fast.next) {
    slow = slow.next        // 1 step
    fast = fast.next.next   // 2 steps
    // 순환 고리 안에서 두 포인터가 만났는지 (동일한 node를 가리키는지) 점검
    if (slow === fast) return true  // circular!
  }
  return false // tail!, not circular!
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
console.log('Test #1:', is_circular(aHead))  // false

// 2) Head →Node #1 →Node #2 →Node #3 →Node #1 일 경우 return true
aHead.next = aNode1
aNode1.next = aNode2
aNode2.next = aNode3
aNode3.next = aNode1    // circular
console.log('Test #2:', is_circular(aHead))  // true

// 3) Head →Node #1 →Node #2 →Node #3 →Node #2일 경우 return true
aHead.next = aNode1
aNode1.next = aNode2
aNode2.next = aNode3
aNode3.next = aNode2    // circular
console.log('Test #3:', is_circular(aHead))   // true
