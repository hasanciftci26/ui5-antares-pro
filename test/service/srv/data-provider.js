const cds = require("@sap/cds");

class CompanyManagement extends cds.ApplicationService {
    async init() {

        await super.init();
    }
}

module.exports = CompanyManagement;