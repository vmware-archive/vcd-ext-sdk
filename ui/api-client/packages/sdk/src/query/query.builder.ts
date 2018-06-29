export namespace Query {
    export class Builder {
        private _type: string;
        private _format: Format = Format.ID_RECORDS;
        private _links: boolean = true;
        private _pageSize: number = 25;

        private constructor() { }

        public static ofType(type: string): Builder {
            let qb = new Builder();
            qb._type = type;
            return qb;
        }

        public format(format: Query.Format): Builder {
            this._format = format;
            return this;
        }

        public links(links: boolean): Builder {
            this._links = links;
            return this;
        }

        public pageSize(pageSize: number): Builder {
            this._pageSize = pageSize;
            return this;
        }

        public get(): string {
            let query: string = `?type=${this._type}&format=${this._format}&links=${this._links}&pageSize=${this._pageSize}`;

            return query;
        }
    }

    export class Format {
        static readonly ID_RECORDS = 'idrecords';
        static readonly RECORDS = 'records';
        static readonly REFERENCES = 'references';
    }
}