import { useEffect, useRef, useState } from 'react';
import script from './python/script.py';
import { Button, Container, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core'
import './App.css';
import { textdata } from './data.js';
import * as localForage from 'localforage';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme) => ({
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  root: {
    flexGrow: 1,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    maxWidth: 360,
    overflow: 'auto',
    maxHeight: 800,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  text:{
    flexGrow: 1,
    margin: theme.spacing(4, 4, 2),
    padding: 10
  }
}));

export const Custom = ({ textVal, setTextVal, runEffect }) => {
  const classes = useStyles();
  const [temtText, setTempText] = useState()
  const refresh = (e) => {
    e.preventDefault()
    window.location.reload()
  } 
  useEffect(() => {
    localForage.getItem('sometext').then(function(value) {
      // This code runs once the value has been loaded
      // from the offline store.
      if(value===null){
        localForage.setItem('sometext', textdata[0].toString()).then(function (value) {
          setTextVal(value)
          setTempText(value)
              console.log(value);
          }).catch(function(err) {
              // This code runs if there were any errors
              console.log(err);
          });
      }
      else {
        localForage.getItem('sometext').then(function (value) {
          setTextVal(value)
          setTempText(value)
            console.log(value);
          }).catch(function(err) {
              // This code runs if there were any errors
              console.log(err);
          });
      }
  }).catch(function(err) {
      // This code runs if there were any errors
      console.log(err);
  });
  },[])

  const HandleText = (e) => {
    setTempText(e.target.value)
    localForage.setItem('sometext', e.target.value).then(function (value) {
      setTextVal(value)
          console.log(value);
      }).catch(function(err) {
          // This code runs if there were any errors
          console.log(err);
      });
  } 
  return(
    <div className={classes.text}>
    <Typography style={{fontWeight:700}} variant="h6" className={classes.title}>
            Text to Pyodide
        </Typography>
      <TextField
          id="outlined-multiline-static"
          label="Enter Text"
          multiline
          rows={8}
          fullWidth
          value={temtText || ""}
          variant="outlined"
          onChange={(e) => {HandleText(e)}}
        />
        <Button 
        variant="contained" 
        color="secondary"
        onClick={runEffect}
        >
        Process
        </Button>
        <IconButton 
        variant="contained" 
        color="primary"

        onClick={(e) => refresh(e)}
        >
        <RefreshIcon />
        </IconButton>
        </div>
  )
} 

function App() {
  const classes = useStyles();
  const mounted = useRef(false);
  const [output, setOutput] = useState([]);
  const [textVal, setTextVal] = useState()
  const [processing, setProcessing] = useState(false)

  // const runScript = code => {
  //   window.pyodide.loadPackage([]).then(() => {
  //     const output = window.pyodide.runPython(code);
  //     setOutput(output);
  //   })
  // }

  const loadModule = async script => {
    const code = await fetch(script).then(src => src.text());
    return code;
  }

  
  const runEffect = async () => {
      setProcessing(true)
      const trainCode = await loadModule(script);
      window.languagePluginLoader
        .then(() => {
          if (mounted.current === false){
            mounted.current = true;
            return window.pyodide.loadPackage(['micropip']);
          }
        })
        .then(() => {
          const py = window.pyodide;
            const output = py.runPython(trainCode);
            output.then((res) => {
              if(res){
                setProcessing(false)
              }
              setOutput(res);
            })
            window.data = {
              textdata: textVal
            };
        })
  }
  

  return (
    <Paper>
    <div className={classes.root}>
    <Grid container spacing={3}>
    <Custom 
    textVal={textVal}
    setTextVal={setTextVal}
    runEffect={runEffect}
    />
      <Grid item xs={2} />
        <Grid item xs>
          <Typography style={{fontWeight:700}} variant="h6" className={classes.title}>
            Results from python scripts:
          </Typography>
          <div className={classes.demo}>
          {(output && processing === false) ? (
            <List className={classes.root} subheader={<li />}>
            {output.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${item}`} />
              </ListItem>
            ))}
            </List>
          ) : 
          <Typography style={{fontWeight:300}} variant="h6" className={classes.title}>
            Loading...
          </Typography>
          }
    </div>
    </Grid>
      </Grid>
      </div>
      </Paper>
  );
}

export default App;
