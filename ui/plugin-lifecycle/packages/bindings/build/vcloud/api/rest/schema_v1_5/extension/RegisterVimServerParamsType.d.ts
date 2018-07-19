import { ShieldManagerType } from "./ShieldManagerType";
import { VimServerType } from "./VimServerType";
export declare class RegisterVimServerParamsType {
    vimServer?: VimServerType;
    shieldManager?: ShieldManagerType;
}
export declare namespace RegisterVimServerParamsType {
    class Fields {
        static readonly VIM_SERVER: "vimServer";
        static readonly SHIELD_MANAGER: "shieldManager";
    }
}
