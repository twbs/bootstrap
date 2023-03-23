const lambdaTunnel = require("@lambdatest/node-tunnel");
const tunnelInstance = new lambdaTunnel();
const tunnelArguments = {
    user: process.env.LT_USERNAME,
    key: process.env.LT_ACCESS_KEY,
    tunnelName: process.env.LT_TUNNEL_NAME || 'jasmine',
    logFile: "local.log"
};

if (process.env.LAMBDATEST == 'true') {
    (async () => {
        try {
            await tunnelInstance.start(tunnelArguments)
        } catch (err) {
            console.log(err.message)
        }
    })()
}