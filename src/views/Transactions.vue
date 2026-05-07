<script setup>
import { onMounted, ref, computed } from 'vue';
import { useTransactionStore } from '../stores/transactionStore.js';

const store = useTransactionStore();
const filter = ref('all');

onMounted(() => {
  if (store.transactions.length === 0) store.fetchTransactions();
});

const fmt = (n) => n.toLocaleString('ko-KR') + '원';

const list = computed(() => {
  const arr = [...store.transactions].sort((a, b) => b.date.localeCompare(a.date));
  if (filter.value === 'all') return arr;
  return arr.filter((t) => t.type === filter.value);
});

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
  category: '식비',
  description: '',
  amount: 0
});

const submit = async () => {
  if (!form.value.amount || !form.value.description) return;
  await store.addTransaction({ ...form.value, amount: Number(form.value.amount) });
  form.value.description = '';
  form.value.amount = 0;
};

const remove = async (id) => {
  if (confirm('삭제하시겠습니까?')) await store.deleteTransaction(id);
};

// ===== 수정 기능 =====
const editing = ref(null); // 수정 중인 거래 객체 (복사본)
const saving = ref(false);

const startEdit = (t) => {
  editing.value = { ...t, amount: Number(t.amount) };
};

const cancelEdit = () => {
  editing.value = null;
};

const saveEdit = async () => {
  if (!editing.value) return;
  const e = editing.value;
  if (!e.date || !e.category || !e.description || !e.amount) {
    alert('모든 항목을 입력하세요.');
    return;
  }
  saving.value = true;
  try {
    await store.updateTransaction(e.id, {
      ...e,
      amount: Number(e.amount)
    });
    editing.value = null;
  } catch (err) {
    alert('수정 실패: ' + err.message);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="row g-3">
    <div class="col-lg-4">
      <div class="card card-stat p-4">
        <h5 class="mb-3"><i class="fa-solid fa-plus me-2"></i>거래 추가</h5>
        <form @submit.prevent="submit">
          <div class="mb-2">
            <label class="form-label small">날짜</label>
            <input v-model="form.date" type="date" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label small">구분</label>
            <select v-model="form.type" class="form-select">
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label small">카테고리</label>
            <input v-model="form.category" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label small">설명</label>
            <input v-model="form.description" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">금액</label>
            <input v-model="form.amount" type="number" class="form-control" required />
          </div>
          <button class="btn btn-primary w-100"><i class="fa-solid fa-check me-1"></i>저장</button>
        </form>
      </div>
    </div>

    <div class="col-lg-8">
      <div class="card card-stat p-4">
        <div class="d-flex justify-content-between mb-3">
          <h5 class="mb-0"><i class="fa-solid fa-list me-2"></i>거래 내역 ({{ list.length }})</h5>
          <div class="btn-group btn-group-sm">
            <button class="btn" :class="filter==='all'?'btn-dark':'btn-outline-dark'" @click="filter='all'">전체</button>
            <button class="btn" :class="filter==='income'?'btn-success':'btn-outline-success'" @click="filter='income'">수입</button>
            <button class="btn" :class="filter==='expense'?'btn-danger':'btn-outline-danger'" @click="filter='expense'">지출</button>
          </div>
        </div>
        <div class="table-responsive" style="max-height: 600px; overflow-y: auto">
          <table class="table table-hover align-middle">
            <thead class="table-light sticky-top">
              <tr>
                <th>날짜</th><th>구분</th><th>카테고리</th><th>설명</th><th class="text-end">금액</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in list" :key="t.id" style="cursor: pointer" @click="startEdit(t)">
                <td class="small">{{ t.date }}</td>
                <td>
                  <span class="badge" :class="t.type==='income'?'bg-success':'bg-danger'">
                    {{ t.type === 'income' ? '수입' : '지출' }}
                  </span>
                </td>
                <td><span class="badge bg-secondary">{{ t.category }}</span></td>
                <td>{{ t.description }}</td>
                <td class="text-end" :class="t.type === 'income' ? 'tx-income' : 'tx-expense'">
                  {{ t.type === 'income' ? '+' : '-' }}{{ fmt(t.amount) }}
                </td>
                <td class="text-end" @click.stop>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="startEdit(t)">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="remove(t.id)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 수정 모달 -->
    <div v-if="editing" class="modal-backdrop-custom" @click.self="cancelEdit">
      <div class="modal-dialog-custom card card-stat p-4">
        <h5 class="mb-3"><i class="fa-solid fa-pen me-2"></i>거래 수정</h5>
        <form @submit.prevent="saveEdit">
          <div class="mb-2">
            <label class="form-label small">날짜</label>
            <input v-model="editing.date" type="date" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label small">구분</label>
            <select v-model="editing.type" class="form-select">
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label small">카테고리</label>
            <input v-model="editing.category" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label small">설명</label>
            <input v-model="editing.description" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label small">금액</label>
            <input v-model="editing.amount" type="number" class="form-control" required />
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary flex-fill" @click="cancelEdit" :disabled="saving">
              취소
            </button>
            <button type="submit" class="btn btn-primary flex-fill" :disabled="saving">
              <i class="fa-solid fa-check me-1"></i>{{ saving ? '저장 중...' : '저장' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-dialog-custom {
  width: 100%;
  max-width: 480px;
  background: #fff;
}
</style>
