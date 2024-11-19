import { request, response } from "express"

export const validatePatologias = (patologias) => {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(patologias)) {
            return reject('The provided data is not an array');
        }

        const pasado = patologias.some(patologia => patologia > 28);

        if(pasado) {
            return reject('Some patologia is greater than 28');
        }

        const uniquePatologias = new Set(patologias);
        if(uniquePatologias.size !== patologias.length) {
            return reject('There are duplicate elements in the array');
        }

        resolve(true);
    });
};

export const validateAlergias = (alergias) => {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(alergias)) {
            return reject('The provided data is not an array');
        }

        const pasado = alergias.some(alergia => alergia > 20);

        if(pasado) {
            return reject('Some alergia is greater than 20');
        }

        const uniqueAlergias = new Set(alergias);
        if(uniqueAlergias.size !== alergias.length) {
            return reject('There are duplicate elements in the array');
        }

        resolve(true);
    });
};

export const validateProblemasVision = (problemas) => {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(problemas)) {
            return reject('The provided data is not an array');
        }

        const pasado = problemas.some(problema => problema > 29);

        if(pasado) {
            return reject('Some problema de vision is greater than 29');
        }

        const uniqueProblemas = new Set(problemas);
        if(uniqueProblemas.size !== problemas.length) {
            return reject('There are duplicate elements in the array');
        }

        resolve(true);
    });
};

export const validateDiscapacidades = (discapacidades) => {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(discapacidades)) {
            return reject('The provided data is not an array');
        }

        const pasado = discapacidades.some(discapacidad => discapacidad > 15);

        if(pasado) {
            return reject('Some discapacidad is greater than 15');
        }

        const uniqueDiscapacidades = new Set(discapacidades);
        if(uniqueDiscapacidades.size !== discapacidades.length) {
            return reject('There are duplicate elements in the array');
        }

        resolve(true);
    });
};

export const validateTrastornoMental = (trastornos) => {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(trastornos)) {
            return reject('The provided data is not an array');
        }

        const pasado = trastornos.some(trastorno => trastorno > 15);

        if(pasado) {
            return reject('Some trastorno is greater than 15');
        }

        const uniqueTrastornos = new Set(trastornos);
        if(uniqueTrastornos.size !== trastornos.length) {
            return reject('There are duplicate elements in the array');
        }

        resolve(true);
    });
};