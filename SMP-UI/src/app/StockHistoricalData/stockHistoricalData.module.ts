import { NgModule } from '@angular/core';
import { StockHistoricalDataRouting } from './stockHistoricalData-routing.module';
import { StockHistoricalDataService } from './stockHistoricalData.service';
import { StockHistoricalDataComponent } from './stockHistoricalData.component';
import { DailyHighOIVolumeDataComponent } from './dailyHighOIVolumeData.component';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [ StockHistoricalDataComponent, DailyHighOIVolumeDataComponent],
    imports: [CommonModule, StockHistoricalDataRouting],
    providers: [StockHistoricalDataService]
}) 
export class StockHistoricalDataModule{

}