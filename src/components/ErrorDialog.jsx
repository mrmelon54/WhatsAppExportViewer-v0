import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {};

class ErrorDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      open: false,
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  hideDialog() {
    this.setState({open:false});
  }

  showDialog(title = "", description = "") {
    this.setState({open:true,title,description});
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={()=>this.hideDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{this.state.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.hideDialog()} color="primary">Ok</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ErrorDialog);