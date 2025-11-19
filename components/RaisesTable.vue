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
  (e: 'clear-filters'): void
  (e: 'refresh'): void
  (e: 'sort-changed', val: string): void
  (e: 'platform-changed', val: string | undefined): void
}>()

const columnHeaders = ["Name", "Status", "Platform", "Amount Raised", "Minimum Investment", "Valuation", "Days Left"]

const sortOptions = ['Name asc', 'Name desc', 'Status asc', 'Status desc', 'Platform asc', 'Platform desc', 'Amount Raised asc', 'Amount Raised desc', 'Valuation asc', 'Valuation desc']
const sort = ref<string>(sortOptions[0] ?? 'Name asc')

const platformOptions = ['Wefunder', 'Republic']
const platformChoice = ref<string | undefined>(platformOptions[0] ?? undefined)

const calculateDaysLeft = (startDate: string, closeDate: string): string => {
  const start = new Date(startDate)
  const close = new Date(closeDate)

  if (isNaN(start.getTime()) || isNaN(close.getTime())) {
    return "_"
  }

  // Normalize to avoid timezone chaos
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const closeUTC = Date.UTC(close.getFullYear(), close.getMonth(), close.getDate())

  const diffMs = closeUTC - startUTC
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  return diffDays.toString()
}

const formattedRows = computed(() =>
    props.rows.map((raise) => ({
      name: raise.name,
      status: raise.raise_status.name,
      platform: raise.platform_id.name,
      raised: raise?.funding_gather_money_raised_to_date?.formatted ?? '_',
      minimum_investment: raise.minimum_investment_amount.formatted ?? '_',
      valuation: raise?.valuation?.formatted ?? '_',
      daysLeft: calculateDaysLeft(raise.start_date, raise.close_date)
    })))

</script>
<template>
  <!-- Top toolbar -->
  <div class="flex justify-between items-center p-4 border-b bg-slate-900 border-slate-800">
    <h2 class="text-slate-300 font-semibold">Raises</h2>

    <button
        class="px-3 py-2 text-xs font-medium rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
        @click="$emit('refresh')"
    >
      Refresh Table
    </button>
    <button
        class="px-3 py-2 text-xs font-medium rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
        @click="exportRaisesToCSV(rows, columnHeaders)"
    >
      Export CSV
    </button>
  </div>
  <div v-if="props.pending"
       class="overflow-x-auto rounded-xl border  min-h-[100vh] border-slate-800 bg-slate-950 shadow-sm animate-pulse">
    <div class="p-4 border-b border-slate-800">
      <div class="h-5 w-24 bg-slate-800 rounded"></div>
    </div>

    <table class="min-w-full text-sm">
      <thead class="bg-slate-900/60">
      <tr>
        <th v-for="header in columnHeaders"
            :key="header"
            class="px-4 py-3 text-left uppercase text-xs tracking-wide font-semibold text-slate-700">
          <div class="h-3 w-20 bg-slate-800 rounded"></div>
        </th>
      </tr>
      </thead>

      <tbody class="divide-y divide-slate-800">
      <tr v-for="n in (pagination?.count ?? 25)" :key="n">
        <td v-for="i in columnHeaders.length" :key="i" class="px-4 py-3">
          <div class="h-4 w-full bg-slate-800 rounded"></div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <!-- ERROR -->
  <div v-else-if="error" class="text-slate-400 space-y-5 bg-slate-900 min-h-[100vh] text-center py-16">
    <div
        class="text-red-400 bg-red-900/20 border border-red-700 px-4 py-3 rounded-lg"
    >
      Sorry, there was a network issue loading raises. Contact israelafangideh@gmail.com if this continues.


    </div>
    <div>
      <button
          class="px-3 py-2 text-xs font-medium rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          @click="() => reloadNuxtApp({force: true})">
        Refresh
      </button>
    </div>

  </div>

  <!-- EMPTY -->
  <div
      v-else-if="rows.length === 0"
      class="text-slate-400  flex flex-col bg-slate-900 min-h-[100vh] text-center py-16"
  >
    No raises found

    <div class="mt-auto">
      <button
          class="px-3 py-2 text-xs font-medium rounded  bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          @click="$emit('refresh')"
      >
        Refresh Table
      </button>
    </div>

    <RaisesTablePagination
        :pagination="pagination"
        class="mt-auto"
        @next-page="$emit('next-page')"
        @previous-page="$emit('previous-page')"
    />
  </div>
  <div v-else class="overflow-x-auto border border-slate-800 bg-slate-950 shadow-sm">
    <div class="flex space-x-5 justify-end">
      <div class=" flex flex-col">
        <label class="text-slate-50">Sort order:</label>
        <div>
          <select v-model="sort" @change="()=> $emit('sort-changed', sort)">
            <option v-for="option in sortOptions" :key="option">{{ option }}</option>
          </select>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="text-slate-50"> Platform Filter</div>
        <div>
          <select v-model="platformChoice" @change="$emit('platform-changed', platformChoice)">
            <option v-for="option in platformOptions" :key="option">{{ option }}</option>
          </select>
        </div>
      </div>
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
        <td class="px-4 py-3 font-mono text-slate-200">{{ raise.minimum_investment }}</td>
        <td class="px-4 py-3 font-mono text-slate-200">{{ raise.valuation }}</td>
        <td class="px-4 py-3 font-mono text-slate-200">{{ raise.daysLeft }}</td>
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