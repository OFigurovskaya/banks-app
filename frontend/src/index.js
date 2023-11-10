import JustValidate from 'just-validate';
import { el, mount } from 'redom';
import './style.scss';
import logo from './assets/images/Logo.png';
import Navigo from 'navigo';
import Chart from 'chart.js/auto';
import { getHeader } from './header';
import { getMenu } from './menu';
import { getToken, updteLS, changeDate, changeDateTable, getCraph, getSumArr } from './allFunctions';
import * as ymaps3 from 'ymaps3';


const router = new Navigo('/');

router.on('/currencies', () => {
    renderCurrencies()
});

router.on('/accounts', () => {
    renderCardPage(accountsList)
})

router.on('/banks', () => {
    renderBanks(accountsList)
})

//получить токен
const token = await getToken();

//получить все счета:
const response = await fetch('http://localhost:3000/accounts/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
    },
});
const res = await response.json();
let accountsList = [...res.payload];


//page1
router.on('/', () => {
    const container = el('div');
    container.classList.add('container');
    mount(window.document.body, container);

    const headerEntry = el('div');
    headerEntry.classList.add('headerEntry');
    mount(container, headerEntry);

    const img = el('img');
    img.src = logo;
    img.classList.add('headerEntry__img');
    mount(headerEntry, img);

    const entryWind = el('div');
    entryWind.classList.add('entryWind');
    mount(document.querySelector('.container'), entryWind);

    const entryWindTitle = el('h1', 'Вход в аккаунт');
    entryWindTitle.classList.add('entryWind__title');
    mount(entryWind, entryWindTitle);

    const entryForm = el('form');
    entryForm.classList.add('entryWind__form');
    entryForm.classList.add('form');
    mount(entryWind, entryForm);

    const divLogin = el('div');
    divLogin.classList.add('form__login');
    const labelLogin = el('label');
    labelLogin.textContent = 'Логин';
    labelLogin.classList.add('form__loginlabel');
    const inputLogin = el('input');
    inputLogin.classList.add('entryWind__form__login__input')
    mount(divLogin, labelLogin);
    mount(divLogin, inputLogin);
    mount(entryForm, divLogin);

    const divPassword = el('div');
    divPassword.classList.add('form__password');
    const labelPassword = el('label');
    labelPassword.textContent = 'Пароль';
    labelPassword.classList.add('form__password-label');
    const inputPassword = el('input', { type: 'password' });
    inputPassword.classList.add('entryWind__form__password__input')
    mount(divPassword, labelPassword);
    mount(divPassword, inputPassword);
    mount(entryForm, divPassword);

    const entryFormButton = el('button');
    entryFormButton.classList.add('entryWind__form__btn');
    const entryFormButtonHref = el('a');
    entryFormButtonHref.classList.add('entryWind__form__btn__href');
    entryFormButtonHref.textContent = 'Войти';
    entryFormButtonHref.dataset.navigo = 'navigo';
    mount(entryFormButton, entryFormButtonHref);
    mount(entryForm, entryFormButton);

    const validation = new JustValidate('.entryWind__form');
    validation
        .addField('.entryWind__form__login__input', [
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'Слишком короткий логин'
            },
            {
                rule: 'required',
                errorMessage: 'Введите логин'
            },
            {
                rule: 'customRegexp',
                value: /^\S*$/,
                errorMessage: 'Логин не должен содержать пробелов'
            }
        ])
        .addField('.entryWind__form__password__input', [
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'Пароль должен содержать минимум 6 символов'
            },
            {
                rule: 'required',
                errorMessage: 'Введите пароль'
            },
            {
                rule: 'customRegexp',
                value: /^\S*$/,
                errorMessage: 'Пароль не должен содержать пробелов'
            }
        ]);

    entryFormButton.addEventListener('click', async (e) => {
        e.preventDefault();
        document.querySelector('.entryWind__form__btn__href').href = '/accounts';
        if (inputLogin.value === 'developer' && inputPassword.value === 'developer') {
            renderCardPage(accountsList);
            updteLS(accountsList);
        } else {
            const p = el('p', 'Такой пользователь не найден');
            entryFormButton.style.marginBottom = '1vh';
            p.style.color = 'red';
            p.style.marginBottom = '1vh';
            mount(entryForm, p);
        }
    })
})


//render Page History
function renderHistory(data) {
    document.querySelector('.bodyAccount__transfer').style.display = 'none';
    document.querySelector('.bodyAccount__dynamic').classList.add('graph1');
    document.querySelector('.bodyAccount__dynamic__graph').removeChild(document.querySelector('#myChart'));
    const divGraph = el('canvas#myChart');
    divGraph.style.width = '850px';
    mount(document.querySelector('.bodyAccount__dynamic__graph'), divGraph)

    let sumArr = getSumArr(data);

    let monthMax;
    for (let i = 0; i < data.length; i++) {
        let dataMax = new Date(((data[data.length - 1]).date));
        monthMax = dataMax.getMonth() + 1;
    }

    let months = ['янв', 'фев', 'март', 'апр', 'май', 'июнm', 'июлm', 'авг', 'сент', 'окт', 'ноя', 'дек'];
    let datesGraph = [];
    let sumMonth = [];

    for (let i = (monthMax - 6); i <= months.length - 1; i++) {
        datesGraph.push(months[i]);
    }

    for (let i = monthMax - 6; i <= months.length - 1; i++) {
        sumMonth.push(sumArr[i]);
    }

    getCraph(divGraph, datesGraph, sumMonth)


    const divWrap = el('div.graph2');
    const divGraph2 = el('canvas#myChart');
    divGraph2.style.width = '850px';
    const titleGraph2 = el('h3.bodyAccount__dynamic__title2', 'Соотношение входящих исходящих транзакций');
    mount(divWrap, titleGraph2);
    mount(document.querySelector('.bodyAccount'), divWrap)
    mount(divWrap, divGraph2);

    let sumMonth2 = [];

    for (let i = 0; i <= months.length; i++) {
        sumMonth2.push(sumArr[i]);
    }

    let number = (document.querySelector('.bodyAccount__requisite__number').textContent).substring(2);

    let obj = {};

    for (let elemData of data) {
        if (elemData.from === number) {
            obj.plus = elemData.amount;
        }
        else {
            obj.minus = elemData.amount;
        }
    }

    let arrMonth = [];

    let arr2 = [];
    for (let i = monthMax - 2; i < months.length; i++) {
        arrMonth.push(months[i])
    }

    for (let j = 0; j < monthMax - 2; j++) {
        arr2.push(months[j])
    }

    for (let elem of arr2) {
        arrMonth.push(elem)
    }

    new Chart(divGraph2, {
        type: 'bar',
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        },
        data: {
            labels: arrMonth,
            datasets: [
                {
                    data: String(obj.plus),
                    borderColor: '#76CA66',
                    backgroundColor: '#76CA66',
                },
                {
                    data: String(obj.minus),
                    borderColor: '#BA0000',
                    backgroundColor: '#BA0000',
                }
            ],
        },
    });
};


//render Page 1 account //det schet
function renderAccount(arr) {
        getHeader()

    setTimeout(function () {
        document.querySelector('.preloader').style.display = 'none';

        if (!document.querySelector('.divHeaderListWrapper')) {
            getMenu()
        }

        document.querySelector('.headerEntry').style.display = 'flex';
        document.querySelector('.headerEntry').style.justifyContent = 'space-between';
        document.querySelector('.headerEntry').style.marginBottom = '6vh';


        const bodyAccount = el('div');
        bodyAccount.classList.add('bodyAccount');
        mount(document.querySelector('.container'), bodyAccount);

        const bodyAccountRequisite = el('div');
        bodyAccountRequisite.classList.add('bodyAccount__requisite');
        mount(bodyAccount, bodyAccountRequisite);

        const h1 = el('h1', 'Просмотр счета');
        h1.classList.add('bodyAccount__requisite__title')
        const divBackBtn = el('button');
        divBackBtn.classList.add('bodyAccount__requisite__btn');
        const divBackBtnHref = el('a');
        divBackBtnHref.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7.83 11L11.41 7.41L10 6L4 12L10 18L11.41 16.59L7.83 13H20V11H7.83Z" fill="white"/>
        </svg>` + 'Вернуться назад';
        divBackBtnHref.classList.add('bodyAccount__requisite__btn__href');
        divBackBtnHref.dataset.navigo = 'navigo';
        divBackBtnHref.href = '/accounts';

        mount(bodyAccountRequisite, h1);
        mount(bodyAccountRequisite, divBackBtn);
        mount(divBackBtn, divBackBtnHref);

        const numberAccount = el('p', `№ ${arr.account}`);
        numberAccount.classList.add('bodyAccount__requisite__number');
        mount(bodyAccountRequisite, numberAccount);

        const balanceAccount = el('div');
        balanceAccount.classList.add('bodyAccount__requisite__balance');
        const balanceAccountTitle = el('p', 'Баланс');
        balanceAccountTitle.classList.add('bodyAccount__requisite__balance__title');
        const balanceAccountSum = el('p', `${arr.balance} ₽`);
        balanceAccountSum.classList.add('bodyAccount__requisite__balance__sum');
        mount(balanceAccount, balanceAccountTitle);
        mount(balanceAccount, balanceAccountSum);
        mount(bodyAccountRequisite, balanceAccount);

        const bodyAccountTransfer = el('div');
        bodyAccountTransfer.classList.add('bodyAccount__transfer');
        const bodyAccountTransferForm = el('form');
        bodyAccountTransferForm.classList.add('bodyAccount__transfer__form');
        const bodyAccountTransferFormTitle = el('h3', 'Новый перевод');
        bodyAccountTransferFormTitle.classList.add('bodyAccount__transfer__form__title');

        const bodyAccountTransferFormNumberWrap = el('div.bodyAccount__transfer__form__number-wrapper');
        const bodyAccountTransferFormNumberL = el('label', 'Номер счёта получателя');
        bodyAccountTransferFormNumberL.classList.add('bodyAccount__transfer__form__number__label');
        const bodyAccountTransferFormNumberInput = el('select');
        bodyAccountTransferFormNumberInput.classList.add('bodyAccount__transfer__form__number__select');

        

        //option
        let str = localStorage.getItem('key');
        let res = JSON.parse(str);
        for (let elem of res) {
            const option = el('option', `${elem.account}`);
            mount(bodyAccountTransferFormNumberInput, option);
        }
        //end option


        const bodyAccountTransferFormSumWrap = el('div.bodyAccount__transfer__form__sum-wrapper');
        const bodyAccountTransferFormSumL = el('label', 'Сумма перевода');
        bodyAccountTransferFormSumL.classList.add('bodyAccount__transfer__form__sum__label');

        const bodyAccountTransferFormSumInput = el('input');
        bodyAccountTransferFormSumInput.type = 'Number';
        bodyAccountTransferFormSumInput.placeholder = 'Веедите сумму';
        bodyAccountTransferFormSumInput.classList.add('bodyAccount__transfer__form__sum__input');
        const divGet = el('button.bodyAccount__transfer__form__btn');
        divGet.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20H4C2.89543 20 2 19.1046 2 18V5.913C2.04661 4.84255 2.92853 3.99899 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20ZM4 7.868V18H20V7.868L12 13.2L4 7.868ZM4.8 6L12 10.8L19.2 6H4.8Z" fill="white"/>
        </svg>
        ` + 'Отправить';

        mount(bodyAccountTransferForm, bodyAccountTransferFormTitle);
        mount(bodyAccountTransferForm, bodyAccountTransferFormNumberWrap);
        mount(bodyAccountTransferForm, bodyAccountTransferFormSumWrap);
        mount(bodyAccountTransferFormNumberWrap, bodyAccountTransferFormNumberL);
        mount(bodyAccountTransferFormNumberWrap, bodyAccountTransferFormNumberInput);

        mount(bodyAccountTransferFormSumWrap, bodyAccountTransferFormSumL);
        mount(bodyAccountTransferFormSumWrap, bodyAccountTransferFormSumInput);

        mount(bodyAccountTransferForm, divGet);
        mount(bodyAccountTransfer, bodyAccountTransferForm);
        mount(bodyAccount, bodyAccountTransfer);


        //transfer
       async function transfer(str, arr, val) {
            let from = arr.account;
            let to = str;
            let amount = val;
        
            console.log(from);
            console.log(to);
            console.log(amount);
        
            const response = await fetch('http://localhost:3000/transfer-funds/', {
                method: 'POST',
                body: JSON.stringify({
                    from: from, // счёт с которого списываются средства
                    to: to, // счёт, на который зачисляются средства
                    amount: amount // сумма для перевода
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${token}`,
                },
        
            });
            const res1 = await response.json();
        
        }

        divGet.addEventListener('click', (e) => {
            e.preventDefault();
            transfer(bodyAccountTransferFormNumberInput.value, arr, bodyAccountTransferFormSumInput.value);
            arr.balance = arr.balance - bodyAccountTransferFormSumInput.value;
            renderAccount(accountsList);
        })
        //

        const bodyAccountDynamic = el('div');
        bodyAccountDynamic.classList.add('bodyAccount__dynamic');
        const bodyAccountDynamicTitle = el('h3', 'Динамика баланса');
        bodyAccountDynamicTitle.classList.add('bodyAccount__dynamic__title');
        const bodyAccountDynamicGraph = el('div');
        bodyAccountDynamicGraph.classList.add('bodyAccount__dynamic__graph');
        const divGraph = el('canvas#myChart');

        mount(bodyAccountDynamic, bodyAccountDynamicTitle);
        mount(bodyAccountDynamic, bodyAccountDynamicGraph);
        mount(bodyAccountDynamicGraph, divGraph);
        mount(bodyAccount, bodyAccountDynamic);

        //graph

        let data = arr.transactions;
        let sumArr = getSumArr(data);

        let monthMax;
        for (let i = 0; i < data.length; i++) {
            let dataMax = new Date(((data[data.length - 1]).date));
            monthMax = dataMax.getMonth() + 1;
        }

        let months = ['янв', 'фев', 'март', 'апр', 'май', 'июнm', 'июлm', 'авг', 'сент', 'окт', 'ноя', 'дек'];
        let datesGraph = [];
        let sumMonth = [];

        for (let i = (monthMax - 6); i <= 7; i++) {
            datesGraph.push(months[i]);
        }

        for (let i = monthMax - 6; i <= 7; i++) {
            sumMonth.push(sumArr[i]);
        }

        getCraph(divGraph, datesGraph, sumMonth)

        if (document.querySelector('.divHeaderListLi3Btn__href')) {
            document.querySelector('.divHeaderListLi3Btn__href').addEventListener('click', () => {
                router.navigate(e.target.getAttribute('href'));
            })
        }


        const bodyAccountHistory = el('div.bodyAccount__history');
        const bodyAccountHistoryTitle = el('h3.bodyAccount__history__title', 'История переводов');
        const bodyAccountHistoryTable = el('table.bodyAccount__history__table');
        const thead = el('thead');
        const tr = el('tr');
        const thFrom = el('th.bodyAccount__history__table__thFrom', 'Счёт отправителя');
        const thTo = el('th.bodyAccount__history__table__thTo', 'Счёт получателя');
        const thSum = el('th.bodyAccount__history__table__thSum', 'Сумма');
        const thDate = el('th.th.bodyAccount__history__table__thDate', 'Дата');
        const thEntry = el('th.th.bodyAccount__history__table__thEntry');
        const tbody = el('tbody');

        let dataReverse = data.reverse();
        for (let i = 0; i < 10; i++) {
            if (dataReverse[i] != undefined) {
                const tr = el('tr');
                const td1 = el('td', dataReverse[i].from);
                mount(tr, td1);
                const td2 = el('td', dataReverse[i].to);
                mount(tr, td2);
                const td3 = el('td');
                if (dataReverse[i].from === arr.account) {
                    td3.textContent = '-' + dataReverse[i].amount + ' ₽';
                    td3.style.color = 'red';
                } else {
                    td3.textContent = '+' + dataReverse[i].amount + ' ₽';
                    td3.style.color = 'green';
                }
                mount(tr, td3);
                const td4 = el('td', changeDateTable(dataReverse[i].date));
                mount(tr, td4);
                mount(tbody, tr);
            }

        }

        bodyAccountDynamic.addEventListener('click', () => {
            renderHistory(data);
        });

        mount(bodyAccountHistory, bodyAccountHistoryTitle);
        mount(tr, thFrom);
        mount(tr, thTo);
        mount(tr, thSum);
        mount(tr, thDate);
        mount(tr, thEntry);
        mount(thead, tr);

        mount(bodyAccountHistoryTable, thead);
        mount(bodyAccountHistoryTable, tbody);
        mount(bodyAccountHistory, bodyAccountHistoryTable);
        mount(bodyAccount, bodyAccountHistory);

    }, 500);
}

function renderCurrencies(arr) {
    getHeader()
    setTimeout(async function () {
        document.querySelector('.preloader').style.display = 'none';
        if (!document.querySelector('.divHeaderListWrapper')) {
            getMenu()
        }

        const response = await fetch('http://localhost:3000/currencies/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${token}`,
            },
        });
        let arr = await response.json();


        document.querySelector('.headerEntry').style.display = 'flex';
        document.querySelector('.headerEntry').style.justifyContent = 'space-between';
        document.querySelector('.headerEntry').style.marginBottom = '6vh';

        const currenciesWrapper = el('div.currenciesWrapper');
        const currenciesWrapperTitle = el('h2.currenciesWrapper__title', 'Валютный обмен');
        const currenciesWrapperGrid = el('div.currenciesWrapper__grid');
        const section1 = el('div.currenciesWrapper__grid__section1');
        const section2 = el('div.currenciesWrapper__grid__section2');
        const section3 = el('div.currenciesWrapper__grid__section3');

        //section 1
        const section1H3 = el('h3.currenciesWrapper__grid__section1__title', 'Ваши валюты');
        const ul = el('ul.currenciesWrapper__grid__section1__list');
        for (let key in arr.payload) {
            const li = el('li.currenciesWrapper__grid__section1__list__li');
            const pKey = el('p.currenciesWrapper__grid__section1__list__li__key', `${key}`);
            const pAmount = el('p.currenciesWrapper__grid__section1__list__li__amount', `${arr.payload[key].amount}`);
            mount(li, pKey);
            mount(li, pAmount);
            mount(ul, li);
        }


        //section 2
        const section2H3 = el('h3.currenciesWrapper__grid__section2__title', 'Обмен валюты');
        const form = el('form.currenciesWrapper__grid__section2__form');
        const field1 = el('div.currenciesWrapper__grid__section2__form__field1');
        const label1 = el('label.currenciesWrapper__grid__section2__form__field1__label', 'Из');
        const select1 = el('select.currenciesWrapper__grid__section2__form__field1__select');
        for (let key in arr.payload) {
            const option1 = el('option.currenciesWrapper__grid__section2__form__field1__select__option', `${key}`)
            mount(select1, option1);
        }

        const field2 = el('div.currenciesWrapper__grid__section2__form__field2');
        const label2 = el('label.currenciesWrapper__grid__section2__form__field2__label', 'В');
        const select2 = el('select.currenciesWrapper__grid__section2__form__field2__select');
        for (let key in arr.payload) {
            const option2 = el('option.currenciesWrapper__grid__section2__form__field2__select__option', `${key}`)
            mount(select2, option2);
        }

        const field3 = el('div.currenciesWrapper__grid__section2__form__field3');
        const label3 = el('label.currenciesWrapper__grid__section2__form__field3__label', 'Сумма');
        const input3 = el('input.currenciesWrapper__grid__section2__form__field3__input3');
        input3.type = 'number';

        const button = el('button.currenciesWrapper__grid__section2__form__button', 'Обновить');

        mount(field1, label1);
        mount(field1, select1);
        mount(field2, label2);
        mount(field2, select2);
        mount(field3, label3);
        mount(field3, input3);
        mount(form, field1);
        mount(form, field2);
        mount(form, field3);
        mount(form, button);
        //

        //section 3
        const section3H3 = el('h3.currenciesWrapper__grid__section3__title', 'Изменение курсов валют в реальном времени');
        const ul3 = el('ul.currenciesWrapper__grid__section3__list');


        let socket = new WebSocket('ws://localhost:3000/currency-feed');
        socket.onmessage = function (event) {
            let courseChangeData = JSON.parse(event.data);
            const li3 = el('li.currenciesWrapper__grid__section3__list__li');
            const pName = el('p.currenciesWrapper__grid__section3__list__li__name', `${courseChangeData.from}/${courseChangeData.to}`);
            const pValue = el('p.currenciesWrapper__grid__section3__list__li__value', `${courseChangeData.rate}`);

            if (courseChangeData.change == 1) {
                li3.classList.add('currenciesWrapper__grid__section3__list__li__plus');
                pValue.innerHTML = `${courseChangeData.rate}` + `<svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 10L10 0L0 10L20 10Z" fill="#76CA66"/>
                </svg>`

            }
            if (courseChangeData.change == -1) {
                li3.classList.add('currenciesWrapper__grid__section3__list__li__minus');
                pValue.innerHTML = `${courseChangeData.rate}` + `<svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L10 10L20 0H0Z" fill="#FD4E5D"/>
                </svg>`
            }
            mount(li3, pName);
            mount(li3, pValue);

            ul3.prepend(li3);

            const arr3 = (document.querySelectorAll('.currenciesWrapper__grid__section3__list__li__name'));
            if (arr3.length > 14) {
                ul3.innerHTML = '';
                for (let i of [...arr3].slice(0, 14)) {
                    li3.append(i);
                }
            }
        }
        //

        mount(currenciesWrapper, currenciesWrapperTitle);
        mount(currenciesWrapper, currenciesWrapperGrid);
        mount(currenciesWrapperGrid, section1);
        mount(section1, section1H3);
        mount(section1, ul);
        mount(currenciesWrapperGrid, section2);
        mount(section2, section2H3);
        mount(section2, form);
        mount(currenciesWrapperGrid, section3);
        mount(section3, section3H3);

        mount(section3, ul3);
        mount(document.querySelector('.container'), currenciesWrapper);

        //валютный обмен
        button.addEventListener('click', async (e) => {
            const response3 = await fetch('http://localhost:3000/currency-buy/', {
                method: 'POST',
                body: JSON.stringify({
                    from: select1.value,
                    to: select2.value,
                    amount: input3.value
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${token}`,
                },
            });
            const res = await response3.json();
            try {
                if (res.payload != null) {
                    renderCurrencies(res)
                }
            } catch (error) {
                console.log(error);
            }
        })
        //

    }, 500)
}


if (document.querySelector('.bodyAccount__requisite__btn__href')) {
    document.querySelector('.bodyAccount__requisite__btn__href').addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate(e.target.getAttribute('href'));
    })
}


//отрисовать страницу со счетами (2ая страница)
function renderCardPage(arr) {
    getHeader()

    setTimeout(function () {
        document.querySelector('.preloader').style.display = 'none';
        if (!document.querySelector('.divHeaderListWrapper')) {
            getMenu()
        }

        document.querySelector('.headerEntry').style.display = 'flex';
        document.querySelector('.headerEntry').style.justifyContent = 'space-between';
        document.querySelector('.headerEntry').style.marginBottom = '6vh';

        const accountsHeader = el('div');
        accountsHeader.classList.add('accountsHeader');
        mount(document.querySelector('.container'), accountsHeader);

        const accountsHeaderSort = el('div');
        accountsHeaderSort.classList.add('accountsHeader__sort')
        mount(accountsHeader, accountsHeaderSort);
        const accountsHeaderSortTitle = el('h1', 'Ваши счета');
        accountsHeaderSortTitle.classList.add('accountsHeader__sort__title');
        mount(accountsHeaderSort, accountsHeaderSortTitle);
        const accountsHeaderSortSelect = el('select');
        accountsHeaderSortSelect.classList.add('accountsHeader__sort__select');
        mount(accountsHeaderSort, accountsHeaderSortSelect);
        const accountsHeaderSortSelectOption1 = el('option', 'Сортировка');
        mount(accountsHeaderSortSelect, accountsHeaderSortSelectOption1);
        const accountsHeaderSortSelectOption2 = el('option', 'По номеру');

        mount(accountsHeaderSortSelect, accountsHeaderSortSelectOption2);
        const accountsHeaderSortSelectOption3 = el('option', 'По балансу');
        mount(accountsHeaderSortSelect, accountsHeaderSortSelectOption3);
        const accountsHeaderSortSelectOption4 = el('option', 'По последней транзакции');
        mount(accountsHeaderSortSelect, accountsHeaderSortSelectOption4);

        const accountsHeaderNew = el('button');
        accountsHeaderNew.classList.add('accountsHeader__new');
        accountsHeaderNew.textContent = '+ Создать новый счет';
        mount(accountsHeader, accountsHeaderNew);

        const cardWrapper = el('div');
        cardWrapper.classList.add('accountsCardWrapper');
        mount(document.querySelector('.container'), cardWrapper);

        for (let elem of arr) {
            const card = el('div');
            card.classList.add('accountsCardWrapper__card');
            const number = el('p', `${elem.account}`);

            number.classList.add('accountsCardWrapper__card__number');
            const balance = el('p', `${elem.balance} ₽`);

            balance.classList.add('accountsCardWrapper__card__balance');
            const textTranz = el('p', 'Последняя транзакция:');
            textTranz.classList.add('accountsCardWrapper__card__textTranz');


            let dateUser;
            if (elem.transactions.length > 0) {
                const dateResponse = `${elem.transactions[0].date}`;
                dateUser = el('p', changeDate(dateResponse));
                dateUser.classList.add('accountsCardWrapper__card__date')
            } else {
                dateUser = el('p', 'нет');
            }

            const btn = el('button');
            const btnHref = el('a', 'Открыть');
            btn.classList.add('accountsCardWrapper__card__btn');
            btnHref.classList.add('accountsCardWrapper__card__btn__href');
            btnHref.dataset.navigo = 'navigo';
            btnHref.href = `/account/${elem.account}`;

            mount(cardWrapper, card);
            mount(card, number)
            mount(card, balance)
            mount(card, textTranz)
            mount(card, dateUser)
            mount(btn, btnHref)
            mount(card, btn);

            //open card 
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                router.on(`/account/${elem.account}`, () => {
                    console.log('!!!');
                })
                router.navigate(e.target.getAttribute('href'));
                const response = await fetch(`http://localhost:3000/account/${elem.account}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Basic ${token}`,
                    },
                });

                if (response.status !== 200) {
                    throw new Error('Что-то пошло не так, попробуйте обновить страницу')
                }

                try {
                    const res = await response.json();
                    accountsList = (res.payload);
                    renderAccount(accountsList)
                } catch (error) {
                    throw error;
                }
            })
        }

        //создать новый счет
        document.querySelector('.accountsHeader__new').addEventListener('click', async (e) => {
            e.preventDefault();
            const response = await fetch('http://localhost:3000/create-account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${token}`,
                },
            });

            if (response.status !== 200) {
                throw new Error('Что-то пошло не так, попробуйте обновить страницу')
            }

            try {
                const res1 = await response.json();
                accountsList.push(res1.payload)
                renderCardPage(accountsList);
                updteLS(accountsList);
            } catch (error) {
                throw error;
            }
        })

        //sort
        if ((document.querySelector('.accountsHeader__sort__select'))) {
            (document.querySelector('.accountsHeader__sort__select')).addEventListener('change', () => {

                if (document.querySelector('.accountsHeader__sort__select').value === 'По номеру') {
                    let accountsList2 = accountsList.sort(function (a, b) {
                        if ((a.account) > (b.account)) {
                            return 1;
                        }
                        if ((a.account) < (b.account)) {
                            return -1;
                        }
                        return 0;
                    });
                    renderCardPage(accountsList2);
                }

                else if (document.querySelector('.accountsHeader__sort__select').value === 'По балансу') {
                    let accountsList2 = accountsList.sort(function (a, b) {
                        if ((a.balance) > (b.balance)) {
                            return 1;
                        }
                        if ((a.balance) < (b.balance)) {
                            return -1;
                        }
                        return 0;
                    });
                    renderCardPage(accountsList2);

                }

                else if (document.querySelector('.accountsHeader__sort__select').value === 'По последней транзакции') {
                    let accountsList2 = accountsList.sort(function (a, b) {
                        if ((a.transactions.date) > (b.transactions.date)) {
                            return 1;
                        }
                        if ((a.transactions.date) < (b.transactions.date)) {
                            return -1;
                        }
                        return 0;
                    });
                    renderCardPage(accountsList2);

                }
            })
        }
        //end sort
    }, 500);
}

function renderBanks(arr) {
    getHeader()

    setTimeout(async function () {
        document.querySelector('.preloader').style.display = 'none';
        if (!document.querySelector('.divHeaderListWrapper')) {
            getMenu();

            document.querySelector('.headerEntry').style.display = 'flex';
            document.querySelector('.headerEntry').style.justifyContent = 'space-between';
            document.querySelector('.headerEntry').style.marginBottom = '6vh';

            const mapTitle = el('h2.mapTitle', 'Карта банкоматов');
            mount(document.querySelector('.container'), mapTitle);

            const map1 = el('div#map1');
            map1.style.width = '94%';
            map1.style.height = '80vh';
            mount(document.querySelector('.container'), map1);

            const response = await fetch('http://localhost:3000/banks/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${token}`,
                },
            });

            const res = await response.json();

            let map;

            getMap();
            async function getMap() {
                await ymaps3.ready;

                // Создание карты
                map = new ymaps3.YMap(document.getElementById('map1'), {
                    location: {
                        center: [37.625705103210414, 55.75953691884489],
                        zoom: 10
                    },

                });

                console.log(ymaps3);

                map.addChild(new ymaps3.YMapDefaultFeaturesLayer());


                //markers
                function getMarker(a, b) {
                    map.addChild(new ymaps3.YMapDefaultSchemeLayer());
                    const content = document.createElement('section');
                    const marker = new ymaps3.YMapMarker({
                        coordinates: [a, b],
                        draggable: true,
                    }, content);
                    map.addChild(marker);
                    content.innerHTML = `<?xml version="1.0" encoding="utf-8"?>
                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <svg width="4vw" height="4vh" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="#FF3D00" /></svg>
                `;
                }
                //end markers

                for (let elem of res.payload) {
                    console.log(elem);
                    getMarker(elem.lon, elem.lat)
                }
            }
        }


    }, 500)
}


router.resolve();
