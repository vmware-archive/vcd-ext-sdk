import { AutomaticRecoveryAction } from "./AutomaticRecoveryAction";
import { VirtualSystemChangeableTypeType } from "./VirtualSystemChangeableTypeType";
import { CimString } from "./CimString";
import { CimUnsignedLong } from "./CimUnsignedLong";
import { CimUnsignedShort } from "./CimUnsignedShort";
import { AutomaticShutdownAction } from "./AutomaticShutdownAction";
import { CimDateTime } from "./CimDateTime";
import { VirtualSystemCaptionType } from "./VirtualSystemCaptionType";
import { AutomaticStartupAction } from "./AutomaticStartupAction";
export declare class CIMVirtualSystemSettingDataType {
    automaticRecoveryAction?: AutomaticRecoveryAction;
    automaticShutdownAction?: AutomaticShutdownAction;
    automaticStartupAction?: AutomaticStartupAction;
    automaticStartupActionDelay?: CimDateTime;
    automaticStartupActionSequenceNumber?: CimUnsignedShort;
    caption?: VirtualSystemCaptionType;
    changeableType?: VirtualSystemChangeableTypeType;
    configurationDataRoot?: CimString;
    configurationFile?: CimString;
    configurationID?: CimString;
    configurationName?: CimString;
    creationTime?: CimDateTime;
    description?: CimString;
    elementName?: CimString;
    generation?: CimUnsignedLong;
    instanceID?: CimString;
    logDataRoot?: CimString;
    notes?: CimString[];
    recoveryFile?: CimString;
    snapshotDataRoot?: CimString;
    suspendDataRoot?: CimString;
    swapFileDataRoot?: CimString;
    virtualSystemIdentifier?: CimString;
    virtualSystemType?: CimString;
    any?: object[];
    otherAttributes?: object;
}
export declare namespace CIMVirtualSystemSettingDataType {
    class Fields {
        static readonly AUTOMATIC_RECOVERY_ACTION: "automaticRecoveryAction";
        static readonly AUTOMATIC_SHUTDOWN_ACTION: "automaticShutdownAction";
        static readonly AUTOMATIC_STARTUP_ACTION: "automaticStartupAction";
        static readonly AUTOMATIC_STARTUP_ACTION_DELAY: "automaticStartupActionDelay";
        static readonly AUTOMATIC_STARTUP_ACTION_SEQUENCE_NUMBER: "automaticStartupActionSequenceNumber";
        static readonly CAPTION: "caption";
        static readonly CHANGEABLE_TYPE: "changeableType";
        static readonly CONFIGURATION_DATA_ROOT: "configurationDataRoot";
        static readonly CONFIGURATION_FILE: "configurationFile";
        static readonly CONFIGURATION_ID: "configurationID";
        static readonly CONFIGURATION_NAME: "configurationName";
        static readonly CREATION_TIME: "creationTime";
        static readonly DESCRIPTION: "description";
        static readonly ELEMENT_NAME: "elementName";
        static readonly GENERATION: "generation";
        static readonly INSTANCE_ID: "instanceID";
        static readonly LOG_DATA_ROOT: "logDataRoot";
        static readonly NOTES: "notes";
        static readonly RECOVERY_FILE: "recoveryFile";
        static readonly SNAPSHOT_DATA_ROOT: "snapshotDataRoot";
        static readonly SUSPEND_DATA_ROOT: "suspendDataRoot";
        static readonly SWAP_FILE_DATA_ROOT: "swapFileDataRoot";
        static readonly VIRTUAL_SYSTEM_IDENTIFIER: "virtualSystemIdentifier";
        static readonly VIRTUAL_SYSTEM_TYPE: "virtualSystemType";
        static readonly ANY: "any";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}
