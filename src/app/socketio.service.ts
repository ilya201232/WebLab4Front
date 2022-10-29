import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SocketioService {

    socket: any;

    constructor() {
    }

    setupSocketConnection() {
        this.socket = io(environment.SOCKET_ENDPOINT);
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    setupEventListener(event: string, listener: any) {
        this.socket.on(event, listener);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
