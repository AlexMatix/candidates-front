import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {DraftComponent} from './dialogs/draft/draft.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import { ZoneComponent } from './dialogs/zone/zone.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {LocationComponent} from './dialogs/location/location.component';
import {AgmCoreModule} from '@agm/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatDialogModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatSortModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatListModule,
        AgmCoreModule,
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        DraftComponent,
        ZoneComponent,
        LocationComponent
    ],
    exports: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        DraftComponent,
        LocationComponent
    ],
})
export class ComponentsModule {
}
