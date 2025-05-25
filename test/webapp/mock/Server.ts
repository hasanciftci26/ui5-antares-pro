import CustomServer from "test/ui5/antares/pro/mock/CustomServer";

export default {
    init: function () {
        const server = new CustomServer();

        server.simulate("../service/metadata.xml");
        server.start();
    }
};