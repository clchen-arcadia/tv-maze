"use strict";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea")
const $searchForm = $("#searchForm");
const PLACEHOLDER_IMG_URL = "https://tinyurl.com/tv-missing";


/** Function accepts string term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm(term) {
  const response = await axios.get(
    "http://api.tvmaze.com/search/shows",
    { params: { q: term } }
  );

  let outputShows = [];

  for (let showAPIResult of response.data) {
    let showInfo = {
      id: showAPIResult.show.id,
      name: showAPIResult.show.name,
      summary: showAPIResult.show.summary,
      image: showAPIResult.show.image ? showAPIResult.show.image.medium : PLACEHOLDER_IMG_URL,
    };
    outputShows.push(showInfo);
  }

  return outputShows;
}


/** Given list of shows, function creates markup for each and to DOM */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>`
      );

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}




/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let outPutEpisodes = [];

  return response.data.map( (showApiResults) => {
    let showInfoObj = {
    id: showApiResults.id,
    name: showApiResults.name,
    season: showApiResults.season,
    number: showApiResults.number
    };
    return showInfoObj;
  });

  // for (let showApiResults of response.data) { //we can use map() here!!!
  //   let episodeInfo = {
  //     id: showApiResults.id,
  //     name: showApiResults.name,
  //     season: showApiResults.season,
  //     number: showApiResults.number,
  //   };
  //   outPutEpisodes.push(episodeInfo);
  // }

  // return outPutEpisodes;
};

/**
 * Function accepts array of objects of episode information.
 * Function populates episodesArea DOM with a list of episodes.
 */
function populateEpisodes(episodes) {
  $episodesList.empty();

  const $listOfEpisodes = $("<ul>");
  for (let episode of episodes) { //make below read more like HTML? like above
    const $episodeListItem = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    );
    $listOfEpisodes.append($episodeListItem);
  }
  $episodesList.append($($listOfEpisodes));
  $episodesArea.show();
}

// Handle submit on the search term form
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

// Handle "Show Episodes" button
$showsList.on('click', '.Show-getEpisodes', async function (evt) {
  let showId = $(evt.target).closest('.Show').data('show-id');
  populateEpisodes(await getEpisodesOfShow(showId));
});
