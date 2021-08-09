//form fields
const email = document.querySelector('.email');
const form = document.getElementById('form');
const allFormInputs = form.querySelectorAll('input');
const inputDate = document.querySelector('input[name="birthdate"]');

//VALIDATOR
const hintErrorMessage = document.querySelector('.phonebook-content__hint-text');
const emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const nameSurnameRegExp = /[^a-z-' ]/gi;
const stateRegExp = /[^a-z-: ]/gi;
const genderRegExp = /(^|\s)male|female|Non-binary|I'd prefer not to specify(?=\s|$)/gi;
const cityRegExp = /(([a-z]{2,})\-([a-z]{2,}))|([a-z]{2,})/i;
const dateRegExp = /(\d){1,2}?\/(\d){1,2}?\/(\d){4}/;

//QUERIES
// *GET URLS
const url = new URL(window.location.href);
const url_subid = url.searchParams.get('sub_id');
const url_opid = url.searchParams.get('op_id');
const baseGetURL = 'https://get-proper-api.herokuapp.com/organizations/602b5d955587620015c39fc2';
const getURL = `${baseGetURL}?sub_id=${url_subid}&op_id=${url_opid}`;
// *POST URLS
const basePostURL = 'https://get-proper-api.herokuapp.com/';
const postUrlEndpoint = 'subscribers/update';
const postURL = `${basePostURL}${postUrlEndpoint}`;

const sendRequest = (e) => {
  e.preventDefault();
  const allFormInputs = e.target.querySelectorAll('input');
  const submitButton = e.target.querySelector('button');
  const filteredInputs = [...allFormInputs].filter(input => input.value.trim().length === 0);
  const spinner = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g>
    <path d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843" fill="none" stroke="#ffffff" stroke-width="15"></path>
    <path d="M49 3L49 27L61 15L49 3" fill="#ffffff"></path>
    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.2987012987012987s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
  </g>
  </svg>`;

  filteredInputs.length > 0 ? hintErrorMessage.classList.add('show') : submitButton.innerHTML = spinner; // border red for all empty inputs

  allFormInputs.forEach(input => {
    if (input.value.trim() !== '') {
      input.style.border = "1px solid #ccc";
    } else if (!input.value) {
      hintErrorMessage.innerText = 'Please enter all fields before subscribing';
      input.style.border = "1px solid #e58585";
    }
  });

  const inputsArray = Array.from(allFormInputs);
  let objInputs = {};
  const currentDate = new Date(inputDate.value);

  inputsArray.forEach(item => {
    objInputs = { ...objInputs, [item.name]: item.value } //getting all form inputs values as JSON
  });
  objInputs.subscriberID = url_subid; //pushing two additional key:values to objInputs
  objInputs.organizationID = url_opid;
  objInputs.birthdate = currentDate;

  const postData = async (url = '', data = {}) => {
    return await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data)
    });
  };

  if (filteredInputs.length === 0) {
    submitButton.disabled = true;

    objInputs = JSON.parse(JSON.stringify(objInputs));
    objInputs = JSON.stringify(objInputs);
    postData(postURL, objInputs)
      .then(() => {
        allFormInputs.forEach(item => item.value = "");
        hintErrorMessage.classList.remove('show');
        submitButton.disabled = false;
        submitButton.innerHTML = `<span class="phonebook-form__button-span">SAVED</span>`;
        submitButton.style.backgroundColor = '#59B879';
      })
      .catch(() => {
        allFormInputs.forEach(item => item.value = "");
        hintErrorMessage.classList.add('show');
        hintErrorMessage.innerText = 'Something went wrong with your submission';
        submitButton.innerHTML = `<span class="phonebook-form__button-span">accept</span>`;
        setTimeout(() => {
          hintErrorMessage.classList.remove('show');
          submitButton.disabled = false;
        }, 10000);
      });
  }
};

const validateGender = (target) => {
  if (target.classList.contains('gender')) {
    if (!genderRegExp.test(target.value)) {
      target.value = ''
      target.style.border = "1px solid red";
    } else {
      target.style.border = "1px solid #ccc";
    }
  }
};

const validateBirthdate = (target) => {
  if (target.classList.contains('date')) {
    let splitedDate = [];
    let dateString = inputDate.value;

    if (dateString.includes('/')) {
      splitedDate = inputDate.value.split('/')
    } else {
      inputDate.value = '';
    }

    if (!dateRegExp.test(dateString)) {
      inputDate.value = '';
    }

    splitedDate.forEach((dateValue, i) => {
      if (i === 0 && (dateValue > 31 || dateValue < 0)) {
        inputDate.value = '';
      }
      if (i === 1 && (dateValue > 12 || dateValue < 0)) {
        inputDate.value = '';
      }
      if (i === 2 && dateValue < 1940) {
        inputDate.value = '';
      }
    });
  }
}

const validateCity = (target) => {
  if (target.classList.contains('city')) {
    if (!cityRegExp.test(target.value)) {
      target.value = ''
      target.style.border = "1px solid red";
    } else {
      target.style.border = "1px solid #ccc";
    }
  }
};

const validateEmail = (target) => {
  if (target.classList.contains('email')) {
    if (!emailRegExp.test(target.value)) {
      hintErrorMessage.classList.add('show');
      email.style.border = "1px solid #e58585";
      hintErrorMessage.innerText = 'Please provide a valid email address before proceeding';
    } else if (emailRegExp.test(target.value)) {
      hintErrorMessage.classList.remove('show');
      email.style.border = "1px solid #ccc";
    }
  }
};

const validateNames = (target) => {
  if (target.classList.contains('form-name')
    || target.classList.contains('form-surname')
    || target.classList.contains('city')) {
    target.value = target.value.replace(nameSurnameRegExp, '');
  }
};

const validateState = (target) => {
  if (target.classList.contains('state')) {
    target.value = target.value.replace(stateRegExp, '');
  }
};

const blockInputChars = (e) => {
  const target = e.target;
  if (target.value.length === 0) {
    hintErrorMessage.classList.add('show');
    hintErrorMessage.innerText = 'Please enter all fields before subscribing';
    target.style.border = "1px solid #e58585";
  } else {
    target.style.border = "1px solid #ccc";
    const allFormInputs = document.querySelectorAll('input');
    const filteredInputs = [...allFormInputs].filter(input => input.value.trim().length === 0);
    filteredInputs.length > 0 ? hintErrorMessage.classList.remove('show') : null; // border red for all empty inputs
  }

  if (target.classList.contains('email')) {
    target.value = target.value.replace(/[^a-z0-9@-_\.\!\~\*\']/ig, '');
    target.value = target.value.replace(/@.*@/g, match => match = match.substring(0, match.length - 1));
    target.value = target.value.replace(/@(.+)/g, (match, val) => {
      let correctStr = '',
        dot = 0,
        afterDot = 3;
      for (let i = 0; i < val.length; i++) {
        if (/[a-z]/.test(val[i]) && !dot) {
          correctStr += val[i];
        }
        if (/\./.test(val[i]) && !dot) {
          if (correctStr === '') return '';
          correctStr += val[i];
          dot++;
        }
        if (/[a-z]/.test(val[i]) && dot && afterDot) {
          correctStr += val[i];
          afterDot--;
        }
      }
      return '@' + correctStr;
    });
  }

  if (target.classList.contains('date')) {
    target.value = target.value.replace(/^[^0-9/-]*/g, '');
  }

  validateState(target);
  validateNames(target);
};

// GETTING DATA FROM API

// Get:
(async () => {
  return await fetch(getURL, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer', // no-referrer, *client
  })
    .then(data => {
      return data.text();
    })
    .then((data) => Promise.resolve(data ? JSON.parse(data) : {}
    ))
    .then(data => {
      if (data && data.name) {
        const name = data.name;
        const image = data.imageURL;
        const imagePlace = document.querySelector('.phonebook-content__ava-img')
        const namePlace = document.querySelector('.phonebook-content__name-text')
        // * Setting new name and avatar from API
        imagePlace.src = image;
        namePlace.innerText = name;
      }
    })
    .catch(error => { console.error(error); Promise.reject(error); });
})();

// EVENT LISTENERS

inputDate.addEventListener('click', () => { inputDate.style.border = "1px solid #ccc"; });

allFormInputs.forEach(input => {
  input.addEventListener("blur", (e) => {
    blockInputChars(e);
    validateGender(e.target);
    validateCity(e.target);
    validateEmail(e.target);
    validateNames(e.target);
    validateBirthdate(e.target);
  });
});

form.addEventListener('input', blockInputChars);
form.addEventListener('submit', sendRequest);
