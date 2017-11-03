// se-03
//
// Goal:
// Finding the best candidates
//
// This script can be run under nodejs 8.6 or higher

const items = [
  "재무제표/IFRS/연결/제조업/손익계산서/당기순이익",
  "재무제표/IFRS/연결/제조업/손익계산서/매출액",
  "재무제표/IFRS/연결/제조업/손익계산서/영업이익",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산/건물",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산/유형자산",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산/유형자산/건물",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산/유형자산/토지",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산/토지",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산/투자부동산/건물",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/비유동자산/투자부동산/토지",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/유동자산",
  "재무제표/IFRS/연결/제조업/재무상태표/자산/유동자산/재고자산",
  "재무제표/IFRS/연결/제조업/현금흐름표/현금흐름",
  "재무제표/IFRS/연결/제조업/현금흐름표/현금흐름/영업활동",
  "재무제표/IFRS/연결/제조업/현금흐름표/현금흐름/재무활동",
  "재무제표/IFRS/연결/제조업/현금흐름표/현금흐름/투자활동",
  "재무제표/IFRS/개별/제조업/손익계산서/당기순이익",
  "재무제표/IFRS/개별/제조업/손익계산서/매출액",
  "재무제표/IFRS/개별/제조업/손익계산서/영업이익",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산/건물",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산/유형자산",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산/유형자산/건물",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산/유형자산/토지",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산/토지",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산/투자부동산/건물",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/비유동자산/투자부동산/토지",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/유동자산",
  "재무제표/IFRS/개별/제조업/재무상태표/자산/유동자산/재고자산",
  "재무제표/IFRS/개별/제조업/현금흐름표/현금흐름",
  "재무제표/IFRS/개별/제조업/현금흐름표/현금흐름/영업활동",
  "재무제표/IFRS/개별/제조업/현금흐름표/현금흐름/재무활동",
  "재무제표/IFRS/개별/제조업/현금흐름표/현금흐름/투자활동",
  "주식시장데이터/주식/주가",
  "주식시장데이터/주식/시초가",
  "주식시장데이터/주식/고가",
  "주식시장데이터/주식/저가",
  "주식시장데이터/주식/종가",
  "주식시장데이터/주식/거래량",
  "주식시장데이터/주식/거래대금",
  "주식시장데이터/주식/일별주가수익률",
  "주식시장데이터/주식/상장주식수",
  "주식시장데이터/주식/시가총액"
]

// 입력 문자열을 공백 문자 기준으로 구분하여 배열로 갖는다
const inputs = process.argv.splice(2)

// items에서 Name 목록만 추출한다.
const names = items.map(item => item.substr(item.lastIndexOf('/')+1))

// 입력 문자열 안에서 실제 Name에 해당하는 단어민 가지고 후보 item을 찾아 추출한다.
const candidates = []
inputs
  .filter(input => names.indexOf(input) > -1)
  .forEach(name => {
    let index = 0 // fromIndex를 초기화, items 처음부터 찾는다.
    // 입력 문자열에서 Name 외에 나머지 path에 속하는 단어 목록을 만든다.
    let pathWords = inputs.filter(input => input!==name)
    // 해당 name을 갖고 있는 항목을 모두 찾는다.
    while (1) {
      // items의 index번째 항목부터 name을 가진 첫번째 항목을 찾는다.
      index = names.indexOf(name, index)  // 두번째 인자는 fromIndex 이다.
      if (index < 0) break  // 항목이 없으므로 while 루프 벗어난다.

      let item = items[index] // 일치하는 항목
      let path = item.substr(0,item.indexOf(name))  // 항목에서 name을 제외한 path
      let depth = item.split('/').length    // depth가 낮을 수록 유사도(정확도)가 높다고 판별한다

      // 나머지 입력 문자열의 단어들이 현재 찾은 항목의 path로 모두 포함되는지 여부를 점검해서
      // 모두 포함된다면 candidates 결과 배열에 push 한다.
      if (pathWords.filter(word => path.indexOf(word)>-1).length === pathWords.length) {
        candidates.push({ item, name, path, index, depth })
      }
      index++ // indexOf의 fromIndex를 +1
    }
  })

// sort by depth in ascending order
candidates.sort((a,b) => a.depth-b.depth)

// final output
if (candidates.length === 0) console.log('null')
else {
  // 최종 출력에는 depth가 가장 작은 항목들만 출력한다
  let minDepth = candidates[0].depth
  const bestCandidates = candidates.filter(cand => cand.depth === minDepth)
  bestCandidates.forEach(cand => console.log(`${cand.item} (depth:${cand.depth})`))
}
