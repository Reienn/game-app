import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  user: User;
  constructor() {
    this.user = new User;
    this.user.name = 'Ala';
  }

  ngOnInit() {
  }

  sendMessage() {
    console.log('send message method');
  }
}
