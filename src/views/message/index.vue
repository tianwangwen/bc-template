<template>
    <div class="message">
      <TablePage :data="config"></TablePage>
    </div>
  </template>
  
  <script setup>
  import { TablePage } from '@lcode/components-vue3'
  import { config } from "./config";

  defineOptions({
  name: 'Message'
})
  </script>
  