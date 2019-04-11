import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { QuoteService, OrderService, PriceService, Price, LocalCurrencyPipe, Quote, Order, UserService, User } from '@apttus/ecommerce';
import { AObject, ACondition } from '@apttus/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

/**
 * This component is for Apttus-ecommerce dashboard. This gives you glimpse of orders, quotes and total spending done for logged in user profile.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('quoteChart') quoteChart: ElementRef;
  @ViewChild('orderChart') orderChart: ElementRef;

  /**
   * Number of order count for logged in user.
   */
  orderCount: number = 0;
  /**
   * Number of quote count for logged in user.
   */
  quoteCount: number = 0;
  /**
   * List of order for logged in user. -Array of order.
   */
  orderList: Array<Order>;
  /**
   * List of order for logged in user. -Array of quote.
   */
  quoteList: Array<Quote>;
  /**
   * Total spending done by logged-in user.
   */
  spent: Price;
  /**
   * Any current subscription availed by logged in user.
   */
  subscription: any;
  user$: Observable<User>;

  /**
  * @ignore
  */
  constructor(private quoteService: QuoteService, private orderService: OrderService, private priceService: PriceService, private localCurrencyPipe: LocalCurrencyPipe, private userService: UserService) {}

  /**
  * @ignore
  */
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
        // prices.forEach(price => this.spent.addPrice(price));
      });

    });
  }

  /**
  * @ignore
  */
  ngOnDestroy(){
    if (this.subscription && this.subscription.unsubscribe){
      this.subscription.unsubscribe();
    }
  }

  /**
   * @ignore
   */
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
