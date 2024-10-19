import { Routes } from '@angular/router';
// import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ReligionComponent } from './religion/religion.component';
import { ProfileComponent } from './profile/profile.component';
import { TrainingComponent } from './training/training.component';
import { GetbyTrainingComponent } from './getby-training/getby-training.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { LoggedinguardGuard } from './guards/login.guard';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';
import { AboutUsComponent } from './about-us/about-us.component';

export const routes: Routes = [
    {path:'home',component:HomeComponent},
    {path:'',pathMatch:'full',redirectTo:'home'},
    {path:'religion/:id',component:ReligionComponent,canActivate: [LoggedinguardGuard],},
    {path:'profile',component:ProfileComponent,canActivate: [LoggedinguardGuard],},
    {path:'Training',component:TrainingComponent,canActivate: [LoggedinguardGuard],},
    {path:'getbytraining/:id',component:GetbyTrainingComponent},
    {path:'add-training',component:AddTrainingComponent,canActivate: [LoggedinguardGuard], },
    {path:'signup',component:SignupComponent},
    {path:'verify',component:VerifyComponent},
    // {path:'About-us',component:AboutUsComponent},
    {path:'About-us',component:AboutUsComponent}




];
