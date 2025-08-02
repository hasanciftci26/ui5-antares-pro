import Lib from "sap/ui/core/Lib";

const library = Lib.init({
    name: "ui5.antares.pro",
    apiVersion: 2,
    dependencies: [
        "sap.ui.core",
        "sap.m",
        "sap.ui.comp",
        "sap.ui.table",
        "sap.ui.layout"
    ],
    controls: [],
    noLibraryCSS: true,
    version: "1.0.0"
});

export default library;