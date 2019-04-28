var app = angular.module("tpApp", []);
app.controller("tpCtrl", function($scope, $http) {
    $scope.load = function() {
        $scope.locations = locations;
        $scope.months = months;
        $scope.monthDates = [...Array(31).keys()];
        callAPI();
    };
});

function monthChange() {
    const scope = angular.element(document.getElementById("scopediv")).scope();
    const datesInMonth = dates[document.getElementById("newPull.month").value];
    scope.monthDates = [...Array(datesInMonth).keys()];
    scope.$apply();
}

function addPull() {
    const location = document.getElementById("newPull.location").value;
    const date = parseInt(document.getElementById("newPull.date").value);
    const month = parseInt(document.getElementById("newPull.month").value);
    const hour = document.getElementById("newPull.hour").value;
    const minute = document.getElementById("newPull.minute").value;
    const meridiem = document.getElementById("newPull.meridiem").value;
    const notes = document.getElementById("newPull.notes").value;
    const blacktop = document.getElementById("newPull.blacktop").value == "true";
    console.log(location, date, month, hour, minute, meridiem, notes, blacktop);
}

function callAPI() {
    const scope = angular.element(document.getElementById("scopediv")).scope();

    $.ajax({
        type: "GET",
        url: "/api/pullers",
        complete: function(data) {
            if (data.status == 200) {
                scope.pullers = JSON.parse(data.responseText);
                scope.$apply();
            }
        }
    });

    $.ajax({
        type: "GET",
        url: "/api/pulls",
        complete: function(data) {
            if (data.status == 200) {
                scope.pulls = JSON.parse(data.responseText);
                scope.$apply();
            }
        }
    });

    $.ajax({
        type: "GET",
        url: "/api/tractors",
        complete: function(data) {
            if (data.status == 200) {
                scope.tractors = JSON.parse(data.responseText);
                scope.$apply();
            }
        }
    });

    // $.ajax({
    //     type: "POST",
    //     url: "/api/users",
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: JSON.stringify(body),
    //     complete: function(data) {
    //         if (data.status == 200) {
    //             alert("success");
    //         }
    //     }
    // });
}
