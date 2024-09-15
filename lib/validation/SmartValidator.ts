import BaseObject from "sap/ui/base/Object";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import ValidationLogic from "ui5/antares/pro/validation/ValidationLogic";
import { IEntityProperty } from "ui5/antares/pro/types/odata/v2/ODataMetadataReader";

/**
 * @namespace ui5.antares.pro.validation
 */
export default class SmartValidator extends BaseObject {
    private smartForm: SmartForm;
    private properties: IEntityProperty[];
    private validations: ValidationLogic[];

    constructor(smartForm: SmartForm, properties: IEntityProperty[], validations: ValidationLogic[]) {
        super();
        this.smartForm = smartForm;
        this.properties = properties;
        this.validations = validations;
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