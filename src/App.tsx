/* eslint-disable no-useless-escape */
import { ChangeEvent, FC, FormEvent, useState } from "react";
import "./App.css";

enum InputType {
  PASSWORD = "password",
  STRING = "text",
  DATE = "date",
  EMAIL = "email",
  NUMBER = "number",
}

interface InputValidations {
  correlative?: string[];
  regexValidation?: string;
  minDate?: Date;
  maxDate?: Date;
}

interface Input {
  id: string;
  type: InputType;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  // style
  useFullWidth?: boolean;
  // validations
  validations: InputValidations;
}

interface DojoForm {
  inputs: Input[];
  sendForm: (formValues: Input[]) => void;
}

const DojoForm: FC<DojoForm> = ({ inputs, sendForm }) => {
  const [validationError, setValidationError] = useState(false);
  // States to handle Form
  const [formValues, setFormValues] = useState<Record<string, string>>(
    inputs.reduce((acc, input) => ({ ...acc, [input.id]: "" }), {})
  );
  const [validations, setValidations] = useState<Record<string, boolean>>(
    inputs.reduce((acc, input) => ({ ...acc, [input.id]: false }), {})
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    // Validate RegEx
    const input = inputs.find((input) => input.id === id);
    if (input) {
      const formValidations: boolean[] = [];
      const { validations, isRequired } = input;
      const { regexValidation } = validations;
      if (isRequired && (!value || !value.trim().length)) {
        formValidations.push(false);
      }
      if (regexValidation) {
        const regex = new RegExp(regexValidation);
        formValidations.push(regex.test(value));
      }

      const isValid = formValidations.every((itemValid) => itemValid);
      setValidations((prevValidations) => ({
        ...prevValidations,
        [id]: isValid,
      }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const allValid = Object.values(validations).every((isValid) => isValid);
    setValidationError(!allValid);
    if (allValid) {
      console.log(formValues);
      // sendForm(formValues);
    } else {
      console.log("Validation failed.");
    }
  };

  return (
    <form className="form-example" onSubmit={handleSubmit}>
      {inputs.map((input) => {
        const {
          id,
          label,
          type,
          isRequired = true,
          placeholder = label,
          useFullWidth = false,
          validations: inputValidations,
        } = input;

        const isValidClass = validations[id] ? "valid" : "invalid";
        const inputClass = useFullWidth ? "full-width" : "half-width";

        console.log(`${isValidClass} ${inputClass}`);
        return (
          <div className="form-example" key={id}>
            <label htmlFor={label} style={{ marginRight: 4 }}>
              {label}
            </label>
            <div className={`${inputClass}`}>
              <input
                onChange={handleChange}
                id={id}
                type={type}
                name={label}
                required={isRequired}
                placeholder={placeholder}
                autoComplete="off"
                className={`${isValidClass}`}
                min={inputValidations.minDate?.toString()}
                max={inputValidations.maxDate?.toString()}
              />
            </div>
          </div>
        );
      })}

      <div className="form-example" style={{ width: "100px" }}>
        <input type="submit" value="Submit" autoComplete="off" />
      </div>

      {validationError && <h3 style={{ color: "red" }}>Validation failed.</h3>}
    </form>
  );
};

function App() {
  return (
    <>
      <h1>IT Dojo 2</h1>
      <DojoForm
        inputs={mock}
        sendForm={(values) => {
          console.log({ values });
        }}
      />
    </>
  );
}

const mock: Input[] = [
  {
    id: "nombre",
    label: "Nombre",
    placeholder: "Your name",
    type: InputType.STRING,
    isRequired: true,
    useFullWidth: false,
    validations: {
      regexValidation: `\\ba{1,3}\\b`,
    },
  },
  {
    id: "email",
    label: "Email",
    placeholder: "Your name",
    type: InputType.EMAIL,
    isRequired: true,
    useFullWidth: false,
    validations: { regexValidation: `@` },
  },
];

export default App;
