

export interface ModuleDataOptions {
    name: string;
    listName?: string;
}

export enum ModuleDataTypeEnum {
    section  = "section",
    cell = "cell"
}


export interface ModuleManagerInterface {
    moduleLoaded() : void
    moduleDataUpdated?: {(): void};// This method is called when we add or remove a part of the module.
    moduleProjectNameChanged?() : void ;
    moduleAutoSaved?() : void ;

}