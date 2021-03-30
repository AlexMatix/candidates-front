import {Routes} from '@angular/router';

import {DashboardComponent} from '../../components/dashboard/dashboard.component';
import {MapsComponent} from '../../components/dashboard/pages/maps/maps.component';
import {NewBoxComponent} from '../../components/dashboard/pages/new-box/new-box.component';
import {PoliticalPartiesComponent} from '../../components/dashboard/pages/political-parties/political-parties.component';
import {UserComponent} from '../../components/dashboard/pages/user/user.component';
import {LogsComponent} from '../../components/dashboard/pages/logs/logs.component';
import {StructureComponent} from '../../components/dashboard/pages/structure/structure.component';
import {LogsMovementsComponent} from '../../components/dashboard/pages/logs-movements/logs-movements.component';
import {StatisticsMapComponent} from '../../components/dashboard/pages/statistics-map/statistics-map.component';
import {PromotersComponent} from '../../components/dashboard/pages/promoters/promoters.component';
import {MapPromotersComponent} from '../../components/dashboard/pages/map-promoters/map-promoters.component';

export const AdminLayoutRoutes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'maps', component: MapsComponent},
    {path: 'maps-statistics', component: StatisticsMapComponent},
    {path: 'new-box/:id', component: NewBoxComponent},
    {path: 'add-box', component: NewBoxComponent},
    {path: 'political-parties', component: PoliticalPartiesComponent},
    {path: 'users', component: UserComponent},
    {path: 'all-boxes', component: LogsComponent},
    {path: 'structure', component: StructureComponent},
    {path: 'logs-movements', component: LogsMovementsComponent},
    {path: 'promoters', component: PromotersComponent},
    {path: 'map-promoters', component: MapPromotersComponent},
];
