import mongoose from 'mongoose';

const avistamientoSchema = new mongoose.Schema({
    nombreComun: {
        type: String,
        required: [true, 'El nombre común es obligatorio'],
        trim: true,
    },
    nombreCientifico: {
        type: String,
        required: [true, 'El nombre científico es obligatorio'],
        trim: true,
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: {
            values: ['Mamífero', 'Ave', 'Reptil', 'Anfibio', 'Flora'],
            message: '{VALUE} no es una categoría válida',
        },
    },
    zona: {
        type: String,
        required: [true, 'La zona es obligatoria'],
        trim: true,
    },
    estadoConservacion: {
        type: String,
        required: false,
        enum: {
            values: ['Preocupación menor', 'Vulnerable', 'En peligro'],
            message: '{VALUE} no es un estado de conservación válido',
        },
        default: 'Preocupación menor',
    },
    investigador: {
        type: String,
        required: [true, 'El investigador es obligatorio'],
        trim: true,
    },
    fechaRegistro: {
        type: Date,
        required: false,
        default: Date.now,
    },
});

const AvistamientoModel = mongoose.model('Avistamiento', avistamientoSchema);
export default AvistamientoModel;
