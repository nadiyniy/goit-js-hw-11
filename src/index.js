import { fetchImages, per_page } from './js/imgAPI';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
const galleryEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');

let page = 1;
let currentSearchQuery = '';
let total = 0;

formEl.addEventListener('submit', onFormElSubmit);
// inputEl.addEventListener('input', onInputElClick);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);

async function onFormElSubmit(e) {
  e.preventDefault();
  page = 1;
  currentSearchQuery = e.target.elements.searchQuery.value.trim();
  if (currentSearchQuery.trim() === '') {
    loadMoreBtnEl.classList.add('is-hidden');
    galleryEl.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }

  try {
    galleryEl.innerHTML = '';
    const response = await fetchImages(currentSearchQuery, page);

    if (response.hits.length === 0) {
      e.target.reset();

      loadMoreBtnEl.classList.add('is-hidden');

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    } else {
      createMarkup(response.hits);
      Notiflix.Notify.success(
        `Hooray! We found ${response.totalHits} ${currentSearchQuery}.`
      );

      loadMoreBtnEl.classList.remove('is-hidden');
    }
    if (response.totalHits < per_page) {
        console.log(response.totalHits);
        console.log(per_page);
      loadMoreBtnEl.classList.add('is-hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  scrollPage();
}

async function onLoadMoreBtnElClick() {
  page += 1;
  const response = await fetchImages(currentSearchQuery, page);

  total = Math.ceil(response.totalHits / per_page);

  if (page >= total) {
    loadMoreBtnEl.classList.add('is-hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  createMarkup(response.hits);

  scrollPage();
}

function createMarkup(images) {
  let lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  const markup = images
    .map(image => {
      return `

        <div class="photo-card">
      <a href="${image.largeImageURL}" class="photo-card-link">

  <img width='220' height='152' src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
</a>

  <div class="info">
    <p class="info-item">
      <b>Likes: ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${image.downloads}</b>
    </p>
  </div>
</div>

        `;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function scrollPage() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
}
