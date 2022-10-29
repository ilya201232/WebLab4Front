import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'app-no-access-page',
    templateUrl: './no-access-page.component.html',
    styleUrls: ['./no-access-page.component.css']
})
export class NoAccessPageComponent implements OnInit {

    constructor(private router : Router) {
    }

    ngOnInit(): void {
    }

    returnToHomePage() {
        this.router.navigate(['/home'])
    }
}
