//Pipes
import {UserPipe} from '../../pipes/user.pipe';
import {TypeManagerBoxPipe} from '../../pipes/type-manager-box.pipe';

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../components/dashboard/dashboard.component';
import {MapsComponent} from '../../components/dashboard/pages/maps/maps.component';
import {NewBoxComponent} from '../../components/dashboard/pages/new-box/new-box.component';
import {PoliticalPartiesComponent} from '../../components/dashboard/pages/political-parties/political-parties.component';

import {MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSelectModule, MatTooltipModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import {PoliticalPartiesDataTableComponent} from '../../components/dashboard/pages/political-parties/political-parties-data-table/political-parties-data-table.component';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {UserComponent} from '../../components/dashboard/pages/user/user.component';
import {UserDataTableComponent} from '../../components/dashboard/pages/user/user-data-table/user-data-table.component';
import {LogsComponent} from '../../components/dashboard/pages/logs/logs.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {StructureComponent} from '../../components/dashboard/pages/structure/structure.component';
import {StructureDataTableComponent} from '../../components/dashboard/pages/structure/structure-data-table/structure-data-table.component';
import {LogsMovementsComponent} from '../../components/dashboard/pages/logs-movements/logs-movements.component';
import {DragImageDirective} from '../../directives/drag-image.directive';
import {MatSortModule} from '@angular/material/sort';
import {LogsDataTableComponent} from '../../components/dashboard/pages/logs/logs-data-table/logs-data-table.component';
import {ReportsComponent} from '../../components/dashboard/pages/logs/reports/reports.component';
import {MatTabsModule} from '@angular/material/tabs';
import {BlockCopyPasteDirective} from '../../directives/block-copy-paste.directive';
import {DigitOnlyDirective} from '../../directives/DigitOnlyDirective';
import {RecordsOperationsComponent} from '../../components/dashboard/pages/logs/records-operations/records-operations.component';
import {StatisticsMapComponent} from '../../components/dashboard/pages/statistics-map/statistics-map.component';
import {SettingComponent} from '../../components/dashboard/pages/user/setting/setting.component';
import {PromotersComponent} from '../../components/dashboard/pages/promoters/promoters.component';
import {PromotersDataTableComponent} from '../../components/dashboard/pages/promoters/promoters-data-table/promoters-data-table.component';
import {IronmanComponent} from '../../components/dashboard/pages/logs/ironman/ironman.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AgmCoreModule} from '@agm/core';
import {OperatorPipe} from '../../pipes/operator.pipe';
import {MapPromotersComponent} from '../../components/dashboard/pages/map-promoters/map-promoters.component';
import {IronmanPipe} from '../../pipes/ironman.pipe';
import {OrganizationChartModule} from 'primeng/organizationchart';

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
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAHukNiEIS2AzxptYrarhGCdFJw2zmZGLY',
            libraries: ['places']
        }),
        OrganizationChartModule,
    ],
    exports: [
        StructureDataTableComponent,
        DragImageDirective,
    ],
    declarations: [
        DashboardComponent,
        MapsComponent,
        NewBoxComponent,
        PoliticalPartiesComponent,
        PoliticalPartiesDataTableComponent,
        UserComponent,
        UserDataTableComponent,
        SettingComponent,
        UserPipe,
        IronmanPipe,
        OperatorPipe,
        TypeManagerBoxPipe,
        LogsComponent,
        StructureComponent,
        StructureDataTableComponent,
        LogsMovementsComponent,
        DragImageDirective,
        LogsDataTableComponent,
        ReportsComponent,
        IronmanComponent,
        BlockCopyPasteDirective,
        DigitOnlyDirective,
        RecordsOperationsComponent,
        StatisticsMapComponent,
        PromotersComponent,
        PromotersDataTableComponent,
        MapPromotersComponent,
    ]
})

export class AdminLayoutModule {
}
