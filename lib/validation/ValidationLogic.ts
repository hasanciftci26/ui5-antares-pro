import BaseObject from "sap/ui/base/Object";
import { IValidationLogicSettings } from "ui5/antares/pro/types/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.validation
 */
export default class ValidationLogic extends BaseObject {
    private settings: IValidationLogicSettings;

    constructor(settings: IValidationLogicSettings) {
        super();
        this.settings = settings;
    }

    public validateInitialSettings() {
        if (this.settings.validator) {
            return;
        }

        this.validateOperator();
        this.validateProperty();
        this.validateDependent();
    }

    private validateOperator() {
        if (!this.settings.operator) {
            throw new Error("If no validator function is attached, operator is mandatory");
        }
    }

    private validateProperty() {
        if (["BT", "NB"].includes(this.settings.operator as string)) {
            if (!this.settings.value1 || !this.settings.value2) {
                throw new Error("BT and NB requires both value1 and value2");
            }
        } else {
            if (!this.settings.value1) {
                throw new Error("value1 must be provided");
            }
        }
    }

    private validateDependent() {
        if (!this.settings.dependentProperty) {
            return;
        }

        this.validateDependentOperator();
        this.validateDependentProperty();
    }

    private validateDependentOperator() {
        if (!this.settings.dependentOperator) {
            throw new Error("If no validator function is attached, operator is mandatory");
        }
    }

    private validateDependentProperty() {
        if (["BT", "NB"].includes(this.settings.dependentOperator as string)) {
            if (!this.settings.dependentValue1 || !this.settings.dependentValue2) {
                throw new Error("BT and NB requires both dependentValue1 and dependentValue2");
            }
        } else {
            if (!this.settings.dependentValue1) {
                throw new Error("dependentValue1 must be provided");
            }
        }
    }
}