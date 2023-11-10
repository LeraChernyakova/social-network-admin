const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require("@sentry/profiling-node");

const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

const routesAdministration = require('./router/routesAdministration');
const routesUser = require('./router/routesUser');

const {createServer} = require("http");
const {initIo} = require("./socket");

const app = express();
const server = createServer(app);

Sentry.init({
    dsn: 'https://574e6b4bf4a1e7a412ff176caf1416b4@o4506201692569600.ingest.sentry.io/4506201735626752',
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
    origin: 'http://localhost:4200',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept'
}));

initIo(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен http://localhost:${PORT}`);
});

module.exports = app;
