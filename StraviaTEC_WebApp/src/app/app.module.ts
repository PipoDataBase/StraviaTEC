import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';

//Angular material
import { AngularMaterialModule } from './angular-material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

// FormsModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Primeng components
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { SkeletonModule } from 'primeng/skeleton';
import { MultiSelectModule } from 'primeng/multiselect';

import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent, UserLoginComponent, UserSignupComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ButtonModule,
        TabMenuModule,
        SkeletonModule,
        MultiSelectModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, DatePipe
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
