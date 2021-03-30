import {Directive, HostListener} from '@angular/core';
import {DEBUG} from '../util/Config.utils';

@Directive({
    selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {
    constructor() {
    }

    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
        if (!DEBUG) {
            e.preventDefault();
        }
    }

    @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
        if (!DEBUG) {
            e.preventDefault();
        }
    }

    @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
        if (!DEBUG) {
            e.preventDefault();
        }
    }
}
