import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    var comment = '';
    var headers = '';
    var data = '# if you modifying, request payload make sure to drop content-length or update to correct value';
    const bodymethods = ['POST', 'PUT']
    if (req.body && bodymethods.indexOf(req.method) === -1) {
        comment = comment + `\n# as per spec, its adviced to have body for ${bodymethods} requests`
    }
    if (req.body) {
        if (req.rawBody.indexOf('"') == -1) {
            data = `--data "${req.rawBody}"`
        } else if (req.rawBody.indexOf("'") == -1) {
            data = `--data '${req.rawBody}'`
        } else {
            data = `--data '''${req.rawBody}'''`
        }
    }
    if (req.headers) {
        Object.keys(req.headers).forEach(key => {
            headers = `-H "${key}: ${req.headers[key]}" \\\n`
        });
        if (headers !== '') {
            headers = headers.substring(0, headers.length - 2);
        }
    }
    var body = `curl "${req.url}" \\
    -X ${req.method} \\
    ${headers}`
    if (data !== '') {
        body = body + '\\\n' + data;
    }
    if (comment !== '') {
        body = body + '\\\n' + comment;
    }
    const isHtmlResponse = false
    if (isHtmlResponse) {
        context.log('not yet implemented'); // TODO
    }
    context.res = {
        'headers': {
            'authoredby': 'https://github.com/cedric05',
        },
        'body': body
    }
};

export default httpTrigger;