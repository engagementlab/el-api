import React, { PureComponent, useState } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';

import { Box, Fab, Snackbar, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Tooltip, ThemeProvider } from '@material-ui/core';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import MuiAlert from '@material-ui/lab/Alert';


const theme = createMuiTheme({
    typography: {
        fontFamily: 'LunchtypeRegular'
    }
});
const styles = theme => ({
    rootUrl: {
      color: 'grey',
    },
    fab: {
        background: '#00ab9e',
    },
    hidden: {
        display: 'none'
    }
  });

// QL mutation for adding links
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

// Alert for success/fail
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Add extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            errorHelper: '',
            isValid: false,
            labelEntered: false,
            labelHelper: null,
            labelInput: '',
            shortUrl: '',
            shortUrlError: false,
            shortUrlGenerated: '',
            shortUrlHelper: null,
            success: false,
            urlError: null,
            urlInput: '',
            urlFull: '',
        };
        
        this.isMac = navigator.appVersion.indexOf("Mac") !== -1;
        this.shortUrlCount = 0;
        this.shortUrlMax = 10;

    }

    componentDidUpdate = () => {

        // Check if all fields valid per update
        const s = this.state;
        const isValid =
            s.labelEntered &&
            !s.labelHelper &&
            !s.urlError &&
            !s.shortUrlError &&
            s.shortUrlGenerated !== null &&
            (s.urlInput.length >= 8) &&
            (this.shortUrlCount <= this.shortUrlMax);

        this.setState({
            isValid
        });

    }

    generateLink = (evt) => {

        this.setState({
            urlError: null,
            urlInput: evt.target.value,
        });

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

        fetch('http://localhost:3000/shortener/generate')
            .then((response) => {
                return response.text();
            }).then((data) => {
                this.setState({
                    shortUrlGenerated: data,
                    shortUrl: data,
                    shortUrlHelper: '(This can be customized if desired.)',
                    urlFull: `https://elab.works/${data}`
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
        
        this.setState({
            isValid: false,
            labelHelper: '',
            labelInput: '',
            success: true,
            shortUrl: '',
            shortUrlError: false,
            shortUrlGenerated: '',
            shortUrlHelper: '',
            urlError: null,
            urlInput: '',
        });

        // Tell app that data changed
        this.props.updated();

    }


    handleError = (err) => {
        
        let errorHelper = 'Something went wrong. :(';

        // Handle duplicate errors
        if(err.graphQLErrors && err.graphQLErrors[0].extensions.code === 11000) {
            switch(err.graphQLErrors[0].message) {
                case 'label':
                    errorHelper = 'A link with this label already exists.'; 
                    break;
                case 'url':
                    errorHelper = 'This link has already been shortened. Please locate it in link history.'; 
                    break;
                case 'shorturl':
                    errorHelper = 'This shortened URL is already in use.'; 
                    break;
                default:
                    break;
            }
        }

        this.setState({
            error: true,
            errorHelper
        });

    };

    snackbarClose = (event, reason) => {

        this.setState({
            error: false,
            success: false,
        });

    };

  render () {
    const { classes } = this.props;
    const {
        error,
        errorHelper,
        isValid,
        labelHelper,
        labelInput,
        shortUrlGenerated,
        shortUrl,
        shortUrlHelper,
        success,
        shortUrlError,
        urlError,
        urlInput,
        urlFull
    } = this.state;

    return (
        <ThemeProvider theme={theme}>
            <Mutation mutation={ADD_LINK} errorPolicy="all" onCompleted={this.linkAdded} onError={this.handleError}>
                {(addLink, { data, mutationErr }) => (

                <Box>
                    <TableContainer component={Paper}>
                        <Table size="medium" aria-label="form to add link">
                            <TableBody>
                                <TableRow key="Add">
                                    <TableCell>
                                        <TextField id="add-label" aria-label="field to input label" label="Label"
                                            value={labelInput} error={labelHelper !==null} helperText={labelHelper}
                                            onChange={(e)=> this.measureLabel(e)}
                                            />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={`${this.isMac ? '⌘' : 'Ctrl' } - V`} arrow
                                            disableHoverListener disableTouchListener>
                                            <TextField id="add-url" label="URL" value={urlInput} error={urlError
                                                !==null} helperText={urlError} onChange={(e)=> this.generateLink(e)}
                                                />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <TextField id="short-url" label="Short URL" value={shortUrl}
                                            placeholder={shortUrlGenerated} error={this.shortUrlCount>
                                            this.shortUrlMax || shortUrlError}
                                            helperText={shortUrlHelper}
                                            onChange={(e) => this.measureShortUrl(e)}
                                            InputProps={{ 
                                                startAdornment: <span id="url-prefix" className={classes.rootUrl}>elab.works/</span>,
                                                endAdornment: <input id="url-full" readOnly={true} className={classes.hidden} value={urlFull} />
                                            }}
                                            />
                                            <Zoom in={isValid}>
                                                <Fab id="btn-add" size="small" color="secondary" aria-label="add"
                                                    data-clipboard-target="#url-full" className={classes.fab}
                                                    onClick={e=> {
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
                            {errorHelper}
                        </Alert>
                    </Snackbar>
                    <Snackbar open={success} autoHideDuration={4500} onClose={this.snackbarClose}>
                        <Alert severity="success">
                            Link added!
                        </Alert>
                    </Snackbar>
                </Box>
                )}
            </Mutation>
        </ThemeProvider>
    );
  }
}

Add.propTypes = {
  classes: PropTypes.object.isRequired,
  updated: PropTypes.func.isRequired,
};

Add.defaultProps = {
  // bla: 'test',
};

export default withStyles(styles)(Add);
