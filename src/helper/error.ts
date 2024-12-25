class BaseError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    }
}

export class HttpRequestError extends BaseError {
    constructor(public status: number, public message: string, public error?: any) {
        super(message);

        this.name = 'HttpRequestError';
        this.status = status || 500;
        this.message = message || 'Internal Server Error';
        this.error = error || null;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            error: this.error,
        }
    }
}