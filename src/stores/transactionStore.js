import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from './api.js';

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 전체 거래 조회
  const fetchTransactions = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/transactions');
      transactions.value = data;
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (tx) => {
    const { data } = await api.post('/transactions', tx);
    transactions.value.push(data);
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    transactions.value = transactions.value.filter((t) => t.id !== id);
  };

  // 거래 수정
  const updateTransaction = async (id, tx) => {
    const { data } = await api.put(`/transactions/${id}`, tx);
    const idx = transactions.value.findIndex((t) => t.id === id);
    if (idx !== -1) transactions.value[idx] = data;
  };

  // 계산된 통계
  const totalIncome = computed(() =>
    transactions.value
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)
  );

  const totalExpense = computed(() =>
    transactions.value
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)
  );

  const balance = computed(() => totalIncome.value - totalExpense.value);

  // 카테고리별 지출
  const expenseByCategory = computed(() => {
    const map = {};
    transactions.value
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  });

  // 월별 수입/지출
  const monthlyStats = computed(() => {
    const map = {};
    transactions.value.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!map[month]) map[month] = { income: 0, expense: 0 };
      map[month][t.type] += t.amount;
    });
    return map;
  });

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    monthlyStats
  };
});
