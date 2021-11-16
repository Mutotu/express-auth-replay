// nav links
document.querySelector("#home-link").addEventListener("click", () => {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  document.querySelector("#home-content").classList.remove("hidden");
});

document.querySelector("#signup-link").addEventListener("click", () => {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  document.querySelector("#signup-content").classList.remove("hidden");
});

document.querySelector("#login-link").addEventListener("click", () => {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  document.querySelector("#login-content").classList.remove("hidden");
});

document.querySelector("#logout-link").addEventListener("click", () => {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  document.querySelector("#home-content").classList.remove("hidden");
  localStorage.removeItem("userId");

  document.querySelector("#signup-link").classList.remove("hidden");
  document.querySelector("#login-link").classList.remove("hidden");
  document.querySelector("#logout-link").classList.add("hidden");
  document.querySelector("#profile-link").classList.add("hidden");
});

document.querySelector("#profile-link").addEventListener("click", () => {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  document.querySelector("#profile-content").classList.remove("hidden");

  axios
    .get("http://localhost:3001/users/profile", {
      headers: {
        Authorization: localStorage.getItem("userId"),
      },
    })
    .then((response) => {
      //console.log(response.data.user.email)
      document.querySelector(
        "#profile-info"
      ).innerText = `Welcome back, ${response.data.user.email}!`;
    });
});
//make a request
//POST to http://localhost:3001
//send a body
//email and password
//get .value from inputs
document.querySelector("#signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
});

document
  .querySelector("#signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-password").value;

    /* console.log(email)
  console.log(password)*/
    try {
      const response = await axios.post("http://localhost:3008/users", {
        email: email,
        password: password,
      });
      console.log(response);
      const userId = response.data.user.id;
      localStorage.setItem("userId", userId);
      addHidden("#signup-link");
      addHidden("#login-link");
      removeHidden("#logout-link");
      removeHidden("#profile-link");

      // document.querySelector("#signup-link").classList.add("hidden");
      // document.querySelector("#login-link").classList.add("hidden");
      // document.querySelector("#logout-link").classList.remove("hidden");
      // document.querySelector("#profile-link").classList.remove("hidden");
    } catch (error) {
      console.log(error);
      alert("email is taken");
    }
  });

document
  .querySelector("#login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    /* console.log(email)
    console.log(password)*/
    try {
      const response = await axios.post("http://localhost:3008/users/login", {
        email: email,
        password: password,
      });
      console.log(response);
      const userId = response.data.user.id;
      localStorage.setItem("userId", userId);
      if (localStorage.getItem("userId")) {
        addHidden("#signup-link");
        addHidden("#login-link");
        removeHidden("#logout-link");
        removeHidden("#profile-link");
        // document.querySelector("#signup-link").classList.add("hidden");
        // document.querySelector("#login-link").classList.add("hidden");
        // document.querySelector("#logout-link").classList.remove("hidden");
        // document.querySelector("#profile-link").classList.remove("hidden");
      }
    } catch (error) {
      console.log(error);
      alert("login failed");
    }
  });

if (localStorage.getItem("userId")) {
  addHidden("#signup-link");
  addHidden("#login-link");
  // document.querySelector("#signup-link").classList.add("hidden");
  // document.querySelector("#login-link").classList.add("hidden");
} else {
  addHidden("#logout-link");
  addHidden("#profile-link");
  // document.querySelector("#logout-link").classList.add("hidden");
  // document.querySelector("#profile-link").classList.add("hidden");
}

function addHidden(id) {
  document.querySelector(id).classList.add("hidden");
}
function removeHidden(id) {
  document.querySelector(id).classList.remove("hidden");
}
