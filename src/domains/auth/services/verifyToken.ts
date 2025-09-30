import { tryCatch } from "@/shared/utils/try-catch";

export async function verifyToken(token: string): Promise<Record<string, any>> {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const verifyTokenPromise = fetch(`${apiURLBase}/auth/confirmacion?token=${token}`, {
    method: "GET",
    cache: "no-store",
  });

  const verifyTokenResponse = await tryCatch(verifyTokenPromise);
  if (verifyTokenResponse.error || !verifyTokenResponse.data.ok) {
    return {
      success: false,
      message: "Error al verificar el token. Inténtalo de nuevo más tarde."
    };
  }
  
  const userData = await tryCatch(verifyTokenResponse.data.json());
  if (userData.error) {
    return {
      success: false,
      message: "Token inválido."
    };
  }
    
  return {
    success: true,
    data: userData.data.data
  };
}