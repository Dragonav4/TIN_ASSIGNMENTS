const {
    validateApplication,
    calculateSurvivalScore,
    getRiskLevel,
    getDecisionMessage
} = require('./application.validate');

const ApplicationTitle = 'Bunker Admission Application';

function evaluateApplication(values) {
    const score = calculateSurvivalScore(values);
    const riskLevel = getRiskLevel(score);
    const message = getDecisionMessage(values, score);
    const status = score >= 30 ? 'accepted' : 'rejected';

    return { score, riskLevel, message, status };
}

function showApplicationForm(req, res) {
    res.render('application/index', {
        title: ApplicationTitle,
        application: {},
        errors: [],
    });
}

function submitApplication(req, res) { //POST
    const { values, errors } = validateApplication(req.body);

    if (errors.length > 0) {
        return res.status(400).render('ApplicationTitle/index', {
            title: ApplicationTitle,
            application: values,
            errors,
        });
    }

    const result = evaluateApplication(values);

    return res.render('ApplicationTitle/result', {
        title: result.status === 'accepted' ? 'Application Accepted' : 'Application Rejected',
        ...result,
    });
}

function submitApplicationAsync(req, res) { //instead of reload and render page again sends json to front and update info
    const { values, errors } = validateApplication(req.body);

    if (errors.length > 0) {
        return res.json({
            status: 'rejected',
            score: 0,
            errors,
        });
    }

    const result = evaluateApplication(values);

 return res.json({
        status: result.status,
        score: result.score,
        message: result.message,
        ...(result.status === 'accepted' && { riskLevel: result.riskLevel }// if false -> ignore, else add riskLevel
     //only if accepted
 )})
}

function getBunkerStatus(req, res) {
    const radiationLevel = Math.floor(Math.random() * 100);
    const zombieActivities = ['low', 'medium', 'high', 'critical'];
    const zombieActivity = zombieActivities[Math.floor(Math.random() * zombieActivities.length)];
    const temperature = Math.floor(Math.random() * 40) - 20;

    const water = Math.max(0, Math.min(100, 50 + Math.floor(Math.random() * 40) - 20));
    const food = Math.max(0, Math.min(100, 50 + Math.floor(Math.random() * 40) - 20));
    const power = Math.max(0, Math.min(100, 70 + Math.floor(Math.random() * 30) - 10));

    const events = [
        'All systems operational.',
        'Raiders spotted near the east gate.',
        'Supply convoy arrived safely.',
        'Radiation storm approaching from the north.',
        'Water purification system running at full capacity.',
        'Emergency drill scheduled for tomorrow.',
        'New survivors requesting entry.',
        'Power generator maintenance completed.',
        'Food storage temperature stable.',
        'Perimeter breach detected and sealed.'
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    res.json({
        timestamp: new Date().toISOString(), // -> YYYY-MM-DDTHH:mm:ss.sss
        outside: {
            radiationLevel,
            zombieActivity,
            temperature
        },
        inside: {
            water,
            food,
            power
        },
        event
    });
}

module.exports = {
    showApplicationForm,
    submitApplication,
    submitApplicationAsync,
    getBunkerStatus,
};
