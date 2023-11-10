
import { el, mount } from 'redom';
import logo from './assets/images/Logo.png';
import loader from './assets/images/4.gif';

export function getHeader() {

    window.document.body.innerHTML = '';
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

    const preloader = el('img');
    preloader.classList.add('preloader');
    preloader.src = loader;
    mount(document.querySelector('.container'), headerEntry)
    mount(document.querySelector('.container'), preloader);
}