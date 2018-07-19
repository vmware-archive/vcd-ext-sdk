import { Injectable } from "@angular/core";

declare var zip: any;
// Disable web workers
zip.useWebWorkers = false;

@Injectable()
export class ZipManager {

    private parseManifestFile(manifest: any): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            if (!manifest) {
                reject(new Error("Manifest is required!"));
                return;
            }

            manifest.getData(new zip.TextWriter(), function(text: string) {
                // text contains the entry data as a String
                resolve(text);
        
              }, function(current: number, total: number) {
                // onprogress callback
              });
        });
        return promise;
    }

    private validatePluginStructure(entries: any[]): Promise<{
        isValid: boolean;
        entries: any[];
    }> {
        const promise = new Promise<{
            isValid: boolean;
            entries: any[];
        }>((resolve, reject) => {
            if (entries.length < 3) {
                resolve({
                    isValid: false,
                    entries
                });
                return;
            }

            entries.forEach((entrie) => {
                const validStructure = /^(?!..\/)(((manifest|i18n|).(json)$)|((bundle).(js)$)|([0-9]|[a-z]+\/)([0-9]|[a-z]+).(svg|png|jpg))$/gm
                    .test(entrie.filename);

                if (!validStructure) {
                    resolve({
                        isValid: false,
                        entries
                    });
                    return;
                }
            })

            resolve({
                isValid: true,
                entries
            });
        });
        return promise;
    }

    private parseFile(file: File): Promise<any[]> {
        const promise = new Promise<any[]>((resolve, reject) => {
            // use a BlobReader to read the zip from a Blob object
            zip.createReader(new zip.BlobReader(file), function (reader: any) {
                // get all entries from the zip
                reader.getEntries(function (entries: any) {
                    resolve(entries);
                });
            }, function (error: Error) {
                // onerror callback
                reject(error);
            });
        });

        return promise;
    }

    public parse(file: File): Promise<string> {
        return this.parseFile(file)
            .then((entries) => {
                return this.validatePluginStructure(entries);
            })
            .then((data) => {
                if (!data.isValid) {
                    throw new Error('Plugin file structure is incorrect!');
                }

                const manifestFile = data.entries.find((entrie) => {
                    return entrie.filename === "manifest.json";
                });

                return this.parseManifestFile(manifestFile);
            })
    }
}