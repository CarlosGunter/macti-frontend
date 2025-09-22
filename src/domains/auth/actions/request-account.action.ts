/**
 * 
 * @param prevState estado previo
 * @param formData datos del formulario
 * @returns objeto con el resultado de la acción
 */
export function requestAccountAction(prevState: unknown, formData: FormData) {

  const getData = Object.fromEntries(formData.entries());
  // Convertir a string los valores del objeto
  Object.keys(getData).forEach(key => {
    getData[key] = getData[key]?.toString() || "";
  });

  // Llamar a la API para solicitar la cuenta

  return {
    success: true,
    message: "Solicitud de cuenta enviada. Se enviará un correo de confirmación cuando el profesor a cargo del curso lo apruebe.",
    data: getData
  }
}