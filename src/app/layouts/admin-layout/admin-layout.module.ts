// Pipes
import {UserPipe} from '../../pipes/user.pipe';
import {PostulatePipe} from '../../pipes/postulate.pipe';

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../components/dashboard/dashboard.component';

import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {UserComponent} from '../../components/dashboard/pages/user/user.component';
import {UserDataTableComponent} from '../../components/dashboard/pages/user/user-data-table/user-data-table.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {DragImageDirective} from '../../directives/drag-image.directive';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {BlockCopyPasteDirective} from '../../directives/block-copy-paste.directive';
import {DigitOnlyDirective} from '../../directives/DigitOnlyDirective';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AgmCoreModule} from '@agm/core';
import {OperatorPipe} from '../../pipes/operator.pipe';
import {TypePostulatePipe} from '../../pipes/TypePostulate.pipe';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {CandidateComponent} from '../../components/dashboard/pages/candidate/candidate.component';
import {CandidateListComponent} from '../../components/dashboard/pages/candidate-list/candidate-list.component';
import {CandidateFormComponent} from '../../components/dashboard/pages/candidate-form/candidate-form.component';
import {CandidateIneComponent} from '../../components/dashboard/pages/candidate-ine/candidate-ine.component';
import {CityHallComponent} from '../../components/dashboard/pages/city-hall/city-hall.component';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatRadioModule,
        MatExpansionModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatDividerModule,
        MatListModule,
        MaterialFileInputModule,
        MatToolbarModule,
        MatSortModule,
        MatTabsModule,
        DragDropModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatStepperModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAHukNiEIS2AzxptYrarhGCdFJw2zmZGLY',
            libraries: ['places']
        }),
        OrganizationChartModule,
    ],
    exports: [
        DragImageDirective,
    ],
    declarations: [
        DashboardComponent,
        UserComponent,
        UserDataTableComponent,
        UserPipe,
        TypePostulatePipe,
        OperatorPipe,
        PostulatePipe,
        DragImageDirective,
        BlockCopyPasteDirective,
        DigitOnlyDirective,
        CandidateComponent,
        CandidateListComponent,
        CandidateFormComponent,
        CityHallComponent,
        CandidateFormComponent,
        CandidateIneComponent
    ]
})

export class AdminLayoutModule {
}
