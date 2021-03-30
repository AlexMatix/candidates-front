import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';


import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './shared/components.module';

import {AppComponent} from './app.component';

import {AgmCoreModule} from '@agm/core';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {DraftComponent} from './shared/dialogs/draft/draft.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AssignStructureComponent} from './shared/dialogs/assign-structure/assign-structure.component';
import {LoginComponent} from './components/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './services/AuthInterceptor.service';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {CustomMatPaginatorIntl} from './Internalization/CustomMatPaginatorIntl';
import {ZoneComponent} from './shared/dialogs/zone/zone.component';
import {BoxReportDetailComponent} from './shared/dialogs/box-report-detail/box-report-detail.component';
import {LocationComponent} from './shared/dialogs/location/location.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
        }),
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    },
        {
            provide: MatPaginatorIntl,
            useClass: CustomMatPaginatorIntl
        }],
    entryComponents: [
        DraftComponent,
        AssignStructureComponent,
        ZoneComponent,
        BoxReportDetailComponent,
        LocationComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
