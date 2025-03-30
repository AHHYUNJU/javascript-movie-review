var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _movieList, _page;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
async function fetchPopularMovies(page2) {
  const popularMovieUrl = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page2}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NzVlOWQxYjA0NDVjMjcwNDFlNjJkNGRlYmRmNDMxZiIsIm5iZiI6MTc0MjI5MzAxMy40MTI5OTk5LCJzdWIiOiI2N2Q5NDgxNTZhN2I5ODA0MzZjNmIwMmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.iG09bisridxjWWiqAEoG5KgVgdex771xzTPz1w156Wo"}`
    }
  };
  try {
    const response = await fetch(popularMovieUrl, options);
    const { results, total_pages } = await response.json();
    const totalPages = total_pages;
    return { results, totalPages };
  } catch (error) {
    alert("영화 정보를 불러오는데 실패했습니다.");
  }
}
const imageUrl = (path, size = 400) => `https://image.tmdb.org/t/p/w${size}${path}`;
const createElement = ({
  tag,
  classNames = [],
  dataset,
  ...attributes
}) => {
  const $element = document.createElement(tag);
  classNames.forEach((className) => $element.classList.add(className));
  if (dataset) {
    Object.entries(dataset).forEach(([key, value]) => {
      $element.dataset[key] = value;
    });
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "required" && $element instanceof HTMLInputElement) {
      $element.required = Boolean(value);
    } else {
      $element.setAttribute(key, value);
    }
  });
  return $element;
};
const getYear = (releaseDate) => {
  const data = new Date(releaseDate);
  return data.getFullYear();
};
const getGenres = (genres) => {
  return genres.map(({ name }) => name).join(", ");
};
class Modal {
  constructor(movieDetail, id) {
    __publicField(this, "modalElement");
    __publicField(this, "closeButton");
    __publicField(this, "movieId");
    this.movieId = id;
    this.modalElement = document.getElementById(
      "modalBackground"
    );
    this.render(movieDetail);
    this.closeButton = document.getElementById(
      "closeModal"
    );
    this.open();
    this.addEventListeners();
  }
  open() {
    this.modalElement.showModal();
    document.body.classList.add("modal-open");
  }
  close() {
    this.modalElement.close();
    document.body.classList.remove("modal-open");
  }
  addEventListeners() {
    this.closeButton.addEventListener("click", () => this.close());
    this.modalElement.addEventListener("click", (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });
  }
  render({
    title,
    release_date,
    genres,
    vote_average,
    overview,
    poster_path
  }) {
    const $modal = createElement({
      tag: "div",
      classNames: ["modal"]
    });
    const $closeModal = createElement({
      tag: "button",
      classNames: ["close-modal"],
      id: "closeModal"
    });
    const $modalCloseButttonImg = createElement({
      tag: "img",
      src: "./images/modal_button_close.png"
    });
    const $modalContainer = createElement({
      tag: "div",
      classNames: ["modal-container"]
    });
    const $modalImage = createElement({
      tag: "div",
      classNames: ["modal-image"]
    });
    const $ModalImg = createElement({
      tag: "img",
      src: imageUrl(poster_path)
    });
    const $modalDescription = createElement({
      tag: "div",
      classNames: ["modal-description"]
    });
    const $h2 = createElement({
      tag: "h1",
      id: "modalTitle"
    });
    $h2.textContent = title;
    const $category = createElement({
      tag: "p",
      classNames: ["category"]
    });
    $category.textContent = `${getYear(release_date)} · ${getGenres(genres)}`;
    const $averageRate = createElement({
      tag: "p",
      classNames: ["rate"]
    });
    const $labelspan = createElement({
      tag: "span"
    });
    $labelspan.textContent = "평균";
    const $starFilled = createElement({
      tag: "img",
      src: "./images/star_filled.png",
      classNames: ["star"]
    });
    const $rateScore = createElement({
      tag: "span",
      classNames: ["rate-score"]
    });
    $rateScore.textContent = `${vote_average}`;
    const $rateBox = createElement({
      tag: "div",
      classNames: ["rate-box"]
    });
    const $myStar = createElement({
      tag: "h2",
      classNames: ["my-star"]
    });
    $myStar.textContent = "내 별점";
    const $starCommentBox = createElement({
      tag: "div",
      classNames: ["star-comment-box"]
    });
    const $stars = createElement({
      tag: "div",
      classNames: ["stars"]
    });
    const $comment = createElement({
      tag: "p",
      classNames: ["comment"]
    });
    $comment.textContent = "명작이에요";
    const $score = createElement({
      tag: "span",
      classNames: ["score"]
    });
    const $overviewSpan = createElement({
      tag: "h2",
      classNames: ["overview"]
    });
    $overviewSpan.textContent = "줄거리";
    const $detail = createElement({
      tag: "p",
      classNames: ["detail"]
    });
    $detail.textContent = overview;
    $modal.appendChild($closeModal);
    $closeModal.appendChild($modalCloseButttonImg);
    $modal.appendChild($modalContainer);
    $modalContainer.append($modalImage, $modalDescription);
    $modalImage.appendChild($ModalImg);
    $modalDescription.append(
      $h2,
      $category,
      $averageRate,
      $rateBox,
      $overviewSpan,
      $detail
    );
    $averageRate.append($labelspan, $starFilled, $rateScore);
    $rateBox.append($myStar, $starCommentBox);
    $starCommentBox.append($stars, $comment, $score);
    const renderStars = (rating) => {
      $stars.replaceChildren();
      const score = rating * 2;
      $score.textContent = `(${score}/10)`;
      const filledCount = rating;
      const emptyCount = 5 - rating;
      for (let i = 0; i < filledCount; i++) {
        const $countedStar = createElement({
          tag: "img",
          classNames: ["star"],
          src: "./images/star_filled.png"
        });
        $countedStar.addEventListener("click", () => {
          const saved2 = JSON.parse(localStorage.getItem("myRating")) ?? {};
          const newState = JSON.stringify({
            ...saved2,
            [this.movieId]: String(i + 1)
          });
          localStorage.setItem("myRating", newState);
          renderStars(i + 1);
        });
        $stars.appendChild($countedStar);
      }
      for (let i = 0; i < emptyCount; i++) {
        const $unCountedStar = createElement({
          tag: "img",
          classNames: ["star"],
          src: "./images/star_empty.png"
        });
        $unCountedStar.addEventListener("click", () => {
          const saved2 = JSON.parse(localStorage.getItem("myRating")) ?? {};
          const newState = JSON.stringify({
            ...saved2,
            [this.movieId]: String(filledCount + i + 1)
          });
          localStorage.setItem("myRating", newState);
          renderStars(filledCount + i + 1);
        });
        $stars.appendChild($unCountedStar);
      }
    };
    this.modalElement.replaceChildren($modal);
    const saved = JSON.parse(localStorage.getItem("myRating")) ?? {};
    const rateValue = Number(saved[this.movieId]);
    renderStars(rateValue ? rateValue : 4);
  }
}
const LOGO_IMG_SRC$1 = "./images/woowacourse_logo.png";
const Footer = () => {
  const $footer = createElement({
    tag: "footer",
    classNames: ["footer"]
  });
  const $copy = createElement({
    tag: "p"
  });
  const $p = createElement({
    tag: "p"
  });
  const $img = createElement({
    tag: "img",
    src: LOGO_IMG_SRC$1,
    width: "180"
  });
  const COPY_TEXT = "우아한테크코스 All Rights Reserved.";
  $copy.textContent = COPY_TEXT;
  $footer.appendChild($copy);
  $footer.appendChild($p);
  $p.appendChild($img);
  return $footer;
};
const STAR_IMG_SRC = "./images/star_empty.png";
const MoviePreviewInfo = ({ movie, bigFont = true }) => {
  const title = movie == null ? void 0 : movie.title;
  const voteAverage = movie == null ? void 0 : movie.vote_average;
  const $fragment2 = document.createDocumentFragment();
  const $rate = createElement({ tag: "div", classNames: ["rate"] });
  const $starImg = createElement({
    tag: "img",
    classNames: ["star"],
    src: STAR_IMG_SRC
  });
  const $rateValue = createElement({
    tag: "span"
  });
  const $title = createElement({
    tag: "div"
  });
  if (bigFont) {
    $rateValue.classList.add("rate-value");
    $title.classList.add("title");
  }
  $fragment2.append($rate);
  $rate.append($starImg);
  $rate.append($rateValue);
  $fragment2.append($title);
  $rateValue.textContent = voteAverage;
  $title.textContent = title;
  return $fragment2;
};
const fetchDetailMovie = async (movieId) => {
  const detailMovieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NzVlOWQxYjA0NDVjMjcwNDFlNjJkNGRlYmRmNDMxZiIsIm5iZiI6MTc0MjI5MzAxMy40MTI5OTk5LCJzdWIiOiI2N2Q5NDgxNTZhN2I5ODA0MzZjNmIwMmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.iG09bisridxjWWiqAEoG5KgVgdex771xzTPz1w156Wo"}`
    }
  };
  try {
    const response = await fetch(detailMovieUrl, options);
    const { title, release_date, genres, vote_average, overview, poster_path } = await response.json();
    return { title, release_date, genres, vote_average, overview, poster_path };
  } catch (error) {
    alert("영화 정보를 불러오는데 실패했습니다.");
  }
};
const MovieItem = ({ movie }) => {
  const { title, poster_path, id } = movie;
  const $li = createElement({
    tag: "li",
    classNames: ["open_modal"]
  });
  const $div = createElement({
    tag: "div",
    classNames: ["item"],
    dataset: {
      id: movie.id.toString()
    }
  });
  const $img = createElement({
    tag: "img",
    classNames: ["thumbnail"],
    src: imageUrl(poster_path),
    alt: title
  });
  $li.appendChild($div);
  $div.appendChild($img);
  $div.appendChild(
    MoviePreviewInfo({
      movie,
      bigFont: false
    })
  );
  $li.addEventListener("click", async () => {
    const movieDetailData = await fetchDetailMovie(id);
    new Modal(movieDetailData, id);
  });
  return $li;
};
const SkeletonMovieItem = () => {
  const $div = createElement({
    tag: "div"
  });
  $div.innerHTML = `
                  <li>
                    <div class="item">
                      <div class="thumbnail skeleton"></div>
                      <div class="item-desc">
                        <p class="rate">
                          <div class="skeleton skeleton-star"></div>
                        <div class="skeleton skeleton-text-title"></div>
                      </div>
                    </div>
                  </li>
        `;
  return $div;
};
const NOTHING_IMG_SRC = "./images/으아아.png";
const NOTHING_TEXT = "검색 결과가 없습니다.";
const $fragment = document.createDocumentFragment();
const NothingMovieList = () => {
  const $p = createElement({
    tag: "p",
    classNames: ["nothing-text"]
  });
  const $img = createElement({
    tag: "img",
    src: NOTHING_IMG_SRC,
    alt: "으아아",
    classNames: ["nothing-img"]
  });
  $p.textContent = NOTHING_TEXT;
  $fragment.appendChild($p);
  $fragment.appendChild($img);
  return $fragment;
};
const MovieList = ({ movies }) => {
  const $ul = createElement({
    tag: "ul",
    classNames: ["thumbnail-list"]
  });
  if (movies.length === 0) {
    return NothingMovieList();
  }
  const SKELETON_ITEMS_COUNT = 20;
  if (movies === "loading") {
    Array(SKELETON_ITEMS_COUNT).fill(null).forEach(() => {
      $ul.appendChild(SkeletonMovieItem());
    });
  } else {
    movies.forEach((movie) => {
      $ul.appendChild(MovieItem({ movie }));
    });
  }
  return $ul;
};
async function fetchSearchMovies(query, page2) {
  const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=ko-KR&page=${page2}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NzVlOWQxYjA0NDVjMjcwNDFlNjJkNGRlYmRmNDMxZiIsIm5iZiI6MTc0MjI5MzAxMy40MTI5OTk5LCJzdWIiOiI2N2Q5NDgxNTZhN2I5ODA0MzZjNmIwMmYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.iG09bisridxjWWiqAEoG5KgVgdex771xzTPz1w156Wo"}`
    }
  };
  try {
    const response = await fetch(searchMovieUrl, options);
    const { results, total_pages } = await response.json();
    const totalPages = total_pages;
    return { results, totalPages };
  } catch (error) {
    alert("영화 정보를 불러오는데 실패했습니다.");
  }
}
class StoreMovies {
  constructor() {
    __privateAdd(this, _movieList);
    __privateSet(this, _movieList, []);
  }
  get movieList() {
    return __privateGet(this, _movieList);
  }
  updateMovies(movies) {
    __privateSet(this, _movieList, movies);
  }
  addMovies(movies) {
    __privateSet(this, _movieList, [...__privateGet(this, _movieList), ...movies]);
  }
}
_movieList = new WeakMap();
const storeMovies = new StoreMovies();
class Page {
  constructor() {
    __privateAdd(this, _page);
    __privateSet(this, _page, 1);
  }
  getNextPage() {
    __privateWrapper(this, _page)._++;
    return __privateGet(this, _page);
  }
}
_page = new WeakMap();
const page = new Page();
const Button = ({ text, type }) => {
  const $button = createElement({
    tag: "button",
    classNames: ["primary", `${type}`]
  });
  $button.textContent = text;
  $button.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    let fetchedMovies;
    const currentPage = page.getNextPage();
    if (params.has("query")) {
      fetchedMovies = await fetchSearchMovies(params.get("query"), currentPage);
    } else {
      fetchedMovies = await fetchPopularMovies(currentPage);
    }
    storeMovies.addMovies(fetchedMovies.results);
    if (fetchedMovies.totalPages === currentPage) {
      $button.classList.toggle("disappear");
    }
    document.querySelector(".thumbnail-list").remove();
    const oberserver = document.querySelector(".oberserver");
    const section = document.querySelector("section");
    section.insertBefore(
      MovieList({
        movies: storeMovies.movieList
      }),
      oberserver
    );
  });
  return $button;
};
const BUTTON_DETAIL = "자세히 보기";
const TopRatedContainer = ({ popularMovie }) => {
  const $topRatedContainer = createElement({
    tag: "div",
    classNames: ["top-rated-container"]
  });
  const $topRatedMovie = createElement({
    tag: "div",
    classNames: ["top-rated-movie"]
  });
  $topRatedContainer.append($topRatedMovie);
  $topRatedMovie.append(
    MoviePreviewInfo({
      bigFont: true,
      movie: popularMovie
    })
  );
  $topRatedMovie.append(Button({ text: BUTTON_DETAIL, type: "detail" }));
  return $topRatedContainer;
};
const deleteParams = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("query")) {
    params.delete("query");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }
};
const SEARCH_BUTTON_IMAGE_SRC = "images/searchButtonIcon.png";
const PAGE = 1;
const SEARCH_BAR_PLACEHOLDER = "검색어를 입력하세요";
const SearchBar = () => {
  const $form = createElement({
    tag: "form",
    classNames: ["search-bar-container"]
  });
  const $input = createElement({
    tag: "input",
    classNames: ["search-bar"],
    placeholder: SEARCH_BAR_PLACEHOLDER
  });
  const $button = createElement({
    tag: "button",
    classNames: ["search-bar-button"]
  });
  const $img = createElement({
    tag: "img",
    src: SEARCH_BUTTON_IMAGE_SRC
  });
  $button.appendChild($img);
  $form.append($input, $button);
  const handleSearch = async (event) => {
    event.preventDefault();
    const query = $input.value.trim();
    if (!query) return;
    document.querySelector(".background-container").classList.add("disappear");
    const params = new URLSearchParams(window.location.search);
    params.set("query", query);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
    document.querySelector(".list-title").textContent = `"${query}" 검색 결과`;
    const searchMovieData = await fetchSearchMovies(query, PAGE);
    storeMovies.updateMovies(searchMovieData.results);
    const $thumbnailList = document.querySelector(".thumbnail-list");
    $thumbnailList.replaceWith(MovieList({ movies: storeMovies.movieList }));
  };
  $form.addEventListener("submit", handleSearch);
  return $form;
};
const LOGO_IMG_SRC = "./images/logo.png";
const Gnb = () => {
  const $div = createElement({
    tag: "div",
    classNames: ["gnb"]
  });
  const $logoBar = createElement({
    tag: "div",
    classNames: ["logo-bar"]
  });
  const $logo = createElement({
    tag: "h1",
    classNames: ["logo"]
  });
  const $logoImg = createElement({
    tag: "img",
    src: LOGO_IMG_SRC,
    alt: "MovieList"
  });
  $div.appendChild($logoBar);
  $logoBar.append($logo);
  $logo.appendChild($logoImg);
  $div.appendChild(SearchBar());
  return $div;
};
const Header = ({ popularMovie }) => {
  const title = popularMovie == null ? void 0 : popularMovie.title;
  const posterPath = popularMovie == null ? void 0 : popularMovie.poster_path;
  const $header = createElement({
    tag: "header"
  });
  const $backgroundContainer = createElement({
    tag: "div",
    classNames: ["background-container"]
  });
  const $overlay = createElement({
    tag: "div",
    classNames: ["overlay"],
    "aria-hidden": "true"
  });
  const $img = createElement({
    tag: "img",
    src: imageUrl(posterPath),
    alt: title
  });
  $header.appendChild(Gnb());
  $header.appendChild($backgroundContainer);
  $header.appendChild($overlay);
  $overlay.appendChild($img);
  $backgroundContainer.appendChild(TopRatedContainer({ popularMovie }));
  return $header;
};
const BUTTON_MORE = "더보기";
const MovieContainer = ({ movies }) => {
  const $container = createElement({
    tag: "div",
    classNames: ["container"]
  });
  const $main = createElement({
    tag: "main"
  });
  const $section = createElement({
    tag: "section"
  });
  const $h2 = createElement({
    tag: "h2",
    classNames: ["list-title"]
  });
  $h2.textContent = "지금 인기 있는 영화";
  $container.appendChild($main);
  $main.appendChild($section);
  $section.appendChild($h2);
  const $div = createElement({
    tag: "div",
    classNames: ["oberserver"]
  });
  const callback = (entries, observer2) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const params = new URLSearchParams(window.location.search);
        let fetchedMovies;
        const currentPage = page.getNextPage();
        if (params.has("query")) {
          fetchedMovies = await fetchSearchMovies(
            params.get("query"),
            currentPage
          );
        } else {
          fetchedMovies = await fetchPopularMovies(currentPage);
        }
        storeMovies.addMovies(fetchedMovies.results);
        if (fetchedMovies.totalPages === currentPage) {
          observer2.unobserve($div);
        }
        document.querySelector(".thumbnail-list").remove();
        const oberserver = document.querySelector(".oberserver");
        const section = document.querySelector("section");
        section.insertBefore(
          MovieList({
            movies: storeMovies.movieList
          }),
          oberserver
        );
      }
    });
  };
  const observer = new IntersectionObserver(callback);
  observer.observe($div);
  $section.appendChild(MovieList({ movies }));
  $section.appendChild($div);
  $main.appendChild(Button({ text: BUTTON_MORE, type: "more" }));
  return $container;
};
const Main = ({ movies }) => {
  const $body = document.querySelector("body");
  if ($body) {
    const $wrap = createElement({
      tag: "div",
      id: "wrap"
    });
    const $container = createElement({
      tag: "div",
      id: "container"
    });
    $body.appendChild($wrap);
    $container.appendChild(
      Header({
        popularMovie: movies[0]
      })
    );
    $container.appendChild(
      MovieContainer({
        movies
      })
    );
    const $dialog = createElement({
      tag: "dialog",
      classNames: ["modal-background", "active"],
      id: "modalBackground"
    });
    $wrap.append($container, Footer(), $dialog);
  }
};
deleteParams();
async function init() {
  var _a;
  const PAGE2 = 1;
  const popularMovieData = await fetchPopularMovies(PAGE2);
  storeMovies.updateMovies(popularMovieData.results);
  (_a = document.querySelector("#wrap")) == null ? void 0 : _a.remove();
  Main({
    movies: storeMovies.movieList
  });
}
init();
