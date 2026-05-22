// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2603-Chase"; // Make sure to change this!
const API = BASE + COHORT;

// =============== STATE

let puppies = [];
let selectedPuppy;
let teams = [];

// Get all puppies
// Updates state with all puppies from the API
async function getPuppies() {
  try {
    const response = await fetch(API + "/players");
    const result = await response.json();
    console.log(result);

    puppies = result.data.players;
    render();
  } catch (e) {
    console.error(e);
  }
}

// Get one puppy

// Update STATE DATA Functions

// POST puppy

// Remove puppy

// =============== COMPONENTS

/** A list of names of all parties */
function PuppyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("list");

  const $puppies = puppies.map(PuppyListItem);
  $ul.replaceChildren(...$puppies);

  return $ul;
}

/** Puppy name that shows more details when clicked*/
function PuppyListItem(puppy) {
  const $li = document.createElement("li");

  if (puppy.id === selectedPuppy?.id) {
    $li.classList.add("selectedPuppy");
  }

  $li.innerHTML = `
    <a href="#selected">${puppy.name}</a>
  `;
  $li.addEventListener("click", () => getPuppy(puppy.id));
  return $li;
}

// =============== RENDER

function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section id="list">
        <h2>Puppy Roster</h2>
        <PuppyList></PuppyList>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <SelectedPuppy></SelectedPuppy>
      </section>
      <section id="form">
        <h2>Add a Puppy</h2>
        <NewPuppyForm></NewPuppyForm>
      </section>
    </main>
  `;

  $app.querySelector("PuppyList").replaceWith(PuppyList());
}

async function init() {
  await getPuppies();
  render();
}

init();
