import { Router } from 'express';
import Avistamiento from '../models/Avistamiento.js';

const router = Router();

/**
 * Detecta si la petición viene de un formulario HTML (Handlebars).
 */
const esFormulario = (req) =>
    req.headers['content-type']?.includes('application/x-www-form-urlencoded');

/**
 * Extrae los datos del avistamiento del cuerpo de la petición.
 * También acepta la fechaRegistro como texto desde formularios.
 */
const datosAvistamiento = (body) => {
    const datos = { ...body };
    if (!datos.fechaRegistro) delete datos.fechaRegistro;
    return datos;
};

/**
 * Responde los errores de validación de Mongoose o errores internos.
 */
const responderError = (res, error, mensaje = 'Error interno del servidor') => {
    if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map((e) => e.message);
        return res.status(400).json({ mensaje: 'Datos inválidos', errores });
    }
    if (error.name === 'CastError') {
        return res.status(400).json({ mensaje: 'Identificador no válido' });
    }
    console.error(error);
    return res.status(500).json({ mensaje, error: error.message });
};

// GET /api/avistamientos?categoria=Ave
// Retorna todos los avistamientos del más reciente al más antiguo.
router.get('/', async (req, res) => {
    try {
        const filtro = {};
        if (req.query.categoria) {
            filtro.categoria = req.query.categoria;
        }

        const avistamientos = await Avistamiento.find(filtro).sort({ fechaRegistro: -1 });
        res.status(200).json(avistamientos);
    } catch (error) {
        responderError(res, error, 'Error al obtener los avistamientos');
    }
});

// GET /api/avistamientos/:id
// Retorna un avistamiento por su _id.
router.get('/:id', async (req, res) => {
    try {
        const avistamiento = await Avistamiento.findById(req.params.id);
        if (!avistamiento) {
            return res.status(404).json({ mensaje: 'Avistamiento no encontrado' });
        }
        res.status(200).json(avistamiento);
    } catch (error) {
        responderError(res, error, 'Error al obtener el avistamiento');
    }
});

// POST /api/avistamientos
// Recibe JSON (Postman) o x-www-form-urlencoded (formulario Handlebars).
router.post('/', async (req, res) => {
    try {
        const avistamiento = await Avistamiento.create(datosAvistamiento(req.body));

        if (esFormulario(req)) {
            return res.redirect('/');
        }
        res.status(201).json(avistamiento);
    } catch (error) {
        if (esFormulario(req)) {
            console.error(error);
            return res.redirect('/');
        }
        responderError(res, error, 'Error al crear el avistamiento');
    }
});

// PUT /api/avistamientos/:id
// Actualiza el estado de conservación, la zona o cualquier otro campo.
router.put('/:id', async (req, res) => {
    try {
        const avistamiento = await Avistamiento.findByIdAndUpdate(
            req.params.id,
            datosAvistamiento(req.body),
            { returnDocument: 'after', runValidators: true }
        );

        if (!avistamiento) {
            return res.status(404).json({ mensaje: 'Avistamiento no encontrado' });
        }
        res.status(200).json(avistamiento);
    } catch (error) {
        responderError(res, error, 'Error al actualizar el avistamiento');
    }
});

// POST /api/avistamientos/update/:id
// Soporte para el formulario HTML de edición.
router.post('/update/:id', async (req, res) => {
    try {
        const avistamiento = await Avistamiento.findByIdAndUpdate(
            req.params.id,
            datosAvistamiento(req.body),
            { returnDocument: 'after', runValidators: true }
        );

        if (!avistamiento) {
            return res.status(404).json({ mensaje: 'Avistamiento no encontrado' });
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// DELETE /api/avistamientos/:id
router.delete('/:id', async (req, res) => {
    try {
        const avistamiento = await Avistamiento.findByIdAndDelete(req.params.id);

        if (!avistamiento) {
            return res.status(404).json({ mensaje: 'Avistamiento no encontrado' });
        }
        res.status(200).json({
            mensaje: 'Avistamiento eliminado correctamente',
            avistamiento,
        });
    } catch (error) {
        responderError(res, error, 'Error al eliminar el avistamiento');
    }
});

// POST /api/avistamientos/delete/:id
// Soporte para el botón Eliminar de Handlebars.
router.post('/delete/:id', async (req, res) => {
    try {
        await Avistamiento.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

export default router;
