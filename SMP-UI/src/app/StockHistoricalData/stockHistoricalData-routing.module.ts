import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DailyHighOIVolumeDataComponent } from './dailyHighOIVolumeData.component';
import { StockHistoricalDataComponent } from './stockHistoricalData.component';

const stockHistoricalDataRoutes: Route[] = [
    {
        path: '',
        component: StockHistoricalDataComponent,
        children: [
            {
                path: '',
                redirectTo: 'DailyHighOIVolumeData',
                pathMatch: 'full'
            },
            {
                path: 'DailyHighOIVolumeData',
                component: DailyHighOIVolumeDataComponent
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(stockHistoricalDataRoutes)],
    exports: [RouterModule]
})
export class StockHistoricalDataRouting{}