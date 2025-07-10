import { Form, FormResponse } from '~~/shared/schemas/form';

export const makeDefaultMessage = (form: Form) => {
  return `New submission received on ${form.name}`;
};

export const makeDefaultMessageWithFormData = (form: Form, formResponse: FormResponse) => {
  return `**${makeDefaultMessage(form)}**\n\n${JSON.stringify(formResponse, null, 2)}`;
};
