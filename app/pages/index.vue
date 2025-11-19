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
  changeSorting,
  changePlatform,
  refresh,
  clearFilters,
} = useRaises()
</script>
<template>
  <div class="bg-white border border-spacing-48 border-gray-200">
    <RaisesTable :error :pagination :pending :rows @refresh="refresh" @next-page="nextPage"
                 @previous-page="prevPage"
                 @sort-changed="changeSorting"
                 @clear-filters="clearFilters"
                 @platform-changed="changePlatform"
    />
  </div>
</template>