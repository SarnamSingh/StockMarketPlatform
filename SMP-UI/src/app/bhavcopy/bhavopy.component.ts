import { Component, ViewChild, ElementRef } from '@angular/core';
import { BhavcopyModel } from '../models/bhavcopy';
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
    bhavcopyArray: BhavcopyModel[] = [];

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
                this.bhavcopyArray = this.getBhavcopyDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
            }
            fileReader.readAsText(fileToRead, "UTF-8");

        }


    }
    OnBhavcopyUploadClick() {

        if (this.selectedBhavcopy.value == 1 && this.bhavcopyArray.length > 0) {
           
            let counter = 0;
            this.progressBar.nativeElement.style.display ="inline-block";
            from(this.bhavcopyArray).pipe(
                concatMap(bhavcopy => this.bhavcopyService.uploadBhavCopy(bhavcopy))
            ).subscribe(output => {
                counter++;
                if (output) {
                    //console.log(output);
                }
            }, (err) => {  counter++;console.log(err) },
                () => {
                   
                    if (this.bhavcopyArray.length === counter) {
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

    getBhavcopyDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let currentRecord = (<string>csvRecordsArray[i]).split(',');
            if (currentRecord.length == headerLength) {
                let csvRecord: BhavcopyModel = new BhavcopyModel();
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
                csvRecord.tradedOn = new Date(currentRecord[10].trim());
                csvRecord.totalTrades = +currentRecord[11].trim();
                csvRecord.ISIN = currentRecord[12].trim();
                csvArr.push(csvRecord);

            }
        }
        return csvArr;
    }

}                                                   