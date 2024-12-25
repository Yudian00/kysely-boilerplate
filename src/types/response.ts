
export type APIResponse<T> =
    | { success: boolean; message: string; data: T; error?: never }
    | { success: boolean; message: string; data?: never; error: Error };

export type APIPaginationRequest = {
    page: number;
    limit: number;
}

export type APIPaginationResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
}