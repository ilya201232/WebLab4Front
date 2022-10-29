import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from "./home-page/home-page.component";
import { UserPageComponent } from "./user-page/user-page.component";
import { NewsFeedComponent } from "./news-feed/news-feed.component";
import { FriendsListComponent } from "./friends-list/friends-list.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

import { ExpenseGuard } from "./expense.guard";
import { NoAccessPageComponent } from "./no-access-page/no-access-page.component";

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', title: 'Home page', component: HomePageComponent },
    { path: 'user', title: 'User\'s page', component: UserPageComponent, canActivate: [ExpenseGuard] },
    { path: 'news', title: 'News Feed', component: NewsFeedComponent, canActivate: [ExpenseGuard] },
    { path: 'friends', title: 'Friends List', component: FriendsListComponent, canActivate: [ExpenseGuard] },
    { path: 'no_access', title: 'You have no access', component: NoAccessPageComponent },
    { path: '**', title: 'Not Found', component: PageNotFoundComponent },
];

@NgModule({
    declarations: [
        HomePageComponent, UserPageComponent, NewsFeedComponent, FriendsListComponent, PageNotFoundComponent, NoAccessPageComponent,
    ],
    imports: [
        RouterModule.forRoot(routes),
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
