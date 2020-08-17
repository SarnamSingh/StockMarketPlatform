import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BhavcopyComponent} from './bhavcopy/bhavopy.component'


const routes: Routes = [

  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: 'Home', component: HomeComponent },
  { path: 'Bhavcopy', component: BhavcopyComponent },
  { path: 'StockHistoricalData', loadChildren:()=>import('./StockHistoricalData/stockHistoricalData.module').then(m=>m.StockHistoricalDataModule)},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
