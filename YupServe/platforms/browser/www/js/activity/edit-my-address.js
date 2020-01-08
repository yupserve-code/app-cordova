$$(document).on('page:init', '.page[data-name="edit-my-address"]', function (e) {

      debugger

      var page = $$('.page[data-name="edit-my-address"]')[0].f7Page;
      var address = page.route.query.Address;
      var pin = page.route.query.PIN;
      var city = page.route.query.City;
      var state = page.route.query.State;

      var addressID = page.route.query.AddressId;

      $$('#useraddress').val(address);
      $$('#userPIN').val(pin);
      $$('#usercity').val(city);
      $$('#userstate').val(state);


      //On clicking signup button 
      $$('#update-btn').on('click', function (e) {

            app.preloader.show();
            e.preventDefault();

            var userAddress = $$("#useraddress").val().trim();
            var userPIN = $$("#userPIN").val().trim();
            var userCity = $$("#usercity").val().trim();
            var userState = $$("#userstate").val().trim();

      });
});