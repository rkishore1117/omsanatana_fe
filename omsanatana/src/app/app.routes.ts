import { Routes } from '@angular/router';
// import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'home',component:HomeComponent},
    {path:'',pathMatch:'full',redirectTo:'home'},

];