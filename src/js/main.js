import { refs } from './refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import GetPhotos from './getPhoto';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { scrollByGallary } from './scrollByGallary';
import { renderGallery } from './markup';
import debounce from 'lodash.debounce';
import LoadMoreBtn from './load-btn';

const newGetPhoto = new GetPhotos();
// const loadMoreBtn = new LoadMoreBtn({ //
//   selector: '.load-more',
//   hidden: true,
// });

refs.form.addEventListener('submit', onSearch);
window.addEventListener('scroll', debounce(infinityScroll, 300));
// loadMoreBtn.refs.button.addEventListener('click', loadMore); //

async function onSearch(event) {
  event.preventDefault();
  newGetPhoto.query = await event.currentTarget.elements.searchQuery.value;
  // loadMoreBtn.hide()//
  
  if (newGetPhoto.query === '') {
    // loadMoreBtn.hide();//
    newGetPhoto.resetPage();
    clearGalleryMarkup();
    
    return Notify.info('Enter something, please!');
  }

  clearGalleryMarkup();
  newGetPhoto.resetPage();
  const arrayPhoto = await newGetPhoto.getPhoto();
  newGetPhoto.succesFoundImages();
  if (arrayPhoto.length === 0) {
    // loadMoreBtn.hide();//
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }

  renderGallery(arrayPhoto);
  // loadMoreBtn.show();//
  lightbox.refresh();
  
}

async function loadMore() {
  const arrayPhoto = await newGetPhoto.getPhoto();
  renderGallery(arrayPhoto);
  if (arrayPhoto.length === 0) {
    // loadMoreBtn.hide();//
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
  scrollByGallary();
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  fadeSpeed: 400,
});

function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
  refs.form.reset();
  }

function infinityScroll() {
  const windowHeight = window.innerHeight;
  const galleryPageHeight = refs.gallery.offsetHeight;
  const yOffset = window.pageYOffset;
  const y = yOffset + windowHeight;

  if (y >= galleryPageHeight) {
    loadMore();
  }
}