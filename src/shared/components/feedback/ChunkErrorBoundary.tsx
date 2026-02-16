"use client";

import { Component, type ReactNode } from "react";
import { Button } from "../../shadcn/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ChunkErrorBoundary - Maneja errores de carga de chunks de Next.js
 *
 * Cuando hay múltiples pestañas con diferentes institutos, los chunks pueden
 * fallar en cargar debido a conflictos de estado. Este boundary captura esos
 * errores y recarga automáticamente la página una sola vez.
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  private reloadAttempted = false;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Detectar errores de carga de chunks
    const isChunkError =
      error.message.includes("Loading chunk") ||
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("ChunkLoadError") ||
      error.name === "ChunkLoadError";

    if (isChunkError && !this.reloadAttempted) {
      console.warn(
        "ChunkErrorBoundary: Error de carga de chunk detectado, recargando página...",
        error,
      );
      this.reloadAttempted = true;

      // Recargar después de un breve delay para evitar loops infinitos
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      console.error("ChunkErrorBoundary: Error capturado:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Error al cargar la aplicación</h2>
              <p className="text-gray-600 mb-4">
                Ha ocurrido un error inesperado. La página se recargará automáticamente.
              </p>
              <Button type="button" onClick={() => window.location.reload()}>
                Recargar ahora
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
