import React, { PureComponent, useState } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Fab, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    rootUrl: {
      color: 'grey',
    },
    fab: {
        background: '#00ab9e',
    }
  });

class Add extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      fieldsValid: false,
      labelHelper: null,
      shortUrl: null,
      shortUrlGenerated: null,
      shortUrlHelper: null,
      urlError: null,
    };
    this.isMac = navigator.appVersion.indexOf("Mac") !== -1;
    this.shortUrlCount = 0;
    this.shortUrlMax = 10;

    this.ADD_LINK = gql`
      mutation AddLink($label: String!, $url: String!) {
        addLink(label: $label, originalUrl: $url) {
          id
          label
          originalUrl
        }
      }
    `;
  }

  componentWillMount = () => {
    console.log('Add will mount');
  }

  componentDidMount = () => {
    console.log('Add mounted');
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('Add will receive props', nextProps);
  }

  componentWillUpdate = (nextProps, nextState) => {
    console.log('Add will update', nextProps, nextState);
  }

  componentDidUpdate = () => {
    //   const isValid = !this.state.labelHelper && !this.state.urlError
  }

  componentWillUnmount = () => {
    console.log('Add will unmount');
  }

  generateLink = (evt) => {
      
    if(evt.target.value.length < 8) {
        this.setState({ urlError: 'URL too short.'});
        return;
    }
      
    if(!evt.target.value.match(new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi))) {
        this.setState({ urlError: 'Must be a valid URL.'});
        return;
    }
    this.setState({ urlError: null });
  
    fetch('http://localhost:3000/shortener/generate')
    .then((response) => {
        return response.text();
    }).then((data) => {
      this.setState({
          shortUrlGenerated: data,
          shortUrlHelper: '(This can be customized if desired.)'
        });
    });
  
  }

  measureLabel = (evt) => {
    
    this.setState({ 
        labelHelper:
            evt.target.value.length === 0 ? 
            'Required' :
            null
    });

  };

  measureShortUrl = (evt) => {
    
    this.shortUrlCount = evt.target.value.length;

    this.setState({ 
        shortUrlHelper:
            this.shortUrlCount === 0 ? null :
            `${this.shortUrlCount} / ${this.shortUrlMax}`
    });

  };

  render () {
    // const [addLink, { data }] = useMutation(this.ADD_LINK);
    const { classes } = this.props;
    const { labelHelper, shortUrlGenerated, shortUrl, shortUrlHelper, urlError } = this.state;

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <TableContainer component={Paper}>
      <Table size="medium" aria-label="form to add link">
          <TableBody>
          <TableRow key="Add">
              <TableCell>
                  <TextField 
                    id="add-label" 
                    aria-label="field to input label" 
                    label="Label" 
                    error={labelHelper !== null}
                    helperText={labelHelper} 
                    onChange={(e) => this.measureLabel(e)} 
                  />
              </TableCell>
              <TableCell>
                  <Tooltip title={`${this.isMac ? '⌘' : 'Ctrl'} - V`} arrow disableHoverListener disableTouchListener>
                    <TextField 
                        id="add-url" 
                        label="URL"
                        error={urlError !== null}
                        helperText={urlError} 
                        onChange={(e) => this.generateLink(e)}
                    />
                </Tooltip>
              </TableCell>
              <TableCell>
                <TextField 
                        id="short-url" 
                        label="Short URL"
                        value={shortUrl}
                        placeholder={shortUrlGenerated}
                        error={this.shortUrlCount > this.shortUrlMax}
                        helperText={shortUrlHelper}
                        onChange={(e) => this.measureShortUrl(e)}
                        InputProps={{ startAdornment: <span className={classes.rootUrl}>elab.works/</span> }}
                    />

                    <Fab 
                        size="small" 
                        color="secondary" 
                        aria-label="add"
                        className={classes.fab}
                        onClick={e => {
                            e.preventDefault();
                            //  addLink({
                            //    variables: { label: `${Math.random()}`, url: `http://${Math.random()}` },
                            //  });
                    }}>
                        <AddIcon />
                    </Fab>
              </TableCell>
          </TableRow>
          </TableBody>
      </Table>
      </TableContainer>
    );
  }
}

Add.propTypes = {
  classes: PropTypes.object.isRequired,
};

Add.defaultProps = {
  // bla: 'test',
};

export default withStyles(styles)(Add);
