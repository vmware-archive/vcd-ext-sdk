/**
 * HTTP Headers
 */
export const HTTP_HEADERS = Object.freeze({

    Authorization: 'Authorization',

    etag: 'etag',

    // Angular is dealing with case sensitive links despite the specification
    // https://github.com/angular/angular/issues/6142
    link: 'link',
    Link: 'Link',

    x_vcloud_authorization: 'x-vcloud-authorization'
});
