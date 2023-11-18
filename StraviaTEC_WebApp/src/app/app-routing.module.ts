import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', pathMatch: 'full', redirectTo:'user-login' },
            { path: 'user-login', component: UserLoginComponent },
            { path: 'user-signup', component: UserSignupComponent },
            {
                path: 'dashboard', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/home/home.module').then(m => m.HomeModule) },
                    { path: 'home', loadChildren: () => import('./demo/components/home/home.module').then(m => m.HomeModule) },
                    { path: 'profile', loadChildren: () => import('./demo/components/profile/profile.module').then(m => m.ProfileModule) },
                    { path: 'add-activity', loadChildren: () => import('./demo/components/add-activity/add-activity.module').then(m => m.AddActivityModule) },
                    { path: 'search', loadChildren: () => import('./demo/components/search/search.module').then(m => m.SearchModule) },
                    { path: 'inscriptions', loadChildren: () => import('./demo/components/inscriptions/inscriptions.module').then(m => m.InscriptionsModule) },
                    { path: 'management', loadChildren: () => import('./demo/components/management/management.module').then(m => m.ManagementModule) },
                    { path: 'reports-races', loadChildren: () => import('./demo/components/reports-races/reports-races.module').then(m => m.ReportsRacesModule) }
                ]
            },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
