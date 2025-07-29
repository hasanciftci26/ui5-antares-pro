# UI5 Antares Pro

[TS_URL]: https://www.typescriptlang.org
[SAPUI5_URL]: https://sapui5.hana.ondemand.com
[UI5_LICENSE_URL]: https://tools.hana.ondemand.com/developer-license-3_2.txt
[UI5_COMPONENT_CONTAINER]: https://sapui5.hana.ondemand.com/#/api/sap.ui.core.ComponentContainer
[UI5_DIALOG]: https://sapui5.hana.ondemand.com/#/api/sap.m.Dialog
[UI5_V2_ODATA]: https://sapui5.hana.ondemand.com/#/api/sap.m.Dialog

**UI5 Antares Pro** is a modular SAPUI5 library designed to standardize and accelerate the implementation of CRUD operations for OData EntitySets in enterprise applications.

Leveraging the OData model defined in the consuming application, the library dynamically generates UI elements such as dialogs, forms, and tables. Full lifecycle handling is provided, including data binding, submission, and error management. Support is also included for custom validation logic, which can be implemented by the consumer as needed.

> **Note**  
> The library currently supports only [sap.ui.model.odata.v2.ODataModel][UI5_V2_ODATA]. Support for OData v4 is not yet available.

## Integration Modes

Two integration modes are supported:

- **Dialog Mode**  
  A ready-to-use [dialog][UI5_DIALOG] is generated with embedded form and table components for rapid deployment.

- **Component Mode**  
  A reusable UI component is exposed, which can be integrated via [sap.ui.core.ComponentContainer][UI5_COMPONENT_CONTAINER]. This allows the consumer to position and style the component freely within the application layout while benefiting from the same functionality.

## Compatibility

UI5 Antares Pro is developed using [TypeScript][TS_URL] and is fully compatible with both JavaScript-based and TypeScript-based SAPUI5 applications.

## License and Usage Notice

This library leverages standard classes and components provided by the [SAPUI5][SAPUI5_URL] framework without modifying or redistributing SAPUI5 source code. SAPUI5 is licensed under the [SAP Developer License][UI5_LICENSE_URL]. Users of **UI5 Antares Pro** are responsible for reviewing and complying with the terms and conditions of the [SAP Developer License][UI5_LICENSE_URL].

Careful attention must be paid to the licensing restrictions when integrating **UI5 Antares Pro** in projects that include SAPUI5 dependencies.

## Benefits

UI5 Antares Pro promotes consistency, reusability, and reduced development effort across SAPUI5-based projects, making it a valuable foundation for scalable and maintainable enterprise UI development.