import { Filter } from './filter.builder';

// tslint:disable:variable-name
// tslint:disable-next-line:no-namespace
export namespace Query {
    export class Builder {
        private _type: string;
        private _format: Format = Format.ID_RECORDS;
        private _links = true;
        private _pageSize = 25;
        private _fields: string[];
        private _filter: string;
        private _sort: { field: string, reverse?: boolean }[];

        private constructor() { }

        public static ofType(type: string): Builder {
            const qb = new Builder();
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

        public fields(...fields: string[]): Builder {
            this._fields = fields;
            return this;
        }

        public filter(filter: string): Builder {
            this._filter = filter;
            return this;
        }

        public sort(...sort: { field: string, reverse?: boolean }[]): Builder {
            this._sort = sort;
            return this;
        }

        public get(): string {
            let query = `?type=${this._type}&format=${this._format}&links=${this._links}&pageSize=${this._pageSize}`;
            if (this._fields && this._fields.length > 0) {
                query += `&fields=${this._fields.join(',')}`;
            }

            if (this._filter) {
                query += `&filter=${this._filter}`;
            }

            if (this._sort) {
                this._sort.forEach(s => {
                    query += `&${s.reverse ? 'sortDesc' : 'sortAsc'}=${s.field}`;
                });
            }

            return query;
        }
    }

    export class Format {
        static readonly ID_RECORDS: string = 'idrecords';
        static readonly RECORDS: string = 'records';
        static readonly REFERENCES: string = 'references';
    }
}
