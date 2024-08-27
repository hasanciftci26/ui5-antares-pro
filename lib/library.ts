import Lib from "sap/ui/core/Lib";

const library = Lib.init({
    name: "ui5.antares.pro",
    dependencies: [
        "sap.m",
        "sap.ui.core",
        "sap.ui.comp",
        "sap.ui.table",
        "sap.ui.layout"
    ],
    controls: [
        "ui5.antares.pro.core.v2.ModelCL"
    ],
    noLibraryCSS: true,
    version: "1.120.0"
});

export default library