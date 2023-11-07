import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        AngularMaterialModule,
        AvatarModule,
        SkeletonModule,
        FormsModule
    ],
    declarations: [HomeComponent]
})
export class HomeModule { }