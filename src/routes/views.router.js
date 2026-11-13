import { Router } from 'express';
import Avistamiento from '../models/Avistamiento.js';

const router = Router();

// GET /
// Listado de avistamientos + formulario de registro.
router.get('/', async (req, res) => {
    try {
        const avistamientos = await Avistamiento.find()
            .sort({ fechaRegistro: -1 })
            .lean();

        res.render('home', {
            titulo: 'Avistamientos',
            avistamientos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('home', {
            titulo: 'Avistamientos',
            avistamientos: [],
            error: 'No fue posible cargar los avistamientos.',
        });
    }
});

// GET /editar/:id
// Formulario precargado para actualizar un registro.
router.get('/editar/:id', async (req, res) => {
    try {
        const avistamiento = await Avistamiento.findById(req.params.id).lean();

        if (!avistamiento) {
            return res.status(404).render('home', {
                titulo: 'Avistamientos',
                avistamientos: [],
                error: 'El avistamiento solicitado no existe.',
            });
        }

        res.render('editar', {
            titulo: 'Editar avistamiento',
            avistamiento,
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(400).render('home', {
                titulo: 'Avistamientos',
                avistamientos: [],
                error: 'El identificador del avistamiento no es válido.',
            });
        }
        res.status(500).render('home', {
            titulo: 'Avistamientos',
            avistamientos: [],
            error: 'No fue posible cargar el avistamiento.',
        });
    }
});

export default router;
