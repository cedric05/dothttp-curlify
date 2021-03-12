import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import fs = require('fs');


const extraHeaders = [
    "host", // this header confuses proxy server
    "max-forwards",
    "was-default-hostname",
    "disguised-host",
    "x-waws-unencoded-url",
    "x-arr-log-id",
    "x-site-deployment-id",
    "x-original-url",
    "x-forwarded-for",
    "x-arr-ssl",
    "x-forwarded-proto",
    "x-appservice-proto",
    "x-forwarded-tlsversion",
]


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    var slash = '\\';
    const double = '\\\\'
    const isHtmlResponse = (req.headers['accept'] ?? '').includes('text/html');
    if (isHtmlResponse) slash = double;
    var comment = '';
    var headers = '';
    var data = '';
    const bodymethods = ['POST', 'PUT']
    if (req.body) {
        comment = `# if you modifying, request payload make sure to drop content-length 
# or update to correct value`
        if (bodymethods.indexOf(req.method) === -1)
            comment = comment + `\n# as per spec, its adviced to have body for ${bodymethods} requests`
    }
    if (req.headers) {
        Object.keys(req.headers)
            .filter(key => !extraHeaders.includes(key))
            .forEach(key => {
                headers += `    -H "${key}: ${req.headers[key]}" ${slash}\n`
            });
    }
    if (headers !== '') {
        headers = headers.substring(0, headers.length);
    }
    ifHostNameModifyHostname(req);
    if (req.body) {
        if (req.rawBody.indexOf('"') == -1) {
            data = `--data "${req.rawBody}"`
        } else if (req.rawBody.indexOf("'") == -1) {
            data = `--data '${req.rawBody}'`
        } else {
            data = `--data '''${req.rawBody}'''`
        }
        var body = `curl "${req.url}" ${slash}
    -X ${req.method} ${slash}
${headers}    ${data} ${slash}
${comment}`
    } else {
        var body = `curl "${req.url}" ${slash}
    -X ${req.method} ${slash}
${headers}    ${comment}`
    }

    context.log("body is " + body);

    context.res.headers = { 'authoredby': 'https://github.com/cedric05', };
    if (isHtmlResponse) {
        context.res.headers['content-type'] = 'text/html'
        const data = fs.readFileSync('./template.html');
        body = data.toString().replace('CURLSTATEMENT', body);
    } else {
        context.res.headers['content-type'] = 'text/plain'
    }
    context.res.headers['Access-Control-Allow-Origin'] = '*'
    context.res.headers['Access-Control-Allow-Headers'] = '*'
    context.res.headers['Access-Control-Allow-Methods'] = '*'
    context.res.body = body;
};

export default httpTrigger;

function ifHostNameModifyHostname(req: HttpRequest) {
    var hostname = "req.dothttp.dev";
    Object.keys(req.query)
        .filter(querykey => querykey.toLowerCase() === 'host')
        .forEach(querykey => { hostname = req.query[querykey]; });
    const urlDO = new URL(req.url);
    urlDO.hostname = hostname;
    req.url = urlDO.toString();
}
