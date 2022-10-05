"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const PLACEHOLDER_IMG_URL = "https://tinyurl.com/tv-missing";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */


async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  console.log('getShowsByTerm is invoked');

  const response = await axios.get("http://api.tvmaze.com/search/shows",
    { params: {q: term, x: 1} } //?q=${term}&x=1
  );
  let outputShows = [];
  for(let show of response.data){ //great choice for map() here //response.data.show
    // const show2 = {id: show.id, name: show.name, summary: show.summary,
    //   image: (show.image === null)? PLACEHOLDER_IMG_URL=> } //ternary
    let tempObj = {};
    for(let i of ['id', 'name', 'summary', 'image']){ //'i' is RESERVED for index. use id
      if(i === 'image'){
        if(show.show.image === null){
          tempObj[i] = PLACEHOLDER_IMG_URL;
        }
        else{
          tempObj[i] = show.show.image.medium;
        }
      }
      else{
        tempObj[i] = show.show[i];
      }
    }
    outputShows.push(tempObj);
  }

  return outputShows;
}


// Function no longer needed

// /** Function accepts an array of shows and accesses each one's
//  *  medium image URL, if it does not exist, it inserts a placeholder.
//  *  The function then returns the optionally modified array.
//  */
// function replaceMissingImgURL(shows){
//   for(let show of shows){
//     if(show.show.image === null){
//       show.show.image = {};
//       show.show.image.medium = "https://tinyurl.com/tv-missing";
//     }
//   }
//   return shows;
// }


/** Given list of shows, create markup for each and to DOM */

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
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  console.log("searchForShowAndDisplay is invoked");

  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
