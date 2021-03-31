import {Routes} from '@angular/router';

import {DashboardComponent} from '../../components/dashboard/dashboard.component';
import {UserComponent} from '../../components/dashboard/pages/user/user.component';
import {CandidateComponent} from '../../components/dashboard/pages/candidate/candidate.component';
import {CandidateListComponent} from '../../components/dashboard/pages/candidate-list/candidate-list.component';

export const AdminLayoutRoutes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'users', component: UserComponent},
    {path: 'candidate', component: CandidateComponent},
    {path: 'candidateList', component: CandidateListComponent},
];
