const FILTERS = [
    {
        key: 'raise_status',
        symbol: '=',
        value: ['Active'],
    },
    {
        key: 'crowdfunding_type_1',
        symbol: '=',
        value: ['RegCF', 'RegA+'],
    }
]
// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {


    try {
        const apiKey = process.env.KINGS_API_KEY;
        const base = "https://api.kingscrowd.dev"

        if (!apiKey) {
            console.error('No api key');
            return sendError(event, createError({
                statusCode: 500,
                statusMessage: "Missing KingsCrowd API configuration"
            }))
        }

        const query = getQuery(event);
        const page = query.page ? Number(query.page) : 1;
        // const limit = query.limit ? Number(query.limit) : 5;
        const limit = 5;
        const order_by = query.order_by ? String(query.order_by) : 'start_date';
        const sort = query.sort ? String(query.sort) : 'desc';

        if (query.platform) {
            FILTERS.push({
                key: 'platform_id_name',
                symbol: '=',
                value: [String(query.platform)],
            })
        }

        const url = new URL("/api/v1/deals", base);

        url.searchParams.set('page', String(page));
        url.searchParams.set('limit', String(limit));
        url.searchParams.set('filters', JSON.stringify(FILTERS));
        url.searchParams.set('order_by', String(order_by));
        url.searchParams.set('sort', String(sort));

        console.info("Fetching Raises", {
            page: query.page,
            limit: Number(query.limit),
            order_by: String(order_by),
            sort: String(sort),
            filters: Object(FILTERS),
        });
        const res = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: 'application/json',
            },
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error("Api Response Was Error:", errorText)
            return sendError(event, createError({
                statusCode: res.status,
                statusMessage: `KingsCrowd API Error: ${errorText}`,
            }))
        }

        const json = await res.json();

        if (!json?.data?.result) {
            console.error("Api result was not structured as we expected", json)
            return sendError(event, createError({
                statusCode: 500,
                statusMessage: `KingsCrowd API Error: Malformed Response`,
            }))
        }

        return {
            ok: true,
            pagination: {
                count: json.data.count,
                totalCount: json.data.total_count,
                totalPages: json.data.total_pages,
                currentPage: json.data.current_page,
            },
            results: json.data.result,
        }
    } catch (err: any) {
        console.error("Unknown Server Error", err)
        return sendError(event, createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || err.message || "Server Error"
        }))
    }
})