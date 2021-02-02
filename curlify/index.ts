import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import fs = require('fs');


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
        Object.keys(req.headers).forEach(key => {
            headers += `    -H "${key}: ${req.headers[key]}" ${slash}\n`
        });
    }
    if (headers !== '') {
        headers = headers.substring(0, headers.length);
    }
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
        context.res.headers = { 'content-type': 'text/html' }
        const data = fs.readFileSync('./template.html');
        body = data.toString().replace('CURLSTATEMENT', body);
    } else {
        context.res.headers = { 'content-type': 'text/plain' }
    }
    context.res.body = body;
};

export default httpTrigger;