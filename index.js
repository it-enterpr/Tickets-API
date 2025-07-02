import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/routes.js';

const app = express();
const port = 5000;

// Použití CORS k povolení komunikace mezi frontendem a backendem
app.use(cors());

app.use(bodyParser.json());

// Dummy data pro stanice, dokud nebudou načteny z Odoo
const stations = [
    { id: 1, name: 'Praha' },
    { id: 2, name: 'Brno' },
    { id: 3, name: 'Ostrava' },
    { id: 4, name: 'Plzeň' },
    { id: 5, name: 'Liberec' }
];

// Nová cesta pro získání stanic
app.get('/api/stations', (req, res) => {
    res.json(stations);
});

app.use('/', routes);

app.listen(port, () =>
    console.log(`Server is listening on port: http://localhost:${port}`)
);