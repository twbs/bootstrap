exports.handler = async () => {
    let envString = "";
    for (let key in process.env) {
        envString += `${key}: ${process.env[key]}
`;
    }
    return {
        statusCode: 200,
        body: `hello world! I have a hotub ${envString}`,
    };
};