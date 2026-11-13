import express from 'express';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { engine } from 'express-handlebars';
import { connectToMongoDB } from './config/db.js';
import apiRouter from './routes/api.router.js';
import viewsRouter from './routes/views.router.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.SERVER_PORT || 3000;
const app = express();

// Configuración de Express-Handlebars
app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
        helpers: {
            formatoFecha(fecha) {
                if (!fecha) return 'Sin fecha';
                return new Date(fecha).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
            },
            fechaIso(fecha) {
                if (!fecha) return '';
                return new Date(fecha).toISOString().split('T')[0];
            },
            eq(a, b) {
                return a === b;
            },
        },
    })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/avistamientos', apiRouter);
app.use('/', viewsRouter);

// Arranque del servidor
await connectToMongoDB();

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});
