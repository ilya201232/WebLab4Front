import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../auth.service";
import axios from "axios";

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.user_data = JSON.parse(localStorage.getItem("userData")!);
        console.log(this.user_data);
    }

    user_data = JSON.parse(localStorage.getItem("userData")!);
    user_avatar = this.user_data.avatar_img_name;

    user_name: string = this.user_data.full_name;
    file_name: string = "No file chosen";
    user_full_name: string = this.user_data.full_name;
    user_date_of_birth: string = this.user_data.date_of_birth;
    user_email: string = this.user_data.email;

    editUserForm = this.fb.group({

        emailControl: [this.user_email],
        // No html tags allowed
        fullNameControl: [this.user_full_name, [Validators.required, Validators.pattern("^(?!.*<[^>]+>).*")]],

        dateOfBirthControl: [this.user_date_of_birth, [Validators.required]],

        avatarControl: [''],
        avatarSource: [''],

        userId: ['']
    })

    onFileSet(event: any) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.editUserForm.patchValue({
                avatarSource: file
            })

            this.file_name = file.name;

        } else {
            this.file_name = "No file chosen";
        }
    }

    onSubmit() {
        axios.post('https://localhost:3200/api/edit_user', {
            emailControl: this.editUserForm.value.emailControl,
            fullNameControl: this.editUserForm.value.fullNameControl,
            dateOfBirthControl: this.editUserForm.value.dateOfBirthControl,
        })
            .then((response) => {
                console.log(response);

                this.editUserForm.value.userId = response.data.user_id;

                if (this.editUserForm.value.avatarControl !== '') {
                    axios.post('https://localhost:3000/inner_api/change_user_avatar', this.editUserForm.value, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then((response) => {
                            this.user_data.avatar_img_name = response.data.img_name;
                            this.user_data.full_name = this.editUserForm.value.fullNameControl;
                            this.user_data.date_of_birth = this.editUserForm.value.dateOfBirthControl;

                            localStorage.setItem("userData", JSON.stringify(this.user_data))

                            this.returnToNewsPage();
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                } else {
                    this.user_data.full_name = this.editUserForm.value.fullNameControl;
                    this.user_data.date_of_birth = this.editUserForm.value.dateOfBirthControl;
                    localStorage.setItem("userData", JSON.stringify(this.user_data))

                    this.returnToNewsPage();
                }


            })
            .catch((err) => {
                console.log(err);
            })
    }

    returnToNewsPage() {
        this.router.navigate(['/news']);
    }

    logOut() {
        this.authService.logout();
        this.router.navigate(['/home'])
    }

    removeAvatar() {
        axios.post('https://localhost:3000/inner_api/remove_user_avatar', {
            email: this.user_data.email,
        })
            .then((response) => {

                this.user_data.avatar_img_name = 'default.png';

                localStorage.setItem("userData", JSON.stringify(this.user_data))
                window.location.reload();

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
