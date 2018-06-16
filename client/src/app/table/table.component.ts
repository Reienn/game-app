import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  click: boolean;
  cards;
  relativeX;
  relativeY;
  svgX;
  svgY;
  currentX;
  currentY;
  @ViewChild('tableElement') table;

  constructor(
    private socketService: SocketService
  ) {
    this.click = false;
  }

  ngOnInit() {
    this.socketService.getCards().subscribe(
      cards => {
        this.cards = cards;
      }
    );
  }

  startMove(ev) {
  ev.preventDefault();
    this.click = true;
    this.svgX = this.table.nativeElement.offsetLeft;
    this.svgY = this.table.nativeElement.offsetTop;
    this.relativeX = ev.pageX - ev.target.getAttribute('x') - this.svgX;
    this.relativeY = ev.pageY - ev.target.getAttribute('y') - this.svgY;
  }

  move(ev) {
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

  endMove(ev) {
    this.click = false;
  }

}
