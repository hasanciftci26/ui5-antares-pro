import AntaresMockServer from "test/ui5/antares/pro/server/AntaresMockServer";

export default {
    init: function () {
        const server = new AntaresMockServer();

        server.simulate("../localService/metadata.xml", {
            bGenerateMissingMockData: true
        });

        server.start();
    }
};