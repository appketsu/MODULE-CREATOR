export  interface ResizeConditions {
    name : string;
    condition(newSize: ResizeObserverSize): boolean;
}
  
export  interface ResizeObserverInterface {
    resizeTriggered(condition:ResizeConditions):void;
    resizeFinished(entry:void):void;
    observerFinished?() : void
}
