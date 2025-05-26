import MockServer from "sap/ui/core/util/MockServer";

/**
 * @namespace test.v2.ui5.antares.pro.server
 */
export default class CustomServer extends MockServer {
    constructor() {
        super({
            rootUri: "/mock/v2/antares/pro/"
        });
    }
}