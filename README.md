# vue3-qewd-hello-world

This is a basic example Vue.js version 3.x app using a QEWD-Up/QEWD.js back-end. It uses the standard `@vue/cli` [build tools](https://cli.vuejs.org/guide/installation.html). The example assumes you have a QEWD-Up/QEWD.js back-end server running on `http://localhost:8090`.

## Generate your app skeleton
```bash
vue create vue3-qewd-hello-world
```
Choose the Vue.js 3.x defaults when asked for

## Project setup
```bash
npm install
# to enable use of WebSockets for QEWD-Up/QEWD.js interactive apps
npm install socket.io-client qewd-client
```

### File changes to a fresh Vue.js 3.x app skeleton to integrate with QEWD-Up/QEWD.js interactive apps (using WebSockets)

*Notice that with the new [qewd-client](https://www.npmjs.com/package/qewd-client) module version, the [vue-qewd](https://www.npmjs.com/package/vue-qewd) plugin module isn't needed anymore. You can still use it if you need to use the legacy [ewd-client](https://www.npmjs.com/package/ewd-client) module.*

- in `src/main.js`:
```javascript
import { createApp } from 'vue'
import App from './App.vue'

// import QEWD from the qewd-client
import { QEWD } from 'qewd-client'

// create the Vue App instance
const app = createApp(App)
// add QEWD as a global property
// now you can use QEWD in all your app components as `this.$qewd.reply(...)`
app.config.globalProperties.$qewd = QEWD
// mount the Vue.js app as usual
app.mount('#app')
```
- in `src/App.vue`:
```html
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- show your app's main component when QEWD's websocket is ready -->
  <HelloWorld v-if="qewdReady" msg="Welcome to Your Vue.js App"/>
  <!-- during startup, show a startup indicator -->
  <h1 v-else>Starting QEWD-Up/QEWD.js ...</h1>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import the socket.io client into our App component
import io from 'socket.io-client'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      // define a reactive property set to true when QEWD's websocket is registered
      qewdReady: false
    }
  },
  created () {
    // preserve Vue.js's this pointer
    let self = this
    /*
      create an event handler invoked when QEWD's connection is registered/ready
    */
    this.$qewd.on('ewd-registered', function() {
      // Your QEWD environment is ready, set the qewdReady data property to true
      self.qewdReady = true
      // optionally turn on logging to the console
      self.$qewd.log = true
    });
    /*
      start QEWD-Up/QEWD.js client with these required params:
      - application: QEWD's application name
      - io: the imported websocket client module
      - url: the url of your QEWD-Up/QEWD.js server (hardcoded in this example,
        the url can be passed in too using a process.env.QEWD_URL parameter)

      *** important: by default, a Vue.js app will run it's development server on localhost:8080 
      (this is the same port as QEWD's default port 8080)
      you'll *need* to change the port to e.g. 8090 in QEWD's config
      to make it work with a Vue.js app!
    */
    this.$qewd.start({
      application: 'hello-world',
      io,
      url: 'http://localhost:8090'
    })
  }
}
</script>
```
- in `src/components/HelloWorld.vue`:
```html
<template>
  <div class="hello">
    ...
  </div>
  <hr>
  <p>message from QEWD-Up/QEWD.js: {{ qewdMessage }}</p>
  <button @click="sendMessage">Send message to QEWD-Up/QEWD.js</button>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      // add a reactive property to hold a message coming back from QEWD-Up/QEWD.js
      qewdMessage: ''
    }
  },
  methods: {
    sendMessage() {
      // preserve Vue.js's this for use in QEWD's reply
      let self = this
      // add a debugger statement if you want to debug your Vue app
      /* eslint-disable no-debugger, no-console */
      debugger
      // send a test 'hello-world' message to QEWD-Up/QEWD.js
      this.$qewd.reply({
        type: 'hello-world'
      }).then(response => {
        debugger
        // log QEWD's response on the console
        console.log(response)
        // show an error message in the app
        self.qewdMessage = response.message.error || ''
      }) 
    }
  }
}
</script>
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Debugging with VSCode

See the recipe at [Vue.js debugging in Chrome and VS Code](https://github.com/microsoft/vscode-recipes/tree/master/vuejs-cli)

### Deploying to non-root domain url's

In case you deploy your app and/or your QEWD-Up/QEWD.js server to a non-root domain url, you need to configure some parameters.

#### The QEWD-Up/QEWD.js server back-end

When you reverse proxy your QEWD-Up/QEWD.js server using Apache, Nginx, ... under a non-root path (e.g. `https://mydomain.com/qewd`) you need to configure your webserver to reverse proxy QEWD-Up/QEWD.js's built-in static webserver under this path. Don't forget to add statements to proxy the websocket `ws://mydomain.com/qewd` and/or `wss://mydomain.com/qewd` protocol too.

- for Apache:
```
RewriteEngine on
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/qewd/?(.*) "ws://qewd-server.local:8090/$1" [P,L]

ProxyPass /qewd http://qewd-server.local:8090
ProxyPassReverse /qewd http://qewd-server.local:8090
```
- for Nginx:
```
http {
  server {
    listen 80;
    server_mame mydomain.com

    location /qewd {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;

      proxy_pass http://qewd-server.local:8090;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
  }
}
```
In the QEWD.js server config, you need to add/change a `webSockets.io_paths` setting in your `configuration/config.json` file:
```javascript
{
  "qewd": {
    "managementPassword": "keepThisSecret!",
    "serverName": "QEWD-Up server",
    ...
    "webSockets": {
      "io_paths": ["/qewd"]
    }
  },
  ...
}
```
This setting ensures the socket.io module in the QEWD-Up/QEWD.js server picks up messages from a `/qewd` path/location too. If you don't set this config option, your websocket messages will be refused with an `Invalid namespace /qewd` error.

In case the same QEWD-Up/QEWD.js server is reverse proxied behind multiple Apache/Nginx proxy servers simultaneously, you can add multiple `io_paths` in this array (only in case the proxied path/location is different on the proxy servers). E.g. if you have one Apache server using the path/location `/qewd1` and another using the path/location `/qewd2`, the setting becomes:
```javascript
{
  "qewd": {
    ...
    "webSockets": {
      "io_paths": ["/qewd1","/qewd2"]
    }
  },
  ...
}
```
*Important note: make sure you install/upgrade your `qewd` module v2.51.7 or later in your QEWD-Up/QEWD.js server setup using `npm install qewd` for this feature to work!*

#### Vue.js web apps

##### The QEWD-Up/QEWD.js client start parameters

To start the QEWD-Up/QEWD.js connection successfully from the `qewd-client` module, you need to tell the module where your QEWD-Up/QEWD.js back-end server lives:
```javascript
this.$qewd.start({
  application: 'hello-world',
  io,
  url: 'http://mydomain.com/qewd',
  io_path: '/qewd'
})
```
Notice both `url` and `io_path` need to contain the url subpath `/qewd`.

##### Deploy your app to a non-root url using Vue's publicPath setting 

When you build your app and deploy it to a non-root url, you need to tell @vue/cli where your app will be deployed in the `vue.config.js` file using the [`publicPath` setting](https://cli.vuejs.org/config/#publicpath):

```javascript
module.exports = {
  publicPath: '/vue',
  configureWebpack: {
    devtool: "source-map"
  }
};
```
During development, you need to adjust the `url` setting in your `launch.json` config in VSCode to point to this public path:
```javascript
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080/vue",
      "webRoot": "${workspaceFolder}",
      "breakOnLoad": true,
      "pathMapping": {
        "/_karma_webpack_": "${workspaceFolder}"
      },
      "sourceMapPathOverrides": {
        "webpack:/*": "${webRoot}/*",
        "/./*": "${webRoot}/*",
        "/src/*": "${webRoot}/*",
        "/*": "*",
        "/./~/*": "${webRoot}/node_modules/*"
      },
      "preLaunchTask": "vuejs: start"
    }
  ]
}
```
The `tasks.json` with the `vuejs: start` pre-launch task:
```javascript
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "vuejs: start",
      "type": "npm",
      "script": "serve",
      "isBackground": true
    }
  ]
}
```