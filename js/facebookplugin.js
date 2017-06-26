(function ($) {

    var domain = "http://malcomberstudios.co.uk/nameworkout"

    $(document).ready(function () {

        $.ajaxSetup({
            cache: true
        });
        $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
            FB.init({
                appId: '1039438259454750',
                version: 'v2.5' // or v2.0, v2.1, v2.2, v2.3
            });
        });

        $("#facebookbutton").click(function (event) {
            FB.ui({
                method: 'share',
                href: domain + '?name=' + encodeURI($("#textname").val()),
                source: domain + '/smallheader.png'
            }, function (response) {});
        });
    });
})(jQuery)
