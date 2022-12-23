import { ModuleData } from "./moduleData";
import { ModuleSectionData } from "./moduleDataSection";


export const parseModuleStructure : ModuleSectionData[] = [
    new ModuleSectionData(["moduleInfo"],
    [new ModuleData([])],
    {name : "Module Info", listName: "Parameters"}),


    
    new ModuleSectionData(["mainPage"],
    [new ModuleData([])],
    {name : "Main Page", listName: "Request"}),

    new ModuleSectionData(["search"],
    [new ModuleData([])],
    {name : "Search Page", listName: "Request"}),

    new ModuleSectionData(["info"],
    [new ModuleData([])],
    {name : "Info Page", listName: "Request"}),

    new ModuleSectionData(["chapters"],
    [new ModuleData([])],
    {name : "Chapters", listName: "Request"}),

    new ModuleSectionData(["moduleResolvers"], 
    [new ModuleSectionData(["resolverInfo"],
    [new ModuleData([])],{name : "Resolver Parameters", listName: "parameters"}),
    new ModuleSectionData(["resolver"],
    [new ModuleData([])], {name : "Resolver Request", listName: "Request"})] ,
    {name : "Resolvers", listName: "Resolver"}), 

    new ModuleSectionData(["responseCodeFunctions"],
    [new ModuleSectionData([""],
    [new ModuleData([])], {name : "Function Parameters", listName: "Parameters"}),
    new ModuleSectionData(["functions"],
    [new ModuleData([])], {name : "Function Requests", listName: "Request"})] 
    ,{name : "Response Code Funtions", listName: "Function"}), 

    new ModuleSectionData(["helperFunctions"],
    [new ModuleSectionData([""],[new ModuleData([])], {name : "Function Parameters", listName: "Parameters"}),
    new ModuleSectionData(["functions"],
    [new ModuleData([])], {name : "Function Requests", listName: "Request"})],
    {name : "Helper Functions", listName: "Request"}), 
];