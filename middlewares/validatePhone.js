export const validatePhone = (telefono) => {
    return new Promise((resolve, reject) => {
        const phonePattern = /^\d{1,12}(-\d{1,12})?$/;
        if(!phonePattern.test(telefono)){
            reject('El teléfono no es válido');
        } else {
            resolve(true);
        }
    });
};