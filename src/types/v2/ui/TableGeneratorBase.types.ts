/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/TableGeneratorBase" {
    export default interface TableGeneratorBase {
        getTableTitle: GetProperty<string>;
        setTableTitle: SetProperty<string>;
        getCount: GetProperty<number>;
        setCount: SetProperty<number>;
        getFormTitle: GetProperty<string>;
        setFormTitle: SetProperty<string>;
        getCreateFormTitle: GetProperty<string | undefined>;
        setCreateFormTitle: SetProperty<string | undefined>;
        getUpdateFormTitle: GetProperty<string | undefined>;
        setUpdateFormTitle: SetProperty<string | undefined>;
        getDeleteFormTitle: GetProperty<string | undefined>;
        setDeleteFormTitle: SetProperty<string | undefined>;
        getCreateButtonText: GetProperty<string>;
        setCreateButtonText: SetProperty<string>;
        getCreateButtonType: GetProperty<ButtonType>;
        setCreateButtonType: SetProperty<ButtonType>;
        getUpdateButtonText: GetProperty<string>;
        setUpdateButtonText: SetProperty<string>;
        getUpdateButtonType: GetProperty<ButtonType>;
        setUpdateButtonType: SetProperty<ButtonType>;
        getDeleteButtonText: GetProperty<string>;
        setDeleteButtonText: SetProperty<string>;
        getDeleteButtonType: GetProperty<ButtonType>;
        setDeleteButtonType: SetProperty<ButtonType>;
        getSubmitButtonText: GetProperty<string>;
        setSubmitButtonText: SetProperty<string>;
        getSubmitButtonType: GetProperty<ButtonType>;
        setSubmitButtonType: SetProperty<ButtonType>;
        getCloseButtonText: GetProperty<string>;
        setCloseButtonText: SetProperty<string>;
        getCloseButtonType: GetProperty<ButtonType>;
        setCloseButtonType: SetProperty<ButtonType>;
        getVisibleColumnCount: GetProperty<number>;
        setVisibleColumnCount: SetProperty<number>;
    }
}

export interface Settings {
    tableTitle?: string;
    createFormTitle?: string;
    updateFormTitle?: string;
    deleteFormTitle?: string;
    createButtonText: string;
    createButtonType: ButtonType;
    updateButtonText: string;
    updateButtonType: ButtonType;
    deleteButtonText: string;
    deleteButtonType: ButtonType;
    closeButtonText: string;
    closeButtonType: ButtonType;
    visibleColumnCount: number;
}

export interface P13nProperty {
    key: string;
    label: string;
    path: string;
}

export interface P13nStateChangeParams {
    control: Control;
    state?: {
        // eslint-disable-next-line @typescript-eslint/naming-convention        
        Columns: {
            key: string;
        }[];
    };
}