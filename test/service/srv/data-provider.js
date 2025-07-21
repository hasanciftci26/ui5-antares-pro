const cds = require("@sap/cds");

class CompanyManagement extends cds.ApplicationService {
    async init() {
        this.on("DELETE", "Employees", async (req, res) => {
            return req.reject(422, "Deletion is not allowed.");
        });

        await super.init();
    }
}

module.exports = CompanyManagement;