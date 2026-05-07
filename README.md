# Vue 가계부 대시보드

Vue 3 (Composition API) + Pinia + json-server + Bootstrap 5 + Google Charts + Font Awesome

## 설치 및 실행

```bash
cd vue-budget
npm install
npm start
```

`npm start` 는 json-server (포트 3001) 와 Vite 개발 서버 (포트 5173) 를 동시에 실행합니다.

- 프론트: http://localhost:5173
- API: http://localhost:3001/transactions

## 구조

```
vue-budget/
├── db.json                       # 샘플 거래 100건
├── index.html                    # Bootstrap 5 + Font Awesome CDN
└── src/
    ├── main.js                   # createApp, Pinia, Router 등록
    ├── App.vue                   # 네비게이션
    ├── router/index.js
    ├── stores/
    │   ├── api.js                # axios → json-server 연결
    │   └── transactionStore.js   # Pinia store (Composition API)
    ├── views/
    │   ├── Dashboard.vue         # 통계 카드 + Google Charts 3종
    │   └── Transactions.vue      # 거래 추가/삭제/필터
    └── components/StatCard.vue
```

## 주요 기능
- 총수입/총지출/잔액/거래건수 카드
- 카테고리별 지출 도넛 차트
- 월별 수입/지출 컬럼 차트
- 누적 잔액 라인 차트
- 거래 추가 / 삭제 / 수입·지출 필터
