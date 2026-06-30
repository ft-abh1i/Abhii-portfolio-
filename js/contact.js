const form = document.querySelector('.contact-form');
const contactIntro = document.querySelector('.contact-wrap > p');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const submitButton = form.querySelector('button[type="submit"]');

const popup = document.createElement('div');
popup.className = 'form-popup';
popup.innerHTML = `
    <button type="button" aria-label="Close message">x</button>
    <h3>Form needs attention</h3>
    <p></p>
`;
contactIntro.insertAdjacentElement('afterend', popup);

const popupTitle = popup.querySelector('h3');
const popupText = popup.querySelector('p');
const popupClose = popup.querySelector('button');
let popupTimer;

function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function showPopup(title, message){
    popupTitle.textContent = title;
    popupText.textContent = message;
    popup.classList.add('active');
    clearTimeout(popupTimer);
    popupTimer = setTimeout(() => {
        popup.classList.remove('active');
    }, 6125);
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

form.addEventListener('submit', async function(event){
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    clearErrors();

    if(name.length === 0){
        setFieldError(nameInput, 'Name is required.');
        showPopup('Name required', 'Please enter your name before submitting the form.');
        nameInput.focus();
        return;
    }

    if(!isValidEmail(email)){
        setFieldError(emailInput, 'Use a valid email format.');
        showPopup('Invalid email address', 'Please enter a valid email address so I can reply to your message.');
        emailInput.focus();
        return;
    }

    if(message.length < 15){
        setFieldError(messageInput, 'Add more project details.');
        showPopup('Project details required', 'Please describe your project in a little more detail.');
        messageInput.focus();
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try{
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if(response.ok){
            form.reset();
            showPopup('Message sent', 'Thanks for reaching out. I will get back to you soon.');
        }else{
            showPopup('Message not sent', 'Something went wrong. Please try again in a moment.');
        }
    }catch(error){
        showPopup('Network error', 'Please check your connection and try again.');
    }

    submitButton.disabled = false;
    submitButton.textContent = 'Send Message →';
});
