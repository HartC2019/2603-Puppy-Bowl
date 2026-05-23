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

/** Updates state with a single puppy from the API */
async function getPuppy(id) {
  try {
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    console.log(result);
    selectedPuppy = result.data.player;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all teams from the API */
async function getTeams() {
  try {
    const response = await fetch(API + "/teams");
    const result = await response.json();
    teams = result.data.teams;
    render();
  } catch (e) {
    console.error(e);
  }
}

// Update STATE DATA Functions

// POST puppy
// Updates state with a newly added puppy from the API
async function addPuppy(puppy) {
  try {
    await fetch(API + "/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(puppy),
    });
    await getPuppies();
  } catch (e) {
    console.error(e);
  }
}

// Remove puppy
// Updates state to delete party when button is clicked from the details
async function deletePuppy(id) {
  try {
    await fetch(`${API}/players/${id}`, {
      method: "DELETE",
    });

    selectedPuppy = undefined;

    await getPuppies();
  } catch (e) {
    console.error(e);
  }
}

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
    <img src="${puppy.imageUrl}" alt="${puppy.name}">
    <a href="#selected">${puppy.name}</a>
  `;
  $li.addEventListener("click", () => getPuppy(puppy.id));
  return $li;
}

/** Detailed information about the selected puppy */
function SelectedPuppy() {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }

  const $puppy = document.createElement("section");
  $puppy.innerHTML = `
  <img
   src="${selectedPuppy.imageUrl}"
   alt="${selectedPuppy.name}"
>
    <p>Name: ${selectedPuppy.name}</p>
    <p>ID: ${selectedPuppy.id}</p>
    <p>Breed: ${selectedPuppy.breed}</p>
    <p>Team: ${selectedPuppy.team?.name || "Unassigned"}</p>
    <p>Status: ${selectedPuppy.status}</p>
    <button>Remove Puppy</button>
  `;
  //   Return to add <Team></Team>
  //   $puppy.querySelector("Team").replaceWith(PuppyTeam());

  const $delete = $puppy.querySelector("button");

  $delete.addEventListener("click", async function () {
    await deletePuppy(selectedPuppy.id);
  });

  return $puppy;
}

// For component to add a new puppy
function NewPuppyForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <label>
      Name
      <input name="name" required />
    </label>
    <label>
      Breed
      <input name="breed" required />
    </label>
    <label for="status-select">Status:</label>
        <select name="status">
        <option value="">--Choose a status--</option>
        <option value="bench">Bench</option>
        <option value="field">Field</option>
        </select>    
    <label>
      Image URL
      <input name="imageUrl" type="url" required/>
    </label>
    <button>Add Puppy</button>
  `;

  $form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData($form);

    addPuppy({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      imageUrl: data.get("imageUrl"),
    });
    $form.reset();
  });

  return $form;
}

// =============== RENDER

function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
        <section id="form">
        <h2>Add a Puppy</h2>
        <NewPuppyForm></NewPuppyForm>
      </section>
      <section id="list">
        <h2>Puppy Roster</h2>
        <PuppyList></PuppyList>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <SelectedPuppy></SelectedPuppy>
      </section>
    </main>
  `;

  $app.querySelector("PuppyList").replaceWith(PuppyList());
  $app.querySelector("SelectedPuppy").replaceWith(SelectedPuppy());
  $app.querySelector("NewPuppyForm").replaceWith(NewPuppyForm());
}

async function init() {
  await getPuppies();
  await getTeams();
}

init();

// test
