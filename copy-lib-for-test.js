const fs = require("fs");
const path = require("path");

// Define source and destination paths
const source = path.join(__dirname, "lib");
const destination = path.join(__dirname, "tests/webapp/antares");

async function copyLibFolder() {
    try {
        // Remove the destination folder if it exists
        if (fs.existsSync(destination)) {
            await fs.promises.rm(destination, { recursive: true, force: true });
            console.log("Destination folder removed.");
        }

        // Create the destination folder
        await fs.promises.mkdir(destination, { recursive: true });
        console.log("Destination folder created.");

        // Copy the source folder to the destination
        await fs.promises.cp(source, destination, { recursive: true });
        console.log("Files copied successfully!");
    } catch (err) {
        console.error("Error during copy:", err);
        process.exit(1);
    }
}

copyLibFolder().then(() => {
    console.log("Prestart script completed.");
}).catch(err => {
    console.error("Prestart script failed:", err);
    process.exit(1); // Ensure the script exits with an error code
});