import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function forbiddenWordValidator(forbiddenWords: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value || !forbiddenWords || forbiddenWords.length == 0) return null;

    const hasForbiddenWord: boolean = forbiddenWords.some(forbiddenWord => {
      return value.toLowerCase().includes(forbiddenWord.toLowerCase());
    });
    return hasForbiddenWord ? { forbiddenWord: true } : null;
  };
}
