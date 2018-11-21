import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {LinkType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export const HATEOAS_HEADER = "Link";

/**
 * Parse out Link headers using a very lazily implemented pull parser
 * @param {string} header '<url1>;name1="value1",name2="value2",<url2>;name3="value3,value4"'
 * @returns {LinkType[]} parsed link headers
 */
export function parseHeaderHateoasLinks(header: string): LinkType[] {
    const headerFieldMappings: {[key: string]: keyof LinkType} = {
        href: "href",
        model: "type",
        title: "id",
        rel: "rel"
    };
    let tokenIndex: number = -1;

    function peek(token: string) {
        return header.indexOf(token, tokenIndex + 1);
    }

    function next(token: string) {
        const nextIndex = peek(token);
        if (nextIndex == -1) {
            throw new Error(JSON.stringify({header, token, tokenIndex}));
        }
        tokenIndex = nextIndex;
        return tokenIndex;
    }

    const results: LinkType[] = [];
    while (peek("<") > -1) {
        try {
            const hrefStart = next("<");
            const hrefEnd = next(">");
            const href = header.substring(hrefStart + 1, hrefEnd);
            const result: LinkType = {href, type: null, id: null, rel: null, vCloudExtension: []};
            let comma = peek(",");
            let semicolon = peek(";");
            while ((semicolon > -1 && comma > -1 && semicolon < comma) || (semicolon > -1 && comma == -1)) {
                const nameStart = next(";");
                const nameEnd = next("=");
                const name = header.substring(nameStart + 1, nameEnd).trim().toLowerCase();
                const valueStart = next('"');
                const valueEnd = next('"');
                const value = header.substring(valueStart + 1, valueEnd);
                const mappedName = headerFieldMappings[name];
                if (mappedName) {
                    result[mappedName] = decodeURIComponent(value);
                }
                comma = peek(",");
                semicolon = peek(";");
            }
            results.push(result);
        } catch (error) {  // We will try the next one...
            console.log(error);
        }
    }

    return results;
}

/**
 * Extract HATEOAS Header Links and place in the body.
 * (Null responses with header links will become objects.)
 */
@Injectable()
export class HateoasHeaderInterceptor implements HttpInterceptor {

    private _enabled: boolean = true;

    set enabled(enabled: boolean) {
        this._enabled = enabled;
    }

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this._enabled) {
            return next.handle(req);
        }

        const handled = next.handle(req);
        return handled.pipe(
            map((event: HttpEvent<any>) => {
                if (event.type != HttpEventType.Response) {
                    return event;
                }

                if (!event.headers.has(HATEOAS_HEADER)) {
                    return event;
                }
                const headerLinks: LinkType[] = (event.headers.has(HATEOAS_HEADER))
                    ? parseHeaderHateoasLinks(event.headers.get(HATEOAS_HEADER))
                    : [];
                if (event.body) {
                    if (typeof event.body != "object" || Array.isArray(event.body)) {
                        return event;
                    }

                    const bodyLinks: LinkType[] = (event.body.link)
                        ? event.body.link
                        : [];
                    return event.clone({
                        body: {...event.body, link: [...headerLinks, ...bodyLinks]}
                    })
                }

                return event.clone({
                    body: {link: headerLinks}
                });
            })
        );
    }
}