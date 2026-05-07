<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
  variant: String
});
</script>

<template>
  <div class="col-md-6 col-lg-3">
    <div class="card card-stat p-3">
      <div class="d-flex align-items-center">
        <div :class="`icon-circle bg-${variant} me-3`">
          <i :class="`fa-solid ${icon}`"></i>
        </div>
        <div>
          <div class="text-muted small">{{ title }}</div>
          <div class="fs-4 fw-bold">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
