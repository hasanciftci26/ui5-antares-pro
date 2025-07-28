/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import LayoutData from "sap/ui/core/LayoutData";
import Context from "sap/ui/model/odata/v2/Context";
import {
    AddAggregation,
    DestroyAggregation,
    GetAggregation,
    GetProperty,
    RemoveAggregation,
    RemoveAllAggregation,
    SetAggregation,
    SetProperty
} from "ui5/antares/pro/types/Global.types";
import { Multiplicity } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";
import CustomContent from "ui5/antares/pro/v2/custom/CustomContent";
import CustomElement from "ui5/antares/pro/v2/custom/CustomElement";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

declare module "ui5/antares/pro/v2/metadata/NavigationProperty" {
    export default interface NavigationProperty {
        getName: GetProperty<string>;
        setName: SetProperty<string>;
        getIndex: GetProperty<number | undefined>;
        setIndex: SetProperty<number | undefined>;
        getTableClass: GetProperty<TableClass>;
        setTableClass: SetProperty<TableClass>;
        getTableTitle: GetProperty<string | undefined>;
        setTableTitle: SetProperty<string | undefined>;
        getTableLayoutData: GetProperty<LayoutData | undefined>;
        setTableLayoutData: SetProperty<LayoutData>;
        getFormTitle: GetProperty<string | undefined>;
        setFormTitle: SetProperty<string | undefined>;
        getCreateDialogTitle: GetProperty<string | undefined>;
        setCreateDialogTitle: SetProperty<string | undefined>;
        getUpdateDialogTitle: GetProperty<string | undefined>;
        setUpdateDialogTitle: SetProperty<string | undefined>;
        getDeleteDialogTitle: GetProperty<string | undefined>;
        setDeleteDialogTitle: SetProperty<string | undefined>;
        getReadDialogTitle: GetProperty<string | undefined>;
        setReadDialogTitle: SetProperty<string | undefined>;
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
        getCloseButtonText: GetProperty<string>;
        setCloseButtonText: SetProperty<string>;
        getCloseButtonType: GetProperty<ButtonType>;
        setCloseButtonType: SetProperty<ButtonType>;
        getVisibleColumnCount: GetProperty<number>;
        setVisibleColumnCount: SetProperty<number>;
        getNoEntryErrorEnabled: GetProperty<boolean>;
        setNoEntryErrorEnabled: SetProperty<boolean>;
        getNoEntryErrorMessage: GetProperty<string | undefined>;
        setNoEntryErrorMessage: SetProperty<string>;
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getMultiplicity: GetProperty<Multiplicity>;
        setMultiplicity: SetProperty<Multiplicity>;
        getContext: GetProperty<Context>;
        setContext: SetProperty<Context>;
        getPropertySettings: GetProperty<PropertySettings[]>;
        setPropertySettings: SetProperty<PropertySettings[]>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        getInheritValues: GetProperty<ValueInheritance[]>;
        setInheritValues: SetProperty<ValueInheritance[]>;
        addValidationLogic: AddAggregation<ValidationLogic>;
        removeValidationLogic: RemoveAggregation<ValidationLogic>;
        getValidationLogics: GetAggregation<ValidationLogic[]>;
        removeAllValidationLogics: RemoveAllAggregation;
        destroyValidationLogics: DestroyAggregation;
        addValueList: AddAggregation<ValueList>;
        removeValueList: RemoveAggregation<ValueList>;
        getValueLists: GetAggregation<ValueList[]>;
        removeAllValueLists: RemoveAllAggregation;
        destroyValueLists: DestroyAggregation;
        getFormLayout: GetAggregation<FormLayout>;
        setFormLayout: SetAggregation<FormLayout>;
        getCustomElements: GetAggregation<CustomElement[]>;
        removeCustomElement: RemoveAggregation<CustomElement>;
        removeAllCustomElements: RemoveAllAggregation;
        destroyCustomElements: DestroyAggregation;
        addCustomContent: AddAggregation<CustomContent>;
        getCustomContents: GetAggregation<CustomContent[]>;
        removeCustomContent: RemoveAggregation<CustomContent>;
        removeAllCustomContents: RemoveAllAggregation;
        destroyCustomContents: DestroyAggregation;
    }
}

export interface Settings {
    name: string;
    index?: number;
    tableClass?: TableClass;
    tableTitle?: string;
    tableLayoutData?: LayoutData;
    formTitle?: string;
    createDialogTitle?: string;
    updateDialogTitle?: string;
    deleteDialogTitle?: string;
    readDialogTitle?: string;
    createButtonText?: string;
    createButtonType?: ButtonType;
    updateButtonText?: string;
    updateButtonType?: ButtonType;
    deleteButtonText?: string;
    deleteButtonType?: ButtonType;
    closeButtonText?: string;
    closeButtonType?: ButtonType;
    visibleColumnCount?: number;
    noEntryErrorEnabled?: boolean;
    noEntryErrorMessage?: string;
    propertySettings?: PropertySettings[];
    propertyOrder?: string[];
    inheritValues?: ValueInheritance[];
    validationLogics?: ValidationLogic[];
    valueLists?: ValueList[];
    formLayout?: FormLayout;
    customElements?: CustomElement[];
    customContents?: CustomContent[];
}

export type TableClass = "sap.m.Table" | "sap.ui.table.Table";

export interface ValueInheritance {
    parentProperty: string;
    targetProperty: string;
}