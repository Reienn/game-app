import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor(private route: ActivatedRoute) {
    this.socket = socketIo('http://localhost:3000/' + this.route.snapshot.root.children[0].params.id);
  }
/*
  newGamePlay() {
    this.socket.emit('newGamePlay');
  }
  */

  getCards() {
    return new Observable<Array<{}>>(observer => {
      this.socket.on('cards', cards => {
        observer.next(cards);
      });
    });
  }

  updateCards(updated) {
    this.socket.emit('cards', updated);
  }

  getChat() {
    return new Observable<Array<{}>>(observer => {
      this.socket.on('chat', chat => {
        observer.next(chat);
      });
    });
  }

  sendMessage(user, message) {
    this.socket.emit('chat', {user: user, message: message});
  }

  getTyping() {
    return new Observable<any>(observer => {
      this.socket.on('typing', user => {
        observer.next(user);
      });
      this.socket.on('not-typing', user => {
        observer.next(user);
      });
    });
  }

  typing(user) {
    this.socket.emit('typing', user);
  }

  notTyping(user) {
    this.socket.emit('not-typing', user);
  }

}
