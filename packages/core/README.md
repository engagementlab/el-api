# Engagement Lab API Core Utils

This package contains many of the common libraries and utilities relied on by several web apps.
It can also be used to instantiate an express server, serving either one or all content packages and CMS instance(s).

**Example launch as server**

`yarn run dev` | `node packages/core --server`

**Example usage as dependency**

```
const {
	    Auth,
	    Passport,
	    Server,
	} = require('@engagementlab/core')(__dirname);

    const app = express();
    Passport(app);

    app.get('/admin', Auth.isAllowed('/login'), (req, res) => {
	    res.send('Is logged in.');
    });

    const port = Server.normalizePort(process.env.PORT || '3000');

    app.listen(port);
```

###Utilities:

## `Auth`

Middlewares for checking user authentication statu s.

## `Passport`

All-in-one config and instantiation of passport-js for OAuth2 authentication via Google. Connects to mongo database specified by `MONGO_CLOUD_ADMIN_URI` to query `User` permissions.

`Server`
