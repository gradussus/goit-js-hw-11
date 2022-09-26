import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

let currentPage = 1;

async function searchPhoto(requestedWord) {
  return await axios.get(
    `https://pixabay.com/api/?key=30176034-3a939666b78dd32120afd5b2c?q=${requestedWord}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`
  );
}
