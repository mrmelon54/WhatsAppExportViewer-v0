import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';

import ChatData from '../api/ChatData';
import ChatBubbleList from './ChatBubbleList';
import ErrorDialog from './ErrorDialog';
import readLinesN2M from '../utils/ReadLinesN2M';
import countLines from '../utils/CountLines';


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
      totalLinesInFile:0,
      totalLinesInRam:10000,
      lineOffset:1,
      filepath:''
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
    let $t=this;
    /* Output for error case
     *
     * this.setState({
     *   page:'chat',
     * });
     * if(this.dialog!=null) this.dialog.showDialog("Error","Failed to read file");
     */
    countLines(filepath,(totalLinesInFile)=>{
      $t.setState({
        filepath,
        totalLinesInFile,
        chatPage:1,
        lineOffset:1
      });
      $t.loadSectionOfFile(1);
    });
  }

  loadSectionOfFile(lineOffset) {
    let $t=this;
    let lines = "";
    let offset = (lineOffset-1)*$t.state.totalLinesInRam
    readLinesN2M($t.state.filepath,offset,offset+$t.state.totalLinesInRam,(line)=>{
      lines+=line+"\n";
    },()=>{
      $t.setState({
        lineOffset,
        page:'chat',
        chatPage:1,
        chatData:ChatData.loadFile(lines)
      },()=>{
        $t.updateChatBubbleList($t);
      })
    })
  }

  handlePageChange(e,value) {
    let $t=this;
    this.setState({chatPage:value},()=>{
      $t.updateChatBubbleList($t);
    });
  }

  handleSectionChange(e,value) {
    this.loadSectionOfFile(value);
  }

  updateChatBubbleList($t) {
    if($t.chatBubbleListRef!=null) $t.chatBubbleListRef.updateState($t.getChatPage(),$t.state.config);
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
                    <ChatBubbleList onRef={(ref)=>{this.chatBubbleListRef=ref}} config={this.state.config} />
                  </Grid>
                </Grid>
              )
            )
          )
        }
        {
          (this.state.chatData!=null&&this.state.chatPage!=null&&Math.ceil(this.state.chatData.messages.length/this.state.messagesPerPage)>1)?(
            <div className={classes.pageNumWrapper}>
              {`Page (per ${this.state.messagesPerPage} message): `}
              <Pagination color="primary" count={Math.ceil(this.state.chatData.messages.length/this.state.messagesPerPage)} page={this.state.chatPage} onChange={(e,v)=>this.handlePageChange(e,v)} />
            </div>
          ):(
            <div />
          )
        }
        {
          (this.state.totalLinesInFile>this.state.totalLinesInRam)?(
            <div className={classes.pageNumWrapper}>
              {`Section (per ${this.state.totalLinesInRam} lines from the export): `}
              <Pagination color="primary" count={Math.ceil(this.state.totalLinesInFile/this.state.totalLinesInRam)} page={this.state.lineOffset} onChange={(e,v)=>this.handleSectionChange(e,v)} />
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