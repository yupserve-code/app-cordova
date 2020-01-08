var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'Yup Serve',
  // App id
  id: 'com.ntspl.yupserve',
  // Enable swipe panel
  /*   panel: {
     swipe: 'left',
    }, */
  touch: {
    // Enable fast clicks
    fastClicks: true,
  },
  pushState: true,
  toast: {
    closeTimeout: 3000,
    closeButton: true,
  },
  // Add default routes
  routes: [
    {
      name: 'home',
      path: '/home/',
      url: 'index.html'
    },
    {
      name: 'login',
      path: '/login/',
      url: 'login.html'
    },
    {
      name: 'otp',
      path: '/otp/',
      url: 'otp.html'
    },
    {
      name: 'signup',
      path: '/signup/',
      url: 'signup.html'
    },
    {
      name: 'profile',
      path: '/profile/',
      url: 'profile.html'
    },
    {
      name: 'service-list',
      path: '/service-list/',
      url: 'service-list.html'
    },
    {
      name: 'mybooking',
      path: '/mybooking/',
      url: 'mybooking.html'
    },
    {
      name: 'notification',
      path: '/notification/',
      url: 'notification.html'
    },
    {
      name: 'about-us',
      path: '/about-us/',
      url: 'about-us.html'
    },
    {
      name: 'help',
      path: '/help/',
      url: 'help.html'
    },
    {
      name: 'faq',
      path: '/faq/',
      url: 'faq.html'
    },
    {
      name: 'term-and-conditions',
      path: '/term-and-conditions/',
      url: 'term-and-conditions.html'
    },
    {
      name: 'privacy-policy',
      path: '/privacy-policy/',
      url: 'privacy-policy.html'
    },
    {
      name: 'service-sub-list',
      path: '/service-sub-list/',
      url: 'service-sub-list.html'
    },
    {
      name: 'request-booking',
      path: '/request-booking/',
      url: 'request-booking.html'
    },
    {
      name: 'booking-details',
      path: '/booking-details/',
      url: 'booking-details.html'
    },
    {
      name: 'task-details',
      path: '/task-details/',
      url: 'task-details.html'
    },
    {
      name: 'payment',
      path: '/payment/',
      url: 'payment.html'
    },
    {
      name: 'filters',
      path: '/filters/',
      url: 'filters.html'
    },
    {
      name: 'edit-profile',
      path: '/edit-profile/',
      url: 'edit-profile.html'
    },
    {
      name: 'no-internet-connection',
      path: '/no-internet-connection/',
      url: 'no-internet-connection.html'
    },
    {
      name: 'review-booking',
      path: '/review-booking/',
      url: 'review-booking.html'
    },
    {
      name: 'booking-success',
      path: '/booking-success/',
      url: 'booking-success.html'
    },
    {
      name: 'splash',
      path: '/splash/',
      url: 'splash.html'
    },
    {
      name: 'payu-money',
      path: '/payu-money/',
      url: 'payu-money.html'
    },
    {
      name: 'update-image',
      path: '/update-image/',
      url: 'update-image.html'
    },
    {
      name: 'my-address-list',
      path: '/my-address-list/',
      url: 'my-address-list.html'
    },
    {
      name: 'edit-my-address',
      path: '/edit-my-address/',
      url: 'edit-my-address.html'
    }
  ],
  // ... other parameters
  on: {
    init() {

      //device ready here

      //$$('#home-main-layout').hide();

      // Show intro slider when user installs app for first time else show home screen
      var isFirstTimeInstalled = "true";

      isFirstTimeInstalled = localStorage.getItem("isFirstTimeInstalled");

      if (isFirstTimeInstalled == "true" || isFirstTimeInstalled == null) {
        app.views.main.router.navigate('/splash/');
      } else {
        isFirstTimeInstalled = "false";
      }

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {

        app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "HomeScreen");
      } else {
        app.preloader.show();
        loadHomeServiceList();
        //app.views.main.router.navigate('/home/');
      }

      if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString("#ff9800");
      }
    },
  }
});

var mainView = app.views.create('.view-main');

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {

  // $$('#home-main-layout').hide();

  sessionStorage.platform = device.platform;

  /* var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

    app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "HomeScreen");
  } else {
    app.preloader.hide();
    loadHomeServiceList();
  } */

  /* Check back button functionality */
  document.addEventListener('backbutton', onBackKeyDown, false);
  /* Check back button functionality ends */

  /* push notification */
  FCMPlugin.getToken(function (token) {
    localStorage.setItem("token", token);

  }, function () {

  });

  FCMPlugin.onNotification(function (data) {

    var notiCount = 0;

    notiCount = localStorage.getItem("NotiCount");

    var currPage = sessionStorage.currentPage;

    if (currPage == undefined || currPage == null) {
      currPage = '';
    }

    if (notiCount == 0 || notiCount == null || notiCount == undefined) {
      notiCount = 0;
    } else {
      notiCount = localStorage.getItem("NotiCount");
    }

    var isLoggedIn = localStorage.getItem("isLogin");

    if (isLoggedIn == null || isLoggedIn == undefined) {
      isLoggedIn = "";
    }

    if (data.wasTapped) {

      notiCount = parseInt(notiCount) + 1;

      localStorage.setItem("NotiCount", notiCount);

      if (isLoggedIn == 'true') { // Redirect to Booking details page

        if (currPage == "booking-details") {
          loadBookingDetails(data.request_id);
        } else {
          app.views.main.router.navigate('/booking-details/?orderId=' + data.request_id + '&navigationFrom=' + 'PushNotification');
        }

      } else { // Redirect to login page 
        app.views.main.router.navigate('/login/?pageFrom=' + "PushNotification");
      }

    } else {
      // With callback on close

      var notificationCallbackOnClose = app.notification.create({
        icon: '<i class="icon material-icons md-only">notifications_none</i>',
        title: data.title,
        titleRightText: 'now',
        request_id: data.request_id,
        message: data.message,
        action: data.action,
        text: data.message,
        closeOnClick: true,
        pushState: true,
        on: {
          close: function () {

            notiCount = parseInt(notiCount) + 1;

            localStorage.setItem("NotiCount", notiCount);

            if (isLoggedIn == 'true') { // Redirect to Booking details page

              if (currPage == "booking-details") {
                loadBookingDetails(data.request_id);
              } else {
                app.views.main.router.navigate('/booking-details/?orderId=' + data.request_id + '&navigationFrom=' + 'PushNotification');
              }

            } else { // Redirect to login page
              app.views.main.router.navigate('/login/?pageFrom=' + "PushNotification");
            }
          },
        },
      });

      notificationCallbackOnClose.open();
    }

    /* Notification modal ends */

  });
  /* push notification ends */

});

app.on('pageInit', function (page) {

  // add active class on btn start
  $$('.select-time-slot .button').on('click', function () {
    $$(this).siblings().removeClass('active'); // if you want to remove class from all sibling buttons
    $$(this).toggleClass('active');
  });
  // add active class on btn end

  //my booking search start
  // create searchbar
  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-order-number, .booking-service-name',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });
  //my booking end
});

//swiper slider home page start
/* var swiper = app.swiper.get('.swiper-container');
swiper.autoplay.start(); */
//swiper slider home page end


/********* Home Service List Api Start ************/
$$(document).on('page:init', '.page[data-name="home"]', function (e) {

  setTimeout(function () {
    var swiper = app.swiper.create('.swiper-container', {
      speed: 400,
      spaceBetween: 100
    });
  }, 2000);


  localStorage.removeItem("subserviceid"); // Removing sub service id
  sessionStorage.currentPage = "home";

  var a = localStorage.getItem("token");
  
  console.log("Token " + localStorage.getItem("token"));

  //$$('#home-main-layout').hide();

  var notiCount = localStorage.getItem("NotiCount");

  if (notiCount == undefined || notiCount == null) {
    notiCount = 0;
  }

  if (notiCount > 0) {
    $$(".navbar").find(".badge").html(notiCount);

    $$("#badge-layout").show();
  } else {
    $$("#badge-layout").hide();
  }

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

    app.preloader.hide();
    //app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "HomeScreen");
  } else {
    app.preloader.show();
    loadHomeServiceList();

    var isLoggedIn = localStorage.getItem("isLogin");

    if (isLoggedIn == null || isLoggedIn == undefined) {
      isLoggedIn = "";
    }

    if (isLoggedIn == 'true') { // hide login and show logout
      $$("#login_class").hide();
      $$("#logout_class").show();

    } else { // hide logout and show login

      $$("#login_class").show();
      $$("#logout_class").hide();
    }

    //app.preloader.show();
    //swiper slider home page start

    //swiper slider home page end

    /********* Pincode check in Homepage Api Start ************/

    $$("#pincode").on('keyup', function (e) {
      // pincode
      var pincode = $$(this).val().trim();

      if (pincode.length == 0 || (pincode.length > 0 && pincode.length < 6)) {
      } else {
        app.preloader.show();

        if (pincode.length == 6) {

          var connectiontype = checkConnection();

          if (connectiontype == "No network connection") {

            message = connectiontype;

            var toast = app.toast.create({
              text: message
            });
            toast.open();
            app.preloader.hide();
          } else {
            // call webservice
            callPincodeCheckWebService();
          }
        }
      }

      function callPincodeCheckWebService() {

        app.request.post(PINCODE_CHECK_API, {
          api_key: '6be2f840a6a0da34f9904743800e2cae', pincode: pincode
        }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined && obj.success != null) {

            $$("#pincode").val("");

            app.preloader.hide();

            var dynamicPopup = app.popup.create({
              content: '<div class="popup popup-services">' +
                '<div class="block">' +
                '<p class="deliver-heading">Service Available</p>' +
                '<img src="images/distance.png">' +
                '<p class="deliver-desc">Lets start with Yupserve.<span>Book your service now.</span></p>' +
                '<button class="col button button-fill color-orange link popup-close" href="#" id="ser_avl_button">Ok</button>' +
                '</div>' +
                '</div>',
              // Events
              on: {
                open: function (popup) {
                  console.log('Popup open');
                  sessionStorage.DialogOpen = 'true';
                },
                close: function (popup) {
                  console.log('Popup closed');
                  sessionStorage.DialogOpen = 'false';

                }
              }
            });

            dynamicPopup.open();
          } else if (obj.error != undefined && obj.error != null) {
            $$("#pincode").val("");

            app.preloader.hide();

            var dynamicPopup = app.popup.create({
              content: '<div class="popup popup-services">' +
                '<div class="block">' +
                '<p class="deliver-heading">Service Unavailable</p>' +
                '<img src="images/distance.png">' +
                '<p class="deliver-desc">Sorry, currently we do not provide services in this area.<span>Please select another area</span></p>' +
                '<button class="col button button-fill color-orange link popup-close" href="#">Ok</button>' +
                '</div>' +
                '</div>',
              // Events
              on: {
                open: function (popup) {
                  console.log('Popup open');
                  sessionStorage.DialogOpen = 'true';
                },
                close: function (popup) {
                  console.log('Popup closed');
                  sessionStorage.DialogOpen = 'false';

                }
              }
            });

            dynamicPopup.open();
          }
          app.preloader.hide();
        });
      }
    });
  }

  /********* Pincode check in Homepage Api End ************/

  //Home drawer menu click
  $$('#home-drawer-click').on('click', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {

      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      app.views.main.router.navigate('/home/');
    }
  });

  //My booking drawer menu click
  $$('#my-booking-click').on('click', function () {

    var connectiontype = checkConnection();

     if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      var isLoggedIn = localStorage.getItem("isLogin");

      if (isLoggedIn == null || isLoggedIn == undefined) {
        isLoggedIn = "";
      }
      if (isLoggedIn == 'true') { // Redirect to my booking page
        app.views.main.router.navigate('/mybooking/?navigationFrom=' + "HomeScreen");
      } else { // Redirect to login page
        app.views.main.router.navigate('/login/?pageFrom=' + "homeMyBooking");
      }
    } 
  });

  //My Account drawer menu click
  $$('#my-account-click').on('click', function () {

    //app.views.main.router.navigate('/my-address-list/');

     var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      var isLoggedIn = localStorage.getItem("isLogin");

      if (isLoggedIn == null || isLoggedIn == undefined) {
        isLoggedIn = "";
      }
      if (isLoggedIn == 'true') { // Redirect to my profile page
        app.views.main.router.navigate('/profile/');
      } else { // Redirect to login page
        app.views.main.router.navigate('/login/?pageFrom=' + "homeMyAccount");
      }
    } 
  });

  //Login drawer menu click
  $$('#home-login-click').on('click', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {
      // Redirect to login page
      app.views.main.router.navigate('/login/?pageFrom=' + "homeLogin");
    }

  });

  //My Notification drawer menu click
  $$('#my-notification-click').on('click', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      var isLoggedIn = localStorage.getItem("isLogin");

      if (isLoggedIn == null || isLoggedIn == undefined) {
        isLoggedIn = "";
      }
      if (isLoggedIn == 'true') { // Redirect to Notification page
        app.views.main.router.navigate('/notification/');
      } else { // Redirect to login page
        app.views.main.router.navigate('/login/?pageFrom=' + "homeMyNotification");
      }
    }
  });

  //My Notification icon in header click
  $$('#notification-icon-header').on('click', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      var isLoggedIn = localStorage.getItem("isLogin");

      if (isLoggedIn == null || isLoggedIn == undefined) {
        isLoggedIn = "";
      }
      if (isLoggedIn == 'true') { // Redirect to Notification page
        app.views.main.router.navigate('/notification/');
      } else { // Redirect to login page
        app.views.main.router.navigate('/login/?pageFrom=' + "homeMyNotification");
      }
    }
  });

  //More button click
  $$('#more-button-click').on('click', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "ServiceListScreen");
    } else {

      app.views.main.router.navigate('/service-list/');

    }
  });

});
/********* Home Service List Api End ************/

/******************  On Signup page init*******************************/
$$(document).on('page:init', '.page[data-name="signup"]', function (e) {

  var page = $$('.page[data-name="signup"]')[0].f7Page;
  var pageFrom = page.route.query.pageFrom;
  var serviceID = page.route.query.serviceId;
  var serviceTitle = page.route.query.serviceTitle;

  if (pageFrom == undefined) {
    pageFrom == "";
  }

  if (serviceID == undefined) {
    serviceID == "";
  }

  if (serviceTitle == undefined) {
    serviceTitle == "";
  }

  sessionStorage.sessionServiceID = serviceID;
  sessionStorage.sessionServiceTitle = serviceTitle;
  sessionStorage.sessionPageFrom = pageFrom;

  console.log("pageFrom == " + pageFrom + "serviceID == " + serviceID + "serviceTitle == " + serviceTitle);

  //On clicking signup button 
  $$('.signup-button').on('click', function (e) {

    app.preloader.show();
    e.preventDefault();
    var userFirstName = $$("#userFirstName").val().trim();
    var userLastName = $$("#userLastName").val().trim();
    var userEmail = $$("#useremail").val().trim();
    var userMobile = $$("#userMob").val().trim();
    var userAddress = $$("#useraddress").val().trim();
    var userPIN = $$("#userPIN").val().trim();
    var userCity = $$("#usercity").val().trim();
    var userState = $$("#userstate").val().trim();

    if (userFirstName.length == 0 || (userFirstName.length > 0 && userFirstName.length < 3) ||
      userLastName.length == 0 || (userLastName.length > 0 && userLastName.length < 3) || userEmail.length == 0
      || (userEmail.length > 0 && !validateEmail(userEmail)) || userMobile.length == 0 || (userMobile.length > 0 && userMobile.length < 10)
      || userAddress.length == 0 || (userAddress.length > 0 && userAddress.length < 10) || userPIN.length == 0
      || (userPIN.length > 0 && userPIN.length < 6) || userCity.length == 0 ||
      (userCity.length > 0 && userCity.length < 3) || userState.length == 0 ||
      (userState.length > 0 && userState.length < 6)) {

      app.preloader.hide();

      if (userFirstName.length == 0) {
        $$("#first-name-invalid").removeClass("hidden");
        $$('#first-name-error').text("Enter your first name.");

      } else if (userFirstName.length > 0 && userFirstName.length < 3) {
        $$("#first-name-invalid").removeClass("hidden");
        $$('#first-name-error').text("First name should be minimum 3 characters.");

      } else {
        $$("#first-name-invalid").addClass("hidden");
      }

      if (userLastName.length == 0) {
        $$("#last-name-invalid").removeClass("hidden");
        $$('#last-name-error').text("Enter your last name.");

      } else if (userLastName.length > 0 && userLastName.length < 3) {
        $$("#last-name-invalid").removeClass("hidden");
        $$('#last-name-error').text("Last name should be minimum 3 characters.");

      } else {
        $$("#last-name-invalid").addClass("hidden");
      }

      if (userEmail.length == 0) {
        $$("#email-invalid").removeClass("hidden");
        $$('#email-error').text("Enter your email.");

      } else if (userEmail.length > 0 && !validateEmail(userEmail)) {
        $$("#email-invalid").removeClass("hidden");
        $$('#email-error').text("Enter a valid email id.");

      } else {
        $$("#email-invalid").addClass("hidden");
      }

      if (userMobile.length == 0) {
        $$("#mob-invalid").removeClass("hidden");
        $$('#mob-error').text("Enter your mobile number.");
      } else if (userMobile.length > 0 && userMobile.length < 10) {
        $$("#mob-invalid").removeClass("hidden");
        $$('#mob-error').text("Mobile number should be 10 digits.");

      } else {
        $$("#mob-invalid").addClass("hidden");
      }

      if (userAddress.length == 0) {
        $$("#address-invalid").removeClass("hidden");
        $$('#address-error').text("Enter your address.");
      } else if (userAddress.length > 0 && userAddress.length < 10) {
        $$("#address-invalid").removeClass("hidden");
        $$('#address-error').text("Address should be minimum 10 characters.");

      } else {
        $$("#address-invalid").addClass("hidden");
      }

      if (userPIN.length == 0) {
        $$("#pin-invalid").removeClass("hidden");
        $$('#pin-error').text("Enter your PIN code.");
      } else if (userPIN.length > 0 && userPIN.length < 6) {
        $$("#pin-invalid").removeClass("hidden");
        $$('#pin-error').text("PIN code should be 6 digits.");

      } else {
        $$("#pin-invalid").addClass("hidden");
      }

      if (userCity.length == 0) {
        $$("#city-invalid").removeClass("hidden");
        $$('#city-error').text("Enter your city name.");
      } else if (userCity.length > 0 && userCity.length < 3) {
        $$("#city-invalid").removeClass("hidden");
        $$('#city-error').text("City should be minimum 3 characters.");

      } else {
        $$("#city-invalid").addClass("hidden");
      }

      if (userState.length == 0) {
        $$("#state-invalid").removeClass("hidden");
        $$('#state-error').text("Enter your state name.");
      } else if (userState.length > 0 && userState.length < 6) {
        $$("#state-invalid").removeClass("hidden");
        $$('#state-error').text("State should be minimum 6 characters.");

      } else {
        $$("#state-invalid").addClass("hidden");
      }
    } else {

      $$("#first-name-invalid").addClass("hidden");
      $$("#last-name-invalid").addClass("hidden");
      $$("#email-invalid").addClass("hidden");
      $$("#mobile-invalid").addClass("hidden");
      $$("#address-invalid").addClass("hidden");
      $$("#pin-invalid").addClass("hidden");
      $$("#city-invalid").addClass("hidden");
      $$("#state-invalid").addClass("hidden");

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();
      } else {

        app.request.setup({
          /*  headers: {
             'api_key': "6be2f840a6a0da34f9904743800e2cae"
           }, */
          cache: false
        });

        var tokenID = localStorage.getItem("token");

        app.request.post(SIGNUP_API, {
          first_name: userFirstName, last_name: userLastName, email: userEmail,
          mobile: userMobile, address: userAddress, pincode: userPIN, state: userState, city: userCity, device_id: tokenID
        }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            if (typeof (Storage) !== "undefined") {
              localStorage.setItem("customerID", obj.success.customer_details.customer_id);
              //localStorage.setItem("isLogin", 'true');

            } else {
              // Sorry! No Web Storage support..
            }
            message = obj.success.message;
            var toast = app.toast.create({
              text: message
            });
            toast.open();
            app.preloader.hide();

            app.views.main.router.navigate('/otp/?serviceId=' + serviceID + '&serviceTitle=' + serviceTitle + '&pageFrom=' + pageFrom
              + '&mobileNumber=' + userMobile + '&OTPVerifyFor=' + "Signup");

           /*  if (pageFrom == "homeMyAccount") {
              app.views.main.router.navigate('/profile/');

            } else if (pageFrom == "homeMyBooking") {
              app.views.main.router.navigate('/mybooking/');

            } else if (pageFrom == "homeMyNotification") {
              app.views.main.router.navigate('/notification/');

            } else if (pageFrom == "subServiceList") {
              app.views.main.router.navigate('/service-sub-list/?serviceId=' + serviceID + '&serviceTitle=' + serviceTitle);

            } else if (pageFrom == "homeLogin") {
              app.views.main.router.navigate('/home/');

            } else if (pageFrom == "PushNotification") {
              app.views.main.router.navigate('/home/');

            } else {
              app.views.main.router.navigate('/home/');
            } */
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        });
      }
    }
  });


  // On Text Change listener. Hide error when user gives correct input.

  $$("#userFirstName").on('keyup', function (e) {

    var userFirstName = $$("#userFirstName").val().trim();

    if (userFirstName.length == 0) {
      $$("#first-name-invalid").removeClass("hidden");
      $$('#first-name-error').text("Enter your first name.");

    } else if (userFirstName.length > 0 && userFirstName.length < 3) {
      $$("#first-name-invalid").removeClass("hidden");
      $$('#first-name-error').text("First name should be minimum 3 characters.");

    } else {
      $$("#first-name-invalid").addClass("hidden");
    }

  });

  $$("#userLastName").on('keyup', function (e) {

    var userLastName = $$("#userLastName").val().trim();

    if (userLastName.length == 0) {
      $$("#last-name-invalid").removeClass("hidden");
      $$('#last-name-error').text("Enter your last name.");

    } else if (userLastName.length > 0 && userLastName.length < 3) {
      $$("#last-name-invalid").removeClass("hidden");
      $$('#last-name-error').text("Last name should be minimum 3 characters.");

    } else {
      $$("#last-name-invalid").addClass("hidden");
    }

  });

  $$("#useremail").on('keyup', function (e) {

    var userEmail = $$("#useremail").val().trim();

    if (userEmail.length == 0) {
      $$("#email-invalid").removeClass("hidden");
      $$('#email-error').text("Enter your email.");

    } else if (userEmail.length > 0 && !validateEmail(userEmail)) {
      $$("#email-invalid").removeClass("hidden");
      $$('#email-error').text("Enter a valid email id.");

    } else {
      $$("#email-invalid").addClass("hidden");
    }

  });

  $$("#userMob").on('keyup', function (e) {

    var userMobile = $$("#userMob").val().trim();

    if (userMobile.length == 0) {
      $$("#mob-invalid").removeClass("hidden");
      $$('#mob-error').text("Enter your mobile number.");
    } else if (userMobile.length > 0 && userMobile.length < 10) {
      $$("#mob-invalid").removeClass("hidden");
      $$('#mob-error').text("Mobile number should be 10 digits.");

    } else {
      $$("#mob-invalid").addClass("hidden");
    }

  });

  $$("#useraddress").on('keyup', function (e) {

    var userAddress = $$("#useraddress").val().trim();

    if (userAddress.length == 0) {
      $$("#address-invalid").removeClass("hidden");
      $$('#address-error').text("Enter your address.");
    } else if (userAddress.length > 0 && userAddress.length < 10) {
      $$("#address-invalid").removeClass("hidden");
      $$('#address-error').text("Address should be minimum 10 characters.");

    } else {
      $$("#address-invalid").addClass("hidden");
    }

  });

  $$("#userPIN").on('keyup', function (e) {

    var userPIN = $$("#userPIN").val().trim();

    if (userPIN.length == 0) {
      $$("#pin-invalid").removeClass("hidden");
      $$('#pin-error').text("Enter your PIN code.");
    } else if (userPIN.length > 0 && userPIN.length < 6) {
      $$("#pin-invalid").removeClass("hidden");
      $$('#pin-error').text("PIN code should be 6 digits.");

    } else {
      $$("#pin-invalid").addClass("hidden");
    }

  });

  $$("#usercity").on('keyup', function (e) {

    var userCity = $$("#usercity").val().trim();

    if (userCity.length == 0) {
      $$("#city-invalid").removeClass("hidden");
      $$('#city-error').text("Enter your city name.");
    } else if (userCity.length > 0 && userCity.length < 3) {
      $$("#city-invalid").removeClass("hidden");
      $$('#city-error').text("City should be minimum 3 characters.");

    } else {
      $$("#city-invalid").addClass("hidden");
    }

  });

  $$("#userstate").on('keyup', function (e) {

    var userState = $$("#userstate").val().trim();

    if (userState.length == 0) {
      $$("#state-invalid").removeClass("hidden");
      $$('#state-error').text("Enter your state name.");
    } else if (userState.length > 0 && userState.length < 6) {
      $$("#state-invalid").removeClass("hidden");
      $$('#state-error').text("State should be minimum 6 characters.");

    } else {
      $$("#state-invalid").addClass("hidden");
    }

  });

  //On clicking login button 
  $$('#signup-login-button').on('click', function (e) {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {
      app.views.main.router.navigate('/login/?serviceId=' + serviceID + '&serviceTitle=' + serviceTitle + '&pageFrom=' + pageFrom);
    }
  });

  //On clicking signup button ends

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("Inside validation email");
    return re.test(email);
  }
});
/******************  On Signup page init ends*******************************/


/******************  On Login page init*******************************/

$$(document).on('page:init', '.page[data-name="login"]', function (e) {

  var page = $$('.page[data-name="login"]')[0].f7Page;
  var pageFrom = page.route.query.pageFrom;
  var serviceID = page.route.query.serviceId;
  var serviceTitle = page.route.query.serviceTitle;

  if (pageFrom == undefined) {
    pageFrom == "";
  }

  if (serviceID == undefined) {
    serviceID == "";
  }

  if (serviceTitle == undefined) {
    serviceTitle == "";
  }

  sessionStorage.sessionServiceID = serviceID;
  sessionStorage.sessionServiceTitle = serviceTitle;
  sessionStorage.sessionPageFrom = pageFrom;

  console.log("pageFrom == " + pageFrom + "serviceID == " + serviceID + "serviceTitle == " + serviceTitle);

  //On clicking login button 
  $$('.login-button').on('click', function (e) {

    app.preloader.show();
    e.preventDefault();

    var usermobile = $$("#usermobile").val().trim();

    if (usermobile.length == 0 || (usermobile.length > 0 && usermobile.length < 10)) {

      console.log('Check Validity!');
      app.preloader.hide();

      if (usermobile.length == 0) {
        $$("#mobile-invalid").removeClass("hidden");
        $$('#mobile-error').text("Enter your mobile number.");

      } else if (usermobile.length > 0 && usermobile.length < 10) {
        $$("#mobile-invalid").removeClass("hidden");
        $$('#mobile-error').text("Mobile number should be 10 digits.");

      } else {
        $$("#mobile-invalid").addClass("hidden");
      }

    } else {

      $$("#mobile-invalid").addClass("hidden");

      var user_id = 0;
      var mobile_no = usermobile;

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();
      } else {

        app.request.setup({
          /*  headers: {
             'api_key': "6be2f840a6a0da34f9904743800e2cae"
           }, */
          cache: false
        });

        app.request.post(LOGIN_API, {
          mobile: mobile_no, customer_id: user_id
        }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            if (typeof (Storage) !== "undefined") {

              localStorage.setItem("customerID", obj.success.customer_details.customer_id);

              app.views.main.router.navigate('/otp/?serviceId=' + serviceID + '&serviceTitle=' + serviceTitle + '&pageFrom=' + pageFrom
                + '&mobileNumber=' + mobile_no + '&OTPVerifyFor=' + "Login");

            } else {
              // Sorry! No Web Storage support..
            }
            message = obj.success.message;
            var toast = app.toast.create({
              text: message
            });
            toast.open();
            app.preloader.hide();
          }

          if (obj.error != undefined) {

            message = obj.error.message;
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        },function(error){
          var a = JSON.stringify(error);
          //alert("Webservice error" + a);
          app.preloader.hide();
        });
      }
    }
  });

  //On clicking signup button 
  $$('#login-screen-signup-button').on('click', function (e) {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {
      app.views.main.router.navigate('/signup/?serviceId=' + serviceID + '&serviceTitle=' + serviceTitle + '&pageFrom=' + pageFrom);
    }
  });

  //On clicking back button 
  $$('#login-back-button').on('click', function (e) {

    if (pageFrom == "subServiceList") {

      app.views.main.router.navigate('/service-sub-list/?serviceId=' + serviceID + '&serviceTitle=' + serviceTitle);

    } else {
      app.views.main.router.navigate('/home/');
    }

  });
});

/******************  On Login page init ends*******************************/

/******************  On OTP page init*******************************/
$$(document).on('page:init', '.page[data-name="otp"]', function (e) {

  var page = $$('.page[data-name="otp"]')[0].f7Page;
  var pageFrom = page.route.query.pageFrom;
  var serviceID = page.route.query.serviceId;
  var serviceTitle = page.route.query.serviceTitle;
  var mobileNumber = page.route.query.mobileNumber;
  var OtpVerifyFor = page.route.query.OTPVerifyFor; 

  var verifyOTPURL = "";

  var resendOTPURL = ""

  if (OtpVerifyFor == "Signup"){
    verifyOTPURL = SIGNUP_VERIFY_OTP_API;
    resendOTPURL = SIGNUP_RESEND_OTP_API;

  } else if (OtpVerifyFor == "Login"){
    verifyOTPURL = LOGIN_VERIFY_OTP_API;
    resendOTPURL = RESEND_OTP_API;

  } else{
    verifyOTPURL = LOGIN_VERIFY_OTP_API;
    resendOTPURL = RESEND_OTP_API;
  }

  var firstTwoNumber = mobileNumber.substring(0, 2);
  var lastTwoNumber = mobileNumber.substring(8, 10);

  $$("#reg-mob-number").text(" Please enter the 4 digit OTP sent to  " + firstTwoNumber + "******" + lastTwoNumber);

  if (pageFrom == undefined) {
    pageFrom == "";
  }

  if (serviceID == undefined) {
    serviceID == "";
  }

  if (serviceTitle == undefined) {
    serviceTitle == "";
  }

  sessionStorage.sessionServiceID = serviceID;
  sessionStorage.sessionServiceTitle = serviceTitle;
  sessionStorage.sessionPageFrom = pageFrom;

  console.log("pageFrom == " + pageFrom + "serviceID == " + serviceID + "serviceTitle == " + serviceTitle);

  //On clicking otp submit button 
  $$('.otp-submit').on('click', function (e) {

    app.preloader.show();
    e.preventDefault();

    var userotp = $$("#partitioned").val().trim();

    if (userotp.length == 0 || (userotp.length > 0 && userotp.length < 4)) {

      if (userotp.length == 0) {
        $$("#otp-invalid").removeClass("hidden");
        $$('#otp-error').text("Enter your OTP.");

      } else if (userotp.length > 0 && userotp.length < 4) {
        $$("#otp-invalid").removeClass("hidden");
        $$('#otp-error').text("OTP should be 4 digits.");

      } else {
        $$("#otp-invalid").addClass("hidden");
      }

      app.preloader.hide();

    } else {

      $$("#otp-invalid").addClass("hidden");

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();
      } else {

        // get customer ID stored in localStorage
        var user_id = localStorage.getItem('customerID');
        var tokenID = localStorage.getItem("token");

        var otp = userotp;

        app.request.setup({
          /*  headers: {
             'api_key': "6be2f840a6a0da34f9904743800e2cae"
           }, */
          cache: false
        });

        app.request.post(verifyOTPURL, {
          otp: otp, customer_id: user_id, device_id: tokenID
        }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            if (typeof (Storage) !== "undefined") {

              localStorage.setItem("customerID", obj.success.customer_details.customer_id);
              localStorage.setItem("isLogin", 'true');

              if (pageFrom == "homeMyAccount") {
                app.views.main.router.navigate('/profile/');

              } else if (pageFrom == "homeMyBooking") {
                app.views.main.router.navigate('/mybooking/');

              } else if (pageFrom == "homeMyNotification") {
                app.views.main.router.navigate('/notification/');

              } else if (pageFrom == "subServiceList") {
                app.views.main.router.navigate('/service-sub-list/?serviceId=' + serviceID + '&serviceTitle=' + serviceTitle);

              } else if (pageFrom == "homeLogin") {
                app.views.main.router.navigate('/home/');

              } else if (pageFrom == "PushNotification") {
                app.views.main.router.navigate('/home/');

              } else {
                app.views.main.router.navigate('/home/');
              }

            } else {
              // Sorry! No Web Storage support..
            }
            message = obj.success.message;
            var toast = app.toast.create({
              text: message
            });
            toast.open();
            app.preloader.hide();
          }

          if (obj.error != undefined) {

            message = obj.error.message;
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();

            $$("#partitioned").val("");
          }
        });
      }
    }
  });


  /******** Resend API calling **********/

  //On clicking resend button 
  $$('.resend-onclick').on('click', function (e) {

    $$("#partitioned").val("");

    // get customer ID stored in localStorage
    var user_id = localStorage.getItem('customerID');
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      app.preloader.show();

      app.request.setup({
        /* headers: {
          'api_key': "6be2f840a6a0da34f9904743800e2cae"
        }, */
        cache: false
      });

      app.request.post(resendOTPURL, {
        customer_id: user_id
      }, function (data) {

        var obj = JSON.parse(data);

        if (obj.success != undefined) {

          if (typeof (Storage) !== "undefined") {
            localStorage.setItem("customerID", obj.success.customer_details.customer_id);

            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();

          } else {
            // Sorry! No Web Storage support..
          }
          app.preloader.hide();
        }

        if (obj.error != undefined) {
          message = obj.error.message;
          console.log("Error " + message);
          app.preloader.hide();

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
      });
    }
  });
});

/******************  On OTP page init End*******************************/


/********* Service List Api Start ************/

$$(document).on('page:init', '.page[data-name="service-list"]', function (e) {

  // Hide the main layout and show it after getting the response from server
  $$("#service-list-main-layout").hide();

  $$(".page").addClass("contentload");
  $$(".page").addClass("loadernone");

  var pageIndex = 1;
  var allowInfinite = true;

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {
    message = connectiontype;
    app.preloader.hide();
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();

  } else {

    loadServiceList();
  }

  function loadServiceList() {

    app.preloader.show();

    app.request.setup({
      /*  headers: {
         'api_key': "6be2f840a6a0da34f9904743800e2cae"
       }, */
      cache: false
    });

    /*  app.request.get("https://jsonplaceholder.typicode.com/todos/1", function (data) { */

    app.request.get(SERVICE_LIST_API, { page: pageIndex }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.services != null) {

          var str = "";

          if (obj.success.services.length > 0) {

            for (var x = 0; x < obj.success.services.length; x++) {

              console.log(obj.success.services);

              str += '<li>';
              str += '<a href="/service-sub-list/?serviceId=' + obj.success.services[x].service_id + '&serviceTitle=' + obj.success.services[x].title +
                '&serviceFrom=' + "ServiceListScreen" + '" class="item-link item-content">';
              str += '<div class="item-media"><img src="' + obj.success.services[x].image + '" class="profile-item-image"/></div>';
              str += '<div class="item-inner">';
              str += '<div class="item-title-row text-vertical-center">';
              str += '<div class="item-title">' + obj.success.services[x].title + '</div>';
              str += '</div>';
              str += '</div>';
              str += '</a>';
              str += '</li>';
            }
            pageIndex = pageIndex + 1;

          } else {

          }

          $$(".page").addClass("loadernone");
          $$(".page").removeClass("contentload");
        }

        // Now showing the main layout after getting the response from server
        $$("#service-list-main-layout").show();

      } else if (obj.error != undefined) {
        message = obj.error.message;
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();

        // Now showing the main layout after getting the response from server
        $$("#service-list-main-layout").show();
      }
      $$("#service-list").html(str);
      app.preloader.hide();
      console.log(obj);
      $$("#service-list-main-layout").show();

    }, function (error) {
      console.log(error);
      app.preloader.hide();
      // Now showing the main layout after getting the response from server
      $$("#service-list-main-layout").show();
    });
  }

  /* Infinite scroll */

  // Attach 'infinite' event handler

  $$('.infinite-scroll-content').on('infinite', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {

      $$(".page").removeClass("loadernone");

      $$('.infinite-scroll-preloader').show();
      var lastItemIndex = $$('#service-list li').length;

      // Max items to load
      var maxItems = 1000;

      // Exit, if loading in progress
      if (!allowInfinite) return;

      // Set loading flag
      allowInfinite = false;

      // Emulate 1s loading
      setTimeout(function () {
        // Reset loading flag
        allowInfinite = true;

        if (lastItemIndex >= maxItems) {
          // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
          app.infiniteScroll.destroy('.infinite-scroll-content');
          // Remove preloader
          $$('.infinite-scroll-preloader').hide();
          return;
        }

        app.request.get(SERVICE_LIST_API, { page: pageIndex }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            if (obj.success.services != null) {

              var str = "";

              if (obj.success.services.length > 0) {

                for (var x = 0; x < obj.success.services.length; x++) {

                  str += '<li>';
                  str += '<a href="/service-sub-list/?serviceId=' + obj.success.services[x].service_id + '&serviceTitle=' + obj.success.services[x].title +
                    '&serviceFrom=' + "ServiceListScreen" + '" class="item-link item-content">';
                  str += '<div class="item-media"><img src="' + obj.success.services[x].image + '" class="profile-item-image"/></div>';
                  str += '<div class="item-inner">';
                  str += '<div class="item-title-row text-vertical-center">';
                  str += '<div class="item-title">' + obj.success.services[x].title + '</div>';
                  str += '</div>';
                  str += '</div>';
                  str += '</a>';
                  str += '</li>';
                }

                $$('.infinite-scroll-preloader').hide();
                $$('#service-list').append(str);
              } else {
                app.infiniteScroll.destroy('.infinite-scroll-content');
                // Remove preloader
                $$('.infinite-scroll-preloader').hide();
                pageIndex = 0;
                return;
              }
            }
          }
        }, function (error) {
          console.log(error);
          app.preloader.hide();
        });
        // Update last loaded index
        pageIndex = pageIndex + 1;
      }, 1000);
    }
  });

  /* Infinite scroll ends */

});

/********* Service List Api End ************/



/************ Service Sub List Api Start **************/

$$(document).on('page:init', '.page[data-name="service-sub-list"]', function (e) {

  var page = $$('.page[data-name="service-sub-list"]')[0].f7Page;
  var serviceId = page.route.query.serviceId;
  var serviceTitle = page.route.query.serviceTitle;
  var serviceFrom = page.route.query.serviceFrom;

  sessionStorage.sessionServiceID = serviceId;
  sessionStorage.sessionServiceTitle = serviceTitle;
  sessionStorage.sessionServiceFrom = serviceFrom;

  var service_id = serviceId;
  var service_title = serviceTitle;
  $$('.title').html(service_title);

  var isLoggedIn = localStorage.getItem("isLogin");
  console.log("Login status " + isLoggedIn);

  if (isLoggedIn == null || isLoggedIn == undefined) {
    isLoggedIn = "";
  }

  // Hide the main layout and show it after getting the response from server
  $$("#sub-service-list-main-layout").hide();
  $$("#sub-service-list-navbar").hide();

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

  } else {
    loadServiceList();
  }

  function loadServiceList() {

    app.preloader.show();

    app.request.setup({
      /*  headers: {
         'api_key': "6be2f840a6a0da34f9904743800e2cae"
       }, */
      cache: false
    });

    app.request.get(SUB_SERVICE_LIST_API, { service_id: service_id }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.services != null) {

          var str = "";

          if (obj.success.services.length > 0) {

            for (var x = 0; x < obj.success.services.length; x++) {
              str += '<li>';
              str += '<label class="item-checkbox item-content text-vertical-center">';
              str += '<input class="row_checkbox1" type="checkbox" name="demo-checkbox"  + value="' + obj.success.services[x].sub_service_id + '"/>';
              str += '<div class="item-media"><img src="' + obj.success.services[x].image + '" class="profile-item-image" /></div>';
              str += '<div class="item-inner text-vertical-center">';
              str += '<div class="item-title">' + obj.success.services[x].title + '</div>';
              str += '</div>';
              str += '<i class="icon icon-checkbox"></i>';
              str += '</div>';
              str += '</label>';
              str += '</li>';
            }
          }

          $$("#service-sub-list").html(str);

          var subServiceIDs = JSON.parse(localStorage.getItem("subserviceid") || "[]");

          if (subServiceIDs == null || subServiceIDs == undefined) {
            subServiceIDs.length = 0;
          }

          var num = $$("#service-sub-list").find("li").length;

          if (subServiceIDs.length > 0) {

            $$("#service-sub-list li").each(function (k) {

              for (var i = 0; i < num; i++) {

                for (var j = 0; j < subServiceIDs.length; j++) {

                  if ($$(this).closest('li').find(".row_checkbox1").val() == subServiceIDs[j]) {

                    $$(this).closest('li').find(".row_checkbox1").prop('checked', true);
                  } else {

                  }

                }

              }
            });

          }

        }

        // Now showing the main layout after getting the response from server
        $$("#sub-service-list-main-layout").show();
        $$("#sub-service-list-navbar").show();
        //app.preloader.hide();

      } else if (obj.error != undefined) {
        message = obj.error.message;
        console.log("Error " + message);
        //app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
        // Now showing the main layout after getting the response from server
        $$("#sub-service-list-main-layout").show();
        $$("#sub-service-list-navbar").show();
      }

      //app.preloader.hide();
      console.log(obj);
    });

  }

  //On clicking proceed button pass service id and sub service id to request booking screen
  $$('#proceed-button').on('click', function (e) {

    e.preventDefault();

    var ids = []; // array to save values of all checked checkbox
    var svs = [];
    var a = 0;
    $$("input.row_checkbox1:checked").each(function () {
      ids[a] = $$(this).val();
      svs[a] = $$(this).closest('li').find(".item-title").text();
      a++;
    });
    localStorage.setItem("subserviceid", JSON.stringify(ids));
    localStorage.setItem("subservices", JSON.stringify(svs));
    console.log("Sub Services -" + svs);

    if (isLoggedIn == 'true') { // If user is already logged in

      if (ids.length > 0) {

        var connectiontype = checkConnection();

        if (connectiontype == "No network connection") {
          message = connectiontype;
          app.preloader.hide();
          var toast = app.toast.create({
            text: message
          });
          toast.open();
          app.preloader.hide();

          app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "SubServiceListScreen" + '&serviceId=' + serviceId + '&serviceTitle=' + serviceTitle
            + '&serviceFrom=' + serviceFrom);

        } else {

          app.views.main.router.navigate('/request-booking/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle
            + '&serviceFrom=' + serviceFrom);
        }

      } else {
        var toast = app.toast.create({
          text: "Please select at least one service."
        });
        toast.open();
      }
    } else { // If user is not logged in redirect to login page
      app.views.main.router.navigate('/login/?pageFrom=' + "subServiceList" + '&serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + serviceFrom);
    }
  });

  //On clicking back button 
  $$('#sub-service-back-button').on('click', function (e) {

    localStorage.removeItem("subserviceid");

    if (serviceFrom == "ServiceListScreen") {
      app.views.main.router.navigate('/service-list/');

    } else {
      app.views.main.router.navigate('/home/');
    }
  });
});


/************ Service Sub List Api End **************/


/************ Profile Api Start **************/

$$(document).on('page:init', '.page[data-name="profile"]', function (e) {

  sessionStorage.sessionScreenName = "profile";

  $$('#profile_container').hide();
  $$('#navbar').hide();
  $$('#profile-card-container').hide();

  var user_id = localStorage.getItem("customerID");

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

  } else {
    app.preloader.show();
    loadProfileData();
  }

  function loadProfileData() {

    app.request.setup({
      /* headers: {
        'api_key': "6be2f840a6a0da34f9904743800e2cae"
      }, */
      cache: false
    });

    app.request.get(PROFILE_API, { customer_id: user_id }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.customer_details != undefined) {

          var firstName = obj.success.customer_details.first_name;
          var lastName = obj.success.customer_details.last_name;
          var email = obj.success.customer_details.email;
          var mobile = obj.success.customer_details.mobile;
          var address = obj.success.customer_details.address;
          var state = obj.success.customer_details.state;
          var city = obj.success.customer_details.city;
          var pinCode = obj.success.customer_details.pincode;

          $$('#profile-name').text(firstName + " " + lastName);
          $$('#profile-email').text(email);
          $$('#profile-mobile').text(mobile);
          $$('#profile-address').text(address + ", " + city + ", " + state + ", " + pinCode);
        }
        app.preloader.hide();
        $$('#profile_container').show();
        $$('#navbar').show();
        $$('#profile-card-container').show();

      } if (obj.error != undefined) {
        message = obj.error.message;
        console.log("Error " + message);
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
    });
  }

  //My booking  menu click
  $$("#my-booking-click-profile").on('click', function () {
    app.views.main.router.navigate('/mybooking/?navigationFrom=' + "ProfileScreen");
  });

  // Confirm Logout
  $$('#profile-logout-button').on('click', function () {

    sessionStorage.DialogOpen = 'true';

    app.dialog.confirm('Do you really want to logout?', function () {

      sessionStorage.DialogOpen = 'false';

      if (typeof (Storage) !== "undefined") {
        localStorage.setItem("isLogin", 'false');
        localStorage.removeItem("customerID");
        $$("#login_class").show();
        $$("#logout_class").hide();
        $$('#user-name').text("Guest");
        // Now setting notification count to zero
        localStorage.setItem("NotiCount", 0);
        //$$("#badge-layout").hide();

        var toast = app.toast.create({
          text: "You have been logged out successfully."
        });
        toast.open();

        app.views.main.router.navigate('/home/');
      }
    },
      function () {

        sessionStorage.DialogOpen = 'false';

      });
  });
});

/************ Profile Api End **************/


/******************  On Edit Profile page init*******************************/

$$(document).on('page:init', '.page[data-name="edit-profile"]', function (e) {

  // get customer ID stored in localStorage
  var user_id = localStorage.getItem('customerID');
  var mob_number;

  /************ Edit Profile Get API Start ************/

  app.request.setup({
    /* headers: {
      'api_key': "6be2f840a6a0da34f9904743800e2cae"
    }, */
    cache: false
  });

  app.preloader.show();
  loadProfileData();

  function loadProfileData() {
    app.request.get(PROFILE_API, { customer_id: user_id }, function (data) {
      var obj = JSON.parse(data);

      if (obj.success != undefined) {
        if (obj.success.customer_details != null) {
          var str = "";
          console.log(obj.success.customer_details.first_name);

          //app.input.focus('#editUserFirstName');
          $$('#editUserFirstName').val(obj.success.customer_details.first_name);

          //app.input.focus('#editUserLastName');
          $$('#editUserLastName').val(obj.success.customer_details.last_name);

          //app.input.focus('#editUseremail');
          $$('#editUseremail').val(obj.success.customer_details.email);

          //app.input.focus('#editUsermobile');
          mob_number = obj.success.customer_details.mobile;
          //split +91
          var res = mob_number.split("+91");
          var mobile_no = res[1];
          $$('#editUsermobile').val(parseInt(mobile_no));

          //app.input.focus('#editUseraddress');
          $$('#editUseraddress').val(obj.success.customer_details.address);

          //app.input.focus('#editUserstate');
          $$('#editUserstate').val(obj.success.customer_details.state);

          //app.input.focus('#editUsercity');
          $$('#editUsercity').val(obj.success.customer_details.city);

          //app.input.focus('#editUserPIN');
          $$('#editUserPIN').val(obj.success.customer_details.pincode);
        }
      }

      app.preloader.hide();
      //$$("#editProfileForm").html(str);
      console.log(obj);
    });
  }

  /************ Edit Profile Get API End ************/

  //On clicking save button starts
  $$('.edit-button').on('click', function (e) {

    //app.preloader.show();
    e.preventDefault();

    var editUserFirstName = $$("#editUserFirstName").val().trim();
    var editUserLastName = $$("#editUserLastName").val().trim();
    var editUserEmail = $$("#editUseremail").val().trim();
    var editUserMobile = $$("#editUsermobile").val().trim();
    var editUserAddress = $$("#editUseraddress").val().trim();
    var editUserPIN = $$("#editUserPIN").val().trim();
    var editUserCity = $$("#editUsercity").val().trim();
    var editUserState = $$("#editUserstate").val().trim();

    if (editUserFirstName.length == 0 || (editUserFirstName.length > 0 && editUserFirstName.length < 3) ||
      editUserLastName.length == 0 || (editUserLastName.length > 0 && editUserLastName.length < 3) || editUserEmail.length == 0
      || (editUserEmail.length > 0 && !validateEmail(editUserEmail)) || editUserMobile.length == 0 || (editUserMobile.length > 0 && editUserMobile.length < 10)
      || editUserAddress.length == 0 || (editUserAddress.length > 0 && editUserAddress.length < 10) || editUserPIN.length == 0
      || (editUserPIN.length > 0 && editUserPIN.length < 6) || editUserCity.length == 0 ||
      (editUserCity.length > 0 && editUserCity.length < 3) || editUserState.length == 0 ||
      (editUserState.length > 0 && editUserState.length < 6)) {

      app.preloader.hide();

      if (editUserFirstName.length == 0) {
        $$("#edit-first-name-invalid").removeClass("hidden");
        $$('#edit-first-name-error').text("Enter your first name.");

      } else if (editUserFirstName.length > 0 && editUserFirstName.length < 3) {
        $$("#edit-first-name-invalid").removeClass("hidden");
        $$('#edit-first-name-error').text("First name should be minimum 3 characters.");

      } else {
        $$("#edit-first-name-invalid").addClass("hidden");
      }

      if (editUserLastName.length == 0) {
        $$("#edit-last-name-invalid").removeClass("hidden");
        $$('#edit-last-name-error').text("Enter your last name.");

      } else if (editUserLastName.length > 0 && editUserLastName.length < 3) {
        $$("#edit-last-name-invalid").removeClass("hidden");
        $$('#edit-last-name-error').text("Last name should be minimum 3 characters.");

      } else {
        $$("#edit-last-name-invalid").addClass("hidden");
      }

      if (editUserEmail.length == 0) {
        $$("#edit-email-invalid").removeClass("hidden");
        $$('#edit-email-error').text("Enter your email.");

      } else if (editUserEmail.length > 0 && !validateEmail(editUserEmail)) {
        $$("#edit-email-invalid").removeClass("hidden");
        $$('#edit-email-error').text("Enter a valid email id.");

      } else {
        $$("#edit-email-invalid").addClass("hidden");
      }

      if (editUserMobile.length == 0) {
        $$("#edit-mobile-invalid").removeClass("hidden");
        $$('#edit-mobile-error').text("Enter your mobile number.");
      } else if (editUserMobile.length > 0 && editUserMobile.length < 10) {
        $$("#edit-mobile-invalid").removeClass("hidden");
        $$('#edit-mobile-error').text("Mobile number should be 10 digits.");

      } else {
        $$("#edit-mobile-invalid").addClass("hidden");
      }

      if (editUserAddress.length == 0) {
        $$("#edit-address-invalid").removeClass("hidden");
        $$('#edit-address-error').text("Enter your address.");
      } else if (editUserAddress.length > 0 && editUserAddress.length < 10) {
        $$("#edit-address-invalid").removeClass("hidden");
        $$('#edit-address-error').text("Address should be minimum 10 characters.");

      } else {
        $$("#edit-address-invalid").addClass("hidden");
      }

      if (editUserPIN.length == 0) {
        $$("#edit-pin-invalid").removeClass("hidden");
        $$('#edit-pin-error').text("Enter your PIN.");
      } else if (editUserPIN.length > 0 && editUserPIN.length < 6) {
        $$("#edit-pin-invalid").removeClass("hidden");
        $$('#edit-pin-error').text("PIN should be 6 digits.");

      } else {
        $$("#pin-invalid").addClass("hidden");
      }

      if (editUserCity.length == 0) {
        $$("#edit-city-invalid").removeClass("hidden");
        $$('#edit-city-error').text("Enter your city name.");
      } else if (editUserCity.length > 0 && editUserCity.length < 3) {
        $$("#edit-city-invalid").removeClass("hidden");
        $$('#edit-city-error').text("City should be minimum 3 characters.");

      } else {
        $$("#edit-city-invalid").addClass("hidden");
      }

      if (editUserState.length == 0) {
        $$("#edit-state-invalid").removeClass("hidden");
        $$('#edit-state-error').text("Enter your state name.");
      } else if (editUserState.length > 0 && editUserState.length < 6) {
        $$("#edit-state-invalid").removeClass("hidden");
        $$('#edit-state-error').text("State should be minimum 6 characters.");

      } else {
        $$("#edit-state-invalid").addClass("hidden");
      }
    } else {

      app.preloader.show();

      $$("#edit-first-name-invalid").addClass("hidden");
      $$("#edit-last-name-invalid").addClass("hidden");
      $$("#edit-email-invalid").addClass("hidden");
      $$("#edit-mobile-invalid").addClass("hidden");
      $$("#edit-address-invalid").addClass("hidden");
      $$("#edit-pin-invalid").addClass("hidden");
      $$("#edit-city-invalid").addClass("hidden");
      $$("#edit-state-invalid").addClass("hidden");

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {
        var toast = app.toast.create({
          text: connectiontype
        });
        toast.open();
      } else {

        updateProfile();
      }

      function updateProfile() {

        app.request.setup({
          /* headers: {
            'api_key': "6be2f840a6a0da34f9904743800e2cae"
          }, */
          cache: false
        });

        app.request.post(EDIT_PROFILE_API, {
          customer_id: user_id, first_name: editUserFirstName, last_name: editUserLastName, email: editUserEmail,
          mobile: editUserMobile, address: editUserAddress, pincode: editUserPIN, state: editUserState, city: editUserCity
        }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            message = obj.success.message;
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();

            app.preloader.hide();

            app.views.main.router.navigate('/profile/');
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        });
      }
    }
  });
  //On clicking save button ends

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("Inside validation email");
    return re.test(email);
  }
});
/******************  On Edit Profile page init ends*******************************/


/************ Booking List Api Start **************/

$$(document).on('page:init', '.page[data-name="mybooking"]', function (e) {

  // Hide the main layout and show it after getting the response from server
  $$("#booking-list-main-layout").hide();
  $$("#booking-fab-button").hide();
  $$("#booking-list-search-bar").hide();

  $$(".page").addClass("contentload");
  $$(".page").addClass("loadernone");

  var page = $$('.page[data-name="mybooking"]')[0].f7Page;
  var navigationFrom = page.route.query.navigationFrom;

  if (navigationFrom == undefined) {
    navigationFrom == "";
  }

  sessionStorage.sessionMyBookingNavigationFrom = navigationFrom;

  var pageIndex = 1;
  var allowInfinite = true;

  /* page refresh load */
  var $$ptrContent = $$('.ptr-content');
  // Add 'refresh' listener on it
  $$ptrContent.on('ptr:refresh', function (e) {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      var toast = app.toast.create({
        text: connectiontype
      });
      toast.open();
    } else {
      pageIndex = 1;
      app.preloader.show();
      loadBookings();
      app.infiniteScroll.create('.infinite-scroll-content');
      $$('.infinite-scroll-preloader').show();
      allowInfinite = true;
    }
  });
  /* page refresh load ends */


  var user_id = localStorage.getItem("customerID");
  //var user_id = "2";

  if (user_id == null || user_id == undefined) {
    user_id = 0;
  }

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

  } else {

    app.preloader.show();

    loadBookings();

  }

  function loadBookings() {

    $$("#my-booking").html("");

    console.log(user_id + '-' + pageIndex)

    app.request.setup({
      /*  headers: {
         'api_key': "6be2f840a6a0da34f9904743800e2cae"
       }, */
      cache: false

    });
    app.request.get(MY_BOOKING_LIST_API, { customer_id: user_id, page: pageIndex }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.bookings != null) {

          var str = "";

          if (obj.success.bookings.length > 0) {

            for (var x = 0; x < obj.success.bookings.length; x++) {

              $$("#booking-list-card").show();
              // $$("#booking-fab-button").show();
              $$("#booking-list-search-bar").show();
              $$("#swipe-refresh-pre-image").show();
              $$("#empty-booking-screen").hide();

              var dateTime = obj.success.bookings[x].date_time;
              var orderID = obj.success.bookings[x].order_id;
              var status = obj.success.bookings[x].status;
              var service_name = obj.success.bookings[x].service_name;
              var service_image = obj.success.bookings[x].service_image;

              var res = dateTime.split(" ");
              var dateString = res[0];
              var timeString = res[1];

              var ddmmyy = dateString.split("-");
              var date = ddmmyy[2];
              var month = ddmmyy[1];
              var year = ddmmyy[0];

              var formattedMonth = monthFormat(month);
              var finalDate = date + " " + formattedMonth + " " + year;
              var hhmm = timeString.split(":");
              var hour = hhmm[0];
              var minute = hhmm[1];

              var formattedHour = hourFormat(hour);

              var AMPM = "";

              if (hour >= 12 && hour <= 23) {
                AMPM = "PM";
              } else {
                AMPM = "AM";
              }

              var finalTime = formattedHour + ":" + minute + " " + AMPM;

              str += '<li>';
              str += '<a href="/booking-details/?orderId=' + orderID + '&navigationFrom=' + navigationFrom + '" class="item-link item-content">';
              str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
              str += '<div class="item-inner">';
              str += '<div class="item-title-row">';
              str += '<div class="item-order-number">Booking ID - ' + '#' + orderID + '</div>';

              if (status == "A".toUpperCase()) {
                str += '<div class="item-after orange-background">' + "Active" + '</div>';
              } else if (status == "C".toUpperCase()) {
                str += '<div class="item-after blue-background">' + "Confirmed" + '</div>';
              } else if (status == "R".toUpperCase()) {
                str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
              } else if (status == "CC".toUpperCase()) {
                str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
              } else if (status == "CS".toUpperCase()) {
                str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
              } else if (status == "CO".toUpperCase()) {
                str += '<div class="item-after green-background">' + "Completed" + '</div>';
              } else {
                str += '<div class="item-after">' + status + '</div>';
              }
              str += '</div>';
              str += '<div class="booking-service-name">' + service_name + '</div>';
              str += '<div class="item-title-row my-booking-date-otp-layout">';
              str += '<div class="item-date">Scheduled On - ' + finalDate + " " + finalTime + '</div>';
              str += '<div class="item-otp hidden">4785</div>';
              str += '</div>';
              str += '</div>';
              str += '</a>';
              str += '</li>';

            }
            // Now showing the main layout after getting the response from server
            $$("#booking-list-main-layout").show();
            // $$("#booking-fab-button").show();
            $$("#booking-list-search-bar").show();

            pageIndex = pageIndex + 1;
          } else {
            $$("#booking-list-card").hide();
            $$("#booking-fab-button").hide();
            $$("#booking-list-search-bar").hide();
            $$("#empty-booking-screen").show();
            $$("#swipe-refresh-pre-image").hide();

            // Now showing the main layout after getting the response from server
            $$("#booking-list-main-layout").show();

          }

          $$(".page").addClass("loadernone");
          $$(".page").removeClass("contentload");
        }
      } else if (obj.error != undefined) {
        message = obj.error.message;
        console.log("Error " + message);
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
      $$("#my-booking").html(str);
      app.ptr.done();
      app.preloader.hide();

    });
  }


  /* Infinite scroll */

  // Attach 'infinite' event handler

  $$('.infinite-scroll-content').on('infinite', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {

      $$(".page").removeClass("loadernone");

      $$('.infinite-scroll-preloader').show();
      var lastItemIndex = $$('#my-booking li').length;

      // Max items to load
      var maxItems = 100;

      // Exit, if loading in progress
      if (!allowInfinite) return;

      // Set loading flag
      allowInfinite = false;

      // Emulate 1s loading
      setTimeout(function () {
        // Reset loading flag
        allowInfinite = true;

        if (lastItemIndex >= maxItems) {
          // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
          app.infiniteScroll.destroy('.infinite-scroll-content');
          // Remove preloader
          $$('.infinite-scroll-preloader').hide();
          return;
        }

        app.request.get(MY_BOOKING_LIST_API, { customer_id: user_id, page: pageIndex }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            if (obj.success.bookings != null) {

              var str = "";

              if (obj.success.bookings.length > 0) {

                for (var x = 0; x < obj.success.bookings.length; x++) {

                  var dateTime = obj.success.bookings[x].date_time;
                  var orderID = obj.success.bookings[x].order_id;
                  var status = obj.success.bookings[x].status;
                  var service_name = obj.success.bookings[x].service_name;
                  var service_image = obj.success.bookings[x].service_image;

                  var res = dateTime.split(" ");
                  var dateString = res[0];
                  var timeString = res[1];

                  var ddmmyy = dateString.split("-");
                  var date = ddmmyy[2];
                  var month = ddmmyy[1];
                  var year = ddmmyy[0];

                  var formattedMonth = monthFormat(month);
                  var finalDate = date + " " + formattedMonth + " " + year;
                  var hhmm = timeString.split(":");
                  var hour = hhmm[0];
                  var minute = hhmm[1];

                  var formattedHour = hourFormat(hour);

                  var AMPM = "";

                  if (hour >= 12 && hour <= 23) {
                    AMPM = "PM";
                  } else {
                    AMPM = "AM";
                  }

                  var finalTime = formattedHour + ":" + minute + " " + AMPM;

                  str += '<li>';
                  str += '<a href="/booking-details/?orderId=' + orderID + '&navigationFrom=' + navigationFrom + '" class="item-link item-content">';
                  str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
                  str += '<div class="item-inner">';
                  str += '<div class="item-title-row">';
                  str += '<div class="item-order-number">Booking ID - ' + orderID + '</div>';

                  if (status == "A".toUpperCase()) {
                    str += '<div class="item-after orange-background">' + "Active" + '</div>';
                  } else if (status == "C".toUpperCase()) {
                    str += '<div class="item-after blue-background">' + "Confirmed" + '</div>';
                  } else if (status == "R".toUpperCase()) {
                    str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
                  } else if (status == "CC".toUpperCase()) {
                    str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                  } else if (status == "CS".toUpperCase()) {
                    str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                  } else if (status == "CO".toUpperCase()) {
                    str += '<div class="item-after green-background">' + "Completed" + '</div>';
                  } else {
                    str += '<div class="item-after">' + status + '</div>';
                  }
                  str += '</div>';
                  str += '<div class="booking-service-name">' + service_name + '</div>';
                  str += '<div class="item-title-row my-booking-date-otp-layout">';
                  str += '<div class="item-date">Scheduled On - ' + finalDate + " " + finalTime + '</div>';
                  str += '<div class="item-otp hidden">4785</div>';
                  str += '</div>';
                  str += '</div>';
                  str += '</a>';
                  str += '</li>';

                }
                $$('.infinite-scroll-preloader').hide();
                $$('#my-booking').append(str);
              } else {
                app.infiniteScroll.destroy('.infinite-scroll-content');
                // Remove preloader
                $$('.infinite-scroll-preloader').hide();
                pageIndex = 0;
                return;
              }
            }
          }
        });
        // Update last loaded index
        pageIndex = pageIndex + 1;
      }, 1000);
    }
  });

  /* Infinite scroll ends */


  //On clicking back button 
  $$('#my-booking-back-button').on('click', function (e) {

    var sessionMyBookingNavigationFrom = sessionStorage.sessionMyBookingNavigationFrom;

    if (sessionMyBookingNavigationFrom == "BookingSuccessScreen") {
      app.views.main.router.navigate('/home/');

    } else if (sessionMyBookingNavigationFrom == "HomeScreen") {
      app.views.main.router.navigate('/home/');

    } else if (sessionMyBookingNavigationFrom == "ProfileScreen") {
      app.views.main.router.navigate('/profile/');

    } else {
      app.views.main.router.navigate('/home/');
    }
  });
});

/************ Booking List Api End **************/



/************ Booking Details Screen Start **************/


$$(document).on('page:init', '.page[data-name="booking-details"]', function (e) {

  //hide the booking details screen
  $$('#contain-layout-booking-details').hide();
  $$('#booking-details-navbar').hide();

  var page = $$('.page[data-name="booking-details"]')[0].f7Page;
  var orderId = page.route.query.orderId;
  var navigationFrom = page.route.query.navigationFrom;
  var notificationID = page.route.query.notificationId;

  var ratingValue = 0;

  var user_id = localStorage.getItem("customerID");
  if (user_id == null) {
    user_id = 0;
  }

  if (notificationID == undefined || notificationID == null) {
    notificationID = "";
  } else {
    if (connectiontype == "No network connection") {

      app.preloader.hide();
    } else {
      // Call Read Notification API
      loadReadNotification(notificationID, user_id);

    }
  }

  sessionStorage.sessionMyBookingNavigationFrom = navigationFrom;
  sessionStorage.sessionMyBookingOrderID = orderId;

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

  } else {
    loadBookingDetails(orderId);
  }

  /* $$("body").on('click', '#extraRequirementImage img', function (e) {

    var imageURL = $$(this).attr('src');

  }); */


  // Extra requirement approve button click
  $$('#extra-req-approve-button').on('click', function () {

    sessionStorage.DialogOpen = 'true';

    app.dialog.confirm('Do you really want to approve the service?', function () {

      sessionStorage.DialogOpen = 'false';

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {

        var toast = app.toast.create({
          text: connectiontype
        });
        toast.open();

      } else {

        app.request.setup({
          /*  headers: {
             'api_key': "6be2f840a6a0da34f9904743800e2cae"
           }, */
          cache: false
        });

        app.preloader.show();

        app.request.post(EXTRA_REQ_UPDATE_API, {
          customer_id: user_id, order_id: orderId, status: 1
        }, function (data) {

          var obj = JSON.parse(data);
          console.log(data);
          if (obj.success != undefined) {

            app.preloader.hide();
            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();

            // load API again
            loadBookingDetails(orderId);
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        });
      }
    },
      function () {

        sessionStorage.DialogOpen = 'false';

      });
  });

  // Extra requirement cancel button click
  $$('#extra-req-cancel-button').on('click', function () {

    sessionStorage.DialogOpen = 'true';

    app.dialog.confirm('Do you really want to cancel the service?', function () {

      sessionStorage.DialogOpen = 'false';

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {

        var toast = app.toast.create({
          text: connectiontype
        });
        toast.open();

      } else {

        app.request.setup({
          /*  headers: {
             'api_key': "6be2f840a6a0da34f9904743800e2cae"
           }, */
          cache: false
        });
        app.preloader.show();
        app.request.post(EXTRA_REQ_UPDATE_API, {
          customer_id: user_id, order_id: orderId, status: 0
        }, function (data) {

          var obj = JSON.parse(data);
          console.log(data);
          if (obj.success != undefined) {

            app.preloader.hide();
            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();

            // load API again
            loadBookingDetails(orderId);
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        });
      }
    },
      function () {

        sessionStorage.DialogOpen = 'false';

      });
  });

  //Service end button click
  $$('.serviceEndButton').on('click', function () {

    sessionStorage.DialogOpen = 'true';

    app.dialog.confirm('Do you really want to end the service?', function () {

      sessionStorage.DialogOpen = 'false';

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {

        var toast = app.toast.create({
          text: connectiontype
        });
        toast.open();

      } else {

        app.request.setup({
          /* headers: {
            'api_key': "6be2f840a6a0da34f9904743800e2cae"
          }, */
          cache: false
        });
        app.preloader.show();

        app.request.post(SERVICE_END_API, {
          customer_id: user_id, order_id: orderId
        }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            app.preloader.hide();
            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();

            // Showing feedback dialog to customer and getting the data

            var dialog = app.dialog.create({

              title: '',
              text: '<div class="page-content feedback-main-layout">' +
                '<div class="card">' +
                '<div class="card-header feedback-header">' + "Feedback" +
                '</div>' +
                '<div class="clearfix">' +
                '</div>' +
                '<div class="list media-list card-inner-padding profile-list">' +
                '<div class="rating-stars text-center">' +
                '<ul id="stars">' +
                '<li class="star" title="Poor" data-value="1">' +
                '<i class="icon material-icons md-only">star_rate' +
                '</i>' +
                '</li>' +
                '<li class="star" title="Fair" data-value="2">' +
                '<i class="icon material-icons md-only">star_rate' +
                '</i>' +
                '</li>' +
                '<li class="star" title="Good" data-value="3">' +
                '<i class="icon material-icons md-only">star_rate' +
                '</i>' +
                '</li>' +
                '<li class="star" title="Excellent" data-value="4">' +
                '<i class="icon material-icons md-only">star_rate' +
                '</i>' +
                '</li>' +
                '<li class="star" title="Fully Satisfied" data-value="5">' +
                '<i class="icon material-icons md-only">star_rate' +
                '</i>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<textarea class="resizable" placeholder="Feedback" maxlength="200" id="feedbackInput">' +
                '</textarea>' +
                '<div class="row feed-sub-layout">' +
                '<div class="feedback-cancel-btn col-50" id="feedback-cancel-button">' + "Skip" +
                '</div>' +
                '<div class="feedback-submit-btn col-50" id="feedback-submit-button">' + "Submit" +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',

              cssClass: 'customer-feedback feedback-dialog-h-w',
              closeByBackdropClick: 'false',

              on: {
                opened: function () {
                  sessionStorage.DialogOpen = 'true';
                },
                close: function () {
                  sessionStorage.DialogOpen = 'false';
                }
              }
            });

            dialog.open();

            sessionStorage.DialogOpen = 'true',

              /* 2. Action to perform on click */
              $$('#stars li').on('click', function () {

                var rateStar = parseInt($$(this).data('value'), 10); // The star currently selected
                var stars = $$(this).parent().children('li.star');

                for (i = 0; i < stars.length; i++) {
                  $$(stars[i]).removeClass('selected');
                }

                for (i = 0; i < rateStar; i++) {
                  $$(stars[i]).addClass('selected');
                }

                ratingValue = rateStar;

              });

            $$('#feedback-submit-button').on('click', function (e) {

              var feedbackText = $$("#feedbackInput").val().trim();

              if (ratingValue < 1 || feedbackText == "") {

                var toast = app.toast.create({
                  text: "Please rate the service and write your feedback."
                });
                toast.open();
              } else {


                app.request.setup({
                  /* headers: {
                    'api_key': "6be2f840a6a0da34f9904743800e2cae"
                  }, */
                  cache: false
                });

                app.preloader.show();

                app.request.post(FEEDBACK_API, {
                  customer_id: user_id, order_id: orderId, rating: ratingValue, feedback: feedbackText
                }, function (data) {

                  var obj = JSON.parse(data);
                  console.log(data);
                  if (obj.success != undefined) {

                    app.preloader.hide();
                    var msg = obj.success.message;
                    var toast = app.toast.create({
                      text: msg
                    });
                    toast.open();

                    dialog.close(true);

                    // load API again
                    loadBookingDetails(orderId);
                  }

                  if (obj.error != undefined) {

                    message = obj.error.message;
                    console.log("Error " + message);
                    app.preloader.hide();

                    var toast = app.toast.create({
                      text: message
                    });
                    toast.open();

                    dialog.close(true);

                    // load API again
                    loadBookingDetails(orderId);
                  }
                });

              }

            });

            $$('#feedback-cancel-button').on('click', function (e) {

              sessionStorage.DialogOpen = 'false';

              dialog.close(true);

              // load API again
              loadBookingDetails(orderId);
            });
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();

            // load API again
            loadBookingDetails(orderId);
          }
        });
      }
    },
      function () {

        sessionStorage.DialogOpen = 'false';

      });
  });

  //View invoice button click
  $$('#viewInvoiceButton').on('click', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {
      app.views.main.router.navigate('/payment/?navigationFrom=' + navigationFrom + '&orderId=' + sessionStorage.sessionMyBookingOrderID);
    }

  });

  //On clicking back button 
  $$('#booking-details-back-button').on('click', function (e) {

    if (navigationFrom == "NotificationScreen") {
      app.views.main.router.navigate('/notification/');

    } else if (navigationFrom == "BookingSuccessScreen") {
      app.views.main.router.navigate('/home/');
    } else {
      app.views.main.router.navigate('/mybooking/?navigationFrom=' + navigationFrom);
    }
  });



  //On clicking invoice download button 
  $$('#invoice-anchor').on('click', function (e) {

    e.preventDefault;
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      //alert(" Download Clicked");

      // window.open = cordova.InAppBrowser.open;
      // cordova.InAppBrowser.open('https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf', '_self', 'location=yes');

      //$$('#invoice-anchor').attr("href", "https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf");

      /* debugger
      app.request.setup({
        headers: {
          'api_key': "6be2f840a6a0da34f9904743800e2cae"
        },
        cache: false
      });
 */

      /*
            app.request.get('http://yupserve.com/api/customer/download_invoice.php/index', { order_id: orderId, api_key: '6be2f840a6a0da34f9904743800e2cae' }, function (data) {
              debugger
              var obj = JSON.parse(data);
              debugger
              if (obj.success != undefined) {
      
                if (obj.success.invoice != null) {
      
                  var invoice = obj.success.invoice.order_id;
                  var invoicePath = obj.success.invoice.invoice;
      
                  $$('#invoice-anchor').attr("href", invoicePath);
      
                }
              }
      
              if (obj.error != undefined) {
                message = obj.error.message;
                console.log("Error " + message);
                app.preloader.hide();
      
                var toast = app.toast.create({
                  text: message
                });
                toast.open();
              }
            });  */

      /* 

      switch (device.platform) {

        case "Android":
          storageLocation = 'file:///storage/emulated/0/';
          break;
        case "iOS":
          storageLocation = cordova.file.documentsDirectory;
          break;

      }

      var fileTransfer = new FileTransfer();

      if (sessionStorage.platform.toLowerCase() == "android") {

        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, onFileSystemSuccess, onError);
      } else {
        // for iOS
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onError);
      }

      function onError(e) {
        navigator.notification.alert("Error : Downloading Failed");
      };

      function onFileSystemSuccess(fileSystem) {
        var entry = "";
        if (sessionStorage.platform.toLowerCase() == "android") {
          entry = fileSystem;
        } else {
          entry = fileSystem.root;
        }
        entry.getDirectory("YupServe", {
          create: true,
          exclusive: false
        }, onGetDirectorySuccess, onGetDirectoryFail);

      };

      function onGetDirectorySuccess(dir) {
        cdr = dir;
        dir.getFile("Invoice", {
          create: true,
          exclusive: false
        }, gotFileEntry, errorHandler);

      };

      function gotFileEntry(fileEntry) {
        // URL in which the pdf is available
        var documentUrl = "https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf";
        var uri = encodeURI(documentUrl);
        fileTransfer.download(uri, cdr.nativeURL + "Invoice.pdf",
          function (entry) {
            // Logic to open file using file opener plugin
          },
          function (error) {
            navigator.notification.alert(ajaxErrorMsg);
          },
          false
        );

        var toast = app.toast.create({
          text: "Invoice stored inside YupServe folder."
        });
        toast.open();

      };

      function onGetDirectoryFail(dir) {

        console.log("Fail");
      };

      function errorHandler(dir) {

        console.log("Error");
      }; */
    }
  });



  //On clicking filter button 
  $$('#viewCancelBookingLayout').on('click', function (e) {

    sessionStorage.DialogOpen = "true";

    var reasonDialog = app.dialog.create({
      title: 'Please tell us the reason for cancel',
      text:
        '<div class="page-content-cancel-book">'
        + '<ul id="reason-ul">'
        + '<li class="item-content item-input">'
        + '<div class="item-inner">'
        + '<div class="item-title item-label">Reason</div>'
        + '<div class="item-input-wrap">'
        + '<textarea class="resizable" placeholder="Please enter your reason" id="reason-text-area"></textarea>'
        + '</div>'
        + '</div>'
        + '</li>'
        + '</ul>'
        + '<ul id="button-layout-ul">'
        + '<li class="filter-dialog-button-layout">'
        + '<div class="row" style="margin-top: 10px; border: 1px solid #ddd; padding: 10px;">'
        + '<div class="col-50" style="color: black; border-right: solid 1px gainsboro" id="orderCancelButton">Cancel</div>'
        + '<div class="col-50" style="color: green" id="orderSubmitButton">Submit</div>'
        + '</div>'
        + '</li>'
        + '</ul>'
        + '<div>',

      cssClass: 'filter-dialog filter-dialog-title',
      loseByBackdropClick: 'false',
      on: {
        opened: function () {
          sessionStorage.DialogOpen = 'true';
        },
        close: function () {
          sessionStorage.DialogOpen = 'false';
        }
      }
    });

    reasonDialog.open();

    //Dialog View cancel button click
    $$('#orderCancelButton').on('click', function () {
      sessionStorage.DialogOpen = "false";
      reasonDialog.close();

    });

    //Dialog View submit button click
    $$('#orderSubmitButton').on('click', function () {
     
      var reasonText = $$("#reason-text-area").val().trim();
      var user_id = localStorage.getItem("customerID");
      if (user_id == null) {
        user_id = 0;
      }

      if (reasonText == "") {
        var toast = app.toast.create({
          text: "Please enter reason"
        });
        toast.open();
      } else {

       // app.preloader.show();

         app.request.setup({
            cache: false
          }); 

         app.request.post(CANCEL_BOOKING_API, {
          customer_id: user_id, order_id: orderId, remark: reasonText
          }, function (data) {

            var obj = JSON.parse(data);

            if (obj.success != undefined) {

              app.preloader.hide();
              var msg = obj.success.message;
              var toast = app.toast.create({
                text: msg
              });
              toast.open();

              reasonDialog.close();

              // load API again
              loadBookingDetails(orderId);

            }

            if (obj.error != undefined) {

              message = obj.error.message;
              console.log("Error " + message);
              app.preloader.hide();

              var toast = app.toast.create({
                text: message
              });
              toast.open();

              reasonDialog.close();
            }
          },function(error){
            reasonDialog.close();
          });  
      }
    });
  });
});


/************ Booking Details Screen End **************/

/************ Payment Details Api Start **************/

$$(document).on('page:init', '.page[data-name="payment"]', function (e) {

  var page = $$('.page[data-name="payment"]')[0].f7Page;
  var orderId = page.route.query.orderId;

  var navigationFrom = page.route.query.navigationFrom;

  var customer_email = '';
  var customer_mobile = '';
  var customer_name = '';
  var amount = '';
  var paymentType = '';

  if (orderId == null || orderId == undefined) {
    orderId = sessionStorage.PayUOrderId
  }

  if (navigationFrom == null || navigationFrom == undefined) {
    navigationFrom = sessionStorage.PayUNavigationFrom
  }

  var user_id = localStorage.getItem("customerID");
  if (user_id == null) {
    user_id = 0;
  }

  $$("#coupon-layout").hide();

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {
    message = connectiontype;
    app.preloader.hide();
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();
  } else {
    loadPaymentDetails();
  }

  function loadPaymentDetails() {

    app.preloader.show();

    app.request.setup({
      /* headers: {
        'api_key': "6be2f840a6a0da34f9904743800e2cae"
      }, */
      cache: false
    });

    //hide the booking details screen
    $$('#payment-details-screen').hide();

    app.request.get(PAYMENT_DETAILS_API, {
      order_id: orderId
    }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.booking_details != null) {

          //Order
          var OrderID = obj.success.booking_details.order_details.order_id;
          var serviceTitle = obj.success.booking_details.order_details.service_title;
          customer_email = obj.success.booking_details.customer_details.email;
          customer_mobile = obj.success.booking_details.customer_details.phone;
          customer_name = obj.success.booking_details.customer_details.customer_name;

          $$('#payment-order-id').text("#" + OrderID);

          //Sub Service
          if (obj.success.booking_details.sub_services != null) {

            if (obj.success.booking_details.sub_services.length > 0) {

              var str = "";
              var subServiceName = '';
              for (var x = 0; x < obj.success.booking_details.sub_services.length; x++) {
                var subServiveId = obj.success.booking_details.sub_services[x].sub_service_id;
                //subServiveName = obj.success.booking_details.sub_services[x].sub_service_title;

                if (x == 0) {
                  subServiceName = subServiceName + obj.success.booking_details.sub_services[x].sub_service_title;
                } else {

                  subServiceName = subServiceName + ", " + obj.success.booking_details.sub_services[x].sub_service_title;
                }
              }
              str += '<span>' + subServiceName + '</span>';
              $$("#payment-sub-services").html(str);
            }
          }
          // Invoice Details
          if (obj.success.booking_details.invoice_dtls != "") {

            var isInvoiceGenerated = obj.success.booking_details.invoice_dtls.invoice_generated;
            totalPrice = obj.success.booking_details.invoice_dtls.payment_total;
            amount = totalPrice;

            $$('#payment-price').text("Rs " + totalPrice);

            app.request.get(PAYMENT_INVOICE_DOWNLOAD_API, { order_id: orderId}, function (data) {

              var obj = JSON.parse(data);

              if (obj.success != undefined) {

                if (obj.success.invoice != null) {

                  var invoice = obj.success.invoice.order_id;
                  var invoicePath = obj.success.invoice.invoice;

                  $$('#invoice-anchor_payment').attr("href", invoicePath);

                }
              }

              if (obj.error != undefined) {
                message = obj.error.message;
                console.log("Error " + message);
                //$$('#invoice-anchor').attr("href", "#");
                $$("#invoice-anchor_payment").attr("disabled", "disabled");
                $$("#invoice-anchor_payment").removeAttr("href");
                app.preloader.hide();

              }
            });

          } else {
          }
          //Show the after get all responce
          $$('#payment-details-screen').show();
          app.preloader.hide();

        }
      }

      if (obj.error != undefined) {
        message = obj.error.message;

        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
      app.preloader.hide();
    });
  }

  //On clicking invoice download button 
  $$('#download-invoice').on('click', function (e) {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      /* app.request.setup({
        headers: {
          'api_key': "6be2f840a6a0da34f9904743800e2cae"
        },
        cache: false
      });


      app.request.get('http://yupserve.com/api/customer/download_invoice.php', {
        order_id: orderId
      }, function (data) {

        var obj = JSON.parse(data);

        if (obj.success != undefined) {

          if (obj.success.invoice != null) {

            var orderID = obj.success.invoice.order_id;
            var invoicePath = obj.success.invoice.invoice;

            $$('#invoice-anchor').attr("href", invoicePath);
          }
        }

        if (obj.error != undefined) {
          message = obj.error.message;
          console.log("Error " + message);
          app.preloader.hide();
          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }

      }); */

    }


    /* 
          switch (device.platform) {
    
            case "Android":
              storageLocation = 'file:///storage/emulated/0/';
              break;
            case "iOS":
              storageLocation = cordova.file.documentsDirectory;
              break;
    
          }
    
          var fileTransfer = new FileTransfer();
    
          if (sessionStorage.platform.toLowerCase() == "android") {
    
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, onFileSystemSuccess, onError);
          } else {
            // for iOS
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onError);
          }
    
          function onError(e) {
            navigator.notification.alert("Error : Downloading Failed");
          };
    
          function onFileSystemSuccess(fileSystem) {
            var entry = "";
            if (sessionStorage.platform.toLowerCase() == "android") {
              entry = fileSystem;
            } else {
              entry = fileSystem.root;
            }
            entry.getDirectory("YupServe", {
              create: true,
              exclusive: false
            }, onGetDirectorySuccess, onGetDirectoryFail);
    
          };
    
          function onGetDirectorySuccess(dir) {
            cdr = dir;
            dir.getFile("Invoice", {
              create: true,
              exclusive: false
            }, gotFileEntry, errorHandler);
    
          };
    
          function gotFileEntry(fileEntry) {
            // URL in which the pdf is available
            var documentUrl = "https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf";
            var uri = encodeURI(documentUrl);
            fileTransfer.download(uri, cdr.nativeURL + "Invoice.pdf",
              function (entry) {
                // Logic to open file using file opener plugin
              },
              function (error) {
                navigator.notification.alert(ajaxErrorMsg);
              },
              false
            );
    
            var toast = app.toast.create({
              text: "Invoice stored inside YupServe folder."
            });
            toast.open();
    
          };
    
    
          function onGetDirectoryFail(dir) {
    
            console.log("Fail");
          };
    
          function errorHandler(dir) {
    
            console.log("Error");
          };
    
        } */

  });

  //On clicking back button 
  $$('#popup').on('click', function (e) {

    sessionStorage.DialogOpen = 'true';
  });

  //On clicking back button 
  $$('#popup_close_button').on('click', function (e) {
    sessionStorage.DialogOpen = 'false';
  });


  //On clicking back button 
  $$('#payment-details-back-button').on('click', function (e) {

    app.views.main.router.navigate('/booking-details/?navigationFrom=' + navigationFrom + '&orderId=' + orderId);
  });

  //On clicking book button 
  $$('#pay-now-button').on('click', function (e) {

    var statusIDs = []; // array to save values of all checked checkbox
    var x = 0;

    $$("input.row_checkbox:checked").each(function () {
      statusIDs[x] = $$(this).val();
      x++;
    });

    if (statusIDs.length > 0) {

      if (paymentType == "") {

        var toast = app.toast.create({
          text: "Please choose payment type."
        });
        toast.open();
      } else {

        if (paymentType == "Cash") {

          var connectiontype = checkConnection();

          if (connectiontype == "No network connection") {
            message = connectiontype;
            app.preloader.hide();
            var toast = app.toast.create({
              text: message
            });
            toast.open();
            app.preloader.hide();
          } else {
            callPayByCashAPI();
          }
        } else {
          app.preloader.hide();
          app.views.main.router.navigate('/payu-money/?navigationFrom=' + navigationFrom + '&orderId=' + orderId
            + '&custName=' + customer_name + '&custMobile=' + customer_mobile + '&custEmail=' + customer_email + '&amount=' + amount);

        }
      }
    } else {
      var toast = app.toast.create({
        text: "Please agree to our Terms & Conditions."
      });
      toast.open();
    }

    function callPayByCashAPI() {

      var paymentType = "cash";

      app.preloader.show();

      app.request.setup({
        /*  headers: {
           'api_key': "6be2f840a6a0da34f9904743800e2cae"
         }, */
        cache: false
      });

      app.request.post(PAY_BY_CASH_API, {
        customer_id: user_id, order_id: orderId, payment_method: paymentType
      }, function (data) {

        var obj = JSON.parse(data);

        if (obj.success != undefined) {

          app.preloader.hide();
          var msg = obj.success.message;
          var toast = app.toast.create({
            text: msg
          });
          toast.open();

          app.views.main.router.navigate('/booking-details/?navigationFrom=' + navigationFrom + '&orderId=' + orderId);
        }

        if (obj.error != undefined) {
          message = obj.error.message;
          console.log("Error " + message);
          app.preloader.hide();

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
      });
    }
  });

  $$("body").on('click', '#payment-types-option button', function (e) {

    $$("#payment-types-option button").removeClass("color-green");
    $$(this).addClass("color-green");

    $$("#payment-types-option").val($$(this).val());
    paymentType = ($$(this).val());
  });
});

/************ Payment Details Api End **************/


/* Notification List Start */

$$(document).on('page:init', '.page[data-name="notification"]', function (e) {

  // Hide the main layout and show it after getting the response from server
  $$("#notification-list-main-layout").hide();
  $$("#empty-notification-screen").hide();

  $$(".page").addClass("contentload");
  $$(".page").addClass("loadernone");

  app.request.setup({
    /*  headers: {
       'api_key': "6be2f840a6a0da34f9904743800e2cae"
     }, */
    cache: false
  });

  var user_id = localStorage.getItem("customerID");

  if (user_id == null || user_id == undefined) {
    user_id = 0;
  }

  var pageIndex = 1;
  var allowInfinite = true;

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

  } else {

    app.preloader.show();

    loadNotification();

  }
  function loadNotification() {

    app.request.get(NOTIFICATION_LIST_API, { customer_id: user_id, page: pageIndex }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.notifications != null) {

          var str = "";

          if (obj.success.notifications.length > 0) {

            for (var x = 0; x < obj.success.notifications.length; x++) {

              $$("#empty-notification-screen").hide();

              var notification_text = obj.success.notifications[x].text;
              var dateTime = obj.success.notifications[x].created_at;
              var orderID = obj.success.notifications[x].order_id;
              var isRead = obj.success.notifications[x].is_read;
              var notificationId = obj.success.notifications[x].id;


              var res = dateTime.split(" ");
              var dateString = res[0];
              var timeString = res[1];

              var ddmmyy = dateString.split("-");
              var date = ddmmyy[2];
              var month = ddmmyy[1];
              var year = ddmmyy[0];

              var formattedMonth = monthFormat(month);

              var finalDate = date + " " + formattedMonth + " " + year;

              var hhmm = timeString.split(":");
              var hour = hhmm[0];
              var minute = hhmm[1];

              var formattedHour = hourFormat(hour);

              var AMPM = "";

              if (hour >= 12 && hour <= 23) {
                AMPM = "PM";
              } else {
                AMPM = "AM";
              }

              var finalTime = formattedHour + ":" + minute + " " + AMPM;

              if (isRead) {

                str += '<li>';
                str += '<a href="/booking-details/?orderId=' + orderID + '&navigationFrom=' + "NotificationScreen" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                str += '<div class="item-inner">';
                str += '<div class="notification-read-message-text">' + notification_text + '</div>';
                str += '<div class="row text-vertical-center">';
                str += '<div class="notification-read-date-time">' + finalDate + '</div>';
                str += '<div class="notification-read-date-time">' + finalTime + '</div>';
                str += '</div>';
                str += '</div>';
                str += '</a>';
                str += '</li>';

              } else {

                str += '<li>';
                str += '<a href="/booking-details/?orderId=' + orderID + '&navigationFrom=' + "NotificationScreen" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                str += '<div class="item-inner">';
                str += '<div class="notification-message-text">' + notification_text + '</div>';
                str += '<div class="row text-vertical-center">';
                str += '<div class="notification-date-time">' + finalDate + '</div>';
                str += '<div class="notification-date-time">' + finalTime + '</div>';
                str += '</div>';
                str += '</div>';
                str += '</a>';
                str += '</li>';

              }

            }

            pageIndex = pageIndex + 1;
          } else {
            $$("#empty-notification-screen").show();
          }

          $$(".page").addClass("loadernone");
          $$(".page").removeClass("contentload");
        }
        // Now showing the main layout after getting the response from server
        $$("#notification-list-main-layout").show();
        $$("#notification-navbar").show();

        // Now setting notification count to zero
        localStorage.setItem("NotiCount", 0);

      } else if (obj.error != undefined) {
        message = obj.error.message;
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();

        // Now showing the main layout after getting the response from server
        $$("#notification-list-main-layout").show();
        $$("#notification-navbar").show();
      }
      $$("#my-notification").html(str);
      app.preloader.hide();
    });
  }

  /* Infinite scroll */

  // Attach 'infinite' event handler

  $$('.infinite-scroll-content').on('infinite', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {

      $$(".page").removeClass("loadernone");

      $$('.infinite-scroll-preloader').show();
      var lastItemIndex = $$('#my-notification li').length;

      // Max items to load
      var maxItems = 10000;

      // Exit, if loading in progress
      if (!allowInfinite) return;

      // Set loading flag
      allowInfinite = false;

      // Emulate 1s loading
      setTimeout(function () {
        // Reset loading flag
        allowInfinite = true;

        if (lastItemIndex >= maxItems) {
          // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
          app.infiniteScroll.destroy('.infinite-scroll-content');
          // Remove preloader
          $$('.infinite-scroll-preloader').hide();
          return;
        }

        app.request.get(NOTIFICATION_LIST_API, { customer_id: user_id, page: pageIndex }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            if (obj.success.notifications != null) {

              var str = "";

              if (obj.success.notifications.length > 0) {

                for (var x = 0; x < obj.success.notifications.length; x++) {

                  var notification_text = obj.success.notifications[x].text;
                  var dateTime = obj.success.notifications[x].created_at;
                  var orderID = obj.success.notifications[x].order_id;
                  var isRead = obj.success.notifications[x].is_read;
                  var notificationId = obj.success.notifications[x].id;

                  var res = dateTime.split(" ");
                  var dateString = res[0];
                  var timeString = res[1];

                  var ddmmyy = dateString.split("-");
                  var date = ddmmyy[2];
                  var month = ddmmyy[1];
                  var year = ddmmyy[0];

                  var formattedMonth = monthFormat(month);

                  var finalDate = date + " " + formattedMonth + " " + year;

                  var hhmm = timeString.split(":");
                  var hour = hhmm[0];
                  var minute = hhmm[1];

                  var formattedHour = hourFormat(hour);

                  var AMPM = "";

                  if (hour >= 12 && hour <= 23) {
                    AMPM = "PM";
                  } else {
                    AMPM = "AM";
                  }

                  var finalTime = formattedHour + ":" + minute + " " + AMPM;

                  if (isRead) {

                    str += '<li>';
                    str += '<a href="/booking-details/?orderId=' + orderID + '&navigationFrom=' + "NotificationScreen" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                    str += '<div class="item-inner">';
                    str += '<div class="notification-read-message-text">' + notification_text + '</div>';
                    str += '<div class="row text-vertical-center">';
                    str += '<div class="notification-read-date-time">' + finalDate + '</div>';
                    str += '<div class="notification-read-date-time">' + finalTime + '</div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</a>';
                    str += '</li>';

                  } else {

                    str += '<li>';
                    str += '<a href="/booking-details/?orderId=' + orderID + '&navigationFrom=' + "NotificationScreen" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                    str += '<div class="item-inner">';
                    str += '<div class="notification-message-text">' + notification_text + '</div>';
                    str += '<div class="row text-vertical-center">';
                    str += '<div class="notification-date-time">' + finalDate + '</div>';
                    str += '<div class="notification-date-time">' + finalTime + '</div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</a>';
                    str += '</li>';

                  }

                }

                $$('.infinite-scroll-preloader').hide();
                $$('#my-notification').append(str);
              } else {
                app.infiniteScroll.destroy('.infinite-scroll-content');
                // Remove preloader
                $$('.infinite-scroll-preloader').hide();
                pageIndex = 0;
                return;
              }
            }
          }
        });
        // Update last loaded index
        pageIndex = pageIndex + 1;
      }, 1000);
    }
  });

  /* Infinite scroll ends */


});

/* Notification List End */

/********* Request Booking Start ************/
$$(document).on('page:init', '.page[data-name="request-booking"]', function (e) {

  //calendar start
  var isButtonDisabled;
  var $$ = Dom7;
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var today = new Date();
  var weekLater = new Date().setDate(today.getDate() - 7);
  var bookingDate = "";
  var bookingSlotID = "";
  var bookingSlotTime = "";

  // Hide the main layout and show it after getting the response from server
  $$("#request-booking-main-layout").hide();
  $$("#request-booking-navbar").hide();
  /* $$("#appoint-layout").hide();
  $$("#calendar-layout").hide();
  $$("#time-slot-avail-layout").hide(); */

  var res = today.toString().split(" ");
  var dateString = res[2];
  var monthString = res[1];
  var yearString = res[3];

  var monthConversion = monthCharToInt(monthString);
  var todayDateFormat = dateString + "-" + monthConversion + "-" + yearString;
  bookingDate = todayDateFormat;

  console.log("Booking Date Value First " + todayDateFormat);

  var page = $$('.page[data-name="request-booking"]')[0].f7Page;
  var serviceId = page.route.query.serviceId;
  var serviceTitle = page.route.query.serviceTitle;
  var serviceFrom = page.route.query.serviceFrom;

  var subServiceIDs = JSON.parse(localStorage.getItem("subserviceid") || "[]");
  var subServiceTexts = JSON.parse(localStorage.getItem("subservices") || "[]");
  sessionStorage.sessionServiceID = serviceId;
  sessionStorage.sessionServiceTitle = serviceTitle;
  sessionStorage.sessionServiceFrom = serviceFrom;

  var calendarInline = app.calendar.create({
    containerEl: '#demo-calendar-inline-container',

    weekHeader: true,
    dateFormat: 'dd-mm-yyyy',
    firstDay: 0,
    //Disabled all dates in December 2016
    disabled: {
      to: new Date(today - 24 * 60 * 60 * 1000)
    },

    renderToolbar: function () {
      return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
        '<div class="toolbar-inner">' +
        '<div class="left">' +
        '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
        '</div>' +
        '<div class="center"></div>' +
        '<div class="right">' +
        '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
        '</div>' +
        '</div>' +
        '</div>';
    },
    on: {
      init: function (c) {
        $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
        $$('.calendar-custom-toolbar .left .link').on('click', function () {
          calendarInline.prevMonth();
        });
        $$('.calendar-custom-toolbar .right .link').on('click', function () {
          calendarInline.nextMonth();
        });
      },
      monthYearChangeStart: function (c) {
        $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
      },
      calendarDayClick: function (p, dayContainer, year, month, day) {
        // Add 1 to the month
        var cal_month = month + 1;
        // Add leading zero to day and month
        m = cal_month > 9 ? cal_month : "0" + cal_month;
        d = day > 9 ? day : "0" + day;
        // selected date
        var selected_date = d + "-" + m + "-" + year;
        bookingDate = selected_date;
        bookingSlotID = "";
        bookingSlotTime = "";
        console.log("Booking Date Value After Date Change" + bookingDate);

        // Load timeslots based on the date selection
        var connectiontype = checkConnection();

        if (connectiontype == "No network connection") {
          message = connectiontype;
          app.preloader.hide();
          var toast = app.toast.create({
            text: message
          });
          toast.open();
          app.preloader.hide();
        } else {

          // Hide the time slot layout and show it after getting the response from server
          $$("#time-slot-layout").hide();
          app.preloader.show();

          app.request.setup({
            /*  headers: {
               'api_key': "6be2f840a6a0da34f9904743800e2cae"
             }, */
            cache: false
          });

          var user_id = localStorage.getItem("customerID");
          if (user_id == null) {
            user_id = 0;
          }

          app.request.post(TIME_SLOT_API, {
            customer_id: user_id, date: selected_date
          }, function (data) {

            var obj = JSON.parse(data);

            if (obj.success != undefined) {

              $$("#time_slots").show();
              //hide empty message
              $$("#empty-image-hide").hide();
              //for Button click disabale
              isButtonDisabled = false;

              if (obj.success.time_slots != null) {
                var str = "";

                if (obj.success.time_slots.length > 0) {
                  for (var x = 0; x < obj.success.time_slots.length; x++) {
                    str += '<button class="col-33 button button-raised button-fill button-round time_slot_value" id="time_slot_button" value="' + obj.success.time_slots[x].db_time + '">' + obj.success.time_slots[x].slot + '</button>';
                  }
                }
              }
              // Now showing the main layout after getting the response from server
              $$("#time-slot-layout").show();
              //$$("#time-slot-avail-layout").show();

              $$("#time_slots").html(str);
              app.preloader.hide();
            }

            if (obj.error != undefined) {

              message = obj.error.message;

              //Show empty message
              $$("#empty-image-hide").show();
              $$("#time_slots").hide();
              $$('#message_empty').text(message);

              //for Button click disabale
              isButtonDisabled = true;

              // Now showing the main layout after getting the response from server
              $$("#time-slot-layout").show();
              //$$("#time-slot-avail-layout").show();
              app.preloader.hide();
            }

          });
        }
      }
    }
  });

  //calendar end

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

  } else {

    app.preloader.show();

    app.request.setup({
      /*  headers: {
         'api_key': "6be2f840a6a0da34f9904743800e2cae"
       }, */
      cache: false
    });

    var user_id = localStorage.getItem("customerID");
    if (user_id == null) {
      user_id = 0;
    }

    app.request.post(CURR_DATE_TIMESLOT_API, {
      customer_id: user_id
    }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        $$("#time_slots").show();
        //hide empty message
        $$("#empty-image-hide").hide();
        //for Button click disabale
        isButtonDisabled = false;

        if (obj.success.time_slots != null) {

          var str = "";

          if (obj.success.time_slots.length > 0) {

            for (var x = 0; x < obj.success.time_slots.length; x++) {

              str += '<button class="col-33 button button-raised button-fill button-round" value="' + obj.success.time_slots[x].db_time + '">' + obj.success.time_slots[x].slot + '</button>';
            }
          }
        }

        if (obj.customer_dtls != null) {

          var custDefAddress = obj.customer_dtls.address;
          var custDefPIN = obj.customer_dtls.zip;

          if(custDefAddress != null && custDefAddress != ""){
            $$("#userStreetAddress").val(custDefAddress);
            $$("#userStreetAddress").closest('li').addClass('item-input-with-value');
          } 

          if (custDefPIN != null && custDefPIN != "") {

            $$("#userPinCode").val(custDefPIN);
            $$("#userPinCode").closest('li').addClass('item-input-with-value');
          } 
        }

        
        // Now showing the main layout after getting the response from server
        $$("#request-booking-main-layout").show();
        $$("#request-booking-navbar").show();

        $$("#time_slots").html(str);
        app.preloader.hide();
      }

       if (obj.error != undefined) {

        message = obj.error.message;
        console.log("Error " + message);

        //Show empty message
        $$("#empty-image-hide").show();
        $$("#time_slots").hide();
        $$('#message_empty').text(message);
        //for Button click disabale
        isButtonDisabled = true;

        // Now showing the main layout after getting the response from server
        $$("#request-booking-main-layout").show();
        $$("#request-booking-navbar").show();

         if (obj.customer_dtls != null) {

           var custDefAddress = obj.customer_dtls.address;
           var custDefPIN = obj.customer_dtls.zip;

           if (custDefAddress != null && custDefAddress != "") {
             $$("#userStreetAddress").val(custDefAddress);
             $$("#userStreetAddress").closest('li').addClass('item-input-with-value');
           }

           if (custDefPIN != null && custDefPIN != "") {

             $$("#userPinCode").val(custDefPIN);
             $$("#userPinCode").closest('li').addClass('item-input-with-value');
           }

         }

        app.preloader.hide();

      } 

    });
  }


  //On clicking book button 
  $$('.book-button').on('click', function (e) {

    app.preloader.show();
    e.preventDefault();
    var bookingAddress = $$("#userStreetAddress").val().trim();
    var bookingPin = $$("#userPinCode").val().trim();
    var bookingCity = $$("#userCity").val().trim();
    var bookingState = $$("#userState").val().trim();

    //Check for button disabled
    if (isButtonDisabled == true) {

      var toast = app.toast.create({
        text: "Timeslot is not available"
      });
      toast.open();
      app.preloader.hide();

    } else {
      app.preloader.hide();

      if (bookingDate == "" || bookingDate == null) {
        var toast = app.toast.create({
          text: "Please select a date."
        });
        toast.open();
      } else if (bookingSlotID == "" || bookingSlotID == null) {
        var toast = app.toast.create({
          text: "Please select a time slot."
        });
        toast.open();
      } else {

        if (bookingAddress.length == 0 || (bookingAddress.length > 0 && bookingAddress.length < 10)
          || bookingPin.length == 0 || (bookingPin.length > 0 && bookingPin.length < 6)
          || bookingCity.length == 0 || (bookingCity.length > 0 && bookingCity.length < 3)
          || bookingState.length == 0 || (bookingState.length > 0 && bookingState.length < 6)) {

          app.preloader.hide();

          if (bookingAddress.length == 0) {
            $$("#user-address-invalid").removeClass("hidden");
            $$('#user-street-address-error').text("Enter your address.");
          } else if (bookingAddress.length > 0 && bookingAddress.length < 10) {
            $$("#user-address-invalid").removeClass("hidden");
            $$('#user-street-address-error').text("Address should be minimum 10 characters.");

          } else {
            $$("#user-address-invalid").addClass("hidden");
          }

          if (bookingPin.length == 0) {
            $$("#user-pin-invalid").removeClass("hidden");
            $$('#user-pin-code-error').text("Enter your PIN code.");
          } else if (bookingPin.length > 0 && bookingPin.length < 6) {
            $$("#user-pin-invalid").removeClass("hidden");
            $$('#user-pin-code-error').text("PIN code should be 6 digits.");

          } else {
            $$("#user-pin-invalid").addClass("hidden");
          }

          if (bookingCity.length == 0) {
            $$("#user-city-invalid").removeClass("hidden");
            $$('#user-city-error').text("Enter your city name.");
          } else if (bookingCity.length > 0 && bookingCity.length < 3) {
            $$("#user-city-invalid").removeClass("hidden");
            $$('#user-city-error').text("City should be minimum 3 characters.");

          } else {
            $$("#user-city-invalid").addClass("hidden");
          }

          if (bookingState.length == 0) {
            $$("#user-state-invalid").removeClass("hidden");
            $$('#user-state-error').text("Enter your state name.");
          } else if (bookingState.length > 0 && bookingState.length < 6) {
            $$("#user-state-invalid").removeClass("hidden");
            $$('#user-state-error').text("State should be minimum 6 characters.");

          } else {
            $$("#user-state-invalid").addClass("hidden");
          }
        } else {

          $$("#user-address-invalid").addClass("hidden");
          $$("#user-pin-invalid").addClass("hidden");
          $$("#user-city-invalid").addClass("hidden");
          $$("#user-state-invalid").addClass("hidden");

          app.preloader.hide();

          var connectiontype = checkConnection();

          if (connectiontype == "No network connection") {
            message = connectiontype;
            app.preloader.hide();
            var toast = app.toast.create({
              text: message
            });
            toast.open();
            app.preloader.hide();
          } else {
            // call webservice to check service availability
            callPincodeCheckWebService();

          }

          function callPincodeCheckWebService() {

            app.preloader.show();

            app.request.post(PINCODE_CHECK_API, {
              api_key: '6be2f840a6a0da34f9904743800e2cae', pincode: $$("#userPinCode").val().trim()
            }, function (data) {
              var obj = JSON.parse(data);

              if (obj.success != undefined && obj.success != null) {

                app.preloader.hide();

                app.views.main.router.navigate('/review-booking/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle
                  + '&bookingDate=' + bookingDate + '&bookingSlotID=' + bookingSlotID + '&bookingSlotTime=' + bookingSlotTime
                  + '&subserviceid=' + subServiceIDs + '&subservices=' + subServiceTexts + '&address=' + $$("#userStreetAddress").val().trim()
                  + '&pinCode=' + $$("#userPinCode").val().trim() + '&city=' + $$("#userCity").val().trim()
                  + '&state=' + $$("#userState").val().trim() + '&serviceFrom=' + serviceFrom);


              } else if (obj.error != undefined && obj.error != null) {

                app.preloader.hide();
                var toast = app.toast.create({
                  text: obj.error.message
                });
                toast.open();
                app.preloader.hide();

              }
              app.preloader.hide();
            });
          }
        }
      }
    }
  });

  //On clicking back button and passing the service id and sub-service id to back activity
  $$('#req-book-back-button').on('click', function (e) {
    app.views.main.router.navigate('/service-sub-list/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + serviceFrom);
  });

  $$("body").on('click', '#time_slots button', function (e) {

    $$("#time_slots button").removeClass("color-orange");
    $$(this).addClass("color-orange");

    $$("#time-slot").val($$(this).val());
    bookingSlotID = ($$(this).val());
    bookingSlotTime = $$(this).text();
  });

  $$("#userStreetAddress").on('keyup', function (e) {

    var bookingAddress = $$("#userStreetAddress").val().trim();

    if (bookingAddress.length == 0) {
      $$("#user-address-invalid").removeClass("hidden");
      $$('#user-street-address-error').text("Enter your address.");
    } else if (bookingAddress.length > 0 && bookingAddress.length < 10) {
      $$("#user-address-invalid").removeClass("hidden");
      $$('#user-street-address-error').text("Address should be minimum 10 characters.");

    } else {
      $$("#user-address-invalid").addClass("hidden");
    }
  });

  $$("#userPinCode").on('keyup', function (e) {

    var bookingPin = $$("#userPinCode").val().trim();

    if (bookingPin.length == 0) {
      $$("#user-pin-invalid").removeClass("hidden");
      $$('#user-pin-code-error').text("Enter your PIN code.");
    } else if (bookingPin.length > 0 && bookingPin.length < 6) {
      $$("#user-pin-invalid").removeClass("hidden");
      $$('#user-pin-code-error').text("PIN code should be 6 digits.");

    } else {
      $$("#user-pin-invalid").addClass("hidden");
    }

  });

  $$("#userPinCode").on('keyup', function (e) {

    var bookingCity = $$("#userCity").val().trim();

    if (bookingCity.length == 0) {
      $$("#user-city-invalid").removeClass("hidden");
      $$('#user-city-error').text("Enter your city name.");
    } else if (bookingCity.length > 0 && bookingCity.length < 3) {
      $$("#user-city-invalid").removeClass("hidden");
      $$('#user-city-error').text("City should be minimum 3 characters.");

    } else {
      $$("#user-city-invalid").addClass("hidden");
    }

  });

  $$("#userState").on('keyup', function (e) {

    var bookingState = $$("#userState").val().trim();

    if (bookingState.length == 0) {
      $$("#user-state-invalid").removeClass("hidden");
      $$('#user-state-error').text("Enter your state name.");
    } else if (bookingState.length > 0 && bookingState.length < 6) {
      $$("#user-state-invalid").removeClass("hidden");
      $$('#user-state-error').text("State should be minimum 6 characters.");

    } else {
      $$("#user-state-invalid").addClass("hidden");
    }

  });

});


/********* Request Booking End ************/

/********* Review Booking Start ************/

$$(document).on('page:init', '.page[data-name="review-booking"]', function (e) {

  var user_id = localStorage.getItem("customerID");
  if (user_id == null || user_id == undefined) {
    user_id = 0;
  }

  var page = $$('.page[data-name="review-booking"]')[0].f7Page;
  var serviceId = page.route.query.serviceId;
  var serviceTitle = page.route.query.serviceTitle;
  var bookingDate = page.route.query.bookingDate;
  var bookingSlotID = page.route.query.bookingSlotID;
  var bookingSlotTime = page.route.query.bookingSlotTime;
  var address = page.route.query.address;
  var pin = page.route.query.pinCode;
  var city = page.route.query.city;
  var state = page.route.query.state;
  var serviceFrom = page.route.query.serviceFrom;

  var subServiceIDs = JSON.parse(localStorage.getItem("subserviceid") || "[]");
  var subServiceTexts = JSON.parse(localStorage.getItem("subservices") || "[]");

  sessionStorage.sessionServiceID = serviceId;
  sessionStorage.sessionServiceTitle = serviceTitle;
  sessionStorage.sessionServiceFrom = serviceFrom;

  var ddmmyy = bookingDate.split("-");
  var date = ddmmyy[0];
  var month = ddmmyy[1];
  var year = ddmmyy[2];

  var formattedMonth = monthFormat(month);

  var finalFormattedBookingDate = date + " " + formattedMonth + " " + year;
  var bookingDateAPI = year + "-" + month + "-" + date;

  $$('#service_text').text("Service : " + serviceTitle);
  $$('#scheduled_date').text(finalFormattedBookingDate);
  $$('#scheduled_slot_time').text(bookingSlotTime);
  $$('#address').text(address);

  if (subServiceTexts.length > 0) {

    var str = "";
    var sub_ser_text_data = '';
    for (var x = 0; x < subServiceTexts.length; x++) {

      if (x == 0) {
        sub_ser_text_data = sub_ser_text_data + subServiceTexts[x];
      } else {
        sub_ser_text_data = sub_ser_text_data + ", " + subServiceTexts[x];
      }
    }
    str += '<span>' + sub_ser_text_data + '</span>';
    $$("#preview-sub-list").html(str);
  }

  //On clicking book button 
  $$('.complete-button').on('click', function (e) {

    var sub_ser_json_array = [];

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      var statusIDs = []; // array to save values of all checked checkbox
      var x = 0;

      $$("input.row_checkbox:checked").each(function () {
        statusIDs[x] = $$(this).val();
        x++;
      });

      if (statusIDs.length == 0) {
        var toast = app.toast.create({
          text: "Please agree to our Terms & Conditions."
        });
        toast.open();
      } else {

        var objects = {};
        var sub_ser_id_array = new Array();
        var x;

        for (x = 0; x < subServiceIDs.length; x++) {

          objects[x] = new Object();
          objects[x].sub_service_id = subServiceIDs[x];
          sub_ser_id_array.push(objects[x]);
        }

        sub_ser_json_array = JSON.stringify(sub_ser_id_array);

        // call webservice to check service availability
        callBookServiceAPI();
      }

    }

    function callBookServiceAPI() {

      app.preloader.show();

      app.request.setup({
        /*  headers: {
           'api_key': "6be2f840a6a0da34f9904743800e2cae"
         }, */
        cache: false
      });

      app.request.post(REQUEST_BOOKING_API, {
        customer_id: user_id, date: bookingDateAPI, service_id: serviceId,
        time_slot: bookingSlotID, sub_service_id: sub_ser_json_array, pincode: pin, address: address,
        city: city, state: state
      }, function (data) {

        var obj = JSON.parse(data);

        if (obj.success != undefined) {

          localStorage.removeItem("subserviceid");

          message = obj.success.booking_details.message;
          app.preloader.hide();
          var orderId = obj.success.booking_details.order_id;
          app.views.main.router.navigate('/booking-success/?orderId=' + orderId);
        }

        if (obj.error != undefined) {
          message = obj.error.message;
          console.log("Error " + message);
          app.preloader.hide();

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
      });
    }
  });

  //On clicking back button and passing the service id and sub-service id to back activity
  $$('#rev-book-back-button').on('click', function (e) {

    app.preloader.hide();

    var serviceId = sessionStorage.sessionServiceID;
    var serviceTitle = sessionStorage.sessionServiceTitle;
    var sessionServiceFrom = sessionStorage.sessionServiceFrom;

    //mainView.router.back();

    app.views.main.router.navigate('/request-booking/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + sessionServiceFrom
      + '&FromReviewScreen=' + "FromReviewScreen");
  });

  //On clicking back button 
  $$('#popup').on('click', function (e) {

    sessionStorage.DialogOpen = 'true';
  });

  //On clicking back button 
  $$('#popup_close_button').on('click', function (e) {
    sessionStorage.DialogOpen = 'false';
  });

});


/********* Review Booking End ************/



/************ Booking Success Screen Start **************/
$$(document).on('page:init', '.page[data-name="booking-success"]', function (e) {

  var page = $$('.page[data-name="booking-success"]')[0].f7Page;
  var orderId = page.route.query.orderId;

  $$('#success_text').text("Your booking has been booked successfully. You will be notified once we confirm this booking." + "Your reference number is " + "#" + orderId);

  sessionStorage.currentPage = "BookingSuccess";

  //On clicking login button 
  $$('.view-booking').on('click', function (e) {

    app.views.main.router.navigate('/booking-details/?orderId=' + orderId + '&navigationFrom=' + 'BookingSuccessScreen');
  });

});
/************ Booking Success Screen End **************/

/* Home page service list load */

function loadHomeServiceList() {

  // app.preloader.show();

  var isLoggedIn = localStorage.getItem("isLogin");

  if (isLoggedIn == null || isLoggedIn == undefined || isLoggedIn == 'false') {
    isLoggedIn = "";
  }

  var user_id = (localStorage.getItem('customerID'));

  if (user_id == null || user_id == undefined || isLoggedIn == "") {
    user_id = 0;
  }

  console.log("User Id " + user_id);

  /* app.request.setup({
    headers: {
      'api_key': "6be2f840a6a0da34f9904743800e2cae",
    },
    cache: false
  });    */

  app.request.post(HOME_API, {
    api_key: '6be2f840a6a0da34f9904743800e2cae', customer_id: user_id
  }, function (data) {

    var obj = JSON.parse(data);

    if (obj.success != undefined) {

      if (obj.success.services != null) {

        var str = "";
      
        if (obj.success.services.length > 0) {

          for (var x = 0; x < obj.success.services.length; x++) {

            str += '<div class="col-33">';
            str += '<a href="/service-sub-list/?serviceId=' + obj.success.services[x].service_id +
              '&serviceTitle=' + obj.success.services[x].title + '&serviceFrom=' + "homeScreen"
              + '" class="item-link item-content">';
            str += '<div class="card menu-box">';
            str += '<img src="' + obj.success.services[x].image + '" class="lazy lazy-fade-in">';
            str += '<p class="service-name single-line-ellipsis">' + obj.success.services[x].title + '</p>';
            str += '</div>';
            str += '</a>';
            str += '</div>';
          }

        }
        if (obj.success.customer_dtls != "") {

          var cust_name = obj.success.customer_dtls.name;

          $$('#user-name').text(cust_name);

        } else {
          $$('#user-name').text("Guest");
        }
      }

    }

    if (obj.error != undefined) {
      var message = obj.error.message;

    }

    $$("#home_service_list").html(str);
    app.preloader.hide();
    $$('#home-main-layout').show();

  }, function (error) {
    console.log(error);

    $$('#home-main-layout').show();
    app.preloader.hide();
  });

}

/* Home page service list load ends */

/********* Booking Details API method start ************/

function loadBookingDetails(orderId) {

  debugger

  sessionStorage.sessionMyBookingOrderID = orderId;

  app.preloader.show();

  app.request.setup({
    /*  headers: {
       'api_key': "6be2f840a6a0da34f9904743800e2cae"
     }, */
    cache: false
  });

  app.request.get(BOOKING_DETAILS_API, {
    order_id: orderId
  }, function (data) {


    var obj = JSON.parse(data);

    if (obj.success != undefined) {

      if (obj.success.booking_details != null) {

        //Order
        var id = obj.success.booking_details.order_details.id;
        var OrderID = obj.success.booking_details.order_details.order_id;
        var bookingOn = obj.success.booking_details.order_details.order_date;
        var scheduleDateTime = obj.success.booking_details.order_details.booking_datetime;
        var serviceTitle = obj.success.booking_details.order_details.service_title;
        var bookingStatus = obj.success.booking_details.order_details.booking_status;

        //bookingOn date split
        var ddmmyy = bookingOn.split("-");
        var date = ddmmyy[2];
        var month = ddmmyy[1];
        var year = ddmmyy[0];

        var formattedMonth = monthFormat(month);
        var serviceBokkingDate = date + " " + formattedMonth + " " + year;

        //ScheduleDateTime Split
        var res = scheduleDateTime.split(" ");
        var dateString = res[0];
        var timeString = res[1];

        //Date split
        var schedule_ddmmyy = dateString.split("-");
        var schedule_date = schedule_ddmmyy[2];
        var schedule_month = schedule_ddmmyy[1];
        var schedule_year = schedule_ddmmyy[0];

        var schedule_formattedMonth = monthFormat(schedule_month);
        var scheduleDate = schedule_date + " " + schedule_formattedMonth + " " + schedule_year;

        //Time split
        var hhmm = timeString.split(":");
        var hour = hhmm[0];
        var minute = hhmm[1];

        var formattedHour = hourFormat(hour);

        var AMPM = "";

        if (hour >= 12 && hour <= 23) {
          AMPM = "PM";
        } else {
          AMPM = "AM";
        }

        var scheduleTime = formattedHour + ":" + minute + " " + AMPM;

        $$('#bookingID').text('#' + OrderID);
        $$('#bookingOn').text(serviceBokkingDate);
        $$('#scheduleDate').text(scheduleDate);
        $$('#scheduleTime').text(scheduleTime);
        $$('#serviceName').text(serviceTitle);

        //Status
        var isTaskStarted = obj.success.booking_details.task_stats.task_started;
        var isTaskUpdateRequested = obj.success.booking_details.task_stats.task_update_requested;
        var isTaskUpdateAccepted = obj.success.booking_details.task_stats.task_update_accepted;
        var isTaskUpdateRejected = obj.success.booking_details.task_stats.task_update_rejected;
        var isTaskEndRequested = obj.success.booking_details.task_stats.task_end_requested;
        var isTaskEndAccepted = obj.success.booking_details.task_stats.task_end_accepted;
        var isPaymentReceived = obj.success.booking_details.task_stats.payment_received;

        //Check status
        if (bookingStatus == "A") {

          $$('#bookingStatus').text("Active");
          $$('#statusColor').addClass("orange");

        } else if (bookingStatus == "CO") {

          $$('#bookingStatus').text("Completed");
          $$('#statusColor').addClass("green");

        } else if (bookingStatus == "C") {

          $$('#bookingStatus').text("Confirmed");
          $$('#statusColor').addClass("blue");

        } else if (bookingStatus == "R") {

          $$('#bookingStatus').text("Rejected");
          $$('#statusColor').addClass("red");

        } else if (bookingStatus == "CS") {

          $$('#bookingStatus').text("Cancelled");
          $$('#statusColor').addClass("red");

        } else if (bookingStatus == "CC") {

          $$('#bookingStatus').text("Cancelled");
          $$('#statusColor').addClass("red");

        } 

        //Address
        var Address = obj.success.booking_details.customer_details.address;
        var pinCode = obj.success.booking_details.customer_details.zip;
        var state = obj.success.booking_details.customer_details.state;
        var city = obj.success.booking_details.customer_details.city;

        $$('#userAddress').text(Address + ", " + city + "-" + pinCode + ", " + state);

        //Sub Service
        if (obj.success.booking_details.sub_services != null) {

          if (obj.success.booking_details.sub_services.length > 0) {

            var str = "";
            var subServiceName = '';
            for (var x = 0; x < obj.success.booking_details.sub_services.length; x++) {
              var subServiveId = obj.success.booking_details.sub_services[x].sub_service_id;
              //subServiveName = obj.success.booking_details.sub_services[x].sub_service_title;

              if (x == 0) {
                subServiceName = subServiceName + obj.success.booking_details.sub_services[x].sub_service_title;
              } else {

                subServiceName = subServiceName + ", " + obj.success.booking_details.sub_services[x].sub_service_title;
              }
            }
            str += '<span>' + subServiceName + '</span>';
            $$("#service-sub-list-data").html(str);
          }
        }

        //Service boy details
        if (obj.success.booking_details.staff_dtls != "") {

          var serviceBoyNameText = obj.success.booking_details.staff_dtls.staff_name;
          var serviceBoyMobileText = obj.success.booking_details.staff_dtls.staff_phone;
          var serviveBoyImage = obj.success.booking_details.staff_dtls.image;
          var serviveBoyRating = obj.success.booking_details.staff_dtls.rating;
          //var serviveBoyImage = "https://www.w3schools.com/howto/img_avatar.png";

          $$('#serviceBoyName').text(serviceBoyNameText);
          $$('#serviceBoyMobile').text(serviceBoyMobileText);
           if(serviveBoyRating == 0 || serviveBoyRating == 0.0){
            $$('#serviceBoyRating').text("No Rating Yet");
          }else{
            $$('#serviceBoyRating').text(serviveBoyRating);
          } 

          if (serviveBoyImage == null || serviveBoyImage == ""){
            $$('#servboy-image').attr("src", "https://www.w3schools.com/howto/img_avatar.png");
          } else{
            $$('#servboy-image').attr("src", serviveBoyImage);
          }    
          
          $$('#service-boy-layout').show();
          $$('#viewCancelBookingLayout').hide();

        } else {
          $$('#service-boy-layout').hide();

          if(bookingStatus == "CC" || bookingStatus == "R" || bookingStatus == "CS"){
            $$('#viewCancelBookingLayout').hide();
          } else{
            $$('#viewCancelBookingLayout').show();
          }
        }

        //Payment
        if (obj.success.booking_details.payment_info != "") {

          $$("#booking-details-view-invoice-layout").show();

          var paymentMethod = obj.success.booking_details.payment_info.payment_method;
          var serviceAmount = obj.success.booking_details.payment_info.amount;
          var tax_gst = obj.success.booking_details.payment_info.taxes;
          var discount = obj.success.booking_details.payment_info.discount;
          var partialAmount = obj.success.booking_details.payment_info.partial_amount;
          var paymentDate = obj.success.booking_details.payment_info.payment_date;
          var TotalAmount = obj.success.booking_details.payment_info.net_amount;
          var paymentStatus = obj.success.booking_details.payment_info.payment_status;

          //bookingOn date split
          var ddmmyy = paymentDate.split("-");
          var date = ddmmyy[2];
          var month = ddmmyy[1];
          var year = ddmmyy[0];

          var formattedMonth = monthFormat(month);
          var payDate = date + " " + formattedMonth + " " + year;

          if (paymentMethod == "Pay At Venue") {

            $$('#paymentType').text("Cash");
          } else {
            $$('#paymentType').text(paymentMethod);
          }

          if (isPaymentReceived) {

            if (paymentStatus == "Completed") {
              $$("#payment-status-circle-color").addClass("green");
              $$('#paymentStatus').html("Paid");
            } else {
              $$("#payment-status-circle-color").addClass("orange");
              $$('#paymentStatus').html("Unpaid");
            }
          } else {
            $$("#payment-status-circle-color").addClass("orange");
            $$('#paymentStatus').html("Unpaid");
          }

          $$('#serviceCost').text("Rs." + " " + serviceAmount);
          $$('#serviceTax').text("Rs." + " " + tax_gst);
          $$('#serviceDiscount').text("Rs." + " " + discount);
          $$('#serviceTotalAmount').text("Rs." + " " + TotalAmount);
          $$('#paymentDate').text(payDate);


        } else {
          $$('#payment-details-layout').hide();
          $$("#booking-details-view-invoice-layout").hide();
        }

        if (isTaskStarted) {
          $$('#serviceOtp').hide();

        } else {

          //OTP
          if (obj.success.booking_details.booking_otp != "") {

            var serviveOTP = obj.success.booking_details.booking_otp.otp;

            if (serviveOTP != "") {
              $$('#serviceOtp').text("OTP :" + " " + serviveOTP);
              $$('#serviceOtp').show();
            } else {

              $$('#serviceOtp').hide();
            }
          } else {
            $$('#serviceOtp').hide();
          }
        }

        //If task is started and service boy has updated for requirements then show requirement layout else hide
        if (isTaskUpdateRequested) {

          if (isTaskUpdateAccepted) {
            $$('#service-requirement-layout').show();
            $$('#extra-req-cancel-button').hide();
            $$('#extra-req-approve-button').hide();
          } else {

            if (isTaskUpdateRejected) {
              $$('#service-requirement-layout').show();
              $$('#extra-req-cancel-button').hide();
              $$('#extra-req-approve-button').hide();

            } else {
              $$('#service-requirement-layout').show();
            }
          }
        } else {
          $$('#service-requirement-layout').hide();
        }

        if (obj.success.booking_details.extra_requirements != "") {

          var extra_req_text = obj.success.booking_details.extra_requirements.requirements;
          var str = "";
          str += '<span>' + extra_req_text + '</span>';
          $$("#extra-req-text").html(str);

        } else {
          var str = "";
        }

        //Extra Requirement Image
        var arrayImageLength = obj.success.booking_details.extra_images.length;

        if (arrayImageLength != 0) {

          if (obj.success.booking_details.extra_images != null) {

            var str2 = "";

            if (obj.success.booking_details.extra_images.length > 0) {

              for (var x = 0; x < obj.success.booking_details.extra_images.length; x++) {

                var extraRequirementImage = obj.success.booking_details.extra_images[x].image;

                str2 += '<li style="display:inline;">';
                //str2 += '<a href="#">';
                str2 += '<a href="/update-image/?extraImage=' + extraRequirementImage + ' ">';
                str2 += '<img src="' + extraRequirementImage + '"style="width: 40px; height: 40px; margin: 5px;" class="imageClick" />';
                str2 += '</a>';
                str2 += '</li>';
              }
            }

            $$("#extraRequirementImage").html(str2);
            $$('#extraRequirementImage').show();
          }

        } else {

          $$('#extraRequirementImage').hide();
        }

        //If task end requested by service boy is set true then show end task layout else hide
        if (isTaskEndRequested) {

          if (isTaskEndAccepted) {
            $$('#serviceEndLayout').hide();
          } else {
            $$('#serviceEndLayout').show();
          }

          //If task end requested by service boy and the customer did not accept or reject the extra requirements then hide the extra requirement layout.
          if (!isTaskUpdateAccepted && !isTaskUpdateRejected) {
            $$('#service-requirement-layout').hide();
          }
        } else {
          $$('#serviceEndLayout').hide();
        }

        //History
        var arrayLength = obj.success.booking_details.history.length;

        if (arrayLength != 0) {

          if (obj.success.booking_details.history != null) {
            var str = "";

            if (obj.success.booking_details.history.length > 0) {

              if (obj.success.booking_details.payment_info == "") {
                $$('#history-layout').addClass("floating-div");
              }

              for (var x = 0; x < obj.success.booking_details.history.length; x++) {

                var history_id = obj.success.booking_details.history[x].history_id;
                var historyStatus = obj.success.booking_details.history[x].status;
                var historyDateTime = obj.success.booking_details.history[x].created_at;

                //HistoryDateTime Split
                var res_history = historyDateTime.split(" ");
                var historyDateString = res_history[0];
                var historyTimeString = res_history[1];

                //Date split
                var history_ddmmyy = historyDateString.split("-");
                var history_date = history_ddmmyy[2];
                var history_month = history_ddmmyy[1];
                var history_year = history_ddmmyy[0];

                var history_formattedMonth = monthFormat(history_month);
                var historyDate = history_date + " " + history_formattedMonth + " " + history_year;

                //Time split
                var history_hhmm = historyTimeString.split(":");
                var history_hour = history_hhmm[0];
                var history_minute = history_hhmm[1];

                var historyFormattedHour = hourFormat(history_hour);

                var AMPM = "";

                if (history_hour >= 12 && history_hour <= 23) {
                  AMPM = "PM";
                } else {
                  AMPM = "AM";
                }

                var historyTime = historyFormattedHour + ":" + history_minute + " " + AMPM;
                var historyFinalDateTime = historyDate + ", " + historyTime;

                str += '<li>';
                str += '<table id="customers" class="mrg-top-btm">';
                str += '<td style="width:45%;">';
                str += '<span class="status-btn green" id="historyStatusColor"></span>';
                str += '<span id="historyStatus">' + historyStatus + '</span>';
                str += '<span style="font-size: 12px; color: rgb(112, 111, 111); display: block;" id="historyStatusDate">' + historyFinalDateTime + '</span> ';
                str += '</td>';
                str += '</tr>';
                str += '</table>';
                str += '</li>';
              }
            }
          }

        } else {
          $$('#history-layout').hide();
        }
          // Invoice Details
          if (obj.success.booking_details.invoice_dtls != "") {
            var isInvoiceGenerated = obj.success.booking_details.invoice_dtls.invoice_generated;

            if (isInvoiceGenerated) {

              if (obj.success.booking_details.payment_info != "") {
                $$('#viewInvoiceLayout').hide();
              } else {
                $$('#viewInvoiceLayout').show();
              }

              app.request.get(PAYMENT_INVOICE_DOWNLOAD_API, { order_id: orderId, api_key: '6be2f840a6a0da34f9904743800e2cae' }, function (data) {

                var obj = JSON.parse(data);

                if (obj.success != undefined) {

                  if (obj.success.invoice != null) {

                    var invoice = obj.success.invoice.order_id;
                    var invoicePath = obj.success.invoice.invoice;

                    $$('#invoice-anchor').attr("href", invoicePath);

                  }
                }

                if (obj.error != undefined) {

                  message = obj.error.message;

                  //$$('#invoice-anchor').attr("href", "#");
                  $$("#invoice-anchor").attr("disabled", "disabled");
                  $$("#invoice-anchor").removeAttr("href");
                  app.preloader.hide();

                }
              });

            } else {
              $$('#viewInvoiceLayout').hide();
            }

          } else {
            $$('#viewInvoiceLayout').hide();
          }

        //Show the after get all responce
        $$('#contain-layout-booking-details').show();
        $$('#booking-details-navbar').show();
        app.preloader.hide();
      }
    }

    if (obj.error != undefined) {

      message = obj.error.message;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
    }
    //$$("#extraRequirementImage").html(str2);
    $$("#all-history-layout").html(str);
    app.preloader.hide();

  });
}

/********* Booking Details API method end ************/

/********* Booking Filter Start ************/

$$(document).on('page:init', '.page[data-name="filters"]', function (e) {

  var selectedServiceID = "";

  var selectedStatusName = "";

  var user_id = (localStorage.getItem('customerID'));

  if (user_id == null || user_id == undefined) {
    user_id = 0;
  }

  loadFilterServiceList();

  function loadFilterServiceList() {

    app.preloader.show();

    app.request.setup({
      /*  headers: {
         'api_key': "6be2f840a6a0da34f9904743800e2cae"
       }, */
      cache: false
    });


    app.request.get('http://yupserve.com/api/customer/service.php/index', function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.services != null) {

          var str = "<option value=''>Select Service Name</option>";

          if (obj.success.services.length > 0) {

            for (var x = 0; x < obj.success.services.length; x++) {
              serviceID = obj.success.services[x].service_id;
              serviceText = obj.success.services[x].title;

              str += '<option value=' + serviceID + '>' + serviceText + '</option>';
            }

          }
        }

      } else if (obj.error != undefined) {
        message = obj.error.message;
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
      app.preloader.hide();

      $$("#service-list-dropdown").html(str);
    });

    // Get the selected service id
    $$('#service-list-dropdown').on('change', function (e) {
      selectedServiceID = $$(this).val();
    });
  }


  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var selected_to_date = "";
  var toDateInDFormat = ""
  var selected_from_date = "";
  var fromDateInDFormat = "";

  //calender filter start
  var calendarModal1 = app.calendar.create({
    inputEl: '#filter-from-date-calendar-modal',
    openIn: 'customModal',
    header: true,
    footer: true,
    dateFormat: 'dd-mm-yyyy',

    on: {
      init: function (c) {
        $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
        $$('.calendar-custom-toolbar .left .link').on('click', function () {
          calendarModal1.prevMonth();
        });
        $$('.calendar-custom-toolbar .right .link').on('click', function () {
          calendarModal1.nextMonth();
        });
      },
      monthYearChangeStart: function (c) {
        $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
      },

      closed: function () {

        var today = new Date();

        if (fromDateInDFormat <= today) {
          $$("#filter-from-date-calendar-modal").val(selected_from_date);


        } else {
          $$("#filter-from-date-calendar-modal").val("");
          var toast = app.toast.create({
            text: "From date should not be greater than today's date."
          });
          toast.open();
        }
      },

      calendarDayClick: function (p, dayContainer, year, month, day) {

        // Add 1 to the month
        var cal_month = month + 1;
        // Add leading zero to day and month
        m = cal_month > 9 ? cal_month : "0" + cal_month;
        d = day > 9 ? day : "0" + day;
        // selected date
        selected_from_date = d + "-" + m + "-" + year;

        fromDateInDFormat = stringToDate(selected_from_date, "dd-mm-yyyy", "-");
      }
    }
  });

  var calendarModal2 = app.calendar.create({
    inputEl: '#filter-to-date-calendar-modal',
    openIn: 'customModal',
    header: true,
    footer: true,
    dateFormat: 'dd-mm-yyyy',

    on: {
      init: function (c) {
        $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
        $$('.calendar-custom-toolbar .left .link').on('click', function () {
          calendarModal2.prevMonth();
        });
        $$('.calendar-custom-toolbar .right .link').on('click', function () {
          calendarModal2.nextMonth();
        });
      },
      monthYearChangeStart: function (c) {
        $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
      },
      closed: function () {

        var today = new Date();

        if ($$("#filter-from-date-calendar-modal").val().trim() == "") {
          var toast = app.toast.create({
            text: "Please select from date first."
          });
          toast.open();
          $$("#filter-to-date-calendar-modal").val("");

        } else {
          toDateInDFormat = stringToDate(selected_to_date, "dd-mm-yyyy", "-");

          if (toDateInDFormat < fromDateInDFormat) {

            var toast = app.toast.create({
              text: "To date should be greater than from date."
            });
            toast.open();
            $$("#filter-to-date-calendar-modal").val("");

          } else if (toDateInDFormat > today) {

            var toast = app.toast.create({
              text: "To date should not be greater than today's date."
            });
            toast.open();
            $$("#filter-to-date-calendar-modal").val("");


          } else {

            $$("#filter-to-date-calendar-modal").val(selected_to_date);

          }
        }
      },

      calendarDayClick: function (p, dayContainer, year, month, day) {
        // Add 1 to the month
        var cal_month = month + 1;
        // Add leading zero to day and month
        m = cal_month > 9 ? cal_month : "0" + cal_month;
        d = day > 9 ? day : "0" + day;
        // selected date
        selected_to_date = d + "-" + m + "-" + year;

      }
    }
  });
  //calender filter end

  var str1 = "<option value=''>Select Status</option>";

  for (var i = 0; i < 5; i++) {

    if (i == 0) {

      str1 += '<option value=' + "A" + '>' + "Active" + '</option>';

    } else if (i == 1) {

      str1 += '<option value=' + "C" + '>' + "Confirmed" + '</option>';

    } else if (i == 2) {

      str1 += '<option value=' + "CO" + '>' + "Completed" + '</option>';

    } else if (i == 3) {

      str1 += '<option value=' + "R" + '>' + "Rejected" + '</option>';

    } else if (i == 4) {

      str1 += '<option value=' + "CS" + '>' + "Cancelled" + '</option>';
    }
  }

  $$("#status-list-dropdown").html(str1);

  // Get the selected service id
  $$('#status-list-dropdown').on('change', function (e) {
    selectedStatusName = $$(this).val();
  });

  //On clicking book button 
  $$('#apply-button').on('click', function (e) {

    console.log("Selected Service Name -" + selectedServiceID);
    console.log("Selected Status Name -" + selectedStatusName);

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {
      callFilterAPI();
    }

  });

  function callFilterAPI() {

    var bookingID = $$("#filter-booking-id").val().trim();
    var selectedSerID = selectedServiceID;
    var selectedStaName = selectedStatusName;
    var selectedFromDate = selected_from_date;
    var selectedToDate = selected_to_date;

    var fromddmmyy = selectedFromDate.split("-");
    var fromDate = fromddmmyy[0];
    var fromMonth = fromddmmyy[1];
    var fromYear = fromddmmyy[2];

    var finalFromDate = fromYear + "-" + fromMonth + "-" + fromDate;

    var toddmmyy = selectedToDate.split("-");
    var toDate = toddmmyy[0];
    var toMonth = toddmmyy[1];
    var toYear = toddmmyy[2];

    var finalToDate = toYear + "-" + toMonth + "-" + toDate;

    console.log("bookingID  " + bookingID + "selectedServiceID  " + selectedSerID + "selectedStaName  " + selectedStaName
      + "selectedFromDate  " + finalFromDate + "selectedToDate  " + finalToDate);


    if ((selected_from_date == "" && selected_to_date != "") || (selected_from_date != "" && selected_to_date == "")) {
      var toast = app.toast.create({
        text: "Please select both from date and to date."
      });
      toast.open();
      app.preloader.hide();
    } else if ((selected_from_date == "" && selected_to_date == "") || (selected_from_date == "" && selected_to_date == "")) {
      if (bookingID == "") {
        message = connectiontype;
        var toast = app.toast.create({
          text: "Please enter booking id."
        });
        toast.open();
        app.preloader.hide();
      }
    } else {

      app.preloader.show();

      app.request.setup({
        /* headers: {
          'api_key': "6be2f840a6a0da34f9904743800e2cae"
        }, */
        cache: false
      });

      app.request.post('http://yupserve.com/api/customer/filter_bookings.php/index', {
        customer_id: user_id, order_id: bookingID, service_id: selectedSerID,
        status: selectedStaName, from_date: finalFromDate, to_date: finalToDate, page: 0
      }, function (data) {

        var obj = JSON.parse(data);

        if (obj.success != undefined) {

          if (obj.success.bookings != null) {

            if (obj.success.bookings.length > 0) {
              for (var x = 0; x < obj.success.bookings.length; x++) {
              }
            }
          }
        }

        if (obj.error != undefined) {

          message = obj.error.message;
          console.log("Error " + message);
          app.preloader.hide();

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
      });
    }
  }
});


/********* Booking Filter End ************/

/************* Extra image Start *************/


$$(document).on('page:init', '.page[data-name="update-image"]', function (e) {

  //Received orderID from task details
  var page = $$('.page[data-name="update-image"]')[0].f7Page;

  var largeImage = page.route.query.extraImage;

  //Back arrow click
  $$('#updateImageBack').on('click', function () {

    mainView.router.back();

  });

  $$('#extraImageLarge').attr('src', largeImage);

});

/************* Extra image End *************/

/************ Intro slider Screen Start **************/

$$(document).on('page:init', '.page[data-name="splash"]', function (e) {

  //On clicking signup button 
  $$('#start-button').on('click', function (e) {
    localStorage.setItem("isFirstTimeInstalled", "false");
  });
});

/************ Intro slider Screen End **************/

/*************************** on every page reinit **********************************/
$$(document).on('page:reinit', function (e, page) {

  app.preloader.hide();
  var pagename = page.name;

  if (pagename == "home" || pagename == "service-list" || pagename == "service-sub-list" ||
    pagename == "request-booking" || pagename == "review-booking" || pagename == "login"
    || pagename == "profile" || pagename == "edit-profile" || pagename == "mybooking" || pagename == "notification" || pagename == "otp"
    || pagename == "signup" || pagename == "booking-success" || pagename == "booking-details"
    || pagename == "payment" || pagename == "help" || pagename == "about-us" || pagename == "update-image" || pagename == "payment") {

    sessionStorage.currentPage = page.name;
  } else {
    sessionStorage.currentPage = "";
  }

});
/*************************** on every page reinit ends **********************************/

/*************************** on every page afterin **********************************/
$$(document).on('page:afterin', function (e, page) {

  app.preloader.hide();
  var pagename = page.name;
  var connectiontype = checkConnection();

  if (pagename == "home" || pagename == "service-list" || pagename == "service-sub-list" || pagename == "request-booking" ||
    pagename == "review-booking" || pagename == "login" || pagename == "profile" || pagename == "edit-profile" || pagename == "mybooking" || pagename == "notification"
    || pagename == "otp" || pagename == "signup" || pagename == "booking-success" || pagename == "booking-details"
    || pagename == "payment" || pagename == "help" || pagename == "about-us" || pagename == "update-image" || pagename == "payment") {

    sessionStorage.currentPage = page.name;
  } else {
    sessionStorage.currentPage = "";
  }


  if (pagename == "service-sub-list") {

    if (connectiontype == "No network connection") {

      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "SubServiceListScreen" + '&serviceId=' + sessionStorage.sessionServiceID + '&serviceTitle=' + sessionStorage.sessionServiceTitle
        + '&serviceFrom=' + sessionStorage.sessionServiceFrom);

    } else {
    }
  } else if (pagename == "request-booking") {

    if (connectiontype == "No network connection") {

      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "RequestBookingScreen"
        + '&serviceId=' + sessionStorage.sessionServiceID + '&serviceTitle=' + sessionStorage.sessionServiceTitle
        + '&serviceFrom=' + sessionStorage.sessionServiceFrom);

      app.preloader.hide();

    } else {
      app.preloader.hide();
    }
  } else if (pagename == "mybooking") {

    if (connectiontype == "No network connection") {

      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "MyBookingScreen"
        + '&navigationFrom=' + sessionStorage.sessionMyBookingNavigationFrom);

    } else {
    }
  } else if (pagename == "booking-details") {

    connectiontype = checkConnection();

    if (connectiontype == "No network connection") {

      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "BookingDetailsScreen"
        + '&navigationFrom=' + sessionStorage.sessionMyBookingNavigationFrom + '&orderId=' + sessionStorage.sessionMyBookingOrderID);

    } else {

    }
  } else if (pagename == "profile") {

    connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "ProfileScreen");
    } else {
    }
  } else if (pagename == "notification") {

    if (connectiontype == "No network connection") {

      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "NotificationScreen");

    } else {
    }
  } else if (pagename == "home") {

    if (connectiontype == "No network connection") {

      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "HomeScreen");

    } else {

      //app.preloader.show();
      //loadHomeServiceList();
    }
  } else {
    app.preloader.hide();
  }

});

/*************************** on every page afterin ends **********************************/

/* Check internet connection */
function checkConnection() {

  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.CELL] = 'Cell generic connection';
  states[Connection.NONE] = 'No network connection';

  return states[networkState];
}

/* Check internet connection ends */

/************************ Check back button functionality********************* */
function onBackKeyDown() {

  app.preloader.hide();
  $$(".page").removeClass("contentload");

  var currentPage = sessionStorage.currentPage;

  var serviceId = sessionStorage.sessionServiceID;
  var serviceTitle = sessionStorage.sessionServiceTitle;
  var sessionPageFrom = sessionStorage.sessionPageFrom;
  var sessionServiceFrom = sessionStorage.sessionServiceFrom;
  var sessionMyBookingNavigationFrom = sessionStorage.sessionMyBookingNavigationFrom;
  var orderId = sessionStorage.sessionMyBookingOrderID;

  if (currentPage == "service-sub-list") {

    localStorage.removeItem("subserviceid");

    if (sessionServiceFrom == "ServiceListScreen") {
      app.views.main.router.navigate('/service-list/');

    } else {
      app.views.main.router.navigate('/home/');
    }

  } else if (currentPage == "request-booking") {
    app.views.main.router.navigate('/service-sub-list/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + sessionServiceFrom);

  } else if (currentPage == "review-booking") {

    if (sessionStorage.DialogOpen != null || sessionStorage.DialogOpen != undefined) {

      if (sessionStorage.DialogOpen == 'true') {

      } else {

        app.views.main.router.navigate('/request-booking/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + sessionServiceFrom);
      }
    } else {
      app.views.main.router.navigate('/request-booking/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + sessionServiceFrom);
    }

  } else if (currentPage == "service-list") {
    localStorage.removeItem("subserviceid");
    app.views.main.router.navigate('/home/');

  } else if (currentPage == "login") {

    if (sessionPageFrom == "subServiceList") {
      app.views.main.router.navigate('/service-sub-list/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle);

    } else {
      app.views.main.router.navigate('/home/');
    }

  } else if (currentPage == "payment") {

    if (sessionStorage.DialogOpen != null || sessionStorage.DialogOpen != undefined) {

      if (sessionStorage.DialogOpen == 'true') {

      } else {

        app.views.main.router.navigate('/booking-details/?navigationFrom=' + sessionMyBookingNavigationFrom + '&orderId=' + orderId);
      }
    } else {
      app.views.main.router.navigate('/booking-details/?navigationFrom=' + sessionMyBookingNavigationFrom + '&orderId=' + orderId);
    }

  }
  else if (currentPage == "mybooking") {

    if (sessionMyBookingNavigationFrom == "BookingSuccessScreen") {

      app.views.main.router.navigate('/home/');

    } else if (sessionMyBookingNavigationFrom == "HomeScreen") {
      app.views.main.router.navigate('/home/');

    } else if (sessionMyBookingNavigationFrom == "ProfileScreen") {
      app.views.main.router.navigate('/profile/');

    } else {
      app.views.main.router.navigate('/home/');
    }

  } else if (currentPage == "profile") {

    if (sessionStorage.DialogOpen != null || sessionStorage.DialogOpen != undefined) {

      if (sessionStorage.DialogOpen == 'true') {

      } else {

        app.views.main.router.navigate('/home/');
      }
    } else {

      app.views.main.router.navigate('/home/');
    }


  } else if (currentPage == "booking-success") {
    app.views.main.router.navigate('/home/');

  } else if (currentPage == "notification") {
    app.views.main.router.navigate('/home/');

  } else if (currentPage == "otp") {
    app.views.main.router.navigate('/home/');

  } else if (currentPage == "signup") {
    app.views.main.router.navigate('/home/');

  } else if (currentPage == "booking-details") {

    if (sessionStorage.DialogOpen != null || sessionStorage.DialogOpen != undefined) {

      if (sessionStorage.DialogOpen == 'true') {

      } else {

        if (sessionMyBookingNavigationFrom == "NotificationScreen") {
          app.views.main.router.navigate('/notification/');

        } else if (sessionMyBookingNavigationFrom == "BookingSuccessScreen") {
          app.views.main.router.navigate('/home/');

        } else {
          app.views.main.router.navigate('/mybooking/?navigationFrom=' + sessionMyBookingNavigationFrom);
        }

      }
    } else {

      if (sessionMyBookingNavigationFrom == "NotificationScreen") {
        app.views.main.router.navigate('/notification/');

      } else if (sessionMyBookingNavigationFrom == "BookingSuccessScreen") {
        app.views.main.router.navigate('/home/');

      } else {
        app.views.main.router.navigate('/mybooking/?navigationFrom=' + sessionMyBookingNavigationFrom);
      }

    }

  } else if (currentPage == "edit-profile") {
    app.views.main.router.navigate('/profile/');


  } else if (currentPage == "help") {
    app.views.main.router.navigate('/profile/');

  } else if (currentPage == "about-us") {
    app.views.main.router.navigate('/profile/');

  } else if (currentPage == "home") {

    if (sessionStorage.DialogOpen != null || sessionStorage.DialogOpen != undefined) {

      if (sessionStorage.DialogOpen == 'true') {

      } else {
        sessionStorage.DialogOpen = 'true';

        app.dialog.confirm('Do you want to exit.', function () {
          sessionStorage.DialogOpen = 'false';
          navigator.app.exitApp();
        },
          function () {
            sessionStorage.DialogOpen = 'false';
          });
      }
    } else {

      sessionStorage.DialogOpen = 'true';

      app.dialog.confirm('Do you want to exit.', function () {
        sessionStorage.DialogOpen = 'false';
        navigator.app.exitApp();
      },
        function () {
          sessionStorage.DialogOpen = 'false';
        });
    }

  } else {

    mainView.router.back();
  }

}

/********************** Check back button functionality ends****************** */



/************ No internet Screen Start **************/

$$(document).on('page:init', '.page[data-name="no-internet-connection"]', function (e) {

  var page = $$('.page[data-name="no-internet-connection"]')[0].f7Page;
  var pageToNoInternetScreen = page.route.query.pageToNoInternetScreen;
  var serviceId = page.route.query.serviceId;
  var serviceTitle = page.route.query.serviceTitle;
  var serviceFrom = page.route.query.serviceFrom;
  var navigationFrom = page.route.query.navigationFrom;
  var orderId = page.route.query.orderId;

  //On clicking signup button 
  $$('#retry').on('click', function (e) {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      if (pageToNoInternetScreen == "ServiceListScreen") {
        app.views.main.router.navigate('/service-list/');

      } else if (pageToNoInternetScreen == "SubServiceListScreen") {
        app.views.main.router.navigate('/service-sub-list/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + serviceFrom);

      } else if (pageToNoInternetScreen == "HomeScreen") {
        app.views.main.router.navigate('/home/');

      } else if (pageToNoInternetScreen == "RequestBookingScreen") {
        app.views.main.router.navigate('/request-booking/?serviceId=' + serviceId + '&serviceTitle=' + serviceTitle + '&serviceFrom=' + serviceFrom);

      } else if (pageToNoInternetScreen == "MyBookingScreen") {
        app.views.main.router.navigate('/mybooking/?navigationFrom=' + navigationFrom);

      } else if (pageToNoInternetScreen == "BookingDetailsScreen") {
        app.views.main.router.navigate('/booking-details/?navigationFrom=' + navigationFrom + '&orderId=' + orderId);

      } else if (pageToNoInternetScreen == "ProfileScreen") {
        app.views.main.router.navigate('/profile/');

      } else if (pageToNoInternetScreen == "NotificationScreen") {
        app.views.main.router.navigate('/notification/');

      }
    }

  });
});

/************ No internet Screen End **************/

/************ payu Screen Start **************/

$$(document).on('page:init', '.page[data-name="payu-money"]', function (e) {

  var user_id = (localStorage.getItem('customerID'));

  var page = $$('.page[data-name="payu-money"]')[0].f7Page;
  var navigationFrom = page.route.query.navigationFrom;
  var phoneNumber = page.route.query.custMobile;
  var email = page.route.query.custEmail;
  var amount = page.route.query.amount;
  //var amount = parseFloat(totalPrice);
  var customer_name = page.route.query.custName;
  var txnId = page.route.query.orderId;
  // Merchant Name
  var merchantName = 'YupServe';
  // Test Environment
  var environment_value = PUMEnvironment.PUMEnvironmentProduction;
  //var environment_value = PUMEnvironment.PUMEnvironmentTest;

  // Merchant key
  // var key = "0P61t4V0"; /* <!-- same key for Sandbox & Prod --> */

  var key = "XUYiga5K"; /* <!-- same key for Sandbox & Prod --> */
  // Merchant ID
  //var merchantID = "5805351";  /* <!-- same MerchantId for Sandbox & Prod --> */

  var merchantID = "6630546";  /* <!-- same MerchantId for Sandbox & Prod --> */

  var sURL = 'https://www.payumoney.com/mobileapp/payumoney/success.php';
  var fURL = 'https://www.payumoney.com/mobileapp/payumoney/failure.php';
  var udf2 = 'YupServe';

  load_payu_details();

  function load_payu_details() {

    /* <!--var key = environment_value == PUMEnvironment.PUMEnvironmentProduction ?  "0P61t4V0" : "tPJM2e" ;--> <!-- Different keys for pp44 --> */

    /* <!--var merchantID = environment_value == PUMEnvironment.PUMEnvironmentProduction ? "5805351" : "4824899" ;--> <!-- Different MerchantIds for pp44 --> */

    var txnParam = new PUMTxnParam(key, merchantID, txnId + '', amount, phoneNumber, email, customer_name, sURL, fURL, "iPhone7", environment_value, "", "", udf2);

    txnParam.hashValue = getHash(txnParam);

    cordova.plugins.PayUmoneyPnP.showPaymentView(function (response) {
      console.log('payButtonClicked(): showPaymentView received Success ');
      console.log(JSON.stringify(response));
      callPayByOnlineAPI(user_id, txnId);
    },

      function (response) {

        console.log('payButtonClicked(): showPaymentView received Failure ');
        console.log(JSON.stringify(response));

        if (response == "Missing Command Error") {
          var msg = 'Transaction Failed\n'.concat(JSON.stringify(response));
          alert(msg);
        } else {
          app.views.main.router.navigate('/booking-details/?navigationFrom=' + "PaymentSuccess" + '&orderId=' + txnId);
        }
      },

      txnParam);

    cordova.plugins.PayUmoneyPnP.setiOSAppTheme(function (response) {
      console.log('payButtonClicked(): setiOSAppThemeName received Success ');
    },

      function (response) {
        console.log('payButtonClicked(): setiOSAppThemeName received Failure '.concat(response));
      },

      ['C0175C', 'ffffff', 'C0175C', 'ffffff']);

    cordova.plugins.PayUmoneyPnP.setAndroidAppThemeName(function (response) {
      console.log('payButtonClicked(): setAndroidAppThemeName received Success ');
    },

      function (response) {

        console.log('payButtonClicked(): setAndroidAppThemeName received Failure '.concat(response));
      },

      ['C0175C', 'ffffff', 'C0175C', 'ffffff']);

  }

  function getHash(txnParam) {

    //var salt = "9mF4voMh97"; /* same Salt for Sandbox & Prod */

    var salt = "p2RzVl8FDR"; /* same Salt for Sandbox & Prod */

    /*<!--var salt = getEnv() == PUMEnvironment.PUMEnvironmentProduction ? "9mF4voMh97" : "x4rmTrFm";--> <!-- Different Salts for pp44 -->*/

    console.log('getHash(): salt = '.concat(salt));

    var hashSequence = txnParam.key + '|' + txnParam.txnID + '|' + txnParam.amount + '|' + txnParam.productInfo + '|' + txnParam.firstname + '|' + txnParam.email + '|' + txnParam.udf1 + '|' + txnParam.udf2 + '|' + txnParam.udf3 + '|' + txnParam.udf4 + '|' + txnParam.udf5 + '|' + txnParam.udf6 + '|' + txnParam.udf7 + '|' + txnParam.udf8 + '|' + txnParam.udf9 + '|' + txnParam.udf10 + '|' + salt;
    console.log('getHash(): hashSequence = '.concat(hashSequence));

    var hash = SHA512(hashSequence);
    console.log('getHash(): hash = '.concat(hash));

    return hash;
  }

  // Call internal API to store the payment successfull transaction
  function callPayByOnlineAPI(user_id, txnId) {

    app.preloader.show();

    app.request.setup({
      /*  headers: {
         'api_key': "6be2f840a6a0da34f9904743800e2cae"
       }, */
      cache: false
    });

    app.request.post(ONLINE_PAYMENT_API, {
      customer_id: user_id, order_id: txnId
    }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        app.preloader.hide();
        var msg = obj.success.message;
        var toast = app.toast.create({
          text: msg
        });
        toast.open();

        app.views.main.router.navigate('/booking-details/?navigationFrom=' + navigationFrom + '&orderId=' + txnId);
      }

      if (obj.error != undefined) {
        message = obj.error.message;
        console.log("Error " + message);
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
    });
  }

});
/************ payu Screen End **************/

/************ Help Screen Start **************/

$$(document).on('page:init', '.page[data-name="help"]', function (e) {

  //On clicking back button 
  $$('#help-back-button').on('click', function (e) {

    app.views.main.router.navigate('/profile/');
  });

});
/************ Help Screen End **************/

/************ About Screen Start **************/

$$(document).on('page:init', '.page[data-name="about-us"]', function (e) {

  //On clicking back button 
  $$('#about-us-back-button').on('click', function (e) {

    app.views.main.router.navigate('/profile/');
  });

});
/************ About Screen End **************/

// Confirm Logout
$$('#logout_class').on('click', function () {

  sessionStorage.DialogOpen = 'true';

  app.dialog.confirm('Do you really want to logout?', function () {

    sessionStorage.DialogOpen = 'false';

    if (typeof (Storage) !== "undefined") {
      localStorage.setItem("isLogin", 'false');
      localStorage.removeItem("customerID");
      $$("#login_class").show();
      $$("#logout_class").hide();
      $$('#user-name').text("Guest");
      // Now setting notification count to zero
      localStorage.setItem("NotiCount", 0);
      $$("#badge-layout").hide();

      var toast = app.toast.create({
        text: "You have been logged out successfully."
      });
      toast.open();

      loadHomeServiceList();

      //app.views.main.router.navigate('/home/');
    }
  },
    function () {

      sessionStorage.DialogOpen = 'false';

    });
});


/* Custom functions used here */

function monthFormat(month) {

  var monthValue = "";

  if (month == 01) {
    monthValue = "JAN";
  } else if (month == "02") {
    monthValue = "FEB";
  } else if (month == "03") {
    monthValue = "MAR";
  } else if (month == "04") {
    monthValue = "APR";
  } else if (month == "05") {
    monthValue = "MAY";
  } else if (month == "06") {
    monthValue = "JUN";
  } else if (month == "07") {
    monthValue = "JUL";
  } else if (month == "08") {
    monthValue = "AUG";
  } else if (month == "09") {
    monthValue = "SEP";
  } else if (month == "10") {
    monthValue = "OCT";
  } else if (month == "11") {
    monthValue = "NOV";
  } else if (month == "12") {
    monthvalue = "DEC";
  } else
    monthValue = "";
  return monthValue;
};

function hourFormat(hour) {

  var hourValue = "";

  if (hour == 13) {
    hourValue = "01";
  } else if (hour == "14") {
    hourValue = "02";
  } else if (hour == "15") {
    hourValue = "03";
  } else if (hour == "16") {
    hourValue = "04";
  } else if (hour == "17") {
    hourValue = "05";
  } else if (hour == "18") {
    hourValue = "06";
  } else if (hour == "19") {
    hourValue = "07";
  } else if (hour == "20") {
    hourValue = "08";
  } else if (hour == "21") {
    hourValue = "09";
  } else if (hour == "22") {
    hourValue = "10";
  } else if (hour == "23") {
    hourValue = "11";
  } else
    hourValue = hour;
  return hourValue;
}

function monthCharToInt(month) {

  var monthValue = "";

  if (month == "Jan") {
    monthValue = "01";
  } else if (month == "Feb") {
    monthValue = "02";
  } else if (month == "Mar") {
    monthValue = "03";
  } else if (month == "Apr") {
    monthValue = "04";
  } else if (month == "May") {
    monthValue = "05";
  } else if (month == "Jun") {
    monthValue = "06";
  } else if (month == "Jul") {
    monthValue = "07";
  } else if (month == "Aug") {
    monthValue = "08";
  } else if (month == "Sep") {
    monthValue = "09";
  } else if (month == "Oct") {
    monthValue = "10";
  } else if (month == "Nov") {
    monthValue = "11";
  } else if (month == "Dec") {
    monthvalue = "12";
  } else
    monthValue = "00";
  return monthValue;
}

function stringToDate(_date, _format, _delimiter) {
  var formatLowerCase = _format.toLowerCase();
  var formatItems = formatLowerCase.split(_delimiter);
  var dateItems = _date.split(_delimiter);
  var monthIndex = formatItems.indexOf("mm");
  var dayIndex = formatItems.indexOf("dd");
  var yearIndex = formatItems.indexOf("yyyy");
  var month = parseInt(dateItems[monthIndex]);
  month -= 1;
  var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
  return formatedDate;
}

/********* Notification Read API Start ********/

function loadReadNotification(notificationId, customerID) {

  app.request.setup({
    /*  headers: {
       'api_key': "6be2f840a6a0da34f9904743800e2cae"
     }, */
    cache: false
  });

  app.request.post(READ_NOTIFICATION_API, {
    customer_id: customerID, notification_id: notificationId
  }, function (data) {

    var obj = JSON.parse(data);
    console.log(data);

    if (obj.success != undefined) {

      message = obj.success.message;
      //app.preloader.hide();
    }

    if (obj.error != undefined) {
      message = obj.error.message;
      console.log("Error " + message);
      app.preloader.hide();

      /* var toast = app.toast.create({
        text: message
      });
      toast.open(); */
    }
  });

}

/********* Notification Read API End ********/





