import {useFetch} from "nuxt/app";
import {computed, type ComputedRef, type  Ref, ref} from "vue";
import type {Pagination, Raise, RaisesResponse} from "../types/raises";


export interface UseRaises {
    page: Ref<number>
    limit: Ref<number>
    rows: ComputedRef<Raise[]>
    pagination: ComputedRef<Pagination | null>
    pending: Ref<boolean>
    error: Ref<unknown>
    nextPage: () => void
    prevPage: () => void
    clearFilters: () => void
    changeSorting: (newSort: string) => void
    changePlatform: (newPlatform: string | undefined) => void
    refresh: () => void,
    canGoNext: ComputedRef<boolean>
    canGoPrev: ComputedRef<boolean>

}

export function useRaises(): UseRaises {
    const page = ref(1);
    const limit = ref(25);
    const sortString = ref('')
    const platformString = ref('')
    const orderByProperties = ['name', 'status', 'platform', 'amount_raised', 'valuation']
    const ascOrDesc = ['asc', 'desc']

    const order_by = computed(() => {
        const current = sortString.value.toLowerCase()
        return orderByProperties.find(prop =>
            current.includes(prop.toLowerCase())
        ) ?? null
    })


    const sort = computed(() => {
        const current = sortString.value.toLowerCase()
        return ascOrDesc.find(prop =>
            current.includes(prop.toLowerCase())
        ) ?? null
    })

    const platform = computed(() => platformString.value)


    const {data, pending, error, refresh} = useFetch<RaisesResponse>('/api/raises', {
        query: {page, limit, order_by, sort, platform},
        watch: [page, limit, order_by, sort, platform],
        default: () => ({
            ok: false,
            pagination: {
                count: 0,
                totalCount: 0,
                totalPages: 1,
                currentPage: 1
            },
            results: []
        })
    })

    const rows = computed(() => data.value?.results ?? [])
    const pagination = computed(() => data.value?.pagination ?? null)
    const canGoNext = computed(() => pagination.value && pagination.value.currentPage < pagination.value.totalPages)


    const canGoPrev = computed(() => page.value > 1)

    const nextPage = () => {
        if (canGoNext.value) page.value++;
    }

    const prevPage = () => {
        if (canGoPrev.value) page.value--;
    }

    const changeSorting = (newSort: string) => sortString.value = newSort

    const changePlatform = (newPlatform: string | undefined) => {
        if (newPlatform) platformString.value = newPlatform
    }

    const clearFilters = async () => {
        page.value = 1
        await refresh()
    }
    return {
        page,
        limit,
        rows,
        pagination,
        pending,
        error,
        nextPage,
        prevPage,
        refresh,
        canGoNext,
        canGoPrev,
        changeSorting,
        changePlatform,
        clearFilters
    }
}