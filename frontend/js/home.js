var app = angular.module("tpApp", []);
app.controller("tpCtrl", function($scope, $http) {
    $scope.load = function() {
        $scope.locations = locations;
        callAPI();
    };
});

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
