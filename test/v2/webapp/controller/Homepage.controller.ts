/* eslint-disable @typescript-eslint/no-unsafe-call */
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class Homepage extends BaseController {

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {

    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onInitClass() {
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees",
            metadataLabelEnabled: true,
            formType: "SimpleForm"
        });

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "level",
            errorMessage: "Level must be lower than 100.",
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validator: this.validateLevel
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private async validateLevel(level: number) {
        await this.getTimeOut();
        return level < 100;
    }

    private getTimeOut(): Promise<void> {
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve();
            }, 5000);
        });
    }

}