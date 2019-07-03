import {
    Component,
    Input,
    Output,
    ViewChild,
    SimpleChanges,
    EventEmitter,
    OnChanges,
    OnInit
} from '@angular/core';
import {
    ENTER
} from '@angular/cdk/keycodes';
import {
    MatSelect,
    MatSelectChange,
    MatChipInputEvent
} from '@angular/material';

import * as _ from 'lodash';

import { ComponentBase } from './component-base';
import { TranslateService } from '@ngx-translate/core';

export interface ListItem {
    v: string;
    i: number; // index
}

@Component({
    selector: 'app-listedit-chip',
    templateUrl: './listedit-chip.component.html',
    styleUrls: ['./listedit-chip.component.scss']
})
export class ListEditChipComponent extends ComponentBase<undefined> implements
OnInit, OnChanges {
    @Output() itemClick = new EventEmitter<ListItem>();
    @Output() updated = new EventEmitter<string[]>();
    @Input() itemName: string;
    @Input() editable = false;
    @Input() allowDup = true; // allow duplication?
    @Input() items: string[] = [];
    @Input() options: string[] = [];

    // using ViewChild() is not good in terms of design
    //   because this breaks encapsulation.
    // But, this is used to workaround bug of angular material.
    // See comments at updateItems().
    @ViewChild(MatSelect) matSelect: MatSelect;

    // By default, append to end-of-list
    @Input() addNew: (item: string, items: string[]) => string[]
        = (item, items) => {
            items.push(item);
            return items;
        }

    // return error string. undefined means success. Otherwise error
    @Input() validator: (v: string) => string = v => undefined;


    readonly separatorKeysCodes: number[] = [ENTER];

    listItems: ListItem[] = [];
    newItem = '';
    availableOpts: string[];

    private itemset: Set<string>;
    private removeTmout: number | undefined;
    private removeRequested = new Set<number>();

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    private updateItems(items: string[], emit = true) {
        // This is workaround for bug at mat-select at @angular/material 7.3.7.
        // mat-select shows some options even if nothing selected.
        // Steps for reproducing
        // - add two items by selecting options: ex. 'extends', 'desc'
        // - remove 'desc' by clicking 'X' mark on chip.
        // expected: mat-select should shows 'place-holder' string.
        // result: mat-select shows 'desc' option. And selecting 'desc' doesn't
        //   fire 'selectionChange' event.
        if (this.matSelect) {
            this.matSelect.value = undefined;
        }
        this.items = items;
        if (emit) {
            this.updated.emit(this.items);
        }
        if (!this.allowDup) {
            this.itemset = new Set(items);
            // console.log(items);
            if (undefined !== this.options) {
                this.availableOpts = this.options.filter(v => !this.itemset.has(v));
            }
            // console.log('availableOpts: ', this.availableOpts);
        }
        this.listItems = items.map((v, i) => ({v: v, i: i}));
    }

    private reload(emit = true) {
        // console.log('options: ', this.options);
        // console.log('items: ', this.items);
        this.newItem = '';
        if (undefined === this.items) { this.items = []; }
        this.updateItems(this.items, emit);
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    constructor(
        private translate: TranslateService,
    ) { super(undefined); }

    ngOnInit() {
        // console.log('options: ', this.options);
        this.reload(false);
    }

    ngOnChanges(chgs: SimpleChanges) {
        // console.log('@@@ngOnChanges: ', chgs);
        for (const c of [chgs.items, chgs.options]) {
            if (c && !c.isFirstChange()) {
                this.reload();
                break;
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    readonly itemValidator = (v: string) => {
        if (!this.allowDup && this.itemset.has(v)) {
            return { newItem: 'Duplicated' };
        }
        if ('' === v) {
            return { newItem: '' };
        }
        if (/^\s+/.test(v) || /\s+$/.test(v)) {
            return { newItem: 'leading / trailing white spaces!' };
        }
        const r = this.validator(v);
        return undefined !== r
            ? { newItem: r }
            : null;
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    uiOnAdd(event: MatChipInputEvent): void {
        // console.log('uiOnAdd: ', event);
        const value = event.value;

        // Add new item
        if ((value || '').trim()) {
            this.updateItems(this.addNew(
                value.trim(), this.items));
        }
        this.newItem = '';
    }

    uiOnChipClick(li: ListItem) {
        this.itemClick.emit(_.cloneDeep(li));
    }

    uiOnRemove(li: ListItem) {
        // console.log('uiOnRemove: ', li);
        if (undefined !== this.removeTmout) {
            window.clearTimeout(this.removeTmout);
        }
        this.removeRequested.add(li.i);
        this.removeTmout = window.setTimeout(() => {
            // console.log('uiOnRemove timeout!!!!');
            this.removeRequested.forEach(i => {
                this.items.splice(i, 1);
            });
            this.removeRequested = new Set();
            this.updateItems(this.items);
        }, 300);
    }

    uiOnSelectNewItem(ev: MatSelectChange) {
        // Initialize selection.
        // console.log('uiOnSelectNewItem: ', ev);
        this.updateItems(this.addNew(
            ev.value, this.items));
    }
}
