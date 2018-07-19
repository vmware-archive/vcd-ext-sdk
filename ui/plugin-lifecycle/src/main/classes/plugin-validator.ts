import { Plugin, PluginManifest } from "../interfaces/Plugin";
import { Subscription } from "rxjs";

interface ValidationResult {
    success: boolean;
    message: string;
    errors: any;
}

export abstract class PluginValidator {

    public static checkForDuplications(pluginName: string, plugins: Plugin[]) {
        const promise = new Promise<boolean>((resolve, reject) => {
            const search = plugins.find((plugin: Plugin) => {
                return plugin.pluginName === pluginName;
            });

            if (search) {
                resolve(true);
                return;
            }

            resolve(false);
        });
        return promise;
    }

    public static validateManifestFields(manifest: PluginManifest): ValidationResult {
        const result: ValidationResult = {
            success: true,
            message: "",
            errors: {}
        }

        if (!manifest.name || manifest.name.length < 3) {
            result.errors["name"] = "Plugin name is required and has to be more then 3 characters.";
            result.success = false;
        }

        if (!manifest.vendor || manifest.vendor.length < 3) {
            result.errors["vendor"] = "Plugin vendor name is required and has to be more then 3 characters.";
            result.success = false;
        }

        if (!manifest.version || manifest.version.length < 3) {
            result.errors["version"] = "Plugin version is required and has to be more then 3 characters.";
            result.success = false;
        }

        if (!manifest.license || manifest.license.length < 3) {
            result.errors["license"] = "Plugin license is required and has to be more then 3 characters.";
            result.success = false;
        }

        if (!manifest.link || !/^(http|https):\/\//g.test(manifest.link)) {
            result.errors["link"] = "The link url is required.";
            result.success = false;
        }

        if (!result.success) {
            result.message = "Validation error, check your manifest.json file."
        }

        return result;
    }

    public static validateDisableEnableAction(selected: Plugin[], hasToBe: boolean, openModalFn: any): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            // If no selected elements
            if (selected.length < 1) {
                return;
            }

            // If only one is selected
            if (selected.length === 1) {
                if (selected[0].enabled === hasToBe) {
                    openModalFn({
                        title: "Notify",
                        body: `This plugin is already ${ hasToBe ? "enabled" : "disabled" }, click close to procceed.`,
                        accept: "Close",
                    });
                    return;
                }

                resolve();
                return;
            }

            // If selected elements are already in this state
            const alreadyInState: Plugin[] = [];
            selected.forEach((plugin: Plugin) => {
                if (plugin.enabled === hasToBe) {
                    alreadyInState.push(plugin);
                    return;
                }
            });

            if (alreadyInState.length === selected.length) {
                openModalFn({
                    title: "Notify",
                    body: `These plugins is already ${ hasToBe ? "enabled" : "disabled" }, click close to procceed.`,
                    accept: "Close"
                });
                return;
            }

            if (alreadyInState.length > 0) {
                let subs: Subscription;
                subs = openModalFn({
                    title: "Notify",
                    body: `${alreadyInState.length} of ${selected.length} are
                    already ${ hasToBe ? "enabled" : "disabled" }
                    you changes will be applied only on ${ hasToBe ? "disabled" : "enabled" } plugins. Do you want to procceed?`,
                    decline: "No",
                    accept: "Yes"
                })
                .subscribe((modalSubjectData: { accept: boolean; }) => {
                    if (modalSubjectData.accept === false) {
                        return;
                    }
                    subs.unsubscribe();
                    resolve();
                });
                return;
            }

            resolve();
        });

        return promise;
    }
}