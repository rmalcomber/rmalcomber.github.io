(function () {
    //Main App
    var app = angular.module('nameWorkout', []);

    //Set the location provider to HTML5 for getting the parameters from the query string
    app.config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    });

    //Load data service
    app.service("loadData", function ($http, $q) {
        return {
            waitForBoth: function () {
                return $q.all([
                  $http.get('js/Data/nonGym.json'),
                  $http.get('js/Data/gym.json')
              ]);
            }
        };
    });

    //Main Controller
    app.controller('calculation', function ($scope, $http, $location, loadData) {

        //Delcare the letters array and set it to an empty array
        this.letters = [];

        //The text modal for the input text box
        this.mainText = "";

        //Capture the scope of the controller to access from functions
        var scope = this;

        //Initialise the current selected tab
        this.currentTab = 1;

        //Initialise the data type to non gym
        this.gymType = false;

        //Variable for storing the loading of data state
        this.dataLoading = false;

        //Variable if the data has loaded or not
        this.DataLoaded = false;

        //vars for the indiviual data files being loaded
        this.gymDataLoaded = false;
        this.nonGymDataLoaded = false;

        this.init = function () {
            //sets up initialisation for the hint.
            this.hint = this.getHint();

            //Load the data
            this.LoadJsonData();

            //Checks and loads name query string value to textbox
            var name = $location.search().name;
            this.mainText = (name !== undefined ? name : "");
        }

        //getActiveTab returns if the current tab is active and sets a CSS class
        //if the tab is selected
        //1 = easy
        //2 = medium
        //3 = hard
        //4 = hardcore
        this.getActiveTab = function (i) {
            return this.currentTab === i;
        }

        //Swap for the gym type
        this.changeExerciseType = function () {
            this.gymType = !this.gymType;
            this.SelectData(this.gymType);
            scope.onNewUpdate();
        }

        //Select which data set is used, gym or nonGym
        this.SelectData = function (Gym) {
            scope.listOfLetters = (Gym === true ? scope.listOfGymLetters : scope.listOfNonGymLetters);
        }

        //Load up both sets of JSON data
        this.LoadJsonData = function () {
            if (!scope.DataLoaded && !this.dataLoading) {

                loadData.waitForBoth().then(function (retVal) {
                    scope.listOfNonGymLetters = retVal[0].data;
                    scope.listOfGymLetters = retVal[1].data;
                    scope.nonGymDataLoaded = true;
                    scope.gymDataLoaded = true;
                    scope.onNewUpdate();

                });
            }
        }

        //Check the data has been loaded.
        //If data is loaded set the correct data to the list of letters array
        this.checkDataLoaded = function () {
            scope.DataLoaded = (scope.gymDataLoaded && scope.nonGymDataLoaded);
            if (scope.DataLoaded) {

                scope.SelectData(this.gymType);
            }
            return scope.DataLoaded;
        }

        //selectTab sets the currentTab to be the selected tab
        this.selectTab = function (i) {
            this.currentTab = i;
            this.onNewUpdate();
        }

        //The main hint to display
        this.hint = "";

        //getHint Gets a random hint from the array
        this.getHint = function () {
            var val = Math.floor(Math.random() * (listOfHints.length - 1));
            return listOfHints[val];
        }


        //onNewUpdate is called when the controller loops through the maintext 
        //and adds the excersise data to the letters array
        this.onNewUpdate = function () {

            if (this.checkDataLoaded() === false) {
                return false;
            }

            var ch = this.mainText.toLowerCase().split('');
            this.letters = [];

            if (ch.length == 0) {
                this.init();
            }


            //Loop through each chracter in the textbox
            $.each(ch, function (i, v) {
                $.each(scope.listOfLetters, function (index, value) {
                    if (v == value.letter) {
                        var val = $.extend(true, {}, value);;
                        val.id = i;
                        val.unit = fixValue(value.unit);
                        val.link = encodeURI("http://www.wikihow.com/wikiHowTo?search=" + val.exercise);
                        scope.letters.push(val);
                        return false;
                    }
                });
            });
        };

        //fixValue returns the passed value multiplied by the difficulty setting
        //defined by the currentTab
        function fixValue(value) {
            var multiplyer;

            if (scope.currentTab == 1) {
                multiplyer = 1;
            }

            if (scope.currentTab == 2) {
                multiplyer = 1.5;
            }

            if (scope.currentTab == 3) {
                multiplyer = 2;
            }

            if (scope.currentTab == 4) {
                multiplyer = 3;
            }
            var retval = Math.round(value * multiplyer);

            if (retval == 0) {
                return null;
            }

            return retval;


        }

    });

    var listOfHints = [
        "Try using your email address for a challenge",
        "Using a '.' will give you a rest",
        "Bored of your name? Try a celebrity. e.g. Engelbert Humperdinck"
    ];

})();
