import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PoliticalService} from '../../../../../services/political.service';
import {messageErrorValidation} from '../../../../../util/ValidatorsHelper';
import {BoxesService} from '../../../../../services/boxes.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../../util/messages.utill';
import {ERROR_MESSAGE} from '../../../../../util/Config.utils';
import {includeArray, removeItemFromArrById} from '../../../../../util/UtilsHelper.utils';
import {ManagerBoxService} from '../../../../../services/managerBox.service';

@Component({
    selector: 'app-ironman',
    templateUrl: './ironman.component.html',
    styleUrls: ['./ironman.component.scss']
})
export class IronmanComponent implements OnInit {
    form: FormGroup;
    filters: FormGroup;
    municipalities: string[] = []
    politics = [];
    panelOpenState = true;
    boxes = [];
    object = Object.keys;
    boxesChanged = [];

    @ViewChild('municipalityInput', {static: false}) municipalityInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    municipalityCtrl = new FormControl();
    filteredMunicipality: Observable<string[]>;
    allMunicipality: string[] = [];

    all = [[1], [6]];

    constructor(public politicalService: PoliticalService, public boxesService: BoxesService,
                public managerBoxesService: ManagerBoxService
    ) {
        this.filters = new FormGroup({});

        this.form = new FormGroup({});

        this.boxesService.getMunicipalities().subscribe(
            municipalities => {
                this.allMunicipality = municipalities;

                this.filteredMunicipality = this.municipalityCtrl.valueChanges.pipe(
                    startWith(null),
                    map((municipality: string | null) => municipality ? this._filter(municipality) : this.allMunicipality.slice()));
            }
        );

        this.politicalService.getAll().subscribe(
            political => {
                this.politics = political;
                console.log(political);
            }
        );
    }

    ngOnInit() {
    }

    submit() {

    }

    drop(event: CdkDragDrop<any, any>, section: string, box: any, i: number) {

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        if (event.container.data.length === 3) {
            if (event.container.data[1] === null) {
                event.container.data.splice(1, 1);
            }
        }

        if (event.container.data[event.currentIndex + 1] === null) {
            event.container.data.splice(event.currentIndex + 1, 1);
        }

        if (event.item.data !== null) {
            if (includeArray(this.boxesChanged, event.item.data)) {
                removeItemFromArrById(this.boxesChanged, event.item.data);
            }

            event.item.data.box = box;
            event.item.data.political_parties_id = this.politics[i].id;
            event.item.data.section = section;

            this.boxesChanged.push(event.item.data);
        }
        console.log(this.boxesChanged);
    }

    getMessageErrorFilter(attrName: string) {
        return messageErrorValidation(this.filters, attrName);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if (typeof this.allMunicipality.find(x => x === value) !== 'undefined') {
            if ((value || '').trim()) {
                this.municipalities.push(value.trim());
            }

            // Reset the input value
            if (input) {
                input.value = '';
            }

            this.municipalityCtrl.setValue(null);
        }
    }

    remove(municipality: string): void {
        const index = this.municipalities.indexOf(municipality);

        if (index >= 0) {
            this.municipalities.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.municipalities.push(event.option.viewValue);
        this.municipalityInput.nativeElement.value = '';
        this.municipalityCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allMunicipality.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    }

    submitFilter() {
        Swal.showLoading();
        this.boxesService.getBoxesByMunicipality(this.municipalities).subscribe(
            boxes => {
                Swal.close();
                console.log(boxes);
                for (const element of Object.keys(boxes)) {
                    for (const section of Object.keys(boxes[element])) {
                        for (const box of boxes[element][section]) {
                            if (typeof box['parties'] === 'undefined') {
                                box.parties = [];
                                for (let i = 0; i < this.politics.length; i++) {
                                    box.parties.push(new Array(2).fill(null));
                                }
                            }
                            for (const manager of box.manager) {
                                const index = this.politics.findIndex(politic => politic.id === manager.political_parties_id);
                                if (manager.type === '1') {
                                    box.parties[index][0] = manager;
                                } else {
                                    box.parties[index][1] = manager;
                                }
                            }
                        }
                    }
                }
                this.boxes = boxes;
            },
            error => {
                console.log(error);
                MessagesUtil.errorMessage(ERROR_MESSAGE);
            }
        );
    }

    makeChanges() {
        this.managerBoxesService.edit(
            {boxes: this.boxesChanged}, 1
        ).subscribe(
            value => {
                MessagesUtil.successMessage('Cambio de casillas', 'Se han actualizado los casilleros exitosamente');
            }
        );
    }
}
