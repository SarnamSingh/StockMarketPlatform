import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const stockHistoricalDataRoutes: Route[] = [
    {
        path: 'stockHistoricalData',
        loadChildren: () => import('./stockHistoricalData.module').then(m => m.StockHistoricalDataModule)
    }
]

@NgModule({
    imports: [RouterModule.forChild(stockHistoricalDataRoutes)],
    exports: [RouterModule]
})
export class StockHistoricalDataRouting{}