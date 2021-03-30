import ChatMessage from './ChatMessage';
import ChatMessageSides from './ChatMessageSides';

class ChatData {
  constructor(contactName = "", messages = []) {
    this.contactName = contactName;
    this.messages = messages;
  }
}

ChatData.loadFile = contents=>{
  const lines=contents.split('\n');
  const regexOne = /^(?<date>[0-9]{2}\/[0-9]{2}\/[0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2}), (?<time>[0-9]{1,2}\:[0-9]{2}|[0-9]{1,2}\:[0-9]{2} [ap]\.m\.) \- (?<data>.+)$/;
  const regexTwo = /^(?<name>.+?)\: (?<message>.+)$/;
  const str = contents;
  let lastDate = "";
  let m;
  
  let messages = [];
  
  for(let i=0;i<lines.length;i++) {
    let line=lines[i];
    let m = regexOne.exec(line);
    if(m===null) {
      if(messages.length>=1) {
        messages[messages.length-1].message+="<br>"+line;
      }
    } else {
      if(m.groups.date!=lastDate) {
        messages.push(new ChatMessage("", m.groups.date, m.groups.date, "", ChatMessageSides.MIDDLE));
        lastDate = m.groups.date;
      }
      let d = regexTwo.exec(m.groups.data);
      if (d === null) {
        messages.push(new ChatMessage("", m.groups.data, m.groups.date, m.groups.time, ChatMessageSides.MIDDLE));
      } else {
        messages.push(new ChatMessage(d.groups.name, d.groups.message, m.groups.date, m.groups.time, ChatMessageSides.LEFT));
      }
    }
  }
  return new ChatData("", messages);
};

export default ChatData;
