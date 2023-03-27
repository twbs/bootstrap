const lambdaTunnel = require("@lambdatest/node-tunnel");
const tunnelInstance = new lambdaTunnel();
const tunnelArguments = {
    user: process.env.LT_USERNAME,
    key: process.env.LT_ACCESS_KEY,
    tunnelName: process.env.LT_TUNNEL_NAME || 'jasmine',
    logFile: "local.log"
};

if (process.env.LAMBDATEST == 'true')
    tunnelInstance
        .start(tunnelArguments)
        .then(_ => {
            console.log("Tunnel is Running Successfully")
        })
        .catch(err => {
            console.log(err);
        });