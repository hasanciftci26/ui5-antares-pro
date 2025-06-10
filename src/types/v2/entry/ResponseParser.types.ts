/* eslint-disable @typescript-eslint/naming-convention */

export interface ISubmitChangesResponse {
    __batchResponses: IBatchResponse[];
}

export interface IBatchResponse {
    __changeResponses?: IChangeResponse[];
}

export interface IChangeResponse {
    $reported?: boolean;
    _imported?: boolean;
    message?: string;
    response?: IResponse;
    statusCode?: string;
    statusText?: string;
    headers?: Record<string, any>;
    body?: string;
    data?: Record<string, any>;
}

export interface IResponse {
    $reported?: boolean;
    statusCode?: string;
    statusText?: string;
    headers?: Record<string, any>;
    body?: string;
}

export interface IErrorBody {
    message?: string;
    error?: {
        message?: {
            value?: string;
        };
    };
}