import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { QuoteService, OrderService, PriceService, Price, LocalCurrencyPipe, Quote, Order, UserService, User } from '@apttus/ecommerce';
import { AObject, ACondition } from '@apttus/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('quoteChart') quoteChart: ElementRef;
  @ViewChild('orderChart') orderChart: ElementRef;

  orderCount: number = 0;
  quoteCount: number = 0;
  orderList: Array<Order>;
  quoteList: Array<Quote>;
  spent: Price;
  subscription: any;
  user$: Observable<User>;

  constructor(private quoteService: QuoteService, private orderService: OrderService, private priceService: PriceService, private localCurrencyPipe: LocalCurrencyPipe, private userService: UserService) {}

  ngOnInit() {
    this.user$ = this.userService.me();
    this.spent = new Price(this.localCurrencyPipe);
    this.subscription = Observable.combineLatest(
        // this.quoteService.getMyQuotes(),
        this.orderService.getMyOrders(),
        this.orderService.aggregate([new ACondition(Order, 'CreatedDate', 'LastXDays', 7)]).map(res => res[0]),
        // this.quoteService.aggregate([new ACondition(Quote, 'CreatedDate', 'LastXDays', 7)]).map(res => res[0])
    ).subscribe(([orders, ag1]) => {
      this.orderList = orders;
      // this.quoteList = quotes;
      // this.renderPieWithData(this.quoteChart, quotes, 'Approval_Stage');
      this.renderPieWithData(this.orderChart, orders, 'Status');

      this.orderCount = _.get(ag1, '[0].total_records', 0);
      // this.quoteCount = _.get(ag2, '[0].total_records', 0);

      const orderPriceList$ = [];
      orders.forEach(order => orderPriceList$.push(this.priceService.getOrderPrice(order)));
      Observable.combineLatest(orderPriceList$).subscribe(prices => {
        prices.forEach(price => this.spent.addPrice(price as Price));
      });

    });
  }

  ngOnDestroy(){
    if (this.subscription && this.subscription.unsubscribe){
      this.subscription.unsubscribe();
    }
  }

  renderPieWithData(element: ElementRef, records: Array<AObject>, field: string){
    const data = {};
    records.map(r => r[field]).forEach(a => data[a] = (!data[a]) ? 1 : data[a] + 1);
    const myDoughnutChart = new Chart(element.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ]
          }
        ],
        labels: Object.keys(data)
      }
    });
  }

}
