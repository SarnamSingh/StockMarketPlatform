import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HomeService } from './home.service'
import { environment } from '../../environments/environment';
import { Observable, Subject, Subscription, timer, interval } from 'rxjs';
import { script } from '../models/scriptModel';
import { BhavcopyModel } from '../models/bhavcopy';
import { PreOpenMarketDataModel } from '../models/preOpenMarketData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService]
})
export class HomeComponent {

  title = 'scriptcoitracker';
  trackingStatus = '';
  startTracking = true;
  selectedStock$ = new Subject<script[]>();
  scriptArray: Array<script> = [];
  currentProgress = 0;
  minimumCOIChange = 0;
  minimumPrice = 0;
  currentStockPrice = 0;
  priceRanges = [{ idx: 0, price: 'All' }, { idx: 1, price: '> 100' }, { idx: 2, price: '> 200' }, { idx: 3, price: '> 300' }, { idx: 4, price: '> 400' }, { idx: 5, price: '> 500' }, { idx: 6, price: '> 600' }, { idx: 7, price: '> 700' }, { idx: 8, price: '> 800' }, { idx: 9, price: '> 900' }, { idx: 10, price: '> 1000' }];
  selectedPriceRange = { idx: 1, price: '> 100' };
  coiRanges = [{ idx: 0, coi: '> 50000' }, { idx: 1, coi: '> 100000' }, { idx: 2, coi: '> 150000' },
  { idx: 3, coi: '> 200000' }, { idx: 4, coi: '> 250000' }, { idx: 5, coi: '> 300000' }, { idx: 6, coi: '> 350000' },
  { idx: 7, coi: '> 400000' }, { idx: 8, coi: '> 450000' }, { idx: 9, coi: '> 500000' }];
  selectedCOIRange = { idx: 3, coi: '> 200000' };

  csvContent: string;
  bhavcopyArray: BhavcopyModel[] = [];
  preOpenMarketDataArray: PreOpenMarketDataModel[] = [];
  stocksWithGapUpOpening: string[] = [];
  stocksWithGapDownOpening: string[] = [];
  stocksWithGapUpOpening$ = new Subject<string[]>();
  stocksWithGapDownOpening$ = new Subject<string[]>();

  @ViewChild('progressBar')
  private progressBar: ElementRef;


  private subscription: Subscription;

  definedInterval: Observable<number> = interval(300000);

  constructor(private homeService: HomeService, private httpClient: HttpClient) {

  }

  OnPriceRangeChange(selectedPriceRangeOption) {
    this.selectedPriceRange = this.priceRanges.find(item => item.idx == selectedPriceRangeOption.value);
  }

  OnCOIRangeChange(selectedCOIRangeOption) {
    this.selectedCOIRange = this.coiRanges.find(item => item.idx == selectedCOIRangeOption.value);
  }
  test() {
    console.log(new Date());
  }
  getContentFromAnotherPortal() {
    this.currentProgress = 0;
    //this.progressBar.nativeElement.style.display = "block";
    this.scriptArray.length = 0;
    environment.stockList.forEach((item, idx) => {
      const url = environment.stockMarketOffcialWebsite.replace(/script/g, item);
      this.homeService.getHtml(url).subscribe(
        (data) => {
          this.currentProgress++;
          let doc: Document = (new DOMParser()).parseFromString(data, "text/html");
          let tableElement = doc.querySelector("#octable");
          let stockPriceElementText = doc.querySelector("b").innerText;
          if (stockPriceElementText.includes(item)) {
            this.currentStockPrice = +stockPriceElementText.split(' ')[1];
          }
          if (this.currentStockPrice >= this.minimumPrice) {
            let rowcollection = tableElement.querySelectorAll('tr');
            for (let i = 0; i < rowcollection.length - 1; i++) {
              if (i > 1) {
                let callCOI = rowcollection[i].querySelector('td:nth-of-type(3)').textContent;
                let putCOI = rowcollection[i].querySelector('td:nth-of-type(21)').textContent;
                callCOI = callCOI && callCOI.indexOf(',') >= 0 ? (callCOI.replace(/\,/g, '')).replace("-", "") : callCOI.replace("-", "");
                putCOI = putCOI && putCOI.indexOf(',') >= 0 ? (putCOI.replace(/\,/g, '')).replace("-", "") : putCOI.replace("-", "");
                if (+callCOI > this.minimumCOIChange || +putCOI > this.minimumCOIChange) {
                  this.scriptArray.push({ "name": item, "coi": +callCOI > +putCOI ? +callCOI : +putCOI })
                  this.selectedStock$.next(this.scriptArray);
                  break;
                }
              }
            }
            if (this.currentProgress === environment.stockList.length) {
              //this.progressBar.nativeElement.style.display = "none";
            }
          }

        },
      );
    });


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

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  getHeaderArrayA(csvRecordsArr: any) {
    //let headers = (<string>csvRecordsArr[0]).split(',');
    let headers = csvRecordsArr[0];
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
        csvRecord.timeStamp = new Date(currentRecord[10].trim());
        csvRecord.totalTrades = +currentRecord[11].trim();
        csvRecord.isin = currentRecord[12].trim();
        csvArr.push(csvRecord);

      }
    }
    return csvArr;
  }

   csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};
  OnPreOpenMarketDataFileSelect(input: HTMLInputElement) {
    const files = input.files;
    if (files && files.length) {
      const fileToRead = files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        let csvData = fileReader.result;
        let csvRecordsArray = this.csvToArray(csvData);
        //let csvRecordsArray = (<string>csvData).replace(/"/g, '""').replace(/'/g, '\'').split(/\r\n|\n/);
        let headersRow = this.getHeaderArrayA(csvRecordsArray);
        this.preOpenMarketDataArray = this.getPreOpenMarketDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      }
      fileReader.readAsText(fileToRead, "UTF-8");

    }
  }
  getPreOpenMarketDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let currentRecord = (<string>csvRecordsArray[i]);
      if (currentRecord.length == headerLength) {
        let csvRecord: PreOpenMarketDataModel = new PreOpenMarketDataModel();
        csvRecord.symbol = currentRecord[0].trim();
        csvRecord.prevClose = +currentRecord[1].trim();
        csvRecord.iepPrice = +currentRecord[2].trim();
        csvRecord.change = currentRecord[3] && currentRecord[3].trim()!='-'?+currentRecord[3]:0;
        csvRecord.changePercentage = currentRecord[4]&& currentRecord[4].trim()!='-'?+currentRecord[4]:0;
        csvRecord.finalPrice = currentRecord[5].trim()&& currentRecord[5].trim()!='-'?+currentRecord[5]:0;
        csvRecord.finalQuantity = +currentRecord[6].trim();
        csvRecord.value = currentRecord[7].trim()&& currentRecord[7].trim()!='-'?+currentRecord[7]:0;
        csvRecord.ffmCap = +currentRecord[8].trim();
        csvRecord.nm52WH = +currentRecord[9].trim();
        csvRecord.nm52WL = +currentRecord[10].trim();
        csvArr.push(csvRecord);

      }
    }
    return csvArr;
  }
  OnTrackScriptButtonClick() {
    this.minimumPrice = + (this.selectedPriceRange.idx == 0 ? '0' : (this.selectedPriceRange.price.split(' '))[1]);
    this.minimumCOIChange = + (this.selectedCOIRange.coi.split(' '))[1];
    if (this.startTracking) {
      this.getContentFromAnotherPortal();
      this.subscription = this.definedInterval.subscribe(seconds => {
        this.getContentFromAnotherPortal();
      })
    } else {
      this.subscription.unsubscribe();
    }
    this.startTracking = !this.startTracking;
  }

  OnSearchButtonClick() {
    this.stocksWithGapUpOpening.length = 0;
    this.stocksWithGapDownOpening.length = 0;
    this.preOpenMarketDataArray.forEach(preOpenStock => {
      let bhavcopyData = this.bhavcopyArray.find(bhavcopy => bhavcopy.symbol === preOpenStock.symbol && bhavcopy.series.toLowerCase() === "eq");
      if (bhavcopyData && preOpenStock.iepPrice >= bhavcopyData.high) {
        this.stocksWithGapUpOpening.push(preOpenStock.symbol);
        this.stocksWithGapUpOpening$.next(this.stocksWithGapUpOpening);
      }
      if (bhavcopyData && preOpenStock.iepPrice <= bhavcopyData.low) {
        this.stocksWithGapDownOpening.push(preOpenStock.symbol);
        this.stocksWithGapDownOpening$.next(this.stocksWithGapDownOpening);
      }
    });
  }

}
