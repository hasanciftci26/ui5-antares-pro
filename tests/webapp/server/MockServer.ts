import MockServer from "sap/ui/core/util/MockServer";
import ExtendedMockServer from "test/ui5/antares/pro/server/ExtendedMockServer";

export default {
    init: function () {
        const server = new ExtendedMockServer();

        server.simulate("../localService/metadata.xml", {
            sMockdataBaseUrl: "../localService/data/",
            bGenerateMissingMockData: true
        });

        server.start();
    }
};