export declare namespace Query {
    class Builder {
        private _type;
        private _format;
        private _links;
        private _pageSize;
        private constructor();
        static ofType(type: string): Builder;
        format(format: Query.Format): Builder;
        links(links: boolean): Builder;
        pageSize(pageSize: number): Builder;
        get(): string;
    }
    class Format {
        static readonly ID_RECORDS: string;
        static readonly RECORDS: string;
        static readonly REFERENCES: string;
    }
}
