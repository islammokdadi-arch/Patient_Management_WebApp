import { ref } from 'vue';

export function useFormValidation() {
  const errors = ref({});
  const submitted = ref(false);

  const validatePatientForm = (patient) => {
    errors.value = {};
    submitted.value = true;

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/;

    if (!patient.name?.trim()) {
      errors.value.name = "First name is required";
    } else if (!nameRegex.test(patient.name)) {
      errors.value.name = "Invalid characters in name";
    }

    if (!patient.last_name?.trim()) {
      errors.value.last_name = "Last name is required";
    } else if (!nameRegex.test(patient.last_name)) {
      errors.value.last_name = "Invalid characters in last name";
    }

    const age = parseFloat(patient.age);
    if (!patient.age) {
      errors.value.age = "Age is required";
    } else if (age < 0 || age > 130) {
      errors.value.age = "Age must be between 0 and 130";
    }

    if (!patient.disease?.trim()) {
      errors.value.disease = "Disease is required";
    }

    if (!patient.dat) {
      errors.value.dat = "Date is required";
    }

    if (!patient.Gender) {
      errors.value.Gender = "Gender is required";
    }

    return Object.keys(errors.value).length === 0;
  };

  const resetValidation = () => {
    errors.value = {};
    submitted.value = false;
  };

  return {
    errors,
    submitted,
    validatePatientForm,
    resetValidation
  };
}