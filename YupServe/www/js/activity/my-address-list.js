$$(document).on('page:init', '.page[data-name="my-address-list"]', function (e) {

      debugger



     /*  $$('.editClass').on('click', function () { */

            $$("body").on("click", "#my-address-list-ul .editClass", function (e) {  

            debugger


            var a = $$(this).closest('li').find(".demo-media-radio").val();

            //var val1 = $$(this).closest("div.item-inner").find("#addID").text();

           /*  var address = $$(this).closest("div.item-inner").find(".address").text();
            var pin = $$(this).closest("div.item-inner").find(".pin").text();
            var city = $$(this).closest("div.item-inner").find(".city").text();
            var state = $$(this).closest("div.item-inner").find(".state").text(); */

            var address = $$(this).closest("li").find(".address").text().trim();
            var pin = $$(this).closest("li").find(".pin").text().trim();
            var city = $$(this).closest("li").find(".city").text().trim();
            var state = $$(this).closest("li").find(".state").text().trim();
                
      
            var e = $$(this).closest('li').find(".state").text();

                  app.views.main.router.navigate('/edit-my-address/?AddressId=' + "1" + '&Address=' + address + '&PIN=' + pin +
                                                 '&City=' + city + '&State=' + state);

      }); 

});