<script lang="ts" setup>
import {useRaises} from "~~/composables/useRaises";
import RaisesTable from "../../components/RaisesTable.vue";

const {
  rows,
  pagination,
  pending,
  error,
  nextPage,
  prevPage,
} = useRaises()
</script>
<template>
  <div class="bg-white border border-spacing-48 border-gray-200">
    <RaisesTable :error :pagination :pending :rows @next-page="nextPage" @previous-page="prevPage"/>
  </div>
</template>