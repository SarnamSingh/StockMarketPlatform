import { Component, ViewChild, ElementRef } from '@angular/core';
import { EquityBhavcopyModel } from '../models/equityBhavcopy';
import { FNOBhavcopyModel } from '../models/fnoBhavcopy';
import { BhavcopyService } from './bhavcopy.service';
import { delay, concat, concatMap, count } from "rxjs/operators";
import { from, of } from 'rxjs';


@Component({
    selector: 'bhavcopy',
    templateUrl: './bhavcopy.component.html'
})
export class BhavcopyComponent {

    public bhavcopyTypes = [];
    public selectedBhavcopy: any;
    equityBhavcopyArray: EquityBhavcopyModel[] = [];
    fnoBhavcopyArray: FNOBhavcopyModel[] = [];

    @ViewChild('progressBar')
    private  progressBar: ElementRef;

    constructor(private bhavcopyService: BhavcopyService) {
        this.bhavcopyTypes = [{ value: 0, displayText: ' --- Select --- ' }, { value: 1, displayText: 'Equity' }, { value: 2, displayText: 'FNO' }];
        this.selectedBhavcopy = { value: 0, displayText: ' --- Select --- ' }
    }

    // control events
    OnBhavcopyChange(element) {
        this.selectedBhavcopy = this.bhavcopyTypes.find(item => item.value == element.value);
    }
    OnBhavcopyBrowseSelect(input: HTMLInputElement) {

        const files = input.files;
        if (files && files.length) {
            const fileToRead = files[0];
            const fileReader = new FileReader();
            fileReader.onload = () => {
                let csvData = fileReader.result;
                let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
                let headersRow = this.getHeaderArray(csvRecordsArray);
                if(this.selectedBhavcopy.value == 1){
                this.equityBhavcopyArray = this.getEquityBhavcopyDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
                }else{
                    this.fnoBhavcopyArray = this.getFNOBhavcopyDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
                }
            }
            fileReader.readAsText(fileToRead, "UTF-8");

        }


    }
    OnBhavcopyUploadClick() {

        if (this.selectedBhavcopy.value == 1 && this.equityBhavcopyArray.length > 0) {
           
            let counter = 0;
            this.progressBar.nativeElement.style.display ="inline-block";
            from(this.equityBhavcopyArray).pipe(
                concatMap(bhavcopy => this.bhavcopyService.uploadBhavCopy(bhavcopy, this.selectedBhavcopy.displayText))
            ).subscribe(output => {
                counter++;
                if (output) {
                    //console.log(output);
                }
            }, (err) => {  counter++;console.log(err) },
                () => {
                   
                    if (this.equityBhavcopyArray.length === counter) {
                        this.progressBar.nativeElement.style.display ="none";
                    }
                });
           
        } else if (this.selectedBhavcopy.value == 2 && this.fnoBhavcopyArray.length > 0){
            let counter = 0;
            this.progressBar.nativeElement.style.display ="inline-block";
            from(this.fnoBhavcopyArray).pipe(
                concatMap(fnobhavcopy => this.bhavcopyService.uploadBhavCopy(fnobhavcopy, this.selectedBhavcopy.displayText))
            ).subscribe(output => {
                counter++;
                if (output) {
                    //console.log(output);
                }
            }, (err) => {  counter++;console.log(err) },
                () => {
                   
                    if (this.fnoBhavcopyArray.length === counter) {
                        this.progressBar.nativeElement.style.display ="none";
                    }
                });

        } else {
            console.log('No data found for upload.');
        }
    }

    //private methods
    getHeaderArray(csvRecordsArr: any) {
        let headers = (<string>csvRecordsArr[0]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    getEquityBhavcopyDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let currentRecord = (<string>csvRecordsArray[i]).split(',');
            if (currentRecord.length == headerLength) {
                let csvRecord: EquityBhavcopyModel = new EquityBhavcopyModel();
                csvRecord.symbol = currentRecord[0].trim();
                csvRecord.series = currentRecord[1].trim();
                csvRecord.open = +currentRecord[2].trim();
                csvRecord.high = +currentRecord[3].trim();
                csvRecord.low = +currentRecord[4].trim();
                csvRecord.close = +currentRecord[5].trim();
                csvRecord.last = +currentRecord[6].trim();
                csvRecord.prevClose = +currentRecord[7].trim();
                csvRecord.totTrdQty = +currentRecord[8].trim();
                csvRecord.totTrdVal = +currentRecord[9].trim();
                csvRecord.tradedOn = currentRecord[10].trim();
                csvRecord.totalTrades = +currentRecord[11].trim();
                csvRecord.ISIN = currentRecord[12].trim();
                csvArr.push(csvRecord);

            }
        }
        return csvArr;
    }
    getFNOBhavcopyDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let currentRecord = (<string>csvRecordsArray[i]).split(',');
            if (currentRecord.length == headerLength) {
                let csvRecord: FNOBhavcopyModel = new FNOBhavcopyModel();
                csvRecord.instrument = currentRecord[0].trim();
                csvRecord.symbol = currentRecord[1].trim();
                csvRecord.expiryDate = currentRecord[2].trim();
                csvRecord.strikePrice = +currentRecord[3].trim();
                csvRecord.optionType = currentRecord[4].trim();
                csvRecord.open = +currentRecord[5].trim();
                csvRecord.high = +currentRecord[6].trim();
                csvRecord.low = +currentRecord[7].trim();
                csvRecord.close = +currentRecord[8].trim();
                csvRecord.settlePrice = +currentRecord[9].trim();
                csvRecord.contracts = +currentRecord[10].trim();
                csvRecord.valueInLakh = +currentRecord[11].trim();
                csvRecord.openInterest = +currentRecord[12].trim();
                csvRecord.changeInOpenInterest = +currentRecord[13].trim();
                csvRecord.tradedOn = currentRecord[14].trim();
                
                csvArr.push(csvRecord);

            }
        }
        return csvArr;
    }

}                                                   