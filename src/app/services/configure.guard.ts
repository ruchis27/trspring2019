import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProductService, Product } from '@apttus/ecommerce';
import { ConstraintRuleService } from '@apttus/constraint-rules';
import * as _ from 'lodash';
import { ACondition, ConfigurationService } from '@apttus/core';
import { ProductDetailsComponent } from '../modules/product-details/layout/product-details.component';

@Injectable()
export class ConfigureGuard implements CanActivate, CanDeactivate<ProductDetailsComponent>{

    constructor(private router: Router, private productService: ProductService, private constraintRuleService: ConstraintRuleService, private config: ConfigurationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.productService.where([new ACondition(Product, this.config.get('productIdentifier'), 'Equal', route.params.productCode)])
            .map(res => res[0])
            .filter(product => product != null)
            .distinctUntilKeyChanged('Id')
            .flatMap(product =>
                this.constraintRuleService.getConstraintRulesForProducts([product])
                    .map(rules => {
                        const activate =
                            ((_.get(product, 'Apttus_Config2__HasAttributes__c') && _.get(product, 'Apttus_Config2__AttributeGroups__r', []).totalSize > 0)
                                || (_.get(product, 'Apttus_Config2__HasOptions__c') && _.get(product, 'Apttus_Config2__OptionGroups__r', []).totalSize > 0))
                            && rules.filter(rule => rule.ConstraintRuleActions.filter(action => action.ActionType === 'Replacement').length > 0).length === 0;
                        if(!activate)
                            this.router.navigate(['/product', product[this.config.get('productIdentifier')]]);
                        return activate;
                    })
            );
    }

    canDeactivate(component: ProductDetailsComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        if(component.isConfigurationChanged){
            if(confirm('You have unsaved changes to the product configuration! Are you sure you want to proceed?'))
                return true;
            else
                return false;
        }
        else
            return true;
    }

}