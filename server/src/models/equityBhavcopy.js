function EquityBhavcopyModel(){
    this.symbol = '';
    this.series = '';
    this.open = 0.0;
    this.high = 0.0;
    this.low = 0.0;
    this.close = 0.0;
    this.last = 0.0;
    this.prevClose = 0.0;
    this.totTrdQty = 0;
    this.totTrdVal= 0.0;
    this.tradedOn = new Date();
    this.totalTrades = 0;
    this.ISIN = '';
}