function isNumeric(value) {
    return value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value));
}

function normalizeInt(value) {
    if (!isNumeric(value)) return '';
    return String(value).trim();
}

function validateFullName(name) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return 'Full name is required';
    }

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
    if (!nameRegex.test(name.trim())) {
        return 'Full name must contain at least 2 words with letters only';
    }

    return null;
}

function validateAge(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum))
        return 'Age must be a number';
    if (ageNum < 16 || ageNum > 65)
        return 'Age must be between 16 and 65';
    return null;
}

function validateProfession(profession) {
    const validProfessions = ['Doctor', 'Engineer', 'Farmer', 'Soldier', 'Programmer', 'Influencer'];
    if (!profession || !validProfessions.includes(profession))
        return 'Invalid profession selected';
    return null;
}

function validateHealthStatus(health) {
    const validStatuses = ['Healthy', 'Chronic illness', 'Injured'];

    if (!health || !validStatuses.includes(health))
        return 'Invalid health status selected';
    return null;
}

function validateInfectionCode(code) {
    if (!code || typeof code !== 'string' || code.trim().length === 0)
        return 'Infection code is required';

    const codeRegex = /^INF-\d{4}$/;
    if (!codeRegex.test(code.trim()))
        return 'Infection code must be in format INF-####';


    return null;
}

function validateApplication(payload = {}) {
    const errors = [];
    const values = {
        fullName: (payload.fullName || '').trim(),
        age: normalizeInt(payload.age),
        profession: (payload.profession || '').trim(),
        healthStatus: (payload.healthStatus || '').trim(),
        infectionCode: (payload.infectionCode || '').trim(),
        willingToWork: payload.willingToWork === 'on' || payload.willingToWork === 'true',
    };

    const nameError = validateFullName(values.fullName);
    if (nameError) errors.push(nameError);

    const ageError = validateAge(values.age);
    if (ageError) errors.push(ageError);

    const professionError = validateProfession(values.profession);
    if (professionError) errors.push(professionError);

    const healthError = validateHealthStatus(values.healthStatus);
    if (healthError) errors.push(healthError);

    const codeError = validateInfectionCode(values.infectionCode);
    if (codeError) errors.push(codeError);

    return {values, errors};
}

function calculateSurvivalScore(data) {
    let score = 0;

    const professionScores = {
        'Doctor': 50,
        'Engineer': 40,
        'Farmer': 35,
        'Soldier': 30,
        'Programmer': 10,
        'Influencer': -50
    };

    score += professionScores[data.profession] || 0;

    const age = parseInt(data.age);
    if (age >= 25 && age <= 45) {
        score += 20;
    } else if (age >= 18 && age <= 55) {
        score += 10;
    } else {
        score -= 10;
    }

    const healthScores = {
        'Healthy': 30,
        'Chronic illness': -10,
        'Injured': -20
    };
    score += healthScores[data.healthStatus] || 0;

    const infectionNum = parseInt(data.infectionCode.split('-')[1]);
    if (infectionNum >= 50) {
        score -= 30;
    } else if (infectionNum >= 30) {
        score -= 15;
    }

    if (data.willingToWork) {
        score += 15;
    }

    return score;
}

function getRiskLevel(score) {
    if (score >= 70) return 'low';
    if (score >= 40) return 'medium';
    if (score >= 0) return 'high';
    return 'critical';
}

function getDecisionMessage(data, score) {
    if (score < 0) {
        if (data.profession === 'Influencer') {
            return 'Influencers are not admitted to the bunker. We need practical skills.';
        }
        return 'Your survival score is too low. The bunker cannot accept you at this time.';
    }

    if (score < 30) {
        return 'Your application is rejected. Consider improving your skills and reapplying.';
    }

    const bunkerNum = Math.floor(Math.random() * 20) + 1;
    const gate = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    const hour = Math.floor(Math.random() * 4) + 18;

    return `You are accepted to Bunker #${bunkerNum}. Report to Gate ${gate} at ${hour}:00.`;
}

module.exports = {
    validateApplication,
    calculateSurvivalScore,
    getRiskLevel,
    getDecisionMessage,
};
