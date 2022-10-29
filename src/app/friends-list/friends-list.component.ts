import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
// import { Socket } from 'ngx-socket-io';
import axios from "axios";
import { SocketioService } from "../socketio.service";

@Component({
    selector: 'app-friends-list',
    templateUrl: './friends-list.component.html',
    styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {

    constructor(private fb: FormBuilder, private router: Router, private authService : AuthService,
                private socketService: SocketioService) {
    }

    ngOnInit(): void {
        this.getFriendsList();
        this.socketService.setupSocketConnection();
        this.socketService.setupEventListener('friend_added', (data:any) => {
            let user_email = JSON.parse(localStorage.getItem("userData")!).email;
            if (data.user_email === user_email || data.friend_email === user_email) {
                console.log("Updating user friends list");
                this.getFriendsList();
            }
        })
    }

    ngOnDestroy() {
        this.socketService.disconnect();
    }

    // TODO - This data must come from authorization data in browser
    user_name: string = JSON.parse(localStorage.getItem("userData")!).full_name;

    formVisibility: boolean = false;
    addForm = this.fb.group({
        // TODO - may be check for user existence
        emailControl: ['', [Validators.required, Validators.email]],
        user_email: ['']
    })

    friends_list = [
        {
            user_id: 0,
            avatar_img_name: "TylerNix.jpg",
            full_name: "Tyler Nix",
            date_of_birth: "1989-09-23",
            email: "tyler@nix.old",
            role: "Admin",
        }
    ];

    getFriendsList() {
        axios.post('https://localhost:3200/api/get_friends', {
            user_email: JSON.parse(localStorage.getItem("userData")!).email
        })
            .then((response) => {
                console.log(response);

                if (response.status === 200) {
                    this.friends_list = response.data.friends;
                } else {
                    // TODO: bad
                }


            })
            .catch((err) => {
                console.log(err);
            })
    }

    goToUserPage() {
        this.router.navigate(['/user'])
    }

    goToNewsPage() {
        this.router.navigate(['/news'])
    }

    openForm() {
        this.formVisibility = true;
    }

    closeForm() {
        this.formVisibility = false;
        this.addForm.reset();
    }

    onFormSubmit() {
        let user_email = JSON.parse(localStorage.getItem("userData")!).email;
        this.addForm.value.user_email = user_email;

        axios.post('https://localhost:3200/api/add_friend', {
            emailControl: this.addForm.value.emailControl,
            user_email: this.addForm.value.user_email
        })
            .then((response) => {
                console.log(response);

                if (response.status === 200) {
                    this.socketService.emit('friend_added', {
                        user_email: user_email,
                        friend_email: this.addForm.value.emailControl
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


    check() {
        return this.friends_list.length !== 0
    }

    removeFriend(email: string) {
        axios.post('https://localhost:3200/api/remove_friend', {
            user_email: JSON.parse(localStorage.getItem("userData")!).email,
            friend_email: email
        })
            .then((response) => {
                console.log(response);

                if (response.status === 200) {
                    this.getFriendsList();
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
