var firebaseConfig = {
    apiKey: "AIzaSyC8VWP0c_GKTjHItv9JUi9XnMI0eUI1xJw",
    authDomain: "foodfly-6b05e.firebaseapp.com",
    databaseURL: "https://foodfly-6b05e.firebaseio.com",
    projectId: "foodfly-6b05e",
    storageBucket: "foodfly-6b05e.appspot.com",
    messagingSenderId: "834281128894",
    appId: "1:834281128894:web:7f109a039f88be566defef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase storage
var db = firebase.firestore();

// Provider Google
var provider = new firebase.auth.GoogleAuthProvider();

// Total order price
var total = 0;
var foodlist = [];
function buy(price, name) {
    // Current user
    var user = firebase.auth().currentUser;
    console.log(user);
    if (!user) {
        alert('Please sign in to order');
        return;
    } else {
        alert('Order confirm !');
        foodlist.push([price, name]);
        total = total + price;
        console.log(total);
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var email = user.email;
        console.log(email + "signed in");
        $("#content")[0].load("home.html");
        // User is signed in.
        /*
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        */
        // ...
    } else {
        console.log("signed out");

        // User is signed out.
        // ...
    }
});

document.addEventListener('init', function (event) {
    var page = event.target;
    console.log(page.id);

    if (page.id === "orderconfirm") {
        foodlist.forEach((foodlist, index) => {
            list = `<ons-list-item style="background-color: silver">${foodlist[1]}<br>> ${foodlist[0]} ฿</ons-list-item>`;
            $('#orderlist').append(list);
        });
        $('#ordertotal').append(total + " ฿");
    }

    if (page.id === 'home') {
        $("#icecreamcatebtn").click(function () {
            localStorage.setItem("selectedCategory", "icecream");
            $("#content")[0].load("category.html");
        });
        $("#cakecatebtn").click(function () {
            localStorage.setItem("selectedCategory", "cake");
            $("#content")[0].load("category.html");
        });
        $("#breadcatebtn").click(function () {
            localStorage.setItem("selectedCategory", "bread");
            $("#content")[0].load("category.html");
        });
        db.collection("recommended").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var item = `
                <ons-carousel-item modifier="nodivider" id="${doc.data().id}" class="recommended_item">
        <div class="thumbnail" style="background-repeat: no-repeat;
        background-size: 100px auto; background-position: center; background-color: rgba(255, 255, 255, 255); background-image: url('${doc.data().photoUrl}')">
        </div>
        <div class="recommended_item_title" id="item1_name">${doc.data().name}</div>
        </ons-carousel-item>
        `;
                $("#recomcarousel").append(item);
            });
        });
    }

    if (page.id === 'categoryPage') {
        var category = localStorage.getItem("selectedCategory");
        console.log("categpryPage:" + category);
        $("#rescatcarousel").empty();
        db.collection("restaurantList").where("category", "==", category).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var item = `
                    <ons-card  >
                    <img src="${doc.data().photoUrl}" style="width: 100%">
                    <h2 class="card__title" style="font-weight: bold">${doc.data().name}</h2>
                    <div class="card__content">somthing information like,<br>maybe number or food.</div>
                    <div style="text-align: right">
                     <ons-button onclick="gotoMenu('${doc.id}')">Select</ons-button>
                    </div>
                    </ons-card>
                                `
                    $("#rescatcarousel").append(item);
                    console.log(doc.data().name);
                });
            });
    }

    if (page.id === "restaurantlist") {
        db.collection("restaurantList").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var item = `
                <ons-card  >
                <img src="${doc.data().photoUrl}" style="width: 100%">
                <h2 class="card__title" style="font-weight: bold">${doc.data().name}</h2>
                <div class="card__content">somthing information like,<br>maybe number or food.</div>
                <div style="text-align: right">
                 <ons-button onclick="gotoMenu('${doc.id}')">Select</ons-button>
                </div>
            </ons-card>
                `;
                $("#rescarousel").append(item);
            });
        });
    }

    if (page.id === "tabbar") {
        
    }

    if (page.id === "sidemenu") {
        //Code for sidemenu
        $("#signinsignupbtn").click(function () {
            var content = document.getElementById('content');
            var menu = document.getElementById('menu');
            content.load('tabbar.html')
                .then(menu.close.bind(menu));
        });
        $("#signoutbtn").click(function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                $("#content")[0].load("tabbar.html");
                $("#sidemenu")[0].close();
            }).catch(function (error) {
                // An error happened.
                console.log(error.message);
            });
        });
        $("#categorybtn").click(function () {
            var content = document.getElementById('content');
            var menu = document.getElementById('menu');
            content.load('home.html')
                .then(menu.close.bind(menu));
        });
        $("#listbtn").click(function () {
            var content = document.getElementById('content');
            var menu = document.getElementById('menu');
            content.load('restaurantlist.html')
                .then(menu.close.bind(menu));
        });
        $("#addressbtn").click(function () {
            var content = document.getElementById('content');
            var menu = document.getElementById('menu');
            content.load('address.html')
                .then(menu.close.bind(menu));
        });
        $("#conbtn").click(function () {
            var content = document.getElementById('content');
            var menu = document.getElementById('menu');
            content.load('orderconfirm.html')
                .then(menu.close.bind(menu));
        });
    }

    if (page.id === 'tab1') {
        $("#signinwithgoogle").click(function () {
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult().then(function (result) {
                if (result.credential) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // ...
                }
                // The signed-in user info.
                var user = result.user;
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        });
        $("#toggleSignIn").click(function () {
            if (firebase.auth().currentUser) {
                // [START signout]
                firebase.auth().signOut();
                // [END signout]
            } else {
                var email = document.getElementById('email').value;
                var password = document.getElementById('password').value;
                if (email.length < 4) {
                    alert('Please enter an email address.');
                    return;
                }
                if (password.length < 4) {
                    alert('Please enter a password.');
                    return;
                }
                // Sign in with email and pass.
                // [START authwithemail]
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode === 'auth/wrong-password') {
                        alert('Wrong password.');
                    } else {
                        alert(errorMessage);
                    }
                    console.log(error);
                    document.getElementById('quickstart-sign-in').disabled = false;
                    // [END_EXCLUDE]
                });
                // [END authwithemail]
            }
        });
    }

    if (page.id == 'tab2') {
        $('#toggleSignUp').click(function () {
            var email = document.getElementById('emailsignup').value;
            var password = document.getElementById('passwordsignup').value;
            //var fullname = document.getElementById('fullnamesignup').value;
            //var phone = document.getElementById('phonenumbersignup').value;
            if (email.length < 4) {
                alert('Please enter an email address.');
                return;
            }
            if (password.length < 4) {
                alert('Please enter a password.');
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                // [END_EXCLUDE]
            });
        });
    }

    if (page.id === "menulist") {
        var resId = page.data.resId
        console.log(resId);
        var rest = db.collection("restaurantList").doc(resId);
        rest.get().then(function (doc) {
            if (doc.exists) {
                $("#foods").empty()
                console.log("Document data:", doc.data());
                var restaurant = doc.data();
                var photoUrl = restaurant.photoUrl;
                var menulist = restaurant.menulist;
                $("#respic").attr('src', photoUrl)
                for (var i = 0; i < menulist.length; i++) {
                    var ons_foods = ""
                    var cate = menulist[i];
                    var catname = cate.foodcatname;
                    var foods = cate.foodmenus;
                    for (var j = 0; j < foods.length; j++) {
                        var food = foods[j];
                        var foodname = food.name;
                        var foodprice = food.price;
                        ons_foods += `
                        <ons-list-item style="background-color: orange">
                            ${foodname}<br>> ${foodprice} ฿
                            <p class="right" onclick="buy(${foodprice}, '${foodname}')">
                                <ons-button>
                                    +
                                </ons-button>
                            </p>
                        </ons-list-item>
                    `
                    }
                    var ons_list = `<ons-list >
                    <ons-list-item expandable>
                        <h1>
                            <span >${catname}</span>
                        </h1><div class="expandable-content">
                        ${ons_foods}</div>
                    </ons-list-item>
                </ons-list>`
                    $("#foods").append(ons_list);
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    }

    if (page.id === 'addressPage') {
        console.log("addressPage");
    
        var lat, selectedLat;
        var lng, selectedLng;
    
        //cordova geolocation
        var onSuccess = function (position) {
          lat = selectedLat = position.coords.latitude;
          lng = selectedLng = position.coords.longitude;
          ons.notification.alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n');
    
          mapboxgl.accessToken = 'pk.eyJ1IjoicG9uZ3Nha29ybiIsImEiOiJjazJ4ZG1lOGcwYXBoM2dwZDJmd2JzbWVkIn0.yLqSqy7VKP5CUPVQg6n2kQ';
          var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [lng, lat], // starting position [lng, lat]
            zoom: 13 // starting zoom
          });
    
          var marker = new mapboxgl.Marker({
            draggable: true
          })
            .setLngLat([lng, lat])
            .addTo(map);
    
          function onDragEnd() {
            var lngLat = marker.getLngLat();
            selectedLat = lngLat.lat;
            selectedLng = lngLat.lng;
            coordinates.style.display = 'block';
            coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
          }
    
          marker.on('dragend', onDragEnd);
        };
    
        // onError Callback receives a PositionError object
        //
        function onError(error) {
          ons.notification.alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        }
    
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
        $("#setaddress").click(function () {
          ons.notification.alert("Delivery: "+ selectedLat + ",<br>"+ selectedLng);
        });
      }
});
var myNavigator = document.getElementById('myNavigator');
var gotoMenu = function (id) {
    console.log(id);
    myNavigator
        .pushPage('menulist.html', {
            data: {
                resId: id
                // ...
            }
            // Other options
        });

}