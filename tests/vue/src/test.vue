<script setup>
  import { ref } from 'vue';
  const text = ref('Hello World!');
</script>

<template>
  <div class="text">{{text}}</div>
  <button @click="text = 'Button pressed!'">Push me!</button>
</template>

