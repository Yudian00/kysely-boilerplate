import { SelectQueryBuilder } from "kysely";

interface PaginationResult<T> {
    result: T[];
    meta: {
        page: number;
        offset: number;
        limit: number;
        total: number;
    };
}

export async function applyPagination<T>(
    query: SelectQueryBuilder<any, any, any>,
    filters: { page: number; limit: number }
): Promise<PaginationResult<T>> {
    const offset = (filters.page * filters.limit) - filters.limit;

    let queryWithPagination = query;

    if (filters.limit) {
        queryWithPagination = queryWithPagination.limit(filters.limit);
    }

    if (filters.page) {
        queryWithPagination = queryWithPagination.offset(offset);
    }

    const [result, total] = await Promise.all([
        queryWithPagination.execute(),
        query.execute(),
    ]);

    const meta = {
        page: filters.page,
        offset: offset + 1,
        limit: filters.limit,
        total: total.length,
    };

    return { result, meta };
}