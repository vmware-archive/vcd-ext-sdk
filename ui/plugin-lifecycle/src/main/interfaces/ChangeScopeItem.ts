import { Plugin } from "./Plugin"

export interface ChangeScopeItem {
    orgName: string;
    plugin: Plugin;
    action: string;
}