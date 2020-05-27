import React, { PureComponent, useState } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Mutation } from '@apollo/react-components';

import { Box, Fab, Snackbar, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import MuiAlert from '@material-ui/lab/Alert';

const styles = theme => ({
    rootUrl: {
      color: 'grey',
    },
    fab: {
        background: '#00ab9e',
    }
  });

const ADD_LINK = gql`
mutation AddLink($label: String!, $originalUrl: String!, $shortUrl: String!) {
  addLink(label: $label, originalUrl: $originalUrl, shortUrl: $shortUrl) {
    id
    originalUrl
    shortUrl
    label
  }
}
`;

function Alert(props) {
    return <MuiAlert elevation ={6} variant ="filled" {...props} />;
}


class Add extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            isValid: false,
            labelEntered: false,
            labelHelper: null,
            labelInput: '',
            shortUrl: '',
            shortUrlError: false,
            shortUrlGenerated: null,
            shortUrlHelper: null,
            success: false,
            urlError: null,
            urlInput: '',
        };
        this.isMac = navigator.appVersion.indexOf("Mac") !== -1;
        this.shortUrlCount = 0;
        this.shortUrlMax = 10;

    }

    componentDidUpdate = () => {

        // Check if all fields valid per update
        const isValid =
            this.state.labelEntered &&
            !this.state.labelHelper &&
            !this.state.urlError &&
            this.state.shortUrlGenerated &&
            !this.state.shortUrlError &&
            (this.shortUrlCount <= this.shortUrlMax);
            console.log(isValid)

        this.setState({
            isValid
        });

    }

    componentWillUnmount = () => {
        console.log('Add will unmount');
    }

    generateLink = (evt) => {

        if (evt.target.value.length < 8) {
            this.setState({
                urlError: 'URL too short.'
            });
            return;
        }

        if (!evt.target.value.match(new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm))) {
            this.setState({
                urlError: 'Must be a valid URL.'
            });
            return;
        }
        this.setState({
            urlError: null,
            urlInput: evt.target.value,
        });

        fetch('http://localhost:3000/shortener/generate')
            .then((response) => {
                return response.text();
            }).then((data) => {
                this.setState({
                    shortUrlGenerated: data,
                    shortUrl: data,
                    shortUrlHelper: '(This can be customized if desired.)'
                });
            });

    }

    measureLabel = (evt) => {

        this.setState({
            labelInput: evt.target.value,
            labelEntered: true,
            labelHelper: evt.target.value.length === 0 ?
                'Required' : null
        });

    };

    measureShortUrl = (evt) => {

        this.shortUrlCount = evt.target.value.length;
        this.setState({
            shortUrl: evt.target.value,
        });
    
        if(this.shortUrlCount === 0) {
            this.setState({
                shortUrlHelper: 'Required.',
                shortUrlError: true
            });
            return;
        }

        if (!evt.target.value.match(new RegExp(/^[a-z0-9]+$/gi))) {
            this.setState({
                shortUrlHelper: 'Alphanumeric only.',
                shortUrlError: true
            });
            return;
        }

        this.setState({
            shortUrlError: false,
            shortUrlHelper: this.shortUrlCount === 0 ? null : `${this.shortUrlCount} / ${this.shortUrlMax}`
        });

    };

    linkAdded = () => {

        // Copy short url submitted to clipboard
        // Create ranges for url prefix and short url elements
        const prefixRange = document.createRange();  
        const shortRange = document.createRange();  

        const hiddenInput = document.createElement('span');
        hiddenInput.innerText = `https://elab.works/${document.getElementById('short-url').innerText}`;
       
        shortRange.selectNodeContents(hiddenInput);

        // window.getSelection().addRange(prefixRange);
        window.getSelection().addRange(shortRange);

        const copied = document.execCommand('copy');
        console.log(window.getSelection())
        // window.getSelection().removeRange(prefixRange);
        // window.getSelection().removeRange(shortRange);

        this.setState({
            isValid: false,
            labelHelper: null,
            labelInput: '',
            success: true,
            shortUrl: '',
            shortUrlError: false,
            shortUrlGenerated: '',
            shortUrlHelper: null,
            urlError: null,
            urlInput: '',
        });

    }

    snackbarClose = (event, reason) => {

        this.setState({
            error: false,
            success: false,
        });

    };

  render () {
    const { classes } = this.props;
    const {
        isValid,
        labelHelper,
        labelInput,
        shortUrlGenerated,
        shortUrl,
        shortUrlHelper,
        success,
        shortUrlError,
        urlError,
        urlInput
    } = this.state;

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
        <Mutation mutation={ADD_LINK} onCompleted={this.linkAdded}>
            {(addLink, { data, error }) => (
            
                <Box>
                    <TableContainer component={Paper}>
                        <Table size="medium" aria-label="form to add link">
                            <TableBody>
                                <TableRow key="Add">
                                    <TableCell>
                                        <TextField 
                                            id="add-label" 
                                            aria-label="field to input label" 
                                            label="Label" 
                                            value={labelInput}
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
                                                value={urlInput}
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
                                                error={this.shortUrlCount > this.shortUrlMax || shortUrlError}
                                                helperText={shortUrlHelper}
                                                onChange={(e) => this.measureShortUrl(e)}
                                                InputProps={{ startAdornment: <span id="url-prefix" className={classes.rootUrl}>elab.works/</span> }}
                                            />
                                        <Zoom in={isValid}>
                                            <Fab 
                                                size="small" 
                                                color="secondary" 
                                                aria-label="add"
                                                className={classes.fab}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    addLink({
                                                        variables: { 
                                                            originalUrl: urlInput,
                                                            shortUrl,
                                                            label: labelInput, 
                                                        },
                                                    });
                                            }}>
                                                <AddIcon />
                                            </Fab>
                                        </Zoom>

                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                        
                    <Snackbar open={error} autoHideDuration={3000} onClose={this.snackbarClose}>
                        <Alert severity="error">
                            Sorry, something went wrong.
                        </Alert>
                    </Snackbar>    
                    <Snackbar open={success} autoHideDuration={4500} onClose={this.snackbarClose}>
                        <Alert severity="success">
                            Link added! Short URL copied to clipboard.
                        </Alert>
                    </Snackbar>
                </Box>
            )}
        </Mutation>
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
