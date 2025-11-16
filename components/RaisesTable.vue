<!--This is the Raises Table, pass Raises to it and it will display them -->
<script lang="ts" setup>

import type {Pagination, Raise} from "../types/raises";
import {computed} from "vue";
import {useExport} from "~~/composables/useExport";
import RaisesTablePagination from "~~/components/RaisesTablePagination.vue";

const {exportRaisesToCSV} = useExport()
const props = defineProps<{
  rows: Raise[]
  pagination: Pagination | null,
  pending: boolean,
  error: unknown,
}>()

const emits = defineEmits<{
  (e: 'next-page'): void
  (e: 'previous-page'): void
}>()

const columnHeaders = ["Name", "Status", "Platform", "Amount Raised", "Valuation"]

const formattedRows = computed(() =>
    props.rows.map((raise) => ({
      name: raise.name,
      status: raise.raise_status.name,
      platform: raise.platform_id.name,
      raised: raise?.funding_gather_money_raised_to_date?.formatted ?? '_',
      valuation: raise?.valuation?.formatted ?? '_',
    })))


const isEmpty = computed(() => !props.pending && !props.error && props.rows.length === 0)

const errorMessage = computed(() => {
  if (!props.error) return ''
  if (props.error instanceof Error) return props.error.message;
  return "Sorry Something went wrong loading raises. Contact israelafangideh@gmail.com if this continues"
})

</script>
<template>
  <div v-if="props.pending" class=" flex justify-center space-x-5 py-80">
    <div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-transparent"></div>
  </div>

  <!-- ERROR -->
  <div
      v-else-if="error"
      class="text-red-400 bg-red-900/20 border border-red-700 px-4 py-3 rounded-lg"
  >
    Something went wrong loading raises.
  </div>

  <!-- EMPTY -->
  <div
      v-else-if="rows.length === 0"
      class="text-slate-400 text-center py-16"
  >
    No raises found.

    <RaisesTablePagination
        :pagination="pagination"
        @next-page="$emit('next-page')"
        @previous-page="$emit('previous-page')"
    />
  </div>
  <div v-else class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 shadow-sm">

    <!-- Top toolbar -->
    <div class="flex justify-between items-center p-4 border-b border-slate-800">
      <h2 class="text-slate-300 font-semibold">Raises</h2>

      <button
          class="px-3 py-2 text-xs font-medium rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          @click="exportRaisesToCSV(rows, columnHeaders)"
      >
        Export CSV
      </button>
    </div>

    <!-- Table -->
    <table class="min-w-full text-sm">
      <thead class="bg-slate-900/60 text-slate-300">
      <tr>
        <th v-for="header in columnHeaders"
            :key="header"
            class="px-4 py-3 text-left uppercase text-xs tracking-wide font-semibold">
          {{ header }}
        </th>
      </tr>
      </thead>

      <tbody class="divide-y divide-slate-800">
      <tr v-for="(raise, i) in formattedRows"
          :key="i"
          class="hover:bg-slate-800/40 transition">
        <td class="px-4 py-3 text-slate-200">{{ raise.name }}</td>
        <td class="px-4 py-3 text-slate-200">{{ raise.status }}</td>
        <td class="px-4 py-3 text-slate-200">{{ raise.platform }}</td>
        <td class="px-4 py-3 font-mono text-slate-200">{{ raise.raised }}</td>
        <td class="px-4 py-3 font-mono text-slate-200">{{ raise.valuation }}</td>
      </tr>
      </tbody>
    </table>

    <RaisesTablePagination
        :pagination="pagination"
        @next-page="$emit('next-page')"
        @previous-page="$emit('previous-page')"
    />
  </div>
</template>