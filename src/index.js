import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

let currentPage = 1;

async function request(req) {
  return await axios.get(
    `https://pixabay.com/api/?key=30176034-3a939666b78dd32120afd5b2c?q=${req}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`
  );
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  galleryEl.innerHTML = '';
  currentPage = 1;
  // console.log(searchForm.searchQuery.value);
  searchPhoto(searchForm.searchQuery.value);
});
