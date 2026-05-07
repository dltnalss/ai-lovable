<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <i class="fa-solid fa-wallet me-2"></i>가계부
      </RouterLink>
      <div class="navbar-nav">
        <RouterLink class="nav-link" to="/" exact-active-class="active">
          <i class="fa-solid fa-chart-pie me-1"></i> 대시보드
        </RouterLink>
        <RouterLink class="nav-link" to="/transactions" active-class="active">
          <i class="fa-solid fa-list me-1"></i> 거래 내역
        </RouterLink>
      </div>
    </div>
  </nav>
  <div class="container pb-5">
    <RouterView />
  </div>
</template>
