import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';

import { FileCopyOutlined, Link, LaunchOutlined } from "@material-ui/icons";
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';

const GET_LINKS = gql`
    {
        getLinks        {
            id
            label
            shortUrl
            originalUrl
        }
    }
`;

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    shortLabel:  {
        color: 'grey',
        fontSize: 'x-small',
    },
    invisible: {
        display: 'inline-block',
        color: 'white',
        width: 0,
    }
});


function Alert(props) {
    return <MuiAlert icon={<Link fontSize="inherit" />} elevation={6} variant="filled" {...props} />;
}

export default function DenseTable() {
  const classes = useStyles();
  const [copied, setCopied] = React.useState(false);
  const { loading, error, data } = useQuery(GET_LINKS);

    /**
     * Copy URL to clipboard
     * @function
     * @param {Element} [el] - DOM element containing URL to copy to clipboard
     */
    const copyUrl = (el) => {

        // Create a range and set it to the contents of the reference element
        const range = document.createRange();  
        range.selectNodeContents(el);

        window.getSelection().addRange(range);
        
        const didCopy = document.execCommand('copy');
        window.getSelection().removeRange(range);

        setCopied(didCopy);

    }

    const snackbarClose = (event, reason) => {

        setCopied(false);

    };

  if (loading) return <p>Loading...</p>;
  if (error) return <h2><p>Error :(</p><p>{JSON.stringify(error)}</p></h2>;

  return (
     <TableContainer component={Paper}>

         <Table className={classes.table} size="small" aria-label="list of all links">
             <TableHead>
                 <TableRow>
                     <TableCell>Label</TableCell>
                     <TableCell>Short URL <span className={classes.shortLabel}>elab.works/...</span></TableCell>
                     <TableCell>Original URL <LaunchOutlined size="small" /></TableCell>
                     <TableCell align="right">Clicks</TableCell>
                 </TableRow>
             </TableHead>
             <TableBody>
                 {/* Data from Graph */}
                 {data.getLinks.map((row) => (
                 <TableRow key={row.label}>
                     <TableCell>
                         {row.label}
                     </TableCell>
                     <TableCell>
                        <IconButton aria-label="copy url" onClick={e=>
                            { copyUrl(document.getElementById(`hidden-${row.id}`)); }
                        }>
                            <FileCopyOutlined />
                        </IconButton>
                         <span id={`hidden-${row.id}`} className={classes.invisible}>https://elab.works/{row.shortUrl}</span>
                         <span id={`label-${row.id}`}>{row.shortUrl}</span>
                     </TableCell>
                     <TableCell><a href={row.originalUrl} target="_blank">{row.originalUrl}</a></TableCell>
                     <TableCell align="right">{row.clicks}</TableCell>
                 </TableRow>
                 ))}
             </TableBody> 
            <Snackbar open={copied} autoHideDuration={1000} onClose={snackbarClose}>
                <Alert severity="success">
                    Copied
                </Alert>
            </Snackbar>
         </Table>
     </TableContainer>
  );
}
