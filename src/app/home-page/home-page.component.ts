import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import axios from "axios";
import * as bcrypt from 'bcryptjs';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

    constructor(private fb: FormBuilder, private authService : AuthService, private router : Router) {}

    ngOnInit(): void {
    }

    file_name: string = "No file chosen";
    is_log_in_form_open: boolean = false;
    is_sign_up_form_open: boolean = false;

    logInForm = this.fb.group({
        emailControl: ['', [Validators.required, Validators.email]],

        // Minimum eight characters, max - 32, at least one lowercase and uppercase letter and one number
        passwordControl: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$")]]

    })

    signUpForm = this.fb.group({
        emailControl: ['', [Validators.required, Validators.email]],

        // Minimum eight characters, max - 32, at least one lowercase and uppercase letter and one number
        passwordControl: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$")]],

        // No html tags allowed
        fullNameControl: ['', [Validators.required, Validators.pattern("^(?!.*<[^>]+>).*")]],

        dateOfBirthControl: ['', [Validators.required]],

        avatarControl: ['', [Validators.required]],
        avatarSource: ['', [Validators.required]],
        userId: ['']
    })

    onFileSet(event: any) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.signUpForm.patchValue({
                avatarSource: file
            })

            this.file_name = file.name;

        } else {
            this.file_name = "No file chosen";
        }
    }

    openLogInForm() {
        this.is_log_in_form_open = true;
        this.closeSignUpForm();
    }

    closeLogInForm() {
        this.is_log_in_form_open = false;
        this.logInForm.reset();
    }

    openSignUpForm() {
        this.is_sign_up_form_open = true;
        this.closeLogInForm();
    }

    closeSignUpForm() {
        this.is_sign_up_form_open = false;
        this.signUpForm.reset();
    }

    // TODO - send to Backend
    onLogInSubmit() {
        this.authService.login(this.logInForm.value.emailControl!, this.logInForm.value.passwordControl!).subscribe( result => {
            if (!result){
                console.log("Email or password are incorrect.")
                // TODO: notify user that login failed
            } else {
                this.router.navigate(['/news'])
            }

        })
    }

    onSignUpSubmit() {

        let salt = bcrypt.genSaltSync(10);

        let password = bcrypt.hashSync(this.signUpForm.value.passwordControl!, salt);


        axios.post('https://localhost:3200/api/register_user', {
            emailControl: this.signUpForm.value.emailControl,
            passwordControl: password,
            fullNameControl: this.signUpForm.value.fullNameControl,
            dateOfBirthControl: this.signUpForm.value.dateOfBirthControl,
        })
            .then((response) => {
                console.log(response);

                this.signUpForm.value.userId = response.data.user_id;

                axios.post('https://localhost:3000/inner_api/change_user_avatar', this.signUpForm.value, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then((response) => {
                        let user_data: any = {
                            avatar_img_name: response.data.img_name,
                            email: this.signUpForm.value.emailControl,
                            full_name: this.signUpForm.value.fullNameControl,
                            date_of_birth: this.signUpForm.value.dateOfBirthControl,
                            role: 0
                        };

                        localStorage.setItem("userData", JSON.stringify(user_data))

                        localStorage.setItem("isUserLoggedIn", 'true')

                        this.router.navigate(['/news'])
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })


    }

    isLoggedIn() {
        return localStorage.getItem("isUserLoggedIn") === 'true';
    }

    goToUserPage() {
        this.router.navigate(['/user'])
    }

    logOut() {
        this.authService.logout();
        this.router.navigate(['/home'])
    }

    getUserName() {
        return JSON.parse(localStorage.getItem("userData")!).full_name;
    }

    isAdmin() {
        return JSON.parse(localStorage.getItem("userData")!).role === 1;
    }

    openAdminPage() {
        window.open('https://localhost:3000/', "_blank");
    }

    openFriendsPage() {
        this.router.navigate(['/friends'])
    }
}
