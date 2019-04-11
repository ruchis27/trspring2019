import { AObjectService, ACondition } from '@apttus/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { StorefrontService, Storefront, ConversionService, CurrencyType } from '@apttus/ecommerce';

@Injectable({
    providedIn: 'root'
})

export class PSConversionService extends ConversionService {
    public getConversionRate(): Observable<CurrencyType[]> {
        super.getConversionRates().subscribe(currencyType => {
            console.log(currencyType);
            return currencyType;
        });
        return super.getConversionRates();
    }

    public getMyCurrencyType(): Observable<CurrencyType> {
        super.getMyCurrencyType().subscribe(currencyType => {
            console.log(currencyType);
            return currencyType;
        });
        return super.getMyCurrencyType();
    }
}