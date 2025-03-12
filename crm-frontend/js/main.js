import svgArr from '../modules/svgArr.js';
let clientsToTableArr = [];
let sortColumnFlag = 'id';
let sortDirFlag = true;
const sortSpanId = document.getElementById('sort-span-id');
const sortSpanFIO = document.getElementById('sort-span-fio');
const sortSpanCreate = document.getElementById('sort-span-create');
const sortSpanUpdate = document.getElementById('sort-span-update');
const sortSpan = document.querySelectorAll('.sort-btn-span');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const autocompleteContainer = document.getElementById('autocomplete-container');

function choices() {
    const elements = document.querySelectorAll('.js-choice');
    elements.forEach(el => {
        const choices = new Choices(el, {
            searchEnabled: false,
            itemSelectText: '',
        })
    })
}

// Создание и отрисовка кнопки добавленя клиента
function createAddClientBtn() {
    let btnContainer = document.createElement('div');
    let btn = document.createElement('button');
    let clientsContainer = document.getElementById('clients-container');

    clientsContainer.append(btnContainer);
    btnContainer.classList.add('add-client-btn-container');
    btnContainer.append(btn);
    btn.classList.add('btn-reset', 'add-client-btn');
    btn.id = 'add-client-btn';
    btn.innerHTML = svgArr.addClient + 'Добавить клиента';
}

// Создание и отрисовка формы добавление и редактирования клиента
async function createClientWindow(title, id = 0) {
    let background = document.createElement('div');
    let container = document.createElement('div');
    let form = document.createElement('form');
    let windowTitle = document.createElement('h2');
    let name = document.createElement('input');
    let surname = document.createElement('input');
    let lastName = document.createElement('input');
    let addContactContainer = document.createElement('div');
    let addContactFormContainer = document.createElement('div');
    let row = document.createElement('div');
    let clientId = document.createElement('span');
    let addContactBtnContainer = document.createElement('div');
    let addContactBtn = document.createElement('button');
    let actionsBtnsContainer = document.createElement('div');
    let saveClientBtn = document.createElement('button');
    let cancelOrDeleteBtn = document.createElement('button');
    let closeWindowBtn = document.createElement('button');
    let errorContainer = document.createElement('div');
    let plus = document.createElement('span');
    let client;

    if (id !== 0) {
        client = await loadClientServerFromId(id);
        let loadingSvg = document.getElementById('change-client-load-container');
        let triggerBtn = document.querySelector('.trigger-loading-client');
        if (triggerBtn !== null) {
            triggerBtn.removeChild(loadingSvg);
            triggerBtn.classList.remove('trigger-loading-client');
        }
    };

    document.body.prepend(background);
    background.classList.add('window-client-bg');
    setTimeout(() => {
        background.classList.add('window-client-bg-opacity');
    }, 10);
    background.id = 'window-client-bg'

    background.append(container);
    container.classList.add('client-window-container');

    setTimeout(() => {
        container.classList.add('client-window-container-scale')
    }, 10);

    container.id = 'client-window-container';

    container.append(form);
    form.classList.add('client-form');

    form.append(row);
    row.classList.add('row');

    row.append(windowTitle);
    windowTitle.classList.add('client-title');
    windowTitle.textContent = title;

    form.append(surname);
    surname.classList.add('client-input');
    surname.id = 'surname';
    surname.placeholder = 'Фамилия*';

    form.append(name);
    name.classList.add('client-input');
    name.id = 'name';
    name.placeholder = 'Имя*';

    form.append(lastName);
    lastName.classList.add('client-input');
    lastName.id = 'lastName';
    lastName.placeholder = 'Отчество';

    container.append(addContactContainer);
    addContactContainer.classList.add('add-contact-container');

    addContactContainer.append(addContactFormContainer);
    addContactFormContainer.id = 'add-contact-form-container';

    addContactFormContainer.append(addContactBtnContainer);
    addContactBtnContainer.classList.add('add-contact-btn-container');

    addContactBtnContainer.append(addContactBtn);
    addContactFormContainer.classList.add('add-contact-form-container');

    addContactBtn.append(plus);
    plus.textContent = '+';
    plus.classList.add('plus');

    addContactBtn.append('Добавить контакт');
    addContactBtn.classList.add('add-contact-btn', 'btn-reset');
    addContactBtn.id = 'add-contact-btn';

    container.append(actionsBtnsContainer);

    actionsBtnsContainer.append(errorContainer);
    errorContainer.classList.add('error-container');
    actionsBtnsContainer.classList.add('btn-save-cancel-container');

    actionsBtnsContainer.append(saveClientBtn);
    saveClientBtn.textContent = 'Сохранить';
    saveClientBtn.classList.add('client-btn-save-delete', 'btn-reset');
    saveClientBtn.id = 'save-client';

    actionsBtnsContainer.append(cancelOrDeleteBtn);

    if (id == 0) {
        cancelOrDeleteBtn.textContent = 'Отмена';
        cancelOrDeleteBtn.addEventListener('click', () => {
            closeClientWindow()
        })
    } else {
        cancelOrDeleteBtn.textContent = 'Удалить клиента';
        cancelOrDeleteBtn.addEventListener('click', () => {
            background.classList.remove('window-client-bg-opacity');
            container.classList.remove('client-window-container-scale');
            formClientDelete(id);
        })
    }
    cancelOrDeleteBtn.classList.add('client-btn-cancel', 'btn-reset');

    actionsBtnsContainer.append(closeWindowBtn);
    closeWindowBtn.innerHTML = svgArr.cross;
    closeWindowBtn.classList.add('client-btn-close', 'btn-reset');

    if (id !== 0) {
        let surnameSpan = document.createElement('span');
        let nameSpan = document.createElement('span');
        let lastNameSpan = document.createElement('span');

        surnameSpan.textContent = 'Фамилия*';
        surnameSpan.classList.add('client-input-dscr-span')

        nameSpan.textContent = 'Имя*';
        nameSpan.classList.add('client-input-dscr-span')

        lastNameSpan.textContent = 'Отчество';
        lastNameSpan.classList.add('client-input-dscr-span')

        form.insertBefore(surnameSpan, surname);
        form.insertBefore(nameSpan, name);
        form.insertBefore(lastNameSpan, lastName);

        row.append(clientId);
        row.classList.add('row-change');

        clientId.textContent = 'ID: ' + String(id);
        clientId.classList.add('change-client-id-title');

        windowTitle.classList.remove('client-title');
        windowTitle.classList.add('change-client-title');

        name.classList.add('change-client-input');
        let loadName = client.name.trim().toLowerCase()
        loadName = loadName[0].toUpperCase() + loadName.slice(1);
        name.value = loadName;

        surname.classList.add('change-client-input');
        let loadSurname = client.surname.trim().toLowerCase()
        loadSurname = loadSurname[0].toUpperCase() + loadSurname.slice(1);
        surname.value = loadSurname;

        lastName.classList.add('change-client-input');
        if (client.lastName.length > 0) {
            let loadLastName = client.lastName.trim().toLowerCase()
            loadLastName = loadLastName[0].toUpperCase() + loadLastName.slice(1);
            lastName.value = loadLastName;
        }

        let contacts = client.contacts
        let contactsLength = contacts.length;

        if (contactsLength > 0) {
            for (let contact of contacts) {
                addContactForm(contact);
            }
            tippy(document.querySelectorAll('.delete-contact-btn'), {
                offset: [0, -5],
            });
        }
        checkNumberOfContactsInClientWindow();
    }

    container.addEventListener('click', event => {
        event._isClickWithWindow = true;
    })
    background.addEventListener('click', event => {
        if (event._isClickWithWindow) return
        closeClientWindow()
    });

    closeWindowBtn.addEventListener('click', () => {
        closeClientWindow()
    });

    addContactBtn.addEventListener('click', () => {
        addContactForm()
        checkNumberOfContactsInClientWindow()
    })

    surname.addEventListener('input', () => {
        surname.classList.remove('error-input');
    });

    name.addEventListener('input', () => {
        name.classList.remove('error-input');
    });

    saveClientBtn.addEventListener('click', async () => {
        let client = {};
        let addContactFormContainer = document.getElementById('add-contact-form-container');
        let loadingBg = document.createElement('div');

        // Валидация формы клиента
        if (surname.value.trim() == '') {
            errorContainer.innerHTML = '';
            addContactContainer.classList.add('mb-8');

            let errorSpan = document.createElement('span');
            errorSpan.classList.add('error-span');
            errorContainer.append(errorSpan);
            errorSpan.textContent = 'Введите фамилию';
            surname.classList.add('error-input');
            return
        }

        if (name.value.trim() == '') {
            errorContainer.innerHTML = '';
            addContactContainer.classList.add('mb-8');

            let errorSpan = document.createElement('span');
            errorSpan.classList.add('error-span');
            errorContainer.append(errorSpan);
            errorSpan.textContent = 'Введите имя';
            name.classList.add('error-input');
            return
        }

        if (loadNewContacts(addContactFormContainer) == 'error') {
            errorContainer.innerHTML = '';
            addContactContainer.classList.add('mb-8');

            let errorSpan = document.createElement('span');
            errorSpan.classList.add('error-span');
            errorContainer.append(errorSpan);
            errorSpan.textContent = 'Все добавленные контакты должны быть полностью заполнены';
            return
        }

        container.append(loadingBg);
        loadingBg.classList.add('loading-bg');

        client.surname = surname.value;
        client.name = name.value;
        client.lastName = lastName.value;
        client.contacts = loadNewContacts(addContactFormContainer);

        let response
        if (id == 0) {
            response = await postClientServer(client);
        } else {
            response = await changeClientServer(id, client);
        }
        let responseJson = await response.json();
        let errors = responseJson.errors;

        if (response.status == 200 || response.status == 201) {
            renderTableOfClientsArr();
            closeClientWindow()
        }
        if (response.status == 422 || response.status == 404 || String(response.status)[0] == '5') {
            errorContainer.innerHTML = '';
            addContactContainer.classList.add('mb-8');
            for (let error of errors) {
                let errorSpan = document.createElement('span');
                errorSpan.classList.add('error-span');
                errorContainer.append(errorSpan);
                if (error.message == '' || error.message == undefined) {
                    errorSpan.textContent = 'Что-то пошло не так...'
                    return
                } else {
                    errorSpan.textContent = 'Ошибка: ' + error.message;
                }
            }
        }
    })
}

// Создание и отрисовка формы удаления клиента по id
function formClientDelete(id) {
    let background = document.createElement('div');
    let container = document.createElement('div');
    let title = document.createElement('h2');
    let dscr = document.createElement('span');
    let btnDelete = document.createElement('button');
    let btnCancel = document.createElement('button');
    let btnClose = document.createElement('button');
    let clientWindowBg = document.getElementById('window-client-bg');

    document.body.append(background);
    background.classList.add('window-client-bg');
    setTimeout(() => {
        background.classList.add('window-client-bg-opacity');
    }, 10);
    background.id = 'window-delete-bg';

    background.append(container);
    container.id = 'delete-client-container';
    container.classList.add('delete-client-container');
    setTimeout(() => {
        container.classList.add('delete-client-container-scale');
    }, 10);

    container.append(title);
    title.classList.add('delete-client-title');
    title.textContent = 'Удалить клиента';

    container.append(dscr);
    dscr.classList.add('delete-client-dscr');
    dscr.textContent = 'Вы действительно хотите удалить данного клиента?';

    container.append(btnDelete);
    btnDelete.classList.add('client-btn-save-delete', 'btn-reset');
    btnDelete.textContent = 'Удалить';

    container.append(btnCancel);
    btnCancel.classList.add('client-btn-cancel', 'btn-reset');
    btnCancel.textContent = 'Отмена';

    container.append(btnClose);
    btnClose.classList.add('client-btn-close', 'btn-reset');
    btnClose.innerHTML = svgArr.cross;

    container.addEventListener('click', event => {
        event._isClickWithWindow = true;
    })

    background.addEventListener('click', () => {
        if (event._isClickWithWindow) return
        closeWindowDelete();
    })

    btnClose.addEventListener('click', () => {
        closeWindowDelete();
    })

    btnDelete.addEventListener('click', () => {
        deleteClientServer(id);
        closeWindowDelete();

        if (clientWindowBg !== null) {
            closeClientWindow();
        }
        for (let client of clientsToTableArr) {
            if (client.id == id) {
                let index = clientsToTableArr.indexOf(client);
                clientsToTableArr.splice(index, 1);
            }
        }
        renderTable(clientsToTableArr);
    })

    btnCancel.addEventListener('click', () => {
        closeWindowDelete();
    })
}

// Функция закрытия окна клиента
function closeClientWindow() {
    let backgroundWindowClient = document.getElementById('window-client-bg');
    let containerWindowClient = document.getElementById('client-window-container');

    backgroundWindowClient.classList.remove('window-client-bg-opacity');
    containerWindowClient.classList.remove('client-window-container-scale')

    setTimeout(() => {
        document.body.removeChild(backgroundWindowClient);
    }, 500);
    window.location.hash = 'none';
}

// Функция закрытия окна удаления клиента
function closeWindowDelete() {
    let backgroundWindowDelete = document.getElementById('window-delete-bg');
    let containerWindowDelete = document.getElementById('delete-client-container');

    let backgroundWindowClient = document.getElementById('window-client-bg');
    let containerWindowClient = document.getElementById('client-window-container');
    if (backgroundWindowClient !== null) {
        backgroundWindowClient.classList.add('window-client-bg-opacity');
        containerWindowClient.classList.add('client-window-container-scale')
    }

    containerWindowDelete.classList.remove('delete-client-container-scale');
    backgroundWindowDelete.classList.remove('window-client-bg-opacity');

    setTimeout(() => {
        document.body.removeChild(backgroundWindowDelete);
    }, 500);
}

// Создание формы редактирования контактов в окне клиента
function addContactForm(contact = '') {
    let contactForm = document.createElement('form');
    let selectContainer = document.createElement('div');
    let contactSelect = document.createElement('select');
    let optionTel = document.createElement('option');
    let optionOther = document.createElement('option');
    let optionEmail = document.createElement('option');
    let optionVk = document.createElement('option');
    let optionFb = document.createElement('option');
    let contactInput = document.createElement('input');
    let deleteContactBtn = document.createElement('button');
    let addContactFormContainer = document.getElementById('add-contact-form-container');
    let addContactBtnContainer = addContactFormContainer.querySelector('.add-contact-btn-container');

    optionTel.value = 'telephone';
    optionTel.textContent = 'Телефон';
    optionOther.value = 'other';
    optionOther.textContent = 'Другое';
    optionEmail.value = 'email';
    optionEmail.textContent = 'Email';
    optionVk.value = 'vk';
    optionVk.textContent = 'Vk';
    optionFb.value = 'facebook';
    optionFb.textContent = 'Facebook';

    addContactFormContainer.insertBefore(contactForm, addContactBtnContainer);
    contactForm.append(selectContainer);
    selectContainer.append(contactSelect);
    contactSelect.append(optionTel);
    contactSelect.append(optionOther);
    contactSelect.append(optionEmail);
    contactSelect.append(optionVk);
    contactSelect.append(optionFb);
    contactForm.append(contactInput);

    contactForm.classList.add('add-contact-form');
    contactSelect.classList.add('add-contact-select', 'js-choice');

    contactInput.classList.add('add-contact-input');
    contactInput.placeholder = 'Введите данные контакта';

    contactForm.append(deleteContactBtn);
    deleteContactBtn.innerHTML = svgArr.delContact;
    deleteContactBtn.classList.add('delete-contact-btn');
    deleteContactBtn.setAttribute('data-tippy-content', 'Удалить контакт');
    deleteContactBtn.classList.add('btn-reset');
    deleteContactBtn.addEventListener('click', () => {
        addContactFormContainer.removeChild(contactForm);
        checkNumberOfContactsInClientWindow();
    })

    contactForm.action = '#';

    let selectOptionsLength = contactSelect.options.length;
    while (selectOptionsLength > 0) {
        if (contactSelect.options[contactSelect.options.length - selectOptionsLength].textContent == contact.type) {
            contactSelect.selectedIndex = contactSelect.options.length - selectOptionsLength;
            contactInput.value = contact.value;
        }
        selectOptionsLength -= 1;
    }
    choices()
}

// Проверка количества контактов в окне клиента
function checkNumberOfContactsInClientWindow() {
    let addContactFormContainer = document.getElementById('add-contact-form-container');
    let form = addContactFormContainer.querySelectorAll('form');
    let addContactBtn = document.getElementById('add-contact-btn')

    if (form.length > 0) {
        addContactFormContainer.classList.add('new-add-contact-form-container');
    } else {
        addContactFormContainer.classList.remove('new-add-contact-form-container');
    }
    if (form.length == 10) {
        addContactBtn.classList.add('display-none');
    } else {
        addContactBtn.classList.remove('display-none');
    }
}

// Создание объекта клиента со свойствами как в таблице
function createClientObject(client) {
    let newClient = {}
    newClient.id = client.id;

    let surname = client.surname.trim();
    surname = surname.toLowerCase();
    surname = surname[0].toUpperCase() + surname.slice(1);

    let name = client.name.trim();
    name = name.toLowerCase();
    name = name[0].toUpperCase() + name.slice(1);

    let lastname = client.lastName.trim();
    if (lastname !== '') {
        lastname = lastname.toLowerCase();
        lastname = lastname[0].toUpperCase() + lastname.slice(1);
    }

    let FIO = surname + ' ' + name + ' ' + lastname;

    newClient.fio = FIO;

    let createTime = new Date(client.createdAt);
    let createDate = Number(createTime.getDate());
    let createDateStr = '';
    let createMonth = Number(createTime.getMonth()) + 1;
    let createMonthStr = '';
    let createHours = Number(createTime.getHours());
    let createHoursStr = '';
    let createMinutes = Number(createTime.getMinutes());
    let createMinutesStr = '';

    if (createDate < 10) {
        createDateStr = '0' + String(createDate);
    } else {
        createDateStr = String(createDate)
    }

    if (createMonth < 10) {
        createMonthStr = '0' + String(createMonth);
    } else {
        createMonthStr = String(createMonth)
    }

    if (createHours < 10) {
        createHoursStr = '0' + String(createHours);
    } else {
        createHoursStr = String(createHours);
    }

    if (createMinutes < 10) {
        createMinutesStr = '0' + String(createMinutes);
    } else {
        createMinutesStr = String(createMinutes);
    }

    let createdStr = createDateStr + '.' + createMonthStr + '.' + createTime.getFullYear() + ' ' + createHoursStr + ':' + createMinutesStr;
    newClient.createdAt = createdStr;

    let updateTime = new Date(client.updatedAt);
    let updateDate = Number(updateTime.getDate());
    let updateDateStr = '';
    let updateMonth = Number(updateTime.getMonth()) + 1;
    let updateMonthStr = '';
    let updateHours = Number(updateTime.getHours());
    let updateHoursStr = '';
    let updateMinutes = Number(updateTime.getMinutes());
    let updateMinutesStr = '';

    if (updateDate < 10) {
        updateDateStr = '0' + String(updateDate);
    } else {
        updateDateStr = String(updateDate)
    }


    if (updateMonth < 10) {
        updateMonthStr = '0' + String(updateMonth);
    } else {
        updateMonthStr = String(updateMonth)
    }

    if (updateHours < 10) {
        updateHoursStr = '0' + String(updateHours);
    } else {
        updateHoursStr = String(updateHours);
    }

    if (updateMinutes < 10) {
        updateMinutesStr = '0' + String(updateMinutes);
    } else {
        updateMinutesStr = String(updateMinutes);
    }

    let updatedStr = updateDateStr + '.' + updateMonthStr + '.' + updateTime.getFullYear() + ' ' + updateHoursStr + ':' + updateMinutesStr;
    newClient.updatedAt = updatedStr;

    newClient.contacts = client.contacts;

    return newClient
}

// Создание контаков
function loadNewContacts(container) {
    let newContacts = [];
    let formArr = container.querySelectorAll('form');

    for (let form of formArr) {
        let newContact = {};
        let select = form.querySelector('select');
        let input = form.querySelector('input')
        if (input.value.trim() == '') {
            newContacts = 'error';
            return newContacts
        }
        newContact.type = select.options[select.selectedIndex].textContent;
        newContact.value = input.value;
        newContacts.push(newContact);
    }
    return newContacts
}

// Создание одного клиента в таблице
function renderClient(client) {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdFIO = document.createElement('td');
    let tdCreateDate = document.createElement('td');
    let createDateSpan = document.createElement('span');
    let createTimeSpan = document.createElement('span');
    let tdUpdateDate = document.createElement('td');
    let updateDateSpan = document.createElement('span');
    let updateTimeSpan = document.createElement('span');
    let tdContactsContainer = document.createElement('div');
    let tdContacts = document.createElement('td');
    let tdActions = document.createElement('td');
    let btnChange = document.createElement('button');
    let btnDelete = document.createElement('button');
    let tableBody = document.getElementById('table-body');

    tableBody.append(tr);

    tr.append(tdId);
    tdId.classList.add('client-id');

    tr.append(tdFIO);
    tr.append(tdCreateDate);

    tdCreateDate.append(createDateSpan);
    createDateSpan.classList.add('date-span');

    tdCreateDate.append(createTimeSpan);
    createTimeSpan.classList.add('time-span');

    tr.append(tdUpdateDate);
    tdUpdateDate.append(updateDateSpan);
    updateDateSpan.classList.add('date-span');
    tdUpdateDate.append(updateTimeSpan);
    updateTimeSpan.classList.add('time-span');

    tr.append(tdContacts);
    tdContacts.append(tdContactsContainer);
    tdContactsContainer.classList.add('client-contacts');

    tr.append(tdActions);
    tdActions.append(btnChange);
    tdActions.append(btnDelete);

    // Создаём кнопки и события изменения и удаления клиента
    btnChange.textContent = 'Изменить';
    btnChange.classList.add('btn-reset', 'btn-change');
    btnDelete.textContent = 'Удалить';
    btnDelete.classList.add('btn-reset', 'btn-delete');

    btnChange.addEventListener('click', () => {
        let loadingIndicatorContainer = document.createElement('div');
        btnChange.classList.add('trigger-loading-client')

        btnChange.append(loadingIndicatorContainer);
        loadingIndicatorContainer.innerHTML = svgArr.loadChange;

        loadingIndicatorContainer.id = 'change-client-load-container';
        loadingIndicatorContainer.classList.add('change-client-load-container');
        setTimeout(() => {
            loadingIndicatorContainer.querySelector('.load-change').classList.add('transform-circle');
        }, 10);

        createClientWindow('Изменить данные', client.id);
        window.location.hash = client.id;
    });

    btnDelete.addEventListener('click', () => {
        formClientDelete(client.id);
    })

    tdId.append(client.id);
    tdFIO.append(client.fio)
    createDateSpan.append(client.createdAt.slice(0, 10));
    createTimeSpan.append(client.createdAt.slice(11, 16));
    updateDateSpan.append(client.updatedAt.slice(0, 10));
    updateTimeSpan.append(client.updatedAt.slice(11, 16));

    // Создаём контакты с иконками
    if (client.contacts.length > 0) {
        for (let contact of client.contacts) {
            let svgOther = document.createElement('div');
            svgOther.classList.add('svg-div');
            svgOther.innerHTML = (svgArr.other);
            let svgMail = document.createElement('div');
            svgMail.classList.add('svg-div');
            svgMail.innerHTML = (svgArr.mail);
            let svgTel = document.createElement('div');
            svgTel.classList.add('svg-div');
            svgTel.innerHTML = (svgArr.tel);
            let svgVk = document.createElement('div');
            svgVk.classList.add('svg-div');
            svgVk.innerHTML = (svgArr.vk);
            let svgFb = document.createElement('div');
            svgFb.classList.add('svg-div');
            svgFb.innerHTML = (svgArr.fb);

            if (contact.type == 'Другое') {
                tdContactsContainer.append(svgOther);
                svgOther.setAttribute('data-tippy-content', contact.type + ': ' + contact.value);
            }
            if (contact.type == 'Телефон') {
                tdContactsContainer.append(svgTel);
                svgTel.setAttribute('data-tippy-content', contact.type + ': ' + contact.value);
            }
            if (contact.type == 'Email') {
                tdContactsContainer.append(svgMail);
                svgMail.setAttribute('data-tippy-content', contact.type + ': ' + contact.value);
            }
            if (contact.type == 'Vk') {
                tdContactsContainer.append(svgVk);
                svgVk.setAttribute('data-tippy-content', contact.type + ': ' + contact.value);
            }
            if (contact.type == 'Facebook') {
                tdContactsContainer.append(svgFb);
                svgFb.setAttribute('data-tippy-content', contact.type + ': ' + contact.value);
            }
        }

        let svgDivArr = tdContactsContainer.querySelectorAll('.svg-div');
        let svgDivArrLength = svgDivArr.length;
        let btnOpenContacts = document.createElement('button');
        btnOpenContacts.classList.add('btn-open-contacts', 'btn-reset');
        if (svgDivArrLength > 5) {
            tdContactsContainer.append(btnOpenContacts);
            let x = 4;
            btnOpenContacts.textContent = '+' + String(svgDivArrLength - x);
            while (svgDivArrLength > x) {
                svgDivArr[x].classList.add('display-none');
                x += 1;
            }
        }
        btnOpenContacts.addEventListener('click', () => {
            for (let svgDiv of svgDivArr) {
                svgDiv.classList.remove('display-none');
            }
            let n = 5;
            let m = 0;
            while (m < n) {
                svgDivArr[m].classList.add('mb-10');
                m += 1;
            }
            tdContactsContainer.removeChild(btnOpenContacts);
        })
    }
}

// Отрисовка таблицы
function renderTable(arr) {
    document.getElementById('table-body').innerHTML = '';

    let copyClientsList = [...arr];

    // Подсветка активной колонки таблицы
    for (let item of sortSpan) {
        item.classList.remove('active-sort');
    }

    if (sortColumnFlag == 'id') {
        sortSpanId.classList.add('active-sort');
    }

    if (sortColumnFlag == 'fio') {
        sortSpanFIO.classList.add('active-sort');
    }

    if (sortColumnFlag == 'createdAt') {
        sortSpanCreate.classList.add('active-sort');
    }

    if (sortColumnFlag == 'updatedAt') {
        sortSpanUpdate.classList.add('active-sort');
    }

    // Сортировка
    copyClientsList = copyClientsList.sort(function (a, b) {
        let sort = a[sortColumnFlag] < b[sortColumnFlag]
        if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag]
        if (sort) return -1
    });

    // Отрисовка всех клиентов
    for (let client of copyClientsList) {
        renderClient(client)
    }
    tippy('[data-tippy-content]');
}

let autocompleteBtnArr;
let autocompleteBtnArrLength;
let autocompleteFlag;
let startFlag

// Фильтрация таблицы
let filterTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(filterClients, 300);
})

async function filterClients() {
    let loadingIndicatorContainer = document.createElement('div');
    let table = document.getElementById('table-body');
    let loadingIndicator = document.createElement('div');
    loadingIndicator.innerHTML = svgArr.loadCircle;
    loadingIndicator.classList.add('load-indicator');

    table.prepend(loadingIndicatorContainer);
    loadingIndicatorContainer.classList.add('loading-indicator-container');
    loadingIndicatorContainer.append(loadingIndicator);
    setTimeout(() => {
        loadingIndicator.classList.add('transform-circle');
    }, 10);

    autocompleteContainer.innerHTML = '';

    let clientsFromServer = await loadClientsFromServer();

    if (searchInput.value.trim().length < 2) {
        autocompleteContainer.innerHTML = '';
    } else {
        for (let client of clientsFromServer) {
            if (client.name.trim().toLowerCase().includes(searchInput.value.toLowerCase()) || client.surname.trim().toLowerCase().includes(searchInput.value.toLowerCase())) {
                let repeatTrigger = false;
                let searchWords = document.querySelectorAll('.autocomplete-btn')

                let surname = client.surname.trim();
                surname = surname.toLowerCase();
                surname = surname[0].toUpperCase() + surname.slice(1);

                let name = client.name.trim();
                name = name.toLowerCase();
                name = name[0].toUpperCase() + name.slice(1);

                for (let item of searchWords) {
                    if (item.textContent == (surname + ' ' + name)) {
                        repeatTrigger = true;
                    }
                }

                if (repeatTrigger == false) {
                    let autocompleteBtn = document.createElement('button');

                    autocompleteBtn.classList.add('btn-reset', 'autocomplete-btn');
                    autocompleteContainer.append(autocompleteBtn);

                    autocompleteBtn.textContent = surname + ' ' + name;

                    autocompleteBtn.addEventListener('click', () => {
                        searchInput.value = autocompleteBtn.textContent;
                        filterClients();
                    })
                }
            }
        }
        autocompleteBtnArr = document.querySelectorAll('.autocomplete-btn');
        autocompleteBtnArrLength = autocompleteBtnArr.length;
        autocompleteFlag = true;
        startFlag = true;
    }

    clientsToTableArr = await createClientsArr();
    clientsToTableArr = clientsToTableArr.filter(function (oneClient) {
        for (let key in oneClient) {
            if (typeof oneClient[key] == 'string') {
                if (oneClient[key].trim().toLowerCase().includes(searchInput.value.toLowerCase())) return true
            }
        }
    })
    renderTable(clientsToTableArr);
}

document.addEventListener('keydown', (e) => {
    if (e.code == 'ArrowDown') {
        if (autocompleteFlag == true) {
            e.preventDefault();

            if (startFlag == true) {
                autocompleteBtnArrLength = autocompleteBtnArr.length;
                autocompleteBtnArr[autocompleteBtnArr.length - autocompleteBtnArrLength].focus()
                startFlag = false;
            } else {
                autocompleteBtnArrLength -= 1;
                if (autocompleteBtnArrLength == 0) {
                    document.getElementById('search-input').focus();
                    startFlag = true;
                } else {
                    autocompleteBtnArr[autocompleteBtnArr.length - autocompleteBtnArrLength].focus()
                }
            }
        }
    }
    if (e.code == 'ArrowUp') {
        if (autocompleteFlag == true) {
            e.preventDefault();

            if (startFlag == true) {
                autocompleteBtnArrLength = autocompleteBtnArr.length - autocompleteBtnArr.length + 1;
                autocompleteBtnArr[autocompleteBtnArr.length - autocompleteBtnArrLength].focus();
                startFlag = false;
            } else {
                autocompleteBtnArrLength += 1;
                if (autocompleteBtnArrLength == autocompleteBtnArr.length + 1) {
                    document.getElementById('search-input').focus();
                    startFlag = true;
                } else {
                    autocompleteBtnArr[autocompleteBtnArr.length - autocompleteBtnArrLength].focus();
                }
            }
        }
    }
})

searchForm.addEventListener('click', event => {
    event._isClickWithWindow = true;
})
document.body.addEventListener('click', event => {
    if (event._isClickWithWindow) return
    autocompleteContainer.innerHTML = '';
    autocompleteFlag = false;
});

document.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') autocompleteContainer.innerHTML = '';
});

// Установка стрелок направления сортировки в стандартное положение
function arrowDefault() {
    let arrowArr = document.querySelectorAll('.svg-arrow');
    for (let arrow of arrowArr) {
        arrow.classList.remove('transform');
    }
}

// Сортировка таблицы
let sortID = document.getElementById('sort-id')
let sortFIO = document.getElementById('sort-fio')
let sortDateCreated = document.getElementById('sort-date-create')
let sortDateUpdated = document.getElementById('sort-date-update')
let arrowId = document.getElementById('svg-arrow-id');
let arrowFIO = document.getElementById('svg-arrow-fio');
let arrowCreate = document.getElementById('svg-arrow-create');
let arrowUpdate = document.getElementById('svg-arrow-update');

sortID.addEventListener('click', function () {
    sortColumnFlag = 'id';
    arrowDefault();
    if (!String(sortSpanId.classList).includes('active-sort')) {
        sortDirFlag = false;
    }
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag == false) {
        arrowId.classList.add('transform');
    } else {
        arrowId.classList.remove('transform');
    }

    renderTable(clientsToTableArr)
});

sortFIO.addEventListener('click', () => {
    sortColumnFlag = 'fio';
    arrowDefault();
    if (!String(sortSpanFIO.classList).includes('active-sort')) {
        sortDirFlag = false;
    }
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag == false) {
        arrowFIO.classList.add('transform');
    } else {
        arrowFIO.classList.remove('transform');
    }

    renderTable(clientsToTableArr)
});

sortDateCreated.addEventListener('click', function () {
    sortColumnFlag = 'createdAt';
    arrowDefault();
    if (!String(sortSpanCreate.classList).includes('active-sort')) {
        sortDirFlag = false;
    }
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag == false) {
        arrowCreate.classList.add('transform');
    } else {
        arrowCreate.classList.remove('transform');
    }

    renderTable(clientsToTableArr)
});

sortDateUpdated.addEventListener('click', function () {
    sortColumnFlag = 'updatedAt';
    arrowDefault();
    if (!String(sortSpanUpdate.classList).includes('active-sort')) {
        sortDirFlag = false;
    }
    sortDirFlag = !sortDirFlag;
    if (sortDirFlag == false) {
        arrowUpdate.classList.add('transform');
    } else {
        arrowUpdate.classList.remove('transform');
    }

    renderTable(clientsToTableArr)
});

// Загрузка массива клиентов с сервера
async function loadClientsFromServer() {
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    clientsToTableArr = [];
    return data
}

// Создание массива клиентов для добавления в таблицу
async function createClientsArr() {
    let data = await loadClientsFromServer();
    for (let client of data) {
        clientsToTableArr.push(createClientObject(client));
    }
    return clientsToTableArr
}

// Отрисовка таблицы по массиву клиентов для добавления в таблицу
async function renderTableOfClientsArr() {
    renderTable(await createClientsArr());
}

// Первичная загрузка клиентов в таблицу с сервера
async function firstRenderTableOfClientsArr() {
    let circle = document.getElementById('circle');
    circle.classList.add('transform-circle');
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();

    for (let client of data) {
        clientsToTableArr.push(createClientObject(client));
    }
    renderTable(clientsToTableArr);
    document.getElementById('clients-container').removeChild(document.getElementById('circle-container'));
    document.getElementById('clients-table').classList.add('mb-40');

    createAddClientBtn();
    // Открытие формы добавления клиента
    const addClientBtn = document.getElementById('add-client-btn');
    addClientBtn.addEventListener('click', () => {
        createClientWindow('Новый клиент')
    })
    createHashLink()
}

// Отправка нового клиента на сервер
async function postClientServer(client) {
    const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
    });
    return response
}

// Запрос информации о клиенте по id, возвращает объект клиента
async function loadClientServerFromId(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'GET'
    });
    let client = await response.json();
    return client
}

// Удаление клиента с сервера по id
async function deleteClientServer(id) {
    await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
    });
}

// Изменение данных клиента на сервере по id
async function changeClientServer(id, client) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PATCH',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
    });
    return response
}

function createHashLink() {
    let hash = window.location.hash;
    for (let client of clientsToTableArr) {
        if (String(client.id) == hash.slice(1)) {
            createClientWindow('Изменить данные', client.id);
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
        if (document.getElementById('window-delete-bg') !== null) {
            closeWindowDelete();
            return
        }
        if (document.getElementById('window-client-bg') !== null) {
            closeClientWindow();
        }
    }
});

firstRenderTableOfClientsArr();
