import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { SocketioService } from "../socketio.service";
import axios from "axios";

@Component({
    selector: 'app-news-feed',
    templateUrl: './news-feed.component.html',
    styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {

    constructor(private fb: FormBuilder, private router: Router, private authService : AuthService,
                private socketService: SocketioService) {
    }

    ngOnInit(): void {
        this.getNewsList();
        this.socketService.setupSocketConnection();
        this.socketService.setupEventListener('news_added', (data:any) => {
            let email = JSON.parse(localStorage.getItem("userData")!).email;
            if (data.user_email === email) {
                console.log("Updating user news list!");
                this.getNewsList();
            } else {
                axios.post('https://localhost:3200/api/get_friends', {
                    user_email: JSON.parse(localStorage.getItem("userData")!).email
                })
                    .then((response) => {
                        console.log(response);

                        if (response.status === 200) {
                            for (const friend of response.data.friends) {
                                if (friend.email === data.user_email) {
                                    console.log("Updating user news list!");
                                    this.getNewsList();
                                    break;
                                }
                            }
                        } else {
                            // TODO: bad
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }

        })
    }

    user_name: string = JSON.parse(localStorage.getItem("userData")!).full_name;
    news_list = [
        {
            title: "C Lang is the best!",
            content: "Today is a beautiful day! Let’s get some appreciation to this gorgeous language! C Lang has been with us for more than 30 years already."
        }
    ];

    formVisibility: boolean = false;
    addForm = this.fb.group({
        titleControl: ['', [Validators.required, Validators.pattern("^(?!.*<[^>]+>).*")]],
        contentControl: ['', [Validators.required]],
        user_email: ['']
    })

    goToUserPage() {
        this.router.navigate(['/user'])
    }

    goToFriendsPage() {
        this.router.navigate(['/friends'])
    }

    openForm() {
        this.formVisibility = true;
    }

    closeForm() {
        this.formVisibility = false;
    }

    onFormSubmit() {
        console.warn(this.addForm.value);
        let user_email = JSON.parse(localStorage.getItem("userData")!).email;
        this.addForm.value.user_email = user_email;

        axios.post('https://localhost:3200/api/add_news', {
            titleControl: this.addForm.value.titleControl,
            contentControl: this.addForm.value.contentControl,
            user_email: this.addForm.value.user_email
        })
            .then((response) => {
                console.log(response);

                if (response.status === 200) {
                    this.socketService.emit('news_added', {
                        user_email: user_email
                    })

                    this.closeForm();
                } else {
                    // TODO: wrong email situation handler
                }


            })
            .catch((err) => {
                console.log(err);
            })
    }

    logOut() {
        this.authService.logout();
        this.router.navigate(['/home'])
    }

    private getNewsList() {
        axios.post('https://localhost:3200/api/get_news', {
            user_email: JSON.parse(localStorage.getItem("userData")!).email
        })
            .then((response) => {
                console.log(response);

                if (response.status === 200) {
                    this.news_list = response.data.news;
                } else {
                    // TODO: bad
                }


            })
            .catch((err) => {
                console.log(err);
            })
    }

    isAdmin() {
        return JSON.parse(localStorage.getItem("userData")!).role === 1;
    }

    openAdminPage() {
        window.open('https://localhost:3000/', "_blank");
    }

    goToHomePage() {
        this.router.navigate(["/home"]);
    }
}
