var $_ = (selector, node = document) => node.querySelector(selector);


// var elIdish = $_('.idish');
// var elButton = $_('button', elIdish);

var $$_ = (selector, node = document) => node.querySelectorAll(selector);

var createElement = (element, elementClass, text) => {
  var newElement = document.createElement(element);

  if (elementClass) {
    newElement.setAttribute('class', elementClass);
  }

  if (text) {
    newElement.textContent = text;
  }

  return newElement;
};


var contacts = [];
var relationshipOptions = [];


var elContactForm = $_('.js-contact-form');
if (elContactForm) {
  var elNameInput = $_('.js-contact-form__name-input', elContactForm);
  var elRelationshipInput = $_('.js-contact-form__relationship-input', elContactForm);
  var elRelationshipDatalist = $_('#relationships-list', elContactForm);
  var elPhoneInput = $_('.js-contact-form__phone-input', elContactForm);
}

var elContactsList = $_('.js-contacts');

var elContactsItemTemplate = $_('.contacts-item-template').content;
var elDatalistOptionTemplate = $_('.datalist-option-template').content;


var createContactElement = (contact, index) => {
  var elContactItem = elContactsItemTemplate.cloneNode(true);
  $_('.js-contact__name', elContactItem).textContent = contact.name;
  $_('.js-contact__relationship', elContactItem).textContent = contact.relationship;
  $_('.js-contact__phone', elContactItem).textContent = contact.phoneNumber;
  $_('.js-contact__phone', elContactItem).href = `tel:${contact.phoneNumber}`;
  $_('.js-contact__delete-button', elContactItem).dataset.contactId = index;

  return elContactItem;
  // js-contact__delete-button
};

var displayContacts = () => {
  elContactsList.innerHTML = '';

  var elContactsFragment = document.createDocumentFragment();

  contacts.forEach((contact, index) => {
    elContactsFragment.appendChild(createContactElement(contact, index));
  });

  elContactsList.appendChild(elContactsFragment);
};

var addContact = (contact) => {
  contacts.push(contact);
  displayContacts();
};

var deleteContact = (contactIndex) => {
  contacts.splice(contactIndex, 1);
  displayContacts();
};

var clearContactInputs = () => {
  elNameInput.value = '';
  elRelationshipInput.value = '';
  elPhoneInput.value = '';
};

var phoneNumberExists = (phoneNumber) => {
  var doesExist = false;

  contacts.forEach((contact) => {
    if (contact.phoneNumber === phoneNumber) {
      doesExist = true;
    }
  });

  return doesExist;
};

var displayRelationshipOptions = () => {
  elRelationshipDatalist.innerHTML = '';

  var relationshipOptionsFragment = document.createDocumentFragment();

  relationshipOptions.forEach( (rel) => {
    var elRelOption = elDatalistOptionTemplate.cloneNode(true);
    elRelOption.setAttribute('value', rel);

    relationshipOptionsFragment.appendChild(elRelOption);
  });

  elRelationshipDatalist.appendChild(relationshipOptionsFragment);
};

var addRelationship = (relationship) => {
  relationshipOptions.push(relationship);
  displayRelationshipOptions();
};


if (elContactForm) {
  elContactForm.addEventListener('submit', (evt) =>{
    evt.preventDefault();

    var contact = {
      name: elNameInput.value,
      relationship: elRelationshipInput.value,
      phoneNumber: elPhoneInput.value
    };

    elPhoneInput.classList.remove('is-invalid');
    if (phoneNumberExists(contact.phoneNumber)) {
      elPhoneInput.classList.add('is-invalid');
      return;
    }

    addContact(contact);

    if (!relationshipOptions.includes(contact.relationship)) {
      addRelationship(contact.relationship);
    }

    clearContactInputs();
    elNameInput.focus();
  });
}

if (elContactsList) {
  elContactsList.addEventListener('click', function (evt) {
    if (evt.target.matches('.js-contact__delete-button')) {
      var contactIndex = Number(evt.target.dataset.contactId);
      deleteContact(contactIndex);
    }
  });
}
