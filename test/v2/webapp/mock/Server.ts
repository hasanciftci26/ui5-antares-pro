import CustomServer from "test/v2/ui5/antares/pro/mock/CustomServer";

export default {
    init: function () {
        const server = new CustomServer();

        server.simulate("../service/metadata.xml");
        server.start();
    }
};