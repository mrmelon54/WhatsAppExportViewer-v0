import {LEFT} from './ChatMessageSides';

export default class ChatMessage {
  constructor(name,message,date,time,side=LEFT) {
    this.name = name;
    this.message = message;
    this.date = date;
    this.time = time;
    this.side = side;
    this.timestamp = new Date(`${date}, ${time}`);
  }
}