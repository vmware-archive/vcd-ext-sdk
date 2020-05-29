import { WorkspaceProject, ProjectType } from "@schematics/angular/utility/workspace-models";

export interface Schema {
    skipModuleImport: boolean;
    moduleName: string;
    importInModule: string;
    project: WorkspaceProject<ProjectType.Application | ProjectType.Library>;
}