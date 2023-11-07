import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        AngularMaterialModule,
        AvatarModule,
        SkeletonModule,
        FormsModule
    ],
    declarations: [ProfileComponent]
})
export class ProfileModule { }