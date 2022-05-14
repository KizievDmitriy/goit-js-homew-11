const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class GetPhotos {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.getTotalhits = '';
  }

  async getPhoto() {
    const URL = 'https://pixabay.com/api/';
    const options = {
      params: {
        key: '27112752-ba9c06a82163f4d21667ea4bf',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: `${this.page}`,
      },
    };

    try {
      const { data } = await axios.get(URL, options);
      this.incrementPage();
      this.getTotalhits = data.totalHits;
      return data.hits;
    } catch (error) {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      console.error(error);
    }
  }
  succesFoundImages() {
    Notify.success(`Hooray! We found ${this.getTotalhits} images.`);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}