export const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const formatDate = (dateString) => {
  // Expresión regular para verificar el formato de fecha (YYYY-MM-DD o DD-MM-YYYY)
  const regex = /^\d{4}-\d{2}-\d{2}$|^\d{2}-\d{2}-\d{4}$/;

  if (!regex.test(dateString)) {
    throw new Error("Formato de fecha inválido");
  }

  let date;
  if (dateString.includes("-")) {
    // Asumir que el formato puede ser 'YYYY-MM-DD' o 'DD-MM-YYYY'
    const parts = dateString.split("-");
    if (parts[0].length === 4) {
      // 'YYYY-MM-DD' (formato correcto)
      date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
    } else {
      // 'DD-MM-YYYY' (formato incorrecto)
      date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  } else {
    throw new Error("Formato de fecha inválido");
  }

  if (isNaN(date)) {
    throw new Error("Formato de fecha inválido");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript van de 0 a 11
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
