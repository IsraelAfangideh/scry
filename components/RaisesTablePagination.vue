<script lang="ts" setup>

import type {Pagination} from "../types/raises";
import {computed} from "vue";

const props = defineProps<{
  pagination: Pagination | null
}>()


const emits = defineEmits<{
  (e: 'next-page'): void
  (e: 'previous-page'): void
  (e: 'set-limit'): number
}>()

// This is necessary because of a bug in the external API where the total pages value becomes 28 or 29 when we fetch page 20, but then if we try to fetch page 21 total pages becomes 0
const paginationBug = computed(() => props?.pagination && props?.pagination.currentPage >= 20 && props.pagination.totalPages > 20)

const canGoNext = computed(() => (props?.pagination && props?.pagination.currentPage < props.pagination.totalPages && !paginationBug.value))

const canGoPrev = computed(() => (props?.pagination?.currentPage ?? 0) > 1)
</script>

<template>
  <div class="flex justify-between p-4 text-xs items-center text-slate-400">
    <div v-if="pagination" class="justify-center">
      Page {{ pagination.currentPage }} out of {{ Math.min(pagination.totalPages, 20) }}
    </div>
    <div class="flex space-x-5 justify-between">
      <button v-if="canGoPrev"
              class="px-3 py-2 text-xs font-medium rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
              @click="()=>$emit('previous-page')">
        Previous Page
      </button>
      <button
          v-if="canGoNext"
          class="px-3 py-2 text-xs font-medium rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          @click="()=>$emit('next-page')"
      >
        Next Page
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>