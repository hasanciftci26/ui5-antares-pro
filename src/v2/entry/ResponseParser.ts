import BaseObject from "sap/ui/base/Object";
import { IErrorBody, ISubmitChangesResponse } from "ui5/antares/pro/types/v2/entry/ResponseParser.types";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * @namespace ui5.antares.pro.v2.entry
 */
export default class ResponseParser extends BaseObject {
    public response?: Record<string, any>;
    public data?: Record<string, any>;
    public errorMessage?: string;
    public status: "Success" | "Error";
    private rawResponse?: ISubmitChangesResponse;

    constructor(rawResponse?: ISubmitChangesResponse) {
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

    private setStatus() {
        let statusCode: string | undefined;

        if (this.rawResponse?.__batchResponses[0].__changeResponses) {
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
        if (this.rawResponse?.__batchResponses[0].__changeResponses) {
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
                    const parsedBody = JSON.parse(response.body) as IErrorBody;
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
}