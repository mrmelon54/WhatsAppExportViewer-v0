import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const styles = {};

class SettingsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      open: false,
      config:{},
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  showDialog() {
    this.setState({open:true});
  }

  hideDialog() {
    this.setState({open:false});
  }

  saveConfig() {
    this.props.saveConfig(this.state.config);
    this.hideDialog();
  }

  loadConfig(config) {
    console.log(config);
    this.setState({config});
  }

  handleChange(event) {
    let config = {};
    config[event.target.name]=event.target.value;
    this.setState({config});
  }

  getConfigValue(key) {
    return this.state.config[key];
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={()=>this.hideDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">The name below it used to detect which user shows on the right-hand side.</DialogContentText>
          <TextField margin="dense" name="firstName" label="Name" type="text" value={this.getConfigValue("firstName")} onChange={e=>this.handleChange(e)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.hideDialog()} color="primary">Cancel</Button>
          <Button onClick={()=>this.saveConfig()} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(SettingsDialog);