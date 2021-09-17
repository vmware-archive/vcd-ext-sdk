import {InstantiateOvfPropertyType} from '@vcd/bindings/vcloud/api/rest/schema_v1_5/InstantiateOvfPropertyType';

export interface Configuration {
    vAppName: string;
    instantiateOvfProperties: InstantiateOvfPropertyType[];
}
