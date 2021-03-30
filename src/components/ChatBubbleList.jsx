import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ChatBubble from './ChatBubble';
import ChatMessageSides from '../api/ChatMessageSides';

const styles = {
  messageArea: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
};

class ChatBubbleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatPage: [],
      config: props.config,
    };
    props.onRef(this);
  }

  updateState(chatPage,config) {
    this.setState({chatPage,config});
  }
  
  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollTop = 0;
  }

  render() {
    const { classes } = this.props;
    return (
      <List className={classes.messageArea}>
        {
          this.state.chatPage.map((x,i)=>{
            let isSelf=x.name==this.state.config.firstName;
            return <ChatBubble side={isSelf||x.side==ChatMessageSides.RIGHT?'right':(x.side==ChatMessageSides.MIDDLE?'middle':'left')} key={i} name={!isSelf?x.name:""} message={x.message} date={x.date} time={x.time} />
          })
        }
      </List>
    )
  }
}

export default withStyles(styles)(ChatBubbleList);
