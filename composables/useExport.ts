import type {Raise} from "../types/raises";

export function useExport() {

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

    const exportRaisesToCSV = (rows: Raise[], columns: string[]): void => {
        if (columns.length === 0 && rows.length === 0) return
        const lines = [columns.join(','), ...rows.map(row => {
            const values = [row?.name, row?.raise_status.name, row?.platform_id.name, row?.funding_gather_money_raised_to_date?.formatted, row.minimum_investment_amount.formatted, row?.valuation?.formatted, calculateDaysLeft(row.start_date, row.close_date)]
            return values.map(v => {
                const text = String(v ?? '');
                return `"${text.replace(/"/g, '""')}"`
            })
                .join(',')
        })]

        const blob = new Blob([lines.join('\n')], {type: 'text/csv;charset:utf-8'})
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        document.body.appendChild(link)
        link.download = 'raises.csv'
        link.click();
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
    return {
        exportRaisesToCSV,
    }
}