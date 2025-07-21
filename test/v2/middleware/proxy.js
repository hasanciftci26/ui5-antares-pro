const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function ({ log, middlewareUtil, options, resources }) {
    const northwindProxy = createProxyMiddleware({
        context: "/northwind",
        target: "https://services.odata.org",
        changeOrigin: true,
        pathRewrite: {
            "^/northwind": "/V2/Northwind/Northwind.svc"
        },
        secure: false
    });

    const companyManagementProxy = createProxyMiddleware({
        context: "/company-management",
        target: "http://localhost:4004",
        changeOrigin: true,
        pathRewrite: {
            "^/company-management": "/odata/v2/company-management"
        },
        secure: false
    });

    return function (req, res, next) {
        if (req.url.startsWith("/northwind")) {
            northwindProxy(req, res, next);
        } else if (req.url.startsWith("/company-management")) {
            companyManagementProxy(req, res, next);
        } else {
            next();
        }
    };
};
