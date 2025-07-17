const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function ({ log, middlewareUtil, options, resources }) {
    const proxy = createProxyMiddleware({
        context: "/northwind",
        target: "https://services.odata.org",
        changeOrigin: true,
        pathRewrite: {
            "^/northwind": "/V2/Northwind/Northwind.svc"
        },
        secure: false
    });

    return function (req, res, next) {
        if (req.url.startsWith("/northwind")) {
            proxy(req, res, next);
        } else {
            next();
        }
    };
};
