# Engagement Lab URL shortener

This application allows authenticated users to shorten any long URL to a minified link with the prefix `https://elab.shares/`.

This package:

- Utilizes the `Auth`, `Passport`, `Server` utils from the `core` [package](https://github.com/engagementlab/el-api/tree/master/packages/core).
- Creates a GraphQL schema via an Apollo server.
- Connects to mongo via mongoose for link CRUD operations.
- Redirects user from shortened links to original URL. - Records clicks to DB and Google Analytics.
- Serves a React front-end.

## Installation

1. Get yarn, if needed:

   ```
   curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
   echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
   ```

   `apt update && apt install yarn`

2. Install dependencies:

   `yarn install`

3. Add environment variables in both `/` and `/client` (see .sample files).

4. Make client build:

   `PUBLIC_URL=/shortener (<=== if in sub-url) yarn run build`

5. Run app (using [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) in this case):

   `pm2 start index.js --name el-shortener`

# API

## Modules

<dl>
<dt><a href="#module_DB">DB</a></dt>
<dd><p>Create DB connection for admin database, which contains links collection.</p>
</dd>
<dt><a href="#module_Shortener">Shortener</a></dt>
<dd><p>Instantiates Shortener&#39;s express server, apollo instance.</p>
</dd>
<dt><a href="#module_Link">Link</a> ⇒ <code>mongoose.Model</code></dt>
<dd><p>Link mongoose model</p>
</dd>
</dl>

<a name="module_DB"></a>

## DB

Create DB connection for admin database, which contains links collection.

<a name="module_Shortener"></a>

## Shortener

Instantiates Shortener's express server, apollo instance.

<a name="module_Link"></a>

## Link ⇒ <code>mongoose.Model</code>

Link mongoose model

| Param      | Description                     |
| ---------- | ------------------------------- |
| connection | Mongoose connection to apply to |
