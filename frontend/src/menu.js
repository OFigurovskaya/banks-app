import { el, mount } from 'redom';
import logo from './assets/images/Logo.png';
import loader from './assets/images/4.gif';

export function getMenu() {
    const divHeaderListWrapper = el('div');
            divHeaderListWrapper.classList.add('divHeaderListWrapper');
            mount(document.querySelector('.headerEntry'), divHeaderListWrapper);

            const divHeaderList = el('ul');
            divHeaderList.classList.add('divHeaderList');
            mount(divHeaderListWrapper, divHeaderList);


            const divHeaderListLi1 = el('li');
            divHeaderListLi1.classList.add('divHeaderListLi');
            mount(divHeaderList, divHeaderListLi1);
            const divHeaderListLi1Btn = el('button');
            divHeaderListLi1Btn.classList.add('divHeaderListLi1Btn');
            const divHeaderListLi1BtnHref = el('a', 'Банкоматы');
            divHeaderListLi1BtnHref.classList.add('divHeaderListLi1Btn__href');
            divHeaderListLi1BtnHref.href = '/banks';
            divHeaderListLi1BtnHref.dataset.navigo = 'navigo';
            mount(divHeaderListLi1Btn, divHeaderListLi1BtnHref);
            mount(divHeaderListLi1, divHeaderListLi1Btn);

            const divHeaderListLi2 = el('li');
            divHeaderListLi2.classList.add('divHeaderListLi');
            mount(divHeaderList, divHeaderListLi2);
            const divHeaderListLi2Btn = el('button');
            divHeaderListLi2Btn.classList.add('divHeaderListLi2Btn');
            const divHeaderListLi2BtnHref = el('a', 'Счета');
            divHeaderListLi2BtnHref.classList.add('divHeaderListLi2Btn__href');
            divHeaderListLi2BtnHref.href = '/accounts';
            divHeaderListLi2BtnHref.dataset.navigo = 'navigo';
            mount(divHeaderListLi2Btn, divHeaderListLi2BtnHref);
            mount(divHeaderListLi2, divHeaderListLi2Btn);

            const divHeaderListLi3 = el('li');
            divHeaderListLi3.classList.add('divHeaderListLi');
            mount(divHeaderList, divHeaderListLi3);
            const divHeaderListLi3Btn = el('button');
            divHeaderListLi3Btn.classList.add('divHeaderListLi3Btn');
            const divHeaderListLi3BtnHref = el('a', 'Валюта');
            divHeaderListLi3BtnHref.classList.add('divHeaderListLi3Btn__href');
            divHeaderListLi3BtnHref.href = '/currencies';
            divHeaderListLi3BtnHref.dataset.navigo = 'navigo';
            mount(divHeaderListLi3Btn, divHeaderListLi3BtnHref);
            mount(divHeaderListLi3, divHeaderListLi3Btn);

            const divHeaderListLi4 = el('li');
            divHeaderListLi4.classList.add('divHeaderListLi');
            mount(divHeaderList, divHeaderListLi4);
            const divHeaderListLi4Btn = el('button');
            divHeaderListLi4Btn.classList.add('divHeaderListLi4Btn');
            const divHeaderListLi4BtnHref = el('a', 'Выйти');
            divHeaderListLi4BtnHref.classList.add('divHeaderListLi4Btn__href');
            divHeaderListLi4BtnHref.dataset.navigo = 'navigo';
            divHeaderListLi4BtnHref.href = '/';
            mount(divHeaderListLi4Btn, divHeaderListLi4BtnHref);
            mount(divHeaderListLi4, divHeaderListLi4Btn);
        }

