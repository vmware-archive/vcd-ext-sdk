import { ExtensionPointDefinitions } from "./interfaces";
import { VAPP_VM_ACTION_CONFIG } from "./configs/vapp-vm-action.config";
import { NAVIGATION_DATACENTER_AND_APPLICATION_CONFIG } from "./configs/navigation-datacenter-and-application.config";
import { NAVIGATION_PRIMARY_CONFIG } from "./configs/navigation-primary.config";

export const EXTENSION_POINTS_DEFINITIONS: ExtensionPointDefinitions = {
    "vm-action": VAPP_VM_ACTION_CONFIG,
    "vapp-action": VAPP_VM_ACTION_CONFIG,
    "navigation:primary": NAVIGATION_PRIMARY_CONFIG,
    "navigation:datacenter:overview": NAVIGATION_DATACENTER_AND_APPLICATION_CONFIG,
    "navigation:applications": NAVIGATION_DATACENTER_AND_APPLICATION_CONFIG,
    "navigation:datacenter:compute": NAVIGATION_DATACENTER_AND_APPLICATION_CONFIG,
    "navigation:datacenter:network": NAVIGATION_DATACENTER_AND_APPLICATION_CONFIG,
    "navigation:datacenter:storage": NAVIGATION_DATACENTER_AND_APPLICATION_CONFIG,
}