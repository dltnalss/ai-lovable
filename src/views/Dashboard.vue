<script setup>
import { onMounted, computed } from 'vue';
import { useTransactionStore } from '../stores/transactionStore.js';
import StatCard from '../components/StatCard.vue';

const store = useTransactionStore();

onMounted(() => {
  if (store.transactions.length === 0) store.fetchTransactions();
});

const fmt = (n) => n.toLocaleString('ko-KR') + '원';

// Pie chart - 카테고리별 지출
const pieData = computed(() => {
  const rows = [['카테고리', '금액']];
  Object.entries(store.expenseByCategory).forEach(([k, v]) => rows.push([k, v]));
  return rows;
});
const pieOptions = {
  title: '카테고리별 지출',
  pieHole: 0.4,
  chartArea: { width: '90%', height: '80%' },
  colors: ['#000000', '#3a3a3a', '#5c5c5c', '#7a7a7a', '#999999', '#bdbdbd', '#dcdcdc']
};

// Column chart - 월별 수입/지출
const monthlyData = computed(() => {
  const rows = [['월', '수입', '지출']];
  const sorted = Object.entries(store.monthlyStats).sort(([a], [b]) => a.localeCompare(b));
  sorted.forEach(([m, v]) => rows.push([m, v.income, v.expense]));
  return rows;
});
const monthlyOptions = {
  title: '월별 수입 / 지출',
  chartArea: { width: '85%', height: '70%' },
  colors: ['#000000', '#bdbdbd'],
  legend: { position: 'top' }
};

// Line chart - 누적 잔액
const balanceData = computed(() => {
  const sorted = [...store.transactions].sort((a, b) => a.date.localeCompare(b.date));
  let acc = 0;
  const rows = [['날짜', '잔액']];
  sorted.forEach((t) => {
    acc += t.type === 'income' ? t.amount : -t.amount;
    rows.push([t.date, acc]);
  });
  return rows;
});
const balanceOptions = {
  title: '누적 잔액 추이',
  chartArea: { width: '85%', height: '70%' },
  colors: ['#000000'],
  legend: { position: 'none' }
};

const recent = computed(() =>
  [...store.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
);
</script>

<template>
  <div v-if="store.loading" class="text-center py-5">
    <div class="spinner-border text-primary"></div>
  </div>
  <div v-else>
    <div class="row g-3 mb-4">
      <StatCard title="총 수입" :value="fmt(store.totalIncome)" icon="fa-arrow-trend-up" variant="income" />
      <StatCard title="총 지출" :value="fmt(store.totalExpense)" icon="fa-arrow-trend-down" variant="expense" />
      <StatCard title="잔액" :value="fmt(store.balance)" icon="fa-wallet" variant="balance" />
      <StatCard title="거래 건수" :value="store.transactions.length + '건'" icon="fa-receipt" variant="count" />
    </div>

    <div class="row g-3 mb-4">
      <div class="col-lg-6">
        <div class="card card-stat p-3">
          <GChart type="PieChart" :data="pieData" :options="pieOptions" :resize-debounce="100" style="height: 320px" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card card-stat p-3">
          <GChart type="ColumnChart" :data="monthlyData" :options="monthlyOptions" :resize-debounce="100" style="height: 320px" />
        </div>
      </div>
    </div>

    <div class="card card-stat p-3 mb-4">
      <GChart type="LineChart" :data="balanceData" :options="balanceOptions" :resize-debounce="100" style="height: 300px" />
    </div>

    <div class="card card-stat p-4">
      <h5 class="mb-3"><i class="fa-solid fa-clock-rotate-left me-2"></i>최근 거래</h5>
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>날짜</th><th>구분</th><th>카테고리</th><th>설명</th><th class="text-end">금액</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in recent" :key="t.id">
              <td>{{ t.date }}</td>
              <td>
                <span :class="t.type === 'income' ? 'badge bg-success' : 'badge bg-danger'">
                  {{ t.type === 'income' ? '수입' : '지출' }}
                </span>
              </td>
              <td>{{ t.category }}</td>
              <td>{{ t.description }}</td>
              <td class="text-end" :class="t.type === 'income' ? 'tx-income' : 'tx-expense'">
                {{ t.type === 'income' ? '+' : '-' }}{{ fmt(t.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
