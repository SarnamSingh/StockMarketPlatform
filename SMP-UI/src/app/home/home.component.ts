import { Component, ViewChild, ElementRef, Output, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HomeService } from './home.service'
import { environment } from '../../environments/environment';
import { Observable, Subject, Subscription, timer, interval, from, of } from 'rxjs';
import { script } from '../models/scriptModel';
import { EquityBhavcopyModel } from '../models/equityBhavcopy';
import { PreOpenMarketDataModel } from '../models/preOpenMarketData';
import { TwoDayRelationshipFilter } from '../models/twoDayRelationshipFilter';
import { TwoDayRelationshipResult } from '../models/twoDayRelationshipResult';
import { BhavcopyService } from '../bhavcopy/bhavcopy.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService, BhavcopyService]
})
export class HomeComponent implements OnDestroy {

  title = 'scriptcoitracker';
  trackingStatus = '';
  startTracking = true;
  scriptArray: Array<script> = [];
  stocksWithTwoDayRelationshipArray: Array<TwoDayRelationshipResult> = [];
  selectedStock$ = new Subject<script[]>();
  stocksWithTwoDayRelationship$: Observable<TwoDayRelationshipResult[]>;
  displayStocksWithHighCOI = false;
  displayStocksWithTwoDayRelationship = false;

  currentProgress = 0;
  minimumCOIChange = 0;
  minimumPrice = 0;
  currentStockPrice = 0;
  priceValue = 100;
  coiValue = 200000;
  openPriceValue = 100;
  priceValueForRelationship = 100;
  currentDate: Date = new Date();
  fromDate: Date = new Date();
  toDate: Date = new Date();
  priceRanges = [{ idx: 0, price: 'All' }, { idx: 1, price: '> 100' }, { idx: 2, price: '> 200' }, { idx: 3, price: '> 300' }, { idx: 4, price: '> 400' }, { idx: 5, price: '> 500' }, { idx: 6, price: '> 600' }, { idx: 7, price: '> 700' }, { idx: 8, price: '> 800' }, { idx: 9, price: '> 900' }, { idx: 10, price: '> 1000' }];
  selectedPriceRange = { idx: 1, price: '> 100' };
  coiRanges = [{ idx: 0, coi: '> 50000' }, { idx: 1, coi: '> 100000' }, { idx: 2, coi: '> 150000' },
  { idx: 3, coi: '> 200000' }, { idx: 4, coi: '> 250000' }, { idx: 5, coi: '> 300000' }, { idx: 6, coi: '> 350000' },
  { idx: 7, coi: '> 400000' }, { idx: 8, coi: '> 450000' }, { idx: 9, coi: '> 500000' }];
  selectedCOIRange = { idx: 3, coi: '> 200000' };

  csvContent: string;
  bhavcopyArray: EquityBhavcopyModel[] = [];
  preOpenMarketDataArray: PreOpenMarketDataModel[] = [];
  stocksWithGapUpOpening = [];
  stocksWithGapDownOpening = [];
  stocksWithGapUpOpening$ = new Subject<string[]>();
  stocksWithGapDownOpening$ = new Subject<string[]>();
  displayStocksWithGapUpOpening = false;
  displayStocksWithGapDownOpening = false;
  searchStock = '';
  searchFPR = '';
  searchCR = '';

  twoDayRelationshipFilter: TwoDayRelationshipFilter = new TwoDayRelationshipFilter();

  @ViewChild('progressBar')
  private progressBar: ElementRef;


  private subscription: Subscription;

  definedInterval: Observable<number> = interval(300000);

  constructor(private homeService: HomeService, private httpClient: HttpClient, private bhavcopyService: BhavcopyService) {
    this.fromDate.setDate(this.currentDate.getDate() - 2);
    this.toDate.setDate(this.currentDate.getDate() - 1);
    this.twoDayRelationshipFilter.price = 100;
    this.twoDayRelationshipFilter.fromFloorPointWidth = 0;
    this.twoDayRelationshipFilter.toFloorPointWidth = 1;
  }
  ngOnDestroy() {

  }
  OnPriceRangeChange(selectedPriceRangeOption) {
    this.selectedPriceRange = this.priceRanges.find(item => item.idx == selectedPriceRangeOption.value);
  }

  OnCOIRangeChange(selectedCOIRangeOption) {
    this.selectedCOIRange = this.coiRanges.find(item => item.idx == selectedCOIRangeOption.value);
  }
  onStockSearch(element) {
    this.searchStock = element.target.value;
    if (this.searchStock !== undefined && this.searchStock != null && this.searchStock.length > 0) {
      var filtereredTwoDayRelationship = this.stocksWithTwoDayRelationshipArray.filter(item => {
        return item.symbol.toLowerCase().startsWith(this.searchStock.toLowerCase()) &&
          item.fpr.toLowerCase().startsWith(this.searchFPR.length > 0 ? this.searchFPR.toLowerCase() : item.fpr.toLowerCase()) &&
          (item.cr.toLowerCase().startsWith(this.searchCR.length > 0 ? this.searchCR.toLowerCase() : item.cr.toLowerCase()))
      });

      this.stocksWithTwoDayRelationship$ = of(filtereredTwoDayRelationship);
    }
  }
  onFPRSearch(element) {
    this.searchFPR = element.target.value;
    if (this.searchFPR != null && this.searchFPR.length > 0) {
      var filtereredTwoDayRelationship = this.stocksWithTwoDayRelationshipArray.filter(item => {
        return item.symbol.toLowerCase().startsWith(this.searchStock.length > 0 ? this.searchStock.toLowerCase() : item.symbol.toLowerCase()) &&
          item.fpr.toLowerCase().startsWith(this.searchFPR.toLowerCase()) &&
          (item.cr.toLowerCase().startsWith(this.searchCR.length > 0 ? this.searchCR.toLowerCase() : item.cr.toLowerCase()))
      });

      this.stocksWithTwoDayRelationship$ = of(filtereredTwoDayRelationship);

    }
  }
  onCRSearch(element) {
    this.searchCR = element.target.value;
    if (this.searchCR != null && this.searchCR.length > 0) {
      var filtereredTwoDayRelationship = this.stocksWithTwoDayRelationshipArray.filter(item => {
        return item.symbol.toLowerCase().startsWith(this.searchStock.length > 0 ? this.searchStock.toLowerCase() : item.symbol.toLowerCase()) &&
          item.fpr.toLowerCase().startsWith(this.searchFPR.length > 0 ? this.searchFPR.toLowerCase() : item.fpr.toLowerCase()) &&
          (item.cr.toLowerCase().startsWith(this.searchCR.toLowerCase()))
      });

      this.stocksWithTwoDayRelationship$ = of(filtereredTwoDayRelationship);

    }
  }

  clearGridFilters(){
    this.searchStock = '';
    this.searchFPR = '';
    this.searchCR = '';
    this.stocksWithTwoDayRelationship$ = of (this.stocksWithTwoDayRelationshipArray);
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
                  this.displayStocksWithHighCOI = true;
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
        csvRecord.change = currentRecord[3] && currentRecord[3].trim() != '-' ? +currentRecord[3] : 0;
        csvRecord.changePercentage = currentRecord[4] && currentRecord[4].trim() != '-' ? +currentRecord[4] : 0;
        csvRecord.finalPrice = currentRecord[5].trim() && currentRecord[5].trim() != '-' ? +currentRecord[5] : 0;
        csvRecord.finalQuantity = +currentRecord[6].trim();
        csvRecord.value = currentRecord[7].trim() && currentRecord[7].trim() != '-' ? +currentRecord[7] : 0;
        csvRecord.ffmCap = +currentRecord[8].trim();
        csvRecord.nm52WH = +currentRecord[9].trim();
        csvRecord.nm52WL = +currentRecord[10].trim();
        csvArr.push(csvRecord);

      }
    }
    return csvArr;
  }
  OnTrackScriptButtonClick() {
    this.displayStocksWithHighCOI = false;
    //this.minimumPrice = + (this.selectedPriceRange.idx == 0 ? '0' : (this.selectedPriceRange.price.split(' '))[1]);
    this.minimumPrice = + this.priceValue;
    //this.minimumCOIChange = + (this.selectedCOIRange.coi.split(' '))[1];
    this.minimumCOIChange = + this.coiValue;
    if (this.startTracking) {
      this.getContentFromAnotherPortal();
      this.subscription = this.definedInterval.subscribe(seconds => {
        this.getContentFromAnotherPortal();
      })
    } else {
      this.displayStocksWithHighCOI = false;
      this.subscription.unsubscribe();
    }
    this.startTracking = !this.startTracking;
  }

  OnSearchButtonClick() {
    this.stocksWithGapUpOpening.length = 0;
    this.stocksWithGapDownOpening.length = 0;
    this.displayStocksWithGapUpOpening = false;
    this.displayStocksWithGapDownOpening = false;
    this.preOpenMarketDataArray.forEach(preOpenStock => {
      if (preOpenStock.iepPrice >= +this.openPriceValue) {
        let bhavcopyData = this.bhavcopyArray.find(bhavcopy => bhavcopy.symbol === preOpenStock.symbol && bhavcopy.series.toLowerCase() === "eq");
        const pp = (bhavcopyData.high + bhavcopyData.low + bhavcopyData.last) / 3;
        const r1 = 2 * pp - bhavcopyData.low;
        const r2 = pp + (bhavcopyData.high - bhavcopyData.low);
        const s1 = 2 * pp - bhavcopyData.high;
        const s2 = pp - (bhavcopyData.high - bhavcopyData.low);
        if (bhavcopyData && (preOpenStock.iepPrice >= bhavcopyData.high || preOpenStock.iepPrice >= r2 || preOpenStock.iepPrice >= r1)) {
          this.stocksWithGapUpOpening.push({
            'symbol': preOpenStock.symbol,
            'isEqualOrAboverR2': preOpenStock.iepPrice >= r2 ? true : false,
            'isEqualOrAboverR1': preOpenStock.iepPrice >= r1 ? true : false,
            'isEqualOrAboverPP': preOpenStock.iepPrice >= pp ? true : false,
            'r2': r2,
            'r1': r1,
            'pp': pp,
            'open': preOpenStock.iepPrice
          });
          this.stocksWithGapUpOpening$.next(this.stocksWithGapUpOpening);
          this.displayStocksWithGapUpOpening = true;
        }
        if (bhavcopyData && (preOpenStock.iepPrice <= bhavcopyData.low || preOpenStock.iepPrice <= s2 || preOpenStock.iepPrice <= s1)) {
          this.stocksWithGapDownOpening.push({
            'symbol': preOpenStock.symbol,
            'isEqualOrBelowS2': preOpenStock.iepPrice <= s2 ? true : false,
            'isEqualOrBelowS1': preOpenStock.iepPrice <= s1 ? true : false,
            'isEqualOrBelowPP': preOpenStock.iepPrice <= pp ? true : false,
            's2': s2,
            's1': s1,
            'pp': pp,
            'open': preOpenStock.iepPrice
          });
          this.displayStocksWithGapDownOpening = true;
          this.stocksWithGapDownOpening$.next(this.stocksWithGapDownOpening);
        }

      }
    });
  }
  public OnSearchRelationshipClick() {
    this.stocksWithTwoDayRelationshipArray.length = 0;
    this.progressBar.nativeElement.style.display = 'block';
    // this.twoDayRelationshipFilter.fromDate = this.fromDate.getMonth()+1+"-"+this.fromDate.getDate()+"-"+this.fromDate.getFullYear();
    // this.twoDayRelationshipFilter.toDate = this.toDate.getMonth()+1+"-"+this.toDate.getDate()+"-"+this.toDate.getFullYear();
    const fromDateSplit = this.fromDate.toString().split('-');
    const toDateSplit = this.toDate.toString().split('-');
    this.twoDayRelationshipFilter.fromDate = fromDateSplit[1] + '-' + fromDateSplit[2] + '-' + fromDateSplit[0];
    this.twoDayRelationshipFilter.toDate = toDateSplit[1] + '-' + toDateSplit[2] + '-' + toDateSplit[0];

    this.bhavcopyService.getTwoDayRelationship(this.twoDayRelationshipFilter).subscribe((output) => {
      if (output && output.data !== undefined && output.data.length > 0) {
        this.displayStocksWithTwoDayRelationship = true;

        output.data.forEach(element => {
          let twoDayRelationshipResult = new TwoDayRelationshipResult();
          twoDayRelationshipResult.symbol = element.SYMBOL;
          twoDayRelationshipResult.tc = element.TC;
          twoDayRelationshipResult.bc = element.BC;
          twoDayRelationshipResult.fpWidth = element.FLOORPIVOTWIDTH;
          twoDayRelationshipResult.fpr = element.FloorPointRelationship;
          twoDayRelationshipResult.cr = element.CamrillaRelationship;
          twoDayRelationshipResult.closed = element.Closed;
          twoDayRelationshipResult['h3'] = element['H3'];
          twoDayRelationshipResult['h4'] = element['H4'];
          twoDayRelationshipResult['h5'] = element['H5'];
          twoDayRelationshipResult['l3'] = element['L3'];
          twoDayRelationshipResult['l4'] = element['L4'];
          twoDayRelationshipResult['l5'] = element['L5'];
          this.stocksWithTwoDayRelationshipArray.push(twoDayRelationshipResult)
          this.stocksWithTwoDayRelationship$ = of(this.stocksWithTwoDayRelationshipArray);
        });
      }
    },
      (err) => {
        this.displayStocksWithTwoDayRelationship = false;
        //this.stocksWithTwoDayRelationship$.unsubscribe();
        console.log(err);
      },
      () => { this.progressBar.nativeElement.style.display = 'none'; });
  }
  public getRowColor(currentRow): string {
    let color: string = "white";
    if (currentRow.isEqualOrAboverR2 || currentRow.isEqualOrBelowS2) {
      return color = "green";
    }
    if (currentRow.isEqualOrAboverR1 || currentRow.isEqualOrBelowS1) {
      return color = "skyblue";
    }
    if (currentRow.isEqualOrAboverPP || currentRow.isEqualOrBelowPP) {
      return color = "indianred";
    }
    return color;

  }

  public OnFromDateChange(element) {
    this.fromDate = new Date(element.target.value);
  }

  public OnToDateChange(element) {
    this.toDate = new Date(element.target.value);
  }

}
