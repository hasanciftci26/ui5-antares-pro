import MockServer from "sap/ui/core/util/MockServer";

/**
 * @namespace test.ui5.antares.pro.server
 */
export default class AntaresMockServer extends MockServer {
    constructor() {
        super({
            rootUri: "/mock/v2/antares/pro/"
        });
    }
}