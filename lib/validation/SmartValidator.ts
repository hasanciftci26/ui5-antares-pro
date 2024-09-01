import BaseObject from "sap/ui/base/Object";
import SmartForm from "sap/ui/comp/smartform/SmartForm";

export default class SmartValidator extends BaseObject {
    private smartForm: SmartForm;

    constructor(smartForm: SmartForm) {
        super();
        this.smartForm = smartForm;
    }

    public async validate() {
        return new Promise((resolve, reject) => {
            const validations = this.smartForm.check();

            if (validations instanceof Promise) {
                validations.then((results) => {
                    if (results.length) {
                        reject();
                    } else {
                        resolve(true);
                    }
                });
            } else {
                if (validations.length) {
                    reject();
                } else {
                    resolve(true);
                }
            }
        });
    }
}