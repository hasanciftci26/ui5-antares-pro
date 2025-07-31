import BaseObject from "sap/ui/base/Object";
import { ErrorBody, SubmitChangesResponse } from "ui5/antares/pro/types/v2/entry/ResponseParser.types";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * **Internal use only.**
 *
 * This class is part of the internal implementation of the **UI5 Antares Pro** library
 * and is not intended for public use or direct consumption.
 *
 * It may change or be removed without notice in future versions.
 *
 * @internal
 * 
 * @namespace ui5.antares.pro.v2.entry
 */
export default class ResponseParser extends BaseObject {
    public response?: Record<string, any>;
    public data?: Record<string, any>;
    public errorMessage?: string;
    public status: "Success" | "Error";
    private rawResponse?: SubmitChangesResponse;

    constructor(rawResponse?: SubmitChangesResponse) {
        super();
        this.rawResponse = rawResponse;
    }

    public parse() {
        if (!this.rawResponse) {
            this.status = "Error";
            return;
        }

        this.setStatus();
        this.setResponse();

        if (this.status === "Error") {
            this.setErrorMessage();
            return;
        }

        this.setData();
    }

    public parseError(error?: Record<string, any>) {
        this.status = "Error";

        if (!error) {
            return;
        }

        if (this.hasErrorResponseText(error)) {
            this.errorMessage = error.responseText;
        } else if (this.hasErrorMessage(error)) {
            this.errorMessage = error.message;
        } else {
            this.errorMessage = LibraryBundle.getText("ui5AntaresPro.error.submit");
        }
    }

    private setStatus() {
        let statusCode: string | undefined;

        if (this.rawResponse?.__batchResponses[0].response) {
            statusCode = this.rawResponse?.__batchResponses[0].response.statusCode;
        } else if (this.rawResponse?.__batchResponses[0].__changeResponses) {
            const changeResponses = this.rawResponse?.__batchResponses[0].__changeResponses;

            if (changeResponses.length) {
                const changeResponse = changeResponses[0];
                statusCode = changeResponse.response?.statusCode || changeResponse.statusCode;
            }
        }

        if (statusCode == null) {
            this.status = "Error";
        } else if (statusCode.startsWith("4") || statusCode.startsWith("5")) {
            this.status = "Error";
        } else {
            this.status = "Success";
        }
    }

    private setResponse() {
        if (this.rawResponse?.__batchResponses[0].response) {
            this.response = this.rawResponse?.__batchResponses[0].response;
        } else if (this.rawResponse?.__batchResponses[0].__changeResponses) {
            const changeResponses = this.rawResponse?.__batchResponses[0].__changeResponses;

            if (changeResponses.length) {
                const changeResponse = changeResponses[0];
                this.response = changeResponse.response || changeResponse;
            }
        }
    }

    private setErrorMessage() {
        const response = this.response;

        if (response) {
            if (this.hasBody(response)) {
                try {
                    const parsedBody = JSON.parse(response.body) as ErrorBody;
                    this.errorMessage = parsedBody.message || parsedBody.error?.message?.value;
                } catch (error) {
                    this.errorMessage = LibraryBundle.getText("ui5AntaresPro.error.submit");
                }
            }
        }

        if (!this.errorMessage) {
            this.errorMessage = LibraryBundle.getText("ui5AntaresPro.error.submit");
        }
    }

    private setData() {
        if (this.rawResponse?.__batchResponses[0].__changeResponses) {
            const changeResponses = this.rawResponse?.__batchResponses[0].__changeResponses;

            if (changeResponses.length) {
                const changeResponse = changeResponses[0];
                this.data = changeResponse.data;
            }
        }
    }

    private hasBody(response: Record<string, any>): response is { body: string; } {
        return "body" in response && typeof response.body === "string";
    }

    private hasErrorResponseText(error: Record<string, any>): error is { responseText: string; } {
        return "responseText" in error && typeof error.responseText === "string";
    }

    private hasErrorMessage(error: Record<string, any>): error is { message: string; } {
        return "message" in error && typeof error.message === "string";
    }
}