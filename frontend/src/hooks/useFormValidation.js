import { useState, useEffect } from 'react';

const useFormValidation = (initialState, validate, onSubmit) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        onSubmit(values);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting, onSubmit, values]);

  useEffect(() => {
    // Only validate fields that have been touched
    const touchedFields = Object.keys(touched).filter(key => touched[key]);
    if (touchedFields.length > 0) {
      const validationErrors = validate(values);
      const touchedErrors = {};
      
      touchedFields.forEach(field => {
        if (validationErrors[field]) {
          touchedErrors[field] = validationErrors[field];
        }
      });
      
      setErrors(touchedErrors);
    }
  }, [touched, values, validate]);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(Object.keys(validationErrors).length === 0);
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};

export default useFormValidation;
