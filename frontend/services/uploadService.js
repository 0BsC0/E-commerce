import axios from "axios";

const CLOUD_NAME = "doqxdqgg1";
const UPLOAD_PRESET = "orquidea_viva_imagenes";

// Subir imagen a Cloudinary
export const uploadImage = async (file) => {
  if (!file || !(file instanceof File)) {
    throw new Error("El archivo proporcionado no es válido.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    if (!res.data.secure_url) {
      console.error("❌ Respuesta inesperada:", res.data);
      throw new Error("No se recibió una URL válida desde Cloudinary.");
    }

    return res.data.secure_url;
  } catch (err) {
    const errorMsg = err?.response?.data?.error?.message || err.message || "Error desconocido";
    console.error("❌ Error al subir imagen:", err.response?.data || err.message);
    throw new Error(`No se pudo subir la imagen. Detalle: ${errorMsg}`);
  }
};
