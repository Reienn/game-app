import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  gameId;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  setSocket() {
    this.socket = socketIo('http://localhost:3000');
  }

  setGroupSocket() {
    this.gameId = this.route.snapshot.root.children[0].params.id;
    this.socket = socketIo('http://localhost:3000/' + this.gameId);
  }

  getGameList() {
    return new Observable<Array<{any}>>(observer => {
      this.socket.on('game-list', gameList => {
        observer.next(gameList);
      });
    });
  }

  newGamePlay() {
    this.socket.emit('new-game-play', 'add');
  }

  joinNew() {
    return new Observable<any>(observer => {
      this.socket.on('join-new', newGameId => {
        observer.next(newGameId);
      });
    });
  }

  getPlayers() {
    return new Observable<any>(observer => {
      this.socket.on('players', players => {
        observer.next(players);
      });
    });
  }

  getAnswer() {
    return new Observable<any>(observer => {
      this.socket.on('answer', answerData => {
        observer.next(answerData);
      });
    });
  }

  getWin() {
    return new Observable<any>(observer => {
      this.socket.on('win', win => {
        observer.next(win);
      });
    });
  }

  updatePlayers(playersUpdate) {
    this.socket.emit('players', playersUpdate);
  }

  getCards() {
    return new Observable<Array<{}>>(observer => {
      this.socket.on('cards', cards => {
        observer.next(cards);
        console.log('cards');
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
