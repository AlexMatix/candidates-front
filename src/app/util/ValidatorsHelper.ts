import {FormGroup} from '@angular/forms';

export function ValidatorEquals(field: string, confirmField: string, errorType: string, equals = true): any {
    return (formGroup: FormGroup) => {
        const controlField = formGroup.controls[field];
        const controlFieldConfirm = formGroup.controls[confirmField];
        // tslint:disable-next-line:max-line-length
        if ((controlField.value !== null && controlFieldConfirm.value !== null) && (controlFieldConfirm.valid || controlField.valid)) {
            // controlField.setErrors(null);
            controlFieldConfirm.setErrors(null);
            if (equals) {
                if (controlField.value !== controlFieldConfirm.value) {
                    controlFieldConfirm.setErrors({[errorType]: true});
                }
            } else {
                if (controlField.value === controlFieldConfirm.value) {
                    controlFieldConfirm.setErrors({[errorType]: true});
                }
            }
        }
    };
}

export function messageErrorValidation(form: FormGroup, attrName: string) {
    const control = form.get(attrName);
    return control.hasError('required') ? '* Requerido' :
        control.hasError('minlength') ? `Minimo de Caracteres: ${control.errors.minlength.requiredLength}` :
            control.hasError('maxlength') ? `Máximo de Caracteres: ${control.errors.maxlength.requiredLength}` :
                control.hasError('email') ? 'Debe de ingresar un correo valido' :
                    control.hasError('notEqualsPassword') ? 'La contraseña no coincide' :
                        control.hasError('notEqualsCurp') ? 'No coincide con el CURP' :
                            control.hasError('notEqualsElectorKey') ? 'No coincide con la clave de elector' :
                            control.hasError('notEqualsCurp') ? 'No coincide con el curp' :
                            control.hasError('notEqualsEmail') ? 'No coincide con el email' :
                                control.hasError('notEqualsOCR') ? 'No coincide con el OCR' :
                                    control.hasError('equals') ? 'Este campo no debe ser igual' :
                                        control.hasError('curpExist') ? 'Este CURP ya esta en el sistema' :
                                            control.hasError('keyElectorExist') ? 'Esta clave de elector ya esta en el sistema' :
                                                control.hasError('ocrExist') ? 'Este ocr ya esta en el sistema' :
                                                    control.hasError('rgExist') ? 'Ya existe un RG ocupando este municipio' :
                                                        control.hasError('boxOExist') ? 'Esta casilla ya tiene un propietario' :
                                                            control.hasError('boxHExist') ? 'Esta casilla ya tiene un suplente' :
                                                                '';
}
