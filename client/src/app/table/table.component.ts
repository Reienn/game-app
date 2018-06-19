import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { SocketService } from '../services/socket.service';
import { User } from '../models/user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  click: boolean;
  isActivePlayer: boolean;
  user: User;
  cards;
  relativeX;
  relativeY;
  svgX;
  svgY;
  currentX;
  currentY;
  @ViewChild('tableElement') table;

  constructor(
    private authenticationService: AuthenticationService,
    private socketService: SocketService
  ) {
    this.user = new User;
  }

  ngOnInit() {
    this.user.name = '';
    this.click = false;
    this.isActivePlayer = false;
    this.cards = [];

    this.authenticationService.authUser().subscribe(
      user => {
        this.user.name = user.user.user.name;
      },
      err => {
        this.authenticationService.logout();
      }
    );

    this.socketService.getAnswer().subscribe(
      answerData => {
        console.log('table get');
        if (answerData.player === this.user.name) {
          this.isActivePlayer = true;
        }
      }
    );

    this.socketService.getCards().subscribe(
      cards => {
        this.cards = cards;
      }
    );

  }

  startMove(ev) {
    if (this.isActivePlayer) {
      ev.preventDefault();
      this.click = true;
      this.svgX = this.table.nativeElement.offsetLeft;
      this.svgY = this.table.nativeElement.offsetTop;
      this.relativeX = ev.pageX - ev.target.getAttribute('x') - this.svgX;
      this.relativeY = ev.pageY - ev.target.getAttribute('y') - this.svgY;
    }
  }

  move(ev) {
    if (this.isActivePlayer) {
      ev.preventDefault();
      if (this.click) {
        this.currentX = ev.pageX - this.relativeX - this.svgX;
        this.currentY = ev.pageY - this.relativeY - this.svgY;
        ev.target.setAttribute('x', this.currentX);
        ev.target.setAttribute('y', this.currentY);
        this.cards.forEach( card => {
          if (ev.target.getAttribute('id') === card.id) {
            card.x = this.currentX;
            card.y = this.currentY;
          }
        });
        this.socketService.updateCards(this.cards);
      }
    }
  }

  endMove(ev) {
    if (this.isActivePlayer) {
      this.click = false;
    }
  }

}
