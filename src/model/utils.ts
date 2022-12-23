import {  PointNumber, RectNumber, SizeNumber } from "./interfaces";
import $ from "jquery";



export class Utils {


     deepCopy<T>(source: T): T {
        return Array.isArray(source)
        ? source.map(item => this.deepCopy(item))
        : source instanceof Date
        ? new Date(source.getTime())
        : source && typeof source === 'object'
              ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
                 Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
                 o[prop] = this.deepCopy((source as { [key: string]: any })[prop]);
                 return o;
              }, Object.create(Object.getPrototypeOf(source)))
        : source as T;
      }

      makeId(length:number = 20) : string {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }


    getPath(key: string, o: any) : string[] {
      return this.getPathString(key,o)?.split(".") ?? []
    }

    getPathString (key: string, o: any) : string | undefined {
      if (!o || typeof o !== "object") {
        return "";
      }
    
      const keys = Object.keys(o);
      for(let i = 0; i < keys.length; i++) {
        if (keys[i] === key ) {
          return key;
        }
        
        const path = this.getPathString(key, o[keys[i]]);
        if (path) {
          return keys[i] + "." + path;
        }
      }
      return "";
    };


    getObjectFromPath(path:string[],object:any) : any | undefined{ 
      let current = object;
      path.forEach((el) => {
        if (el != "") {
          current = current[el];
        }
      })

      return current;
    }

    setObjectFromPath(path:string[],object:any) : any | undefined{ 
      let current = object;
      path.forEach((el) => {
        if (el != "") {
          current = current[el];
        }
      })

      return current;
    }
    
    getValueForKey(key: string, o: any) : any | undefined {
      if (!o || typeof o !== "object") {
        return undefined;
      }
    
      const keys = Object.keys(o);
      for(let i = 0; i < keys.length; i++) {
        if (keys[i] === key ) {
          return o[key];
        }
        
        const value = this.getValueForKey(key, o[keys[i]]);
        if (value) {
          return value;
        }
      }
      return undefined;
    }

    getKeysThatMatch(match: string, o: any,foundKeys : string[] = []) : string[] | undefined {
      // Return the keys that contain the match  dd
      let totalKeys = foundKeys;

      if (!o || typeof o !== "object") {
        return totalKeys;
      }
    
      const keys = Object.keys(o);
      for(let i = 0; i < keys.length; i++) {
        
        if (keys[i].includes(match) ) {
          totalKeys.push(keys[i])
        }
        
        this.getKeysThatMatch(match , o[keys[i]],[])?.forEach( (el) => {
          totalKeys.push(el);
        });
      
      }
      return totalKeys;
    }

    getPathsThatMatchKey(match:string,currentPath: string[] = [],o: any) : string[][] {
      let mFoundPaths : string[][] = [];

      if (!o || typeof o !== "object") {
        return mFoundPaths;
      }


      const keys = Object.keys(o);
      for(let i = 0; i < keys.length; i++) {
              
        if (keys[i].includes(match) ) {
          let currentPathCopy = this.deepCopy(currentPath)
          currentPathCopy.push(keys[i])
          mFoundPaths.push(currentPathCopy)
        }

        let newCurrentPath = this.deepCopy(currentPath);
        newCurrentPath.push(keys[i]);
        this.getPathsThatMatchKey(match,newCurrentPath,o[keys[i]]).forEach( (el) => {
          mFoundPaths.push(el);
        })
      }

      return mFoundPaths
    }

    removeKeysThatMatch(match: string, o: any)  {
      // Return the keys that contain the match  dd
      if (!o || typeof o !== "object") {
        return ;
      }
    
      const keys = Object.keys(o);
      for(let i = 0; i < keys.length; i++) {
        if (keys[i].includes(match) ) {
          delete o[keys[i]];
        }
        
        this.removeKeysThatMatch(match , o[keys[i]])
      }
      return;
    }


    getNumberFromString(string:string): number | undefined {
      if (string == "") {return undefined}
      let parsed = Number(string);
      if (Number.isNaN(parsed)) {return undefined}
      return parsed
      
    }

    deleteFromArray(index:number,array: any[]) {
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
   
    addMissingObjectKeys(object:any,newKeys:any) : any {
      Object.keys(newKeys).forEach( (key) => {
        if (!(key in object)) {
          object[key] = newKeys[key];
        }
      })
    }

    capitalizeFirstLetter(str:string) : string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }


    windowSize() : SizeNumber {
      return {width : $(window).width() ?? 0,height: $(window).height() ?? 0}
    }

    getCenter(frame: RectNumber) : PointNumber {
      return {x : frame.x +  frame.width / 2,y: frame.y + frame.height /  2}

    }

    getFrameFromElement(el: Element | String) : RectNumber {
      let parsed = $(el);
       return {x: parsed.offset()?.left ?? 0, y: parsed.offset()?.top ?? 0 ,width : parsed.width() ?? 0,height: parsed.height() ?? 0}
    }


    isInViewport(el: JQuery<HTMLElement>) : boolean {
      var elementTop = el.offset()?.top ?? 0;
      var elementBottom = elementTop + (el.outerHeight() ?? 0);

      var viewportTop = $(window).scrollTop() ?? 0;
      var viewportBottom = viewportTop + ($(window).height() ?? 0);
  
      return elementBottom > viewportTop && elementTop < viewportBottom;
  };

  getImageUrl(imgName: string) : string {
    return `./images/${imgName}`
  }

   prepend(value: any, array: any[]) {
  
    return array.slice().unshift(value);
  }

  isSafari() : boolean {

    var ua = navigator.userAgent.toLowerCase(); 
    if (ua.indexOf('safari') != -1) { 
        if (ua.indexOf('chrome') > -1) {
            return false;
        } else {
            return true;
        }
    }
    return true
  }

  isChrome() : boolean {

    var ua = navigator.userAgent.toLowerCase(); 
    if (ua.indexOf('safari') != -1) { 
        if (ua.indexOf('chrome') > -1) {
            return true;
        } else {
            return false;
        }
    }
    return false
  }
}