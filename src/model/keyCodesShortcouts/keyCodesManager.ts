
import $ from "jquery"
export interface KeyCodesInterface {
    keyDown? (key:string) : void
    keyUp?(key:string) : void
    keyCombinationExecuted?(shortcut:KeyShortcuts) : void
}

export enum KeyShortcuts {
    executeModule = "Shift Alt Enter"
}

interface KeyShortcutsObject {
    checkKeys : string[]
    keysStatus : {[key:string] : KeyStatusInterface}
}

interface KeyStatusInterface {
    keyName : string
    isDown : boolean
    shortCuts : ShortcutsObjectInterface[]
}

interface ShortcutsObjectInterface  {
    id : KeyShortcuts,
    keys: string[]
}


export class keyCodesManager {

    static shared = new keyCodesManager()

    delegates : {[key:string] : KeyCodesInterface} = {}

    shortcouts : KeyShortcutsObject = {checkKeys : [],keysStatus : {}};

    constructor() {
        this.setShortcouts()

        $(document).on("keyup", (e)  => {
            this.updateShortcouts(e.key,false)
            Object.values(this.delegates).forEach( (del) => {
                del.keyUp?.(e.key)
            } )
        });
        $(document).on("keydown", (e)  => {
            this.updateShortcouts(e.key,true)
            this.lookForShortcouts(e.key)
            Object.values(this.delegates).forEach( (del) => {
                del.keyDown?.(e.key)
            } )
        });
    }

    updateShortcouts(key:string,isDown: boolean) {
        if (!this.shortcouts.checkKeys.includes(key)) {return}
        this.shortcouts.keysStatus[key].isDown = isDown
    }

    setShortcouts() {
        console.log(Object.values(KeyShortcuts))
        Object.values(KeyShortcuts).forEach((el) => {
            el.split(" ").forEach((key) => {
                if (!this.shortcouts.checkKeys.includes(key)) {
                    this.shortcouts.checkKeys.push(key);
                    this.shortcouts.keysStatus[key] = {
                        keyName : key,
                        isDown : false,
                        shortCuts : []
                    }
                }
            })
        })
        console.log(Object.values(KeyShortcuts))
        Object.values(KeyShortcuts).forEach((el) => {
            let shortcutKeysArray = el.split(" ");
            shortcutKeysArray.forEach((key) => {
                this.shortcouts.keysStatus[key].shortCuts.push({id: el,keys : shortcutKeysArray})
            })
        })
        console.log(this.shortcouts)
    }

    lookForShortcouts(key:string) {
        if (!this.shortcouts.keysStatus["Shift"].isDown) {
            return
        }
        if (!this.shortcouts.checkKeys.includes(key)) {return}
        for (let shortcout of this.shortcouts.keysStatus[key].shortCuts) {
            let allKeysDown = true
            for (let shortcoutKey of shortcout.keys) {
                if (!this.shortcouts.keysStatus[shortcoutKey].isDown){
                    allKeysDown = false
                    break
                }
            }
            if (allKeysDown) {
                Object.values(this.delegates).forEach((del) => {
                    del.keyCombinationExecuted?.(shortcout.id)
                })
                return
            }
        }
    }

   


    
}