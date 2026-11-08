
export interface HabitoGlobal {
  id: number;
  nombre: string;
}

// Datos que React enviará a .NET para crear un hábito
export interface CrearHabitoGlobalDto {
  nombre: string;
}

// Errores que devuelve FluentValidation desde .NET
export interface FluentValidationError {
  propertyName: string;
  errorMessage: string;
  attemptedValue?: unknown;
  errorCode?: string;
}
