import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ExpenseGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): true | UrlTree {
        let val: string = localStorage.getItem('isUserLoggedIn')!;

        if(val != null && val == "true"){
            if(url == "/home")
                return this.router.parseUrl('/news');
            else
                return true;
        }

        return this.router.parseUrl('/no_access');
    }
}
