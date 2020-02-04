const host = 'http://localhost:3000';
let searchValue = null;
let isSearching = true;
let login = {
  render: async () => {

    let view = `
             
            <input id='login' type="text" name="login"></input><br>
            <input  id="password" type="password" name="password"></input><br>
            <button id="login-button" type="submit" > OK!</button>
            
        `
    return view;
  },
  after_render: async () => {

    const path = '/api/login';
    const url = host + path;
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', async () => {
      const login = document.getElementById('login').value;
      const password = document.getElementById('password').value;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });
      const r = await response.json();
      localStorage.setItem('facenote_id', r.idToken);
      console.log(r);
      if (r.idToken) {
        window.history.replaceState('object or string', 'Users', '/users');
        await render(users);
      }
      else {
        alert("Try Again");
      }
    });
  }

}

let users = {

  render: async () => {

    let view = `
            <div class="users-page">
               
                <input type="text" id="search-input"> </input>
                <button id="search-button"> Search</button>
                <h2>My Friends</h2>
                <div id="friend"> </div>
                <h2>Incoming</h2>
                <div id="incoming"> </div>
                <h2>Outgoing</h2>
                <div id="outgoing"> </div>
                <h2>Others</h2>
                <div id="users"> </div>
            </div>
        `
    return await header.render() + view
  },

  after_render: async () => {
    const friend_button = document.getElementById('show-friends');
    friend_button.addEventListener('click', async () => {
      window.history.replaceState('object or string', 'Friends', '/friends');
    });

    const button = document.getElementById('search-button');

    if (searchValue && !isSearching) {
      document.getElementById('search-input').value = searchValue;
      await searchUsers();
    }

    button.addEventListener('click', searchUsers);
  }
}

///////////////////////////////////////////////////////
let friends = {

  render: async () => {
    let view =  /*html*/`
            <section class="section">
                <h1>Pending requests</h1>
                <h3>Incoming</h3>
                <div id='incomingList'></div>
                <h3>Outgoing</h3>
                <div id='outgoingList'></div>
                <h1>Friends</h1>
                <div id='friendList'></div>
            </section>
        `
    return await header.render() + view;
  },
  after_render: async () => {
    const idToken = localStorage.getItem('facenote_id');
    const path = '/api/friends';
    const url = host + path;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }

    });
    const r = await response.json();

    for (let i in r) {
      var name = document.createElement("p");
      var surname = document.createElement("p");
      var but = document.createElement("button");
      name.setAttribute("id", "nameFriend-" + r[i].id);
      name.innerHTML = r[i].name;
      surname.innerHTML = r[i].surname;
      surname.setAttribute("id", "surnameFriend-" + r[i].id);
      but.innerHTML = "Remove friend";
      but.setAttribute("id", "butFriend-" + r[i].id);
      document.getElementById("friendList").appendChild(name);
      document.getElementById("friendList").appendChild(surname);
      document.getElementById("friendList").appendChild(but);
    }
    const responseInc = await fetch(url + '/incoming', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    const rInc = await responseInc.json();
    for (let i in rInc) {
      var nameInc = document.createElement("p");
      var surnameInc = document.createElement("p");
      var rejInc = document.createElement("button");
      var accInc = document.createElement("button");
      nameInc.setAttribute("id", "nameInc-" + rInc[i].id);
      nameInc.innerHTML = rInc[i].name;
      surnameInc.innerHTML = rInc[i].surname;
      surnameInc.setAttribute("id", "surnameInc-" + rInc[i].id);
      rejInc.innerHTML = "Ignore";
      rejInc.setAttribute("id", "rejectInc-" + rInc[i].id);
      rejInc.setAttribute("title", rInc[i].id);
      accInc.innerHTML = "Accept";
      accInc.setAttribute("id", "acceptInc-" + rInc[i].id);
      document.getElementById("incomingList").appendChild(nameInc);
      document.getElementById("incomingList").appendChild(surnameInc);
      document.getElementById("incomingList").appendChild(rejInc);
      document.getElementById("incomingList").appendChild(accInc);
    }

    const responseOut = await fetch(url + '/outgoing', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }

    });
    const rOut = await responseOut.json();



    for (let i in rOut) {
      var nameOut = document.createElement("p");
      var surnameOut = document.createElement("p");
      var delOut = document.createElement("button");
      nameOut.setAttribute("id", "nameOut-" + rOut[i].id);
      nameOut.innerHTML = rOut[i].name;
      surnameOut.innerHTML = rOut[i].surname;
      surnameOut.setAttribute("id", "surnameOut-" + rOut[i].id);
      delOut.innerHTML = "Cancel request";
      delOut.setAttribute("id", "rejOut-" + rOut[i].id);
      document.getElementById("outgoingList").appendChild(nameOut);
      document.getElementById("outgoingList").appendChild(surnameOut);
      document.getElementById("outgoingList").appendChild(delOut);
    }



    //////////////// ACCEPT
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].onclick = async function () {

        let act = this.id.split('-')[0];
        let id = this.id.split('-')[1];

        if (act === 'acceptInc') {
          const responseId = await fetch(url + '/accept/:id', {
            method: 'PUT',
            headers: {
              "Authorization": `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });
          const r1 = await responseId.json();
          console.log("nice");

        }
        else
          if (act === 'rejectInc' || act === 'butFriend' || act === 'rejOut') {
            const responseDel = await fetch(url + '/delete/id', {
              method: 'DELETE',
              headers: {
                "Authorization": `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id }),
            });
            const r2 = await responseDel.json();
            console.log(r2);
          }
        await render(friends);


      }
    }


  }




}


// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
  '/': login,
  '/users': users,
  '/friends': friends

};


// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {



  // Get the parsed URl from the addressbar

  var getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };
  var l = getLocation(window.location.href);

  let request = l.pathname;


  // Parse the URL and if it has an id part, change it with the string ":id"
  // let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

  // Get the page from our hash of supported routes.
  // If the parsed URL is not in our list of supported routes, select the 404 page instead
  let page = routes[request];
  const token = localStorage.getItem('facenote_id');
  if (!token) {
    page = login;
    window.history.replaceState('object or string', 'Login', '/login');
  }
  render(page);


}
async function checklog() {
  const idToken = localStorage.getItem('facenote_id');
  console.log(idToken);
  if (!idToken) {
    window.history.replaceState('object or string', 'Login', '/login');
  }
  else {
    window.history.replaceState('object or string', 'Friends', '/friends');
  }
}

async function logOut() {
  localStorage.clear();
  window.history.replaceState('object or string', '', '/');
}
// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);

async function render(page) {
  const content = null || document.getElementById('main-app');
  const renderedPage = await page.render();
  content.innerHTML = renderedPage;
  await page.after_render();
}

async function searchUsers() {
  isSearching = true;
  searchValue = document.getElementById('search-input').value || searchValue;
  console.log(searchValue);
  const idToken = localStorage.getItem('facenote_id');
  const path = '/api/users';
  const url = host + path;
  const response = await fetch(url + '?searchValue=' + searchValue, {
    method: 'GET',
    qs: { searchValue },
    headers: {
      "Authorization": `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    }
  });
  const r = await response.json();

  for (let i in r) {
    var nameFr = document.createElement("p");

    var surnameFr = document.createElement("p");
    var delFr = document.createElement("button");
    nameFr.setAttribute("id", "nameFr-" + r[i].id);
    nameFr.innerHTML = r[i].name;
    surnameFr.innerHTML = r[i].surname;
    surnameFr.setAttribute("id", "surnameFr" + r[i].id);
    delFr.innerHTML = "Remove friend";
    delFr.setAttribute("id", "delFr-" + r[i].id);
    delFr.setAttribute("title", r[i].id);
    document.getElementById("friend").appendChild(nameFr);
    document.getElementById("friend").appendChild(surnameFr);
    document.getElementById("friend").appendChild(delFr);
  }
  const responseInc = await fetch(url + '/incoming/' + '?searchValue=' + searchValue, {
    method: 'GET',
    qs: { searchValue },
    headers: {
      "Authorization": `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    }
  });
  const rInc = await responseInc.json();

  for (let i in rInc) {
    var nameInc = document.createElement("p");
    var surnameInc = document.createElement("p");
    var rejInc = document.createElement("button");
    var accInc = document.createElement("button");
    nameInc.setAttribute("id", "nameInc-" + rInc[i].id);
    nameInc.innerHTML = rInc[i].name;
    surnameInc.innerHTML = rInc[i].surname;
    surnameInc.setAttribute("id", "surnameInc-" + rInc[i].id);
    rejInc.innerHTML = "Ignore";
    rejInc.setAttribute("id", "rejectInc-" + rInc[i].id);
    rejInc.setAttribute("title", rInc[i].id);
    accInc.innerHTML = "Accept";
    accInc.setAttribute("id", "acceptInc-" + rInc[i].id);
    document.getElementById("incoming").appendChild(nameInc);
    document.getElementById("incoming").appendChild(surnameInc);
    document.getElementById("incoming").appendChild(rejInc);
    document.getElementById("incoming").appendChild(accInc);
  }


  const responseOut = await fetch(url + '/outgoing/' + '?searchValue=' + searchValue, {
    method: 'GET',
    qs: { searchValue },
    headers: {
      "Authorization": `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    }
  });
  const rOut = await responseOut.json();

  for (let i in rOut) {

    var nameOut = document.createElement("p");
    var surnameOut = document.createElement("p");
    var delOut = document.createElement("button");
    nameOut.setAttribute("id", "nameOut-" + rOut[i].id);
    nameOut.innerHTML = rOut[i].name;
    surnameOut.innerHTML = rOut[i].surname;
    surnameOut.setAttribute("id", "surnameOut-" + rOut[i].id);
    delOut.innerHTML = "Cancel request";
    delOut.setAttribute("id", "rejOut-" + rOut[i].id);
    document.getElementById("outgoing").appendChild(nameOut);
    document.getElementById("outgoing").appendChild(surnameOut);
    document.getElementById("outgoing").appendChild(delOut);
  }


  const responseOther = await fetch(url + '/other/' + '?searchValue=' + searchValue, {
    method: 'GET',
    qs: { searchValue },
    headers: {
      "Authorization": `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    }
  });
  const rOther = await responseOther.json();

  for (let i in rOther) {
    var nameOther = document.createElement("p");
    var surnameOther = document.createElement("p");
    var addOther = document.createElement("button");
    nameOther.setAttribute("id", "nameOther-" + rOther[i].id);
    nameOther.innerHTML = rOther[i].name;
    surnameOther.innerHTML = rOther[i].surname;
    surnameOther.setAttribute("id", "surnameOther-" + rOther[i].id);
    addOther.innerHTML = "Add to friends";
    addOther.setAttribute("id", "addOther-" + rOther[i].id);
    document.getElementById("users").appendChild(nameOther);
    document.getElementById("users").appendChild(surnameOther);
    document.getElementById("users").appendChild(addOther);
  }



  var buttons = document.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = async function () {
      let act = this.id.split('-')[0];
      let id = this.id.split('-')[1];
      if (act === 'acceptInc') {
        const responseId = await fetch(url + '/accept/id', {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const r1 = await responseId.json();

      }
      else if (act === 'rejectInc' || act === 'delFr' || act === 'rejOut') {
        const responseDel = await fetch(url + '/delete/id', {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const r2 = await responseDel.json();

      }
      else if (act === 'addOther') {
        const responseAdd = await fetch(url + '/add/id', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        const rAdd = await responseAdd.json();
        console.log(rAdd);
        //await render(users);
      }
      await render(users);


    }

  }
  isSearching = false;
  //////////////////////////////////////////////////////
}