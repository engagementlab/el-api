import React from 'react';

import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from '@material-ui/core';

import { FileCopyOutlined, Link, LaunchOutlined } from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import { IconButton, Popover } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'LunchtypeRegular',
    }
});
const useStyles = makeStyles({
    header: {
        fontSize: 'large',
        fontWeight: 'bold',
    },
    link: {
        color: 'black',
    },
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

export default function DenseTable(props) {

    const classes = useStyles();
    const [copied, setCopied] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

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

    // Close snackbar after 'copied' notifier
    const snackbarClose = (event, reason) => {
        setCopied(false);
    };

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        console.log(anchorEl)
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        console.log('close')
    };

    // Shorten original url if too long
    const trimUrl = (url) => {
        return (url.length > 40) ? `${url.substring(0, 40)}...` : url;
    }

    const open = Boolean(anchorEl);

  return (
    <ThemeProvider theme={theme}>
     <TableContainer component={Paper}>

                         
     <Popover
                id="info"
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            > 
            Info
            </Popover>
         <Table className={classes.table} size="small" aria-label="list of all links"
                            
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={handlePopoverClose}>
             <TableHead>
                 <TableRow>
                     <TableCell className={classes.header}>Label</TableCell>
                     <TableCell className={classes.header}>Short URL <span className={classes.shortLabel}>elab.works/...</span></TableCell>
                     <TableCell className={classes.header}>Original URL <LaunchOutlined size="small" /></TableCell>
                 </TableRow>
             </TableHead>
             <TableBody>
                 {/* Data from Graph */}
                 {props.data.map((row) => (
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
                     <TableCell><a href={row.originalUrl} target="_blank" rel="noreferrer" className={classes.link}>{trimUrl(row.originalUrl)}</a></TableCell>
                     <TableCell
                             align="right" data-info={`Added on ${row.date} by ${row.user || '??'}`}>

                        <InfoIcon 
                            />
                            {/* </div> */}
                    </TableCell>
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
     </ThemeProvider>
  );
}
