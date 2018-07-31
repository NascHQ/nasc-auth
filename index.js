(function test () {
    window.Nasc = window.Nasc || {};
    window.Nasc.auth = {};
    window.Nasc.auth.status = false;

    const whenLoggedCBs = [];

    const config = {
        apiKey: "AIzaSyCpw7iOA-ggEO3wJetErQCpX5U-rIJmY4A",
        authDomain: "nascauth.firebaseapp.com",
        databaseURL: "https://nascauth.firebaseio.com",
        projectId: "nascauth",
        storageBucket: "nascauth.appspot.com",
        messagingSenderId: "615066838286"
    };

    function appendScript (src) {
        const script = document.createElement('script');
        return new Promise((resolve, reject) => {
            document.querySelectorAll('head,body,html')[0].appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.src = src;
        });
    }
    function appendStyle (src) {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        document.querySelectorAll('head,body,html')[0].appendChild(style);
        style.href = src;
    }
    function firebaseReady () {
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged(function(user) {
            // console.log(user ? 'User is logged' : 'No user');
            whenLoggedCBs.forEach(cb => {
                try{cb(user)}catch(e) {console.error(e);};
            });
        });
        window.Nasc.auth.providers = {
            google: new firebase.auth.GoogleAuthProvider(),
            facebook: new firebase.auth.FacebookAuthProvider(),
            twitter: new firebase.auth.TwitterAuthProvider(),
            github: new firebase.auth.GithubAuthProvider()
        }
    }
    function domLoaded () {
        if (window.firebase) {
            firebaseReady();
        } else {
            appendScript('https://www.gstatic.com/firebasejs/5.3.0/firebase.js').then(_ => {
                firebaseReady();
            });
        }
        // appendStyle('https://cdn.firebase.com/libs/firebaseui/3.1.1/firebaseui.css');
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", domLoaded);
    } else {  // `DOMContentLoaded` already fired
        domLoaded();
    }

    window.Nasc.auth.logout = function () {
        firebase.auth().signOut();
    }
    window.Nasc.auth.login = function (provider = 'google') {
        firebase.auth().signInWithPopup(window.Nasc.auth.providers[provider]).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
    }
    
    window.Nasc.auth.isLogged = _ => !!window.Nasc.auth.checkLogin();
    window.Nasc.auth.checkLogin = function () {
        return firebase.auth().currentUser;
    }
    window.Nasc.auth.onStatusChange = function (cb) {
        whenLoggedCBs.push(cb);
    };

    window.Nasc.auth.availableNetworks = [
        'google',
        'facebook',
        'twitter',
        'github'
    ]
    window.Nasc.auth.getButton = function (btn) {
        const button = document.createElement('button');
        button.name = button.id = button.className = 'nasc-auth-btn-' + btn;
        button.innerHTML = btn;
        if (btn === 'logout') {
            button.onclick = function () {window.Nasc.auth.logout();};
            return button;
        }
        if (window.Nasc.auth.availableNetworks.includes(btn)) {
            button.onclick = function () {window.Nasc.auth.login(btn);};
            return button;
        } else {
            return null
        }
    }
})();

  
