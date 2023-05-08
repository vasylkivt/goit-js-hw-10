import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputSearchForCountry = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const cornetCountryInfo = document.querySelector('.country-info');

inputSearchForCountry.insertAdjacentHTML(
  'beforebegin',
  '<h1 class="hero-title">Пошук країни</h1>'
);
document.body.setAttribute('class', 'container');

inputSearchForCountry.addEventListener(
  'input',
  debounce(onEnteringInput, DEBOUNCE_DELAY)
);

function onEnteringInput({ target: { value } }) {
  if (value === '') {
    countryList.innerHTML = '';
    cornetCountryInfo.innerHTML = '';
    return;
  }
  if (value.length < 2) {
    countryList.innerHTML = '';
    cornetCountryInfo.innerHTML = '';
    Notify.info('Ведіть більше одного символа');
    return;
  }
  if (!value.trim()) {
    countryList.innerHTML = '';
    cornetCountryInfo.innerHTML = '';
    Notify.failure('Рядок не може бути порожнім');
    return;
  }

  fetchCountries(value.trim()).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(countries) {
  if (countries.length > 10) {
    Notify.info(
      'Знайдено занадто багато збігів. Будь ласка, введіть більш конкретну назву.'
    );
    countryList.innerHTML = '';
    cornetCountryInfo.innerHTML = '';
    return;
  }
  if (countries.length === 1) {
    countryList.innerHTML = '';
    cornetCountryInfo.innerHTML = '';
    renderCountryCard(countries);
    return;
  }
  renderCountriesList(countries);
}

function onFetchError(error) {
  console.log(error);
  Notify.failure('На жаль, країни з такою назвою не існує');
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
      <li class='country-item'>
        <img
          style="outline: 1px solid rgb(0 0 0 / 30%)"
          width="35"
          src='${flags?.svg}'
          alt=''>
        <p> ${name?.official}</p>
      </li>`;
    })
    .join('');
  cornetCountryInfo.innerHTML = '';
  countryList.innerHTML = markup;
}

function renderCountryCard(countries) {
  cornetCountryInfo.innerHTML = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <div class='country-info-item'>
        <div class='country-name'>
          <img style="outline: 1px solid rgb(0 0 0 / 30%)"
            width="55"
            src='${flags?.svg}'
            alt=''>
          <p> ${name?.official}</p>
        </div>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>
      </div>`;
    })
    .join('');
}
