const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require("@sentry/profiling-node");

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routesAdministration = require('./router/routesAdministration');
const routesUser = require('./router/routesUser');
const {createServer} = require("http");
const {initIo} = require("./socket");
const app = express();
const server = createServer(app);

Sentry.init({
    dsn: 'https://144f12f37a8e6d0afb4f81f88461bddd@o4506059481153536.ingest.sentry.io/4506059510972416',
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routesAdministration);
app.use('/', routesUser);


app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

app.use(cors({
    origin: 'http://localhost:4200', // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept'
}));

initIo(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
