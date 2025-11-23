function fillAcceptedResult(content, data) {
    const scoreEl = content.querySelector('.score');
    const riskLevelEl = content.querySelector('.risk-level');
    const messageEl = content.querySelector('.message');

    if (scoreEl) scoreEl.textContent = data.score;
    if (riskLevelEl) riskLevelEl.textContent = data.riskLevel;
    if (messageEl) messageEl.textContent = data.message;
}

function fillRejectedResult(content, data) {
    const scoreDisplay = content.querySelector('.score-display');
    const scoreEl = content.querySelector('.score');
    const errorList = content.querySelector('.error-list');
    const messageEl = content.querySelector('.message');

    if (data.score !== undefined && scoreEl) {
        scoreEl.textContent = data.score;
    } else if (scoreDisplay) {
        scoreDisplay.style.display = 'none'; //hide whole scoreDisplay to avoid empty: "Survival Score:"
    }

    if (data.errors && data.errors.length > 0 && errorList) {
        for (const error of data.errors) {
            const li = document.createElement('li');
            li.textContent = error;
            errorList.appendChild(li); // list.Add();
        }
        if (messageEl) { //hide message, only error will be visible
            messageEl.style.display = 'none';
        }
    } else if (data.message && messageEl && errorList) { //logical reject(under 18 age), not validation error
        messageEl.textContent = data.message;
        errorList.style.display = 'none';
    }
}

function showResult(data) {
    const resultDiv = document.getElementById('result');
    const isAccepted = data.status === 'accepted';

    const templateId = isAccepted ? 'acceptedTemplate' : 'rejectedTemplate';
    const template = document.getElementById(templateId);
    const content = template.content.cloneNode(true); //clone content

    resultDiv.setAttribute('data-tone', isAccepted ? 'success' : 'danger');

    if (isAccepted) {
        fillAcceptedResult(content, data);
    } else {
        fillRejectedResult(content, data);
    }

    resultDiv.innerHTML = ''; //remove prev res
    resultDiv.appendChild(content); //add response from methods above
    resultDiv.style.display = 'block'; //unhide block
    resultDiv.scrollIntoView({ behavior: 'smooth'}); //smooth scroll
}

const submitForm = async (formData) => {
    try {
        const response = await fetch('/application/api/submit', { //asyncSubmit
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',},
            body: JSON.stringify(formData), //parse formData to JSON -> server after that use JSON.parse(...) => req.body
        });

        const data = await response.json();
        showResult(data);
    } catch (error) {
        console.error('Error:', error);
        showResult({
            status: 'rejected',
            errors: ['Network error. Please try again later.'],
        });
    }
};
//When the HTML is fully loaded, run this code.
document.addEventListener('DOMContentLoaded', () => { //DOMContentLoaded is a signal that we are ready to deal with elements of HTML.

    const form = document.getElementById('applicationForm');

    form.addEventListener('submit', (e) => { //do not refresh and do not send common post
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            profession: document.getElementById('profession').value,
            healthStatus: document.querySelector('input[name="healthStatus"]:checked')?.value,
            infectionCode: document.getElementById('infectionCode').value,
            willingToWork: document.querySelector('input[name="willingToWork"]').checked
        };

        const errors = validateForm(formData);

        if (errors.length > 0) {
            showResult({
                status: 'rejected',
                errors: errors
            });
            return;
        }

        submitForm(formData);
    });
});
