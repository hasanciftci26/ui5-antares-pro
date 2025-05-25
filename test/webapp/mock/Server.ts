import CustomServer from "test/ui5/antares/pro/mock/CustomServer";

export default {
    init: function () {
        const server = new CustomServer();

        server.simulate("metadata.xml");
        server.start();
    }
};