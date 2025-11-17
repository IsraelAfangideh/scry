import type {Raise} from "../types/raises";

export function useExport() {

    const exportRaisesToCSV = (rows: Raise[], columns: string[]): void => {
        if (columns.length === 0 && rows.length === 0) return
        const lines = [columns.join(','), ...rows.map(row => {
            const values = [row?.name, row?.raise_status, row?.platform_id.name, row?.funding_gather_money_raised_to_date?.formatted, row?.valuation?.formatted]
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