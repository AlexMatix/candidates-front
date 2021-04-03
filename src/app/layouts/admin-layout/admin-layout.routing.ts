import {Routes} from '@angular/router';

import {DashboardComponent} from '../../components/dashboard/dashboard.component';
import {UserComponent} from '../../components/dashboard/pages/user/user.component';
import {CandidateComponent} from '../../components/dashboard/pages/candidate/candidate.component';
import {CandidateListComponent} from '../../components/dashboard/pages/candidate-list/candidate-list.component';
import {CityHallComponent} from '../../components/dashboard/pages/city-hall/city-hall.component';
import {CandidateIneComponent} from '../../components/dashboard/pages/candidate-ine/candidate-ine.component';

export const AdminLayoutRoutes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'users', component: UserComponent},
    {path: 'candidate/:id', component: CandidateComponent},
    {path: 'candidate-ine/:id', component: CandidateIneComponent},
    {path: 'candidateList', component: CandidateListComponent},
    {path: 'cityHall', component: CityHallComponent},
];
