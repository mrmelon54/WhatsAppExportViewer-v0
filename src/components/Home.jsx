import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import envPaths from 'env-paths';
import makeDir from 'make-dir';
import fs from 'fs';
import path from 'path';
import { ipcRenderer } from 'electron';

import Header from './Header';
import ChatSection from './ChatSection';
import SettingsDialog from './SettingsDialog';
import { dialog } from 'electron';

const appPaths = envPaths('WhatsAppExportViewer');

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const styles = (theme) => ({
  root: {
    display: 'flex',
    height:'100vh',
    flexDirection: 'column',
    background: '#121212',
    color: 'white',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    display:'flex',
    flexDirection: 'column',
    height:'100vh',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    height:'100%',
    flexGrow:'0',
    overflow:'hidden',
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.childRefs = {
      settingsDialog:null,
      chatSection:null
    }
    this.state = {
      config:this.defaultConfig(),
    }
    ipcRenderer.on('FILE_OPEN', (event, args) => {
      console.log('got FILE_OPEN', event, args)
      if(this.childRefs.chatSection!=null) this.childRefs.chatSection.openFile(args)
    })
  }

  openAbout() {
    ipcRenderer.send('OPEN_ABOUT');
  }

  openSettingsDialog() {
    if(this.childRefs.settingsDialog!=null) {
      this.childRefs.settingsDialog.loadConfig(this.state.config);
      this.childRefs.settingsDialog.showDialog();
    }
  }

  saveConfig(v) {
    makeDir.sync(appPaths.config);
    console.log('saving to: '+this.getConfigFile());
    fs.writeFile(this.getConfigFile(), JSON.stringify(v), (err)=>{});
    this.setState({config:Object.assign(this.defaultConfig(),v)},()=>{
      this.updateChildConfig(v);
    });
  }

  updateChildConfig(v) {
    let o=Object.keys(this.childRefs);
    for(let i=0;i<o.length;i++) {
      try {
        this.childRefs[o[i]].loadConfig(v);
      } catch(e) {
        console.log(e);
      }
    }
  }

  loadConfig() {
    console.log('Loading config');
    fs.readFile(this.getConfigFile(), (error, data) => {
      if (error) {
        this.setState({config:this.defaultConfig()});
      } else {
        var j;
        try {
          j=JSON.parse(data);
        } catch(e) {
          j=this.defaultConfig();
        }
        let config=Object.assign(this.defaultConfig(),j);
        this.setState({config});
        this.updateChildConfig(config);
      }
    });
  }

  getConfigFile() {
    return path.join(appPaths.config,'config.json');
  }

  defaultConfig() {
    return {
      firstName: "",
    };
  }
  
  componentDidMount() {
    this.loadConfig();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Header openSettings={()=>this.openSettingsDialog()} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <ChatSection onRef={ref => (this.childRefs.chatSection = ref)} />
            </Container>
          </main>
          <SettingsDialog onRef={ref => (this.childRefs.settingsDialog = ref)} saveConfig={v=>this.saveConfig(v)} loadConfig={()=>this.loadConfig()} openAbout={()=>this.openAbout()} />
        </ThemeProvider>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home);