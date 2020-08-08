import { NgModule } from '@angular/core';
import { HighOIVolumeDataComponent } from './HighOIVolumeData.component';
import { StockHistoricalDataRouting } from './stockHistoricalData-routing.module';
import { StockHistoricalDataService } from './stockHistoricalData.service';

@NgModule({
    declarations: [HighOIVolumeDataComponent],
    imports: [StockHistoricalDataRouting],
    providers: [StockHistoricalDataService]
}) 
export class StockHistoricalDataModule{

}