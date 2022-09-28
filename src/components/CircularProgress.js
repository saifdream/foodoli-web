import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: 'relative',
    textAlign: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    position: 'absolute',
  },
  top: {
    color: '#388f48',
    animationDuration: '550ms',
    position: 'absolute',
    //left: 0,
    textAlign: 'center'
  },
  circle: {
    strokeLinecap: 'round',
  },
  loading: {
    marginTop: 55,
    marginLeft: 35
  }
}));

function FoodoliCircularProgress(props) {
  const classes = useStylesFacebook();
  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
      <Typography variant={'h4'} className={classes.loading}>Loading ...</Typography>
    </div>
  );
}

export default FoodoliCircularProgress;
