import MRsesizeObserver from "../../model/ResizeObserver/mResizeObserver";
import { ResizeConditions, ResizeObserverInterface } from "../../model/ResizeObserver/resizeObserverInterfaces";
import GridElement from "../../model/grid/gridElement";
import { MenuSelctor, MenuSelectorInterface } from "../../model/menuSelector/ menuSelector";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { viewDefaultViewsHolder } from "../../view/defaultViews/defatulViewsHolder";
import { BaseGridController } from "../baseGrid/baseGridController";
import { BottomStatusController } from "../bottomStatusBar/bottomStatusController";
import { marked } from 'marked';


export class RightGridElementController extends GridElement implements ResizeObserverInterface, MenuSelectorInterface {
 


    resizeObserver?: MRsesizeObserver

viewWasInserted(): void {
    super.viewWasInserted()
    this.resizeObserver = new MRsesizeObserver(new InsertedViewData(this.id,undefined),[
        {name:"closed",condition(newSize) {
            if (newSize.inlineSize <= 1  ) {
               return true;
            } else {
               return false
            }
        }},
        {name:"opened",condition(newSize) {
           if (newSize.inlineSize >= 350) {
              return true;
           } else {
              return false
           }
       }}
    ])
    this.resizeObserver.interface = this


    let view1 = new View(undefined,'<div style="overflow:auto; min-height:500px;" class="padding tc-t-primary markdown fill-absolute" $id>Here will go the Module Notes, the documentation and the interactive tutorials using markdown.</div>');
    view1.viewName = "Hello";

    view1.viewWasInsertedCallback = (id) => {
        let parsed = marked.parse(atob(`LS0tCl9fQWR2ZXJ0aXNlbWVudCA6KV9fCgotIF9fW3BpY2FdKGh0dHBzOi8vbm9kZWNhLmdpdGh1Yi5pby9waWNhL2RlbW8vKV9fIC0gaGlnaCBxdWFsaXR5IGFuZCBmYXN0IGltYWdlCiAgcmVzaXplIGluIGJyb3dzZXIuCi0gX19bYmFiZWxmaXNoXShodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL2JhYmVsZmlzaC8pX18gLSBkZXZlbG9wZXIgZnJpZW5kbHkKICBpMThuIHdpdGggcGx1cmFscyBzdXBwb3J0IGFuZCBlYXN5IHN5bnRheC4KCllvdSB3aWxsIGxpa2UgdGhvc2UgcHJvamVjdHMhCgotLS0KCiMgaDEgSGVhZGluZyA4LSkKIyMgaDIgSGVhZGluZwojIyMgaDMgSGVhZGluZwojIyMjIGg0IEhlYWRpbmcKIyMjIyMgaDUgSGVhZGluZwojIyMjIyMgaDYgSGVhZGluZwoKCiMjIEhvcml6b250YWwgUnVsZXMKCl9fXwoKLS0tCgoqKioKCgojIyBUeXBvZ3JhcGhpYyByZXBsYWNlbWVudHMKCkVuYWJsZSB0eXBvZ3JhcGhlciBvcHRpb24gdG8gc2VlIHJlc3VsdC4KCihjKSAoQykgKHIpIChSKSAodG0pIChUTSkgKHApIChQKSArLQoKdGVzdC4uIHRlc3QuLi4gdGVzdC4uLi4uIHRlc3Q/Li4uLi4gdGVzdCEuLi4uCgohISEhISEgPz8/PyAsLCAgLS0gLS0tCgoiU21hcnR5cGFudHMsIGRvdWJsZSBxdW90ZXMiIGFuZCAnc2luZ2xlIHF1b3RlcycKCgojIyBFbXBoYXNpcwoKKipUaGlzIGlzIGJvbGQgdGV4dCoqCgpfX1RoaXMgaXMgYm9sZCB0ZXh0X18KCipUaGlzIGlzIGl0YWxpYyB0ZXh0KgoKX1RoaXMgaXMgaXRhbGljIHRleHRfCgp+flN0cmlrZXRocm91Z2h+fgoKCiMjIEJsb2NrcXVvdGVzCgoKPiBCbG9ja3F1b3RlcyBjYW4gYWxzbyBiZSBuZXN0ZWQuLi4KPj4gLi4uYnkgdXNpbmcgYWRkaXRpb25hbCBncmVhdGVyLXRoYW4gc2lnbnMgcmlnaHQgbmV4dCB0byBlYWNoIG90aGVyLi4uCj4gPiA+IC4uLm9yIHdpdGggc3BhY2VzIGJldHdlZW4gYXJyb3dzLgoKCiMjIExpc3RzCgpVbm9yZGVyZWQKCisgQ3JlYXRlIGEgbGlzdCBieSBzdGFydGluZyBhIGxpbmUgd2l0aCBgK2AsIGAtYCwgb3IgYCpgCisgU3ViLWxpc3RzIGFyZSBtYWRlIGJ5IGluZGVudGluZyAyIHNwYWNlczoKICAtIE1hcmtlciBjaGFyYWN0ZXIgY2hhbmdlIGZvcmNlcyBuZXcgbGlzdCBzdGFydDoKICAgICogQWMgdHJpc3RpcXVlIGxpYmVybyB2b2x1dHBhdCBhdAogICAgKyBGYWNpbGlzaXMgaW4gcHJldGl1bSBuaXNsIGFsaXF1ZXQKICAgIC0gTnVsbGEgdm9sdXRwYXQgYWxpcXVhbSB2ZWxpdAorIFZlcnkgZWFzeSEKCk9yZGVyZWQKCjEuIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0CjIuIENvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdAozLiBJbnRlZ2VyIG1vbGVzdGllIGxvcmVtIGF0IG1hc3NhCgoKMS4gWW91IGNhbiB1c2Ugc2VxdWVudGlhbCBudW1iZXJzLi4uCjEuIC4uLm9yIGtlZXAgYWxsIHRoZSBudW1iZXJzIGFzIGAxLmAKClN0YXJ0IG51bWJlcmluZyB3aXRoIG9mZnNldDoKCjU3LiBmb28KMS4gYmFyCgoKIyMgQ29kZQoKSW5saW5lIGBjb2RlYAoKSW5kZW50ZWQgY29kZQoKICAgIC8vIFNvbWUgY29tbWVudHMKICAgIGxpbmUgMSBvZiBjb2RlCiAgICBsaW5lIDIgb2YgY29kZQogICAgbGluZSAzIG9mIGNvZGUKCgpCbG9jayBjb2RlICJmZW5jZXMiCgpgYGAKU2FtcGxlIHRleHQgaGVyZS4uLgpgYGAKClN5bnRheCBoaWdobGlnaHRpbmcKCmBgYCBqcwp2YXIgZm9vID0gZnVuY3Rpb24gKGJhcikgewogIHJldHVybiBiYXIrKzsKfTsKCmNvbnNvbGUubG9nKGZvbyg1KSk7CmBgYAoKIyMgVGFibGVzCgp8IE9wdGlvbiB8IERlc2NyaXB0aW9uIHwKfCAtLS0tLS0gfCAtLS0tLS0tLS0tLSB8CnwgZGF0YSAgIHwgcGF0aCB0byBkYXRhIGZpbGVzIHRvIHN1cHBseSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgcGFzc2VkIGludG8gdGVtcGxhdGVzLiB8CnwgZW5naW5lIHwgZW5naW5lIHRvIGJlIHVzZWQgZm9yIHByb2Nlc3NpbmcgdGVtcGxhdGVzLiBIYW5kbGViYXJzIGlzIHRoZSBkZWZhdWx0LiB8CnwgZXh0ICAgIHwgZXh0ZW5zaW9uIHRvIGJlIHVzZWQgZm9yIGRlc3QgZmlsZXMuIHwKClJpZ2h0IGFsaWduZWQgY29sdW1ucwoKfCBPcHRpb24gfCBEZXNjcmlwdGlvbiB8CnwgLS0tLS0tOnwgLS0tLS0tLS0tLS06fAp8IGRhdGEgICB8IHBhdGggdG8gZGF0YSBmaWxlcyB0byBzdXBwbHkgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHBhc3NlZCBpbnRvIHRlbXBsYXRlcy4gfAp8IGVuZ2luZSB8IGVuZ2luZSB0byBiZSB1c2VkIGZvciBwcm9jZXNzaW5nIHRlbXBsYXRlcy4gSGFuZGxlYmFycyBpcyB0aGUgZGVmYXVsdC4gfAp8IGV4dCAgICB8IGV4dGVuc2lvbiB0byBiZSB1c2VkIGZvciBkZXN0IGZpbGVzLiB8CgoKIyMgTGlua3MKCltsaW5rIHRleHRdKGh0dHA6Ly9kZXYubm9kZWNhLmNvbSkKCltsaW5rIHdpdGggdGl0bGVdKGh0dHA6Ly9ub2RlY2EuZ2l0aHViLmlvL3BpY2EvZGVtby8gInRpdGxlIHRleHQhIikKCkF1dG9jb252ZXJ0ZWQgbGluayBodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL3BpY2EgKGVuYWJsZSBsaW5raWZ5IHRvIHNlZSkKCgojIyBJbWFnZXMKCiFbTWluaW9uXShodHRwczovL29jdG9kZXguZ2l0aHViLmNvbS9pbWFnZXMvbWluaW9uLnBuZykKIVtTdG9ybXRyb29wb2NhdF0oaHR0cHM6Ly9vY3RvZGV4LmdpdGh1Yi5jb20vaW1hZ2VzL3N0b3JtdHJvb3BvY2F0LmpwZyAiVGhlIFN0b3JtdHJvb3BvY2F0IikKCkxpa2UgbGlua3MsIEltYWdlcyBhbHNvIGhhdmUgYSBmb290bm90ZSBzdHlsZSBzeW50YXgKCiFbQWx0IHRleHRdW2lkXQoKV2l0aCBhIHJlZmVyZW5jZSBsYXRlciBpbiB0aGUgZG9jdW1lbnQgZGVmaW5pbmcgdGhlIFVSTCBsb2NhdGlvbjoKCltpZF06IGh0dHBzOi8vb2N0b2RleC5naXRodWIuY29tL2ltYWdlcy9kb2pvY2F0LmpwZyAgIlRoZSBEb2pvY2F0IgoKCiMjIFBsdWdpbnMKClRoZSBraWxsZXIgZmVhdHVyZSBvZiBgbWFya2Rvd24taXRgIGlzIHZlcnkgZWZmZWN0aXZlIHN1cHBvcnQgb2YKW3N5bnRheCBwbHVnaW5zXShodHRwczovL3d3dy5ucG1qcy5vcmcvYnJvd3NlL2tleXdvcmQvbWFya2Rvd24taXQtcGx1Z2luKS4KCgojIyMgW0Vtb2ppZXNdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC1lbW9qaSkKCj4gQ2xhc3NpYyBtYXJrdXA6IDp3aW5rOiA6Y3J1c2g6IDpjcnk6IDp0ZWFyOiA6bGF1Z2hpbmc6IDp5dW06Cj4KPiBTaG9ydGN1dHMgKGVtb3RpY29ucyk6IDotKSA6LSggOC0pIDspCgpzZWUgW2hvdyB0byBjaGFuZ2Ugb3V0cHV0XShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQtZW1vamkjY2hhbmdlLW91dHB1dCkgd2l0aCB0d2Vtb2ppLgoKCiMjIyBbU3Vic2NyaXB0XShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQtc3ViKSAvIFtTdXBlcnNjcmlwdF0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0LXN1cCkKCi0gMTledGheCi0gSH4yfk8KCgojIyMgW1w8aW5zPl0oaHR0cHM6Ly9naXRodWIuY29tL21hcmtkb3duLWl0L21hcmtkb3duLWl0LWlucykKCisrSW5zZXJ0ZWQgdGV4dCsrCgoKIyMjIFtcPG1hcms+XShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQtbWFyaykKCj09TWFya2VkIHRleHQ9PQoKCiMjIyBbRm9vdG5vdGVzXShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQtZm9vdG5vdGUpCgpGb290bm90ZSAxIGxpbmtbXmZpcnN0XS4KCkZvb3Rub3RlIDIgbGlua1tec2Vjb25kXS4KCklubGluZSBmb290bm90ZV5bVGV4dCBvZiBpbmxpbmUgZm9vdG5vdGVdIGRlZmluaXRpb24uCgpEdXBsaWNhdGVkIGZvb3Rub3RlIHJlZmVyZW5jZVtec2Vjb25kXS4KClteZmlyc3RdOiBGb290bm90ZSAqKmNhbiBoYXZlIG1hcmt1cCoqCgogICAgYW5kIG11bHRpcGxlIHBhcmFncmFwaHMuCgpbXnNlY29uZF06IEZvb3Rub3RlIHRleHQuCgoKIyMjIFtEZWZpbml0aW9uIGxpc3RzXShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQtZGVmbGlzdCkKClRlcm0gMQoKOiAgIERlZmluaXRpb24gMQp3aXRoIGxhenkgY29udGludWF0aW9uLgoKVGVybSAyIHdpdGggKmlubGluZSBtYXJrdXAqCgo6ICAgRGVmaW5pdGlvbiAyCgogICAgICAgIHsgc29tZSBjb2RlLCBwYXJ0IG9mIERlZmluaXRpb24gMiB9CgogICAgVGhpcmQgcGFyYWdyYXBoIG9mIGRlZmluaXRpb24gMi4KCl9Db21wYWN0IHN0eWxlOl8KClRlcm0gMQogIH4gRGVmaW5pdGlvbiAxCgpUZXJtIDIKICB+IERlZmluaXRpb24gMmEKICB+IERlZmluaXRpb24gMmIKCgojIyMgW0FiYnJldmlhdGlvbnNdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZG93bi1pdC9tYXJrZG93bi1pdC1hYmJyKQoKVGhpcyBpcyBIVE1MIGFiYnJldmlhdGlvbiBleGFtcGxlLgoKSXQgY29udmVydHMgIkhUTUwiLCBidXQga2VlcCBpbnRhY3QgcGFydGlhbCBlbnRyaWVzIGxpa2UgInh4eEhUTUx5eXkiIGFuZCBzbyBvbi4KCipbSFRNTF06IEh5cGVyIFRleHQgTWFya3VwIExhbmd1YWdlCgojIyMgW0N1c3RvbSBjb250YWluZXJzXShodHRwczovL2dpdGh1Yi5jb20vbWFya2Rvd24taXQvbWFya2Rvd24taXQtY29udGFpbmVyKQoKOjo6IHdhcm5pbmcKKmhlcmUgYmUgZHJhZ29ucyoKOjo6Cg==`))
        console.log(parsed)
        let mView =  document.querySelector(`[${view1.id}]`)
        if (mView != undefined) {
            mView.innerHTML = parsed
        }
       // $(`[${id}]`).html()
    } 


    let view2 = new View();
    view2.viewName = "World";
    

    let menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),[view1.id,view2.id]);
    menuSelector.interface = this;
    
    this.insertNewView(new InsertedViewData(menuSelector.id));

}

menuSelectorWasSelected(viewId: string): void {
    //throw new Error("Method not implemented.");
}

isClosed(): boolean {
    return this.getSize().width <= 0
}

resizeTriggered(condition: ResizeConditions): void {
    let bottomStatusBar = this.getView('bottomStatusBar') as BottomStatusController
        bottomStatusBar?.updateWindowButtons()
        }
resizeFinished(entry: void): void {
    throw new Error("Method not implemented.");
}
observerFinished?(): void {
    throw new Error("Method not implemented.");
}

open(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setDocumnetationViewSize(500);

}

close(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setDocumnetationViewSize(0);

}

finish(): void {
    this.resizeObserver?.finished()
    this.resizeObserver = undefined
    super.finish()
}



}