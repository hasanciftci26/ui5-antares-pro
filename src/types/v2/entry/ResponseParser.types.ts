/* eslint-disable @typescript-eslint/naming-convention */

export interface SubmitChangesResponse {
    __batchResponses: BatchResponse[];
}

export interface BatchResponse {
    __changeResponses?: ChangeResponse[];
    response?: {
        statusCode?: string;
        statusText?: string;
        headers?: Record<string, any>;
        body?: string;
    };
    message?: string;
}

export interface ChangeResponse {
    $reported?: boolean;
    _imported?: boolean;
    message?: string;
    response?: Response;
    statusCode?: string;
    statusText?: string;
    headers?: Record<string, any>;
    body?: string;
    data?: Record<string, any>;
}

export interface Response {
    $reported?: boolean;
    statusCode?: string;
    statusText?: string;
    headers?: Record<string, any>;
    body?: string;
}

export interface ErrorBody {
    message?: string;
    error?: {
        message?: {
            value?: string;
        };
    };
}