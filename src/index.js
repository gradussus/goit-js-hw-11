import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
var lightbox = new SimpleLightbox('.gallery a');
let currentPage = 1;
const forObserver = document.querySelector('.forObserver');
forObserver.style.display = 'none';

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchPhoto(searchForm.searchQuery.value);
});

async function request(req) {
  return await axios.get(
    `https://pixabay.com/api/?key=30176034-3a939666b78dd32120afd5b2c&q=${req}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`
  );
}

async function searchPhoto(v) {
  const { data } = await request(v);
  galleryEl.innerHTML = '';
  if (searchForm.searchQuery.value.length === 0) {
    forObserver.style.display = 'none';
    Notiflix.Notify.info(`Напиши що саме ти хочеш побачити`);
    return;
  }
  if (data.hits.length === 0) {
    forObserver.style.display = 'none';
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  forObserver.style.display = 'inline';
  currentPage = 1;
  createIcons(data.hits);
  lightbox.refresh();
}

async function dowloadNewImages() {
  const { data } = await request(searchForm.searchQuery.value);
  currentPage += 1;
  createIcons(data.hits);
  lightbox.refresh();
  if (document.querySelectorAll('.photo-card').length === data.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function createIcons(arr) {
  let arrMarkup = arr.map(e => {
    return `<div class="photo-card">
    <a href="${e.largeImageURL}">
    <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy"/>
    <div class="info">
      <div class="info-item">
        <span><b>Likes</b></span>
        <span>${e.likes}</span>
      </div>
      <div class="info-item">
        <span><b>Views</b></span>
        <span>${e.views}</span>
      </div>
      <div class="info-item">
        <span><b>Comments</b></span>
        <span>${e.comments}</span>
      </div>
      <div class="info-item">
        <span><b>Downloads</b></span>
        <span>${e.downloads}</span>
      </div>
    </div>
    </a>
  </div>`;
  });
  arrMarkup.forEach(m => {
    galleryEl.insertAdjacentHTML('beforeend', m);
  });
}
// InfiniteScroll

const callback = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dowloadNewImages();
    }
  });
};

const observer = new IntersectionObserver(callback, {
  rootMargin: '350px',
});
observer.observe(forObserver);
