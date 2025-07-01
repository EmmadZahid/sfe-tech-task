import { AbstractControl, ValidationErrors } from "@angular/forms";

export function whitespaceValidator(control: AbstractControl): ValidationErrors | null {
	if (!control.value || typeof control.value !== 'string')
		return null;

	if (!control.value.trim())
		return { whitespace: true };

	return null;
}
