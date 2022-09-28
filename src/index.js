import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
var lightbox = new SimpleLightbox('.gallery a')
let currentPage = 1;

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
  if (data.hits.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  currentPage = 1;
  galleryEl.innerHTML = '';
  createIcons(data.hits);
  lightbox.refresh();
}

async function dowloadNewImages() {
  const { data } = await request(searchForm.searchQuery.value);
  currentPage += 1;
  createIcons(data.hits);
  console.log ('asdasd')
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
    <a href="${e.largeImageURL}"><img src="${e.webformatURL}" alt="${e.tags}" loading="lazy" width="240" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${e.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${e.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${e.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${e.downloads}</b>
      </p>
    </div>
  </div>`
  })
  arrMarkup.forEach (m => {
    galleryEl.insertAdjacentHTML('beforeend', m)
})
}
// InfiniteScroll

const callback = entries => {
  entries.forEach(entry =>{
    if (entry.isIntersecting){
    dowloadNewImages()}});
};

const observer = new IntersectionObserver(callback, {
  rootMargin: '150px',
});

observer.observe(document.querySelector('.forObserver'));
