import { AbstractControl, ValidationErrors } from "@angular/forms";

export function nospaceValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value || typeof control.value !== "string") return null;

  if (control.value.trim().split(" ").length > 1) return { nospace: true };

  return null;
}
