// contains 
//    login/logout logic [done]
//    sending the labels to the server [done]
//    updating labels 
//    deleting labels
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const signupbutton = document.getElementById("sign-up");
// API calls
let email = document.getElementById("mail");
let password = document.getElementById("password");
let names = document.getElementById("username");
//const email = 'neeraj.yathy@gmail.com';
//const password = '1234';
//const username = "Neeraj";
let token = "";

function sessiontoken() {
    chrome.storage.sync.get("session_key", (obj) => {
        let session_key = obj.session_key;
        if (session_key === undefined) {
            session_key = "";
        }
        token = session_key;
    });
}

let signupdata = {
    "data": {
        "email": email,
        "name": username,
        "password": password
    }
}

let loginData = {
    "data": {
        "email": email,
        "password": password,
        "returnSecureToken": "true"
    }
}

let logoutData = {
    "data": {
        "email": email,
        "session_key": token
    }
}

let labels = ['balls', 'covid-19', 'coronavirus', 'car', 'clown', 'cross', 'class', 'Dog'];
//save the labels to the chrome storage
//to show during window load
/*window.onload = function() {
    let v = document.getElementsByTagName('li');
    for (var i = 0; i < labels.length; i++) {
        v[i + 5].innerHTML = labels[i];
    }
}*/

//add an element to the array
function addElement() {
    labels.push(document.getElementById('word').value);
    console.log(labels);
}

const labelData = {
    "data": {
        "labels": labels,
        "email": email,
        "session_key": token
    }
}

loginButton.addEventListener('click', () => {
    console.log(`clicked login button`);
    login(loginData);
});

logoutButton.addEventListener('click', () => {
    console.log(`clicked logout button`);
    sessiontoken();
    logout(logoutData);
});

signupbutton.addEventListener('click', () => {
    console.log(`clicked signup button`);
    signup(signupdata);
});

document.getElementsByClassName('plus').addEventListener('click', () => {
    console.log(`clicked set label button`);
    addElement();
    addLabel(labelData);
    clearInput();
});

// send post HTTP request to https://beiwe.herokuapp.com/extension/login to login
// send get HTTP request to https://beiwe.herokuapp.com/extension/setlabel to set the labels
// send get HTTP request to https://beiwe.herokuapp.com/extension/updatelabel to update the labels
// send get HTTP request to https://beiwe.herokuapp.com/extension/deletelabel to delete the labels
// send post HTTP request to https://beiwe.herokuapp.com/extension/logout to logout
function login(loginData) {
    chrome.storage.sync.get("login_status", function(obj) {
        let login_data = obj.login_status;
        if (login_data === "logged out") {
            $.ajax({
                type: "POST",
                url: `https://beiwe.herokuapp.com/extension/login?login_data=` + encodeURIComponent(JSON.stringify(loginData)),
                contentType: "application/json",
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status === "Logged in") {
                        console.log(`logged in to beiwe backened`)
                        const session_key = data.session_key;
                        chrome.storage.sync.set({ "session_key": session_key });
                        console.log(`session key set`);
                        chrome.storage.sync.set({ "login_status": "logged in" });
                        token = session_key;
                        labelData.data.session_key = session_key;
                        logoutData.data.session_key = session_key;
                    } else if (data.status === "Not logged in") {
                        console.log(`not logged in`);
                    }
                }
            });
        } else if (login_data == "logged in") {
            console.log(`already logged in to beiwe backend`);
        }
    });
    console.log("login function called");
    var x = document.getElementsByClassName("hi");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById('logout-button').style.display = "block";
}

// sending the labels to the server
/*function setLabel(labelData) {
    chrome.storage.sync.get("login_status", function(obj) {
        let login_data = obj.login_status;
        if (login_data === "logged in") {
            $.ajax({
                type: "GET",
                url: `https://beiwe.herokuapp.com/extension/setlabel?labels=` + encodeURIComponent(JSON.stringify(labelData)),
                data: JSON.stringify(labelData),
                contentType: "application/json",
                success: function(data) {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data.status === "user not logged in") {
                        login(loginData);
                        setLabel(labelData);
                    } else if (data.status === "labels updated/inserted") {
                        console.log(`labels set`);
                        clearInput();
                    } else if (data.status === "labels not updated/inserted") {
                        document.getElementById("word-not-found").style.display = "block";
                    }
                }
            });
        } else if (login_data == "logged out") {
            console.log(`not logged in to beiwe backend`);
        }
    });
}

//adding new labels to the file
function addLabel(labelData) {
    chrome.storage.sync.get("login_status", function(obj) {
        let login_data = obj.login_status;
        if (login_data === "logged in") {
            $.ajax({
                type: "GET",
                url: `https://beiwe.herokuapp.com/extension/addlabel?labels=` + encodeURIComponent(JSON.stringify(labelData)),
                data: JSON.stringify(labelData),
                contentType: "application/json",
                success: function(data) {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data.status === "user not logged in") {
                        login(loginData);
                        addLabel(labelData);
                    } else if (data.status === "labels updated/inserted") {
                        console.log(`labels set`);
                        clearInput();
                    } else if (data.status === "labels not updated/inserted") {
                        document.getElementById("word-not-found").style.display = "block";
                    }
                }
            });
        } else if (login_data == "logged out") {
            console.log(`not logged in to beiwe backend`);
        }
    });
}*/

//send signup details to the backend in heroku
function signup(signupdata) {
    $.ajax({
        type: "POST",
        url: `https://beiwe.herokuapp.com/extension/signup?signup_data=` + encodeURIComponent(JSON.stringify(signupdata)),
        contentType: "application/json",
        success: function(data) {
            data = JSON.parse(data);
            if (data.status === "Signed up") {
                console.log(`signed up to beiwe backened`)
                const session_key = data.session_key;
                chrome.storage.sync.set({ "session_key": session_key });
                console.log(`session key set`);
                chrome.storage.sync.set({ "login_status": "logged in" });
                token = session_key;
                labelData.data.session_key = session_key;
                logoutData.data.session_key = session_key;
            } else if (data.status === "Not signed up") {
                console.log(`not signed up`);
            }
        }
    });

}
//logout function
function logout(logoutData) {
    chrome.storage.sync.get("login_status", function(obj) {
        let login_data = obj.login_status;
        if (login_data === "logged in") {
            $.ajax({
                type: "GET",
                url: `https://beiwe.herokuapp.com/extension/logout?logout_data=` + encodeURIComponent(JSON.stringify(logoutData)),
                success: function(data) {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data.status === "Not logged out") {
                        console.log(`not logged out`);
                    } else if (data.status === "logged out") {
                        chrome.storage.sync.set({ "login_status": "logged out" });
                    }
                }
            });
        } else if (login_data == "logged out") {
            console.log(`already logged out from beiwe backend`);
        }
    });
    var x = document.getElementsByClassName("hi");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "block";
    }
    document.getElementById('logout-button').style.display = "none";
}

//reteiving the labels from the server
/*window.onload = function(labelData) {
    chrome.storage.sync.get("login_status", function(obj) {
        let login_data = obj.login_status;
        if (login_data === "logged in") {
            $.ajax({
                type: "GET",
                url: `https://beiwe.herokuapp.com/extension/getlabel?labels=` + encodeURIComponent(JSON.stringify(labelData)),
                data: JSON.stringify(labelData),
                contentType: "application/json",
                success: function(data) {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data.status === "user not logged in") {
                        login(loginData);
                        getLabel(labelData);
                    } else if (data.status === "labels retrieved") {
                        console.log(`labels retrieved`);
                        labels = data.labels;
                        let v = document.getElementsByTagName('li');
                        for (var i = 0; i < labels.length; i++) {
                            v[i + 5].innerHTML = labels[i];
                        }

                        document.getElementById("logout-button").addEventListener("click", () => {
                            console.log(`clicked logout button`);
                            sessiontoken();
                            logout(logoutData);
                        });
                    } else if (data.status === "labels not retrieved") {
                        document.getElementById("word-not-found").style.display = "block";
                    }
                }
            });
        } else if (login_data == "logged out") {
            console.log(`not logged in to beiwe backend`);
        }
    });
}*/