const form = document.querySelector('.contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');

const popup = document.createElement('div');
popup.className = 'form-popup';
popup.innerHTML = `
    <button type="button" aria-label="Close message">x</button>
    <h3>Form needs attention</h3>
    <p></p>
`;
document.body.appendChild(popup);

const popupText = popup.querySelector('p');
const popupClose = popup.querySelector('button');
let popupTimer;

function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function showPopup(message){
    popupText.textContent = message;
    popup.classList.add('active');
    clearTimeout(popupTimer);
    popupTimer = setTimeout(() => {
        popup.classList.remove('active');
    }, 3500);
}

function setFieldError(input, message){
    const field = input.closest('.field');
    let error = field.querySelector('.field-error');

    if(!error){
        error = document.createElement('span');
        error.className = 'field-error';
        field.appendChild(error);
    }

    error.textContent = message;
    field.classList.add('error');
}

function clearErrors(){
    document.querySelectorAll('.field.error').forEach(field => {
        field.classList.remove('error');
    });
}

popupClose.addEventListener('click', () => {
    popup.classList.remove('active');
});

form.addEventListener('submit', function(event){
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    clearErrors();

    if(name.length === 0){
        event.preventDefault();
        setFieldError(nameInput, 'Name is required.');
        showPopup('Please enter your name before submitting the form.');
        nameInput.focus();
        return;
    }

    if(!isValidEmail(email)){
        event.preventDefault();
        setFieldError(emailInput, 'Use a valid email format.');
        showPopup('Please enter a valid email address so I can reply to your message.');
        emailInput.focus();
        return;
    }

    if(message.length < 15){
        event.preventDefault();
        setFieldError(messageInput, 'Add more project details.');
        showPopup('Please describe your project in a little more detail.');
        messageInput.focus();
    }
});
