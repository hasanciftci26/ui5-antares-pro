import Lib from "sap/ui/core/Lib";

const library = Lib.init({
    name: "ui5.antares.pro",
    apiVersion: 2,
    dependencies: [
        "sap.ui.core",
        "sap.m"
    ],
    controls: [],
    noLibraryCSS: true,
    version: "1.0.0"
});

export default library;