import { FormControl } from '@angular/forms';

export class PasswordValidator {
  static equalToPassword(control: FormControl) {
    return control.root.value.password !== control.value
      ? { isEqual: false }
      : null;
  }
}
