module.exports = async function ({ dependencies, log, options, taskUtil, workspace }) {
    const dbgFiles = await workspace.byGlob("**/*-dbg.js") || [];
    const mapFiles = await workspace.byGlob("**/*.js.map") || [];
    const resourcesToDelete = dbgFiles.concat(mapFiles);

    for (const resource of resourcesToDelete) {
        taskUtil.setTag(resource, taskUtil.STANDARD_TAGS.OmitFromBuildResult);
        log.info(`Omitting resource from build result: ${resource.getPath()}`);
    }
};
