import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import SanitizedHTML from 'react-sanitized-html';

const styles = ()=>({
  bubble: {
    borderRadius:'15px',
    maxWidth:'70%',
    border: '0.5px solid black',
    borderRadius: '10px',
    margin: '5px',
    padding: '10px',
    display: 'inline-block',
  },
  leftBubble: {
    background:'#323232',
  },
  rightBubble: {
    background:'#0c4a0c',
  },
  middleBubble: {
    background:'#002255'
  },
  bubbleText: {
    color:'#E1E1E1',
  },
  leftWrapper: {
    justifyContent:'flex-start',
  },
  rightWrapper: {
    justifyContent:'flex-end',
  },
  middleWrapper: {
    justifyContent:'center',
  },
});

class ChatBubble extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <ListItem key={this.props.key} className={this.props.side=="right"?classes.rightWrapper:(this.props.side=="middle"?classes.middleWrapper:classes.leftWrapper)}>
        <div className={classes.bubble+" "+(this.props.side=="right"?classes.rightBubble:(this.props.side=="middle"?classes.middleBubble:classes.leftBubble))}>
          <Grid container>
            {this.props.name!=""?(
              <Grid item xs={12}>
                <ListItemText align={this.props.side} secondary={this.props.name} className={classes.bubbleText} classes={{secondary:classes.bubbleText}}></ListItemText>
              </Grid>
            ):(
              <div />
            )}
            <Grid item xs={12}>
              <ListItemText align={this.props.side} className={classes.bubbleText}>
                <SanitizedHTML
                  allowedAttributes={{ 'br': [] }}
                  allowedTags={['br']}
                  html={this.props.message} />
              </ListItemText>
            </Grid>
            <Grid item xs={12}>
              <ListItemText align={this.props.side} secondary={this.props.time} className={classes.bubbleText} classes={{secondary:classes.bubbleText}} title={this.props.date + ", " + this.props.time}></ListItemText>
            </Grid>
          </Grid>
        </div>
      </ListItem>
    );
  }
}

ChatBubble.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ChatBubble);