// when page loads add listeners to page
window.onload = (event) => {
  setupLightBar();
  addListeners();
  checkPreSets(1);

};

//http://<bridge IP address>/api/<username>/lights/1/state
let bridgeUrl =
  'http://192.168.1.50/api/gx0g63RCE0IcMp5A3WvjyVST6PDnEBdM3AZGNt0Q' // url of the bridge controlling lights
selectedLight = 1;

// find all the lights then add them to bar
async function setupLightBar() {
  let bridgeResponse = await fetch(
    'http://192.168.1.50/api/gx0g63RCE0IcMp5A3WvjyVST6PDnEBdM3AZGNt0Q/lights/', {
      method: 'GET'
    })
  const responseJson = await bridgeResponse.json();
  console.log(responseJson);

  //
  for (let light in responseJson) {
    let temp = document.getElementById("lightBoxTemplate");
    let clone = document.importNode(temp.content, true);
    clone.querySelector("a").textContent = light;
    clone.querySelector("a").addEventListener('click', lightButtonPressed);
    document.getElementById("lightBar").appendChild(clone);
  }

}



function addListeners() {
  // add event listner for button being pressed
  let lightSwitch = document.getElementById("switch");
  lightSwitch.addEventListener("click", switchClick);



  document.getElementById("myRange").addEventListener('change', sliderMoved);

}



async function checkPreSets(lightNum) {
  let bridgeResponse = await fetch(
    'http://192.168.1.50/api/gx0g63RCE0IcMp5A3WvjyVST6PDnEBdM3AZGNt0Q/lights/' +
    lightNum, {
      method: 'GET'
    })

  const responseJson = await bridgeResponse.json();
  // set switch to on if light is already on and vice versa
  console.log(responseJson);
  if (responseJson.state.on == false) {
    document.getElementById('check').checked = false;

  } else {
    document.getElementById('check').checked = true;

  }


  // set value of slider to brightness
  document.getElementById('myRange').value = responseJson.state.bri;



}



async function switchClick() {
  console.log("switch was pressed");

  // find if the light is on or off
  let lightOne = "";
  await fetch(
      'http://192.168.1.50/api/gx0g63RCE0IcMp5A3WvjyVST6PDnEBdM3AZGNt0Q/lights/' +
      selectedLight, {
        method: 'GET'
      })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      lightOne = myJson
      console.log(JSON.stringify(myJson));
    });
  const lightOneStateUrl = bridgeUrl + "/lights/" + selectedLight + "/state"
    // determine if on
  let msgBody = ""
    // if the light is on put the message to turn it off and vice versa
  if (lightOne.state.on == false) {
    msgBody = '{"on": true}';
  } else {
    msgBody = '{"on": false}';
  }
  // send command to bridge
  fetch(
    lightOneStateUrl, {
      method: 'PUT',
      body: msgBody

    });
}



function sliderMoved(e) {
  // when slider moved change brightness to the slider value
  brightness = e.target.value; // slider value
  let msgBody =
    fetch(
      bridgeUrl + "/lights/" + selectedLight + "/state", {
        method: 'PUT',
        body: '{"bri":' + brightness + '}'
      })
}


function lightButtonPressed(e) {
  // chnage the selected css to be the last button pressed
  let selected = document.getElementsByClassName('selected');
  for (let i = 0; i < selected.length; i++) {
    selected[i].classList.remove("selected");
  }
  e.target.classList.add("selected");
  checkPreSets(e.target.text);
  selectedLight = e.target.text;
}
