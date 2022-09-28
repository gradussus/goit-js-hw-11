import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
var lightbox = new SimpleLightbox('.gallery a');

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
  console.log(request(v));
  console.log(data.hits);
  console.log(searchForm.searchQuery.value);
  if (data.hits.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
}

async function dowloadNewImages() {
  const { data } = await request();
  currentPage += 1;
  galleryMarkup(data.hits);
  lightbox.refresh();
  if (document.querySelectorAll('.photo-card').length === data.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

// InfiniteScroll

// const callback = entries => {
//   entries.forEach(entry => dowloadNewImages());
// };

// searchForm.addEventListener('submit', e => {
//   e.preventDefault();
//   galleryEl.innerHTML = '';
//   currentPage = 1;
//   // console.log(searchForm.searchQuery.value);
//   searchPhoto(searchForm.searchQuery.value);
// });

// const observer = new IntersectionObserver(callback, {
//   rootMargin: '150px',
// });

// observer.observe(document.querySelector('.forObserver'));
