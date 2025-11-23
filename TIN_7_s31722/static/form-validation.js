function validateFullName(name) {
    if (!name || name.trim().length === 0) {
        return 'Full name is required';
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    if (!nameRegex.test(name.trim())) {
        return 'Full name must contain at least 2 words with letters only';
    }

    return null;
}

function validateAge(age) {
    const ageNum = parseInt(age);

    if (isNaN(ageNum)) {
        return 'Age must be a number';
    }

    if (ageNum < 16 || ageNum > 65) {
        return 'Age must be between 16 and 65';
    }

    return null;
}

function validateInfectionCode(code) {
    if (!code || code.trim().length === 0) {
        return 'Infection code is required';
    }

    const codeRegex = /^INF-\d{4}$/;
    if (!codeRegex.test(code.trim())) {
        return 'Infection code must be in format INF-####';
    }

    return null;
}

function validateForm(formData) {
    const errors = [];

    const nameError = validateFullName(formData.fullName);
    if (nameError) errors.push(nameError);

    const ageError = validateAge(formData.age);
    if (ageError) errors.push(ageError);

    if (!formData.profession) {
        errors.push('Please select a profession');
    }

    if (!formData.healthStatus) {
        errors.push('Please select a health status');
    }

    const codeError = validateInfectionCode(formData.infectionCode);
    if (codeError) errors.push(codeError);

    return errors;
}
