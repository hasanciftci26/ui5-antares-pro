import Lib from "sap/ui/core/Lib";

const library = Lib.init({
    name: "ui5.antares.pro",
    dependencies: [
        "sap.ui.core",
        "sap.m"
    ],
    controls: [
        "ui5.antares.pro.core.v2.Root"
    ],
    noLibraryCSS: true,
    version: "1.0.0"
});

export default library;