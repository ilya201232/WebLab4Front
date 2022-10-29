import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import * as bcrypt from "bcryptjs";
import axios from "axios";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isUserLoggedIn: boolean = false;

    currentUserData: any = [];

    login(userName: string, password: string): Observable<boolean> {
        return new Observable((observer) => {
            axios.post('https://localhost:3200/api/login', {
                email: userName,
            })
                .then((response) => {
                    console.log(response);

                    this.isUserLoggedIn = bcrypt.compareSync(password, response.data.passwordHash);

                    if (this.isUserLoggedIn) {
                        axios.post('https://localhost:3200/api/get_user_data', {
                            email: userName,
                        }).then((response) => {
                            let tmpData = response.data;
                            tmpData['email'] = userName;
                            localStorage.setItem('userData', JSON.stringify(tmpData));
                            console.log(response.data);
                        })
                    }

                    localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false");

                    observer.next(this.isUserLoggedIn);
                })
                .catch((err) => {
                    console.log(err.response.data.error);
                    observer.next(false);
                })
        });
    }

    logout(): void {
        this.isUserLoggedIn = false;
        localStorage.removeItem('isUserLoggedIn');
    }

    constructor() {
    }
}
