import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';

import fs from 'fs';

import ChatData from '../api/ChatData';
import ChatBubble from './ChatBubble';
import ErrorDialog from './ErrorDialog';
import ChatMessageSides from '../api/ChatMessageSides';


const styles = {
  root:{
    display:'flex',
    flexDirection:'column',
    flexGrow:1,
    overflowY:'hidden',
  },
  chatTemplateMiddle:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
  },
  chatSubHeaderMiddle:{
    color:'white',
    textAlign:'center',
  },
  chatSection: {
    display:'flex',
    flexDirection:'column',
    flexGrow:1,
    height:'100%',
    background: '#1D1D1D',
    overflowY:'hidden',
  },
  chatInner: {
    display:'flex',
    flexDirection:'column',
    height:'100%',
  },
  chatDropArea: {
    flexGrow:1,
    background: '#1D1D1D',
  },
  messageArea: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  pageNumWrapper: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
  },
  pageNumInner: {
    color:'white',
  },
};

class ChatSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page:'chat',
      chatData: null,
      chatPage:1,
      messagesPerPage:500,
      config:{
        firstName:"",
      },
    }
    this.dialog = null;
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  loadConfig(config) {
    this.setState({config});
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      page:'drag',
    });
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      page:'chat',
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      page:'loading',
    });
    if(e.dataTransfer.files.length==1) {
      this.loadFile(e.dataTransfer.files[0].path);
    } else if(e.dataTransfer.files.length>1) {
      this.setState({
        page:'chat',
      });
      if(this.dialog!=null) this.dialog.showDialog("Error","To many files dropped");
    } else {
      this.setState({
        page:'chat',
      });
      if(this.dialog!=null) this.dialog.showDialog("Error","Not enough files dropped");
    }
  }

  openFile(filepaths) {
    if(filepaths.length==1) {
      this.loadFile(filepaths[0]);
    } else if(filepaths.length>1) {
      this.setState({
        page:'chat',
      });
      if(this.dialog!=null) this.dialog.showDialog("Error","To many files dropped");
    } else {
      this.setState({
        page:'chat',
      });
      if(this.dialog!=null) this.dialog.showDialog("Error","Not enough files dropped");
    }
  }

  loadFile(filepath) {
    fs.readFile(filepath,{encoding:'utf8'},(err,data)=>{
      if(err) {
        this.setState({
          page:'chat',
        });
        if(this.dialog!=null) this.dialog.showDialog("Error","Failed to read file");
        return
      }
      this.setState({
        page:'chat',
        chatData:ChatData.loadFile(data),
      })
    })
  }

  handlePageChange(e,value) {
    this.setState({chatPage:value});
  }

  getChatPage() {
    // Chat page is 1-indexed
    let i=(this.state.chatPage-1)*this.state.messagesPerPage;
    return this.state.chatData.messages.slice(i,i+this.state.messagesPerPage);
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        onDrop={e=>this.handleDrop(e)}
        onDragOver={e=>this.handleDragOver(e)}
        onDragEnter={e=>this.handleDragEnter(e)}
        onDragLeave={e=>this.handleDragLeave(e)}
        className={classes.root}>
        {
          this.state.page=="loading"?(
            <Grid container className={classes.chatDropArea}>
              <Grid item xs={12} className={classes.chatTemplateMiddle}>
                <Typography variant="h6" className={classes.chatSubHeaderMiddle}>Loading...</Typography>
              </Grid>
            </Grid>
          ):(
            this.state.page=="drag"?(
              <Grid container className={classes.chatDropArea}>
                <Grid item xs={12} className={classes.chatTemplateMiddle}>
                  <Typography variant="h6" className={classes.chatSubHeaderMiddle}>Drop exported chat here</Typography>
                </Grid>
              </Grid>
            ):(
              this.state.chatData == null ?(
                <Grid container component={Paper} className={classes.chatDropArea}>
                  <Grid item xs={12} className={classes.chatTemplateMiddle}>
                    <Typography variant="h6" className={classes.chatSubHeaderMiddle}>No chat loaded</Typography>
                  </Grid>
                </Grid>
              ):(
                <Grid container component={Paper} className={classes.chatSection}>
                  <Grid item xs={12} className={classes.chatInner}>
                    <List className={classes.messageArea}>
                      {
                        this.getChatPage(this.state.chatData.messages).map((x,i)=>{
                          let isSelf=x.name==this.state.config.firstName;
                          return <ChatBubble side={isSelf||x.side==ChatMessageSides.RIGHT?'right':(x.side==ChatMessageSides.MIDDLE?'middle':'left')} key={i} name={!isSelf?x.name:""} message={x.message} time={x.time} />
                        })
                      }
                    </List>
                  </Grid>
                </Grid>
              )
            )
          )
        }
        {
          (this.state.chatData!=null&&this.state.chatPage!=null&&Math.ceil(this.state.chatData.messages.length/this.state.messagesPerPage)>1)?(
            <div className={classes.pageNumWrapper}>
              <Pagination color="primary" count={Math.ceil(this.state.chatData.messages.length/this.state.messagesPerPage)} page={this.state.chatPage} onChange={(e,v)=>this.handlePageChange(e,v)} />
            </div>
          ):(
            <div />
          )
        }
        <ErrorDialog onRef={ref => (this.dialog = ref)} />
      </div>
    );
  }
}

ChatSection.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ChatSection);