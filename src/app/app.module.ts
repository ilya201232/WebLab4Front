import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NoAccessPageComponent } from './no-access-page/no-access-page.component';
import { SocketioService } from "./socketio.service";

// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

/*const config: SocketIoConfig = {
    url: "https://localhost:3200/", // socket server url;
    options: {}
}*/

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        // SocketIoModule.forRoot(config),
    ],
    providers: [SocketioService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
