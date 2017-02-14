angular.module('starter.controllers', ['ui.router'])

// Menu
.controller('MenuCtrl',function($scope, $ionicSideMenuDelegate){
  if(getToken()){
      $scope.connected=true;
  }
  else{
      $scope.connected=false;
  }
})

//Compte
.controller('AccountCtrl', function($scope, $ionicModal, $ionicPopup, $http, $window) {
    // log in
    console.log(token());
    if(getToken()){
        $scope.token = true;
        $scope.user = getToken();
    }
    else{
        $scope.token = false;
    }
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
    });

    // sign Up
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope,
        animation: 'slide-in-up'

    }).then(function(modal) {
        $scope.signupModal = modal;
    });

    // logIn
    $scope.logIn = function() {
        var username = this.loginData.username;
        var password = this.loginData.password;

        $http.post("http://localhost:8080/api/login?username=" + username + "&password=" + password)
        .then(function(response) {
            if(response.data.success == true){
                var token = response.data.token;
                setToken(token);
                $window.location.reload(true);
                $scope.loginModal.hide();
            }
            else{
              $scope.error=true;
            }
        });
    }

    // signUp
    $scope.signUp = function() {
        var username = this.signupData.username;
        var password = this.signupData.password;
        var isGerant = this.signupData.isGerant;

        // // // // // // // // // //
        // modifier la requete http //
        // // // // // // // // // //
        $http.post("http://localhost:8080/api/signup?username=" + username + "&password=" + password + "&seller=" + isGerant)
        .then(function(response) {
            if(response.data.success == true){
                var token = response.data.token;
                setToken(token);
                $window.location.reload(true);
                $scope.signupModal.hide();
            }
            else{
              $scope.error=true;
            }
        });
    }

    // log out
    $scope.showLogout = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Voulez-vous vous déconnecter',
            template: 'Etes-vous sûr de vouloir vous déconnecter ?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                deleteToken();
                $window.location.reload(true);
            }
        });
    };

    //  popup de confirmations
    $scope.showSupprimer = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmation suppression compte',
            template: 'Etes-vous sûr de vouloir supprimer votre compte ?'
        });

        confirmPopup.then(function(res) {
            if(res) {
              console.log("http://localhost:8080/api/users/" + getToken().username + "?token=" + token());
                $http.delete("http://localhost:8080/api/users/" + getToken().username + "?token=" + token())
                .then(function(response) {
                    console.log(response.data);
                    if(response.data.success == true){
                        deleteToken();
                        $scope.signupModal.hide();
                        $window.location.reload(true);
                    }
                });
            }
        });
    };

    // version
    $scope.info = {
        platform: ionic.Platform.platform(),
        version: ionic.Platform.version()
    };
})

// Mes offres
.controller('MesOffresCtrl', function($scope, $ionicModal, $ionicPopup, $http, $window) {

    // Ajouter une offre
    if(getToken()){
        console.log(getToken());
        if(getToken().seller == "true"){
            $scope.seller = true;
        }
        else{
            $scope.seller = false;
        }
    }
    else{
        $scope.seller = false;
    }

    $ionicModal.fromTemplateUrl('templates/ajouteroffre.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addOffreModal = modal;
    });

    $scope.addOffreData = function() {
        var nameOffer = this.addOffreData.nameOffer;
        var boutique = this.addOffreData.boutique;
        var reductionDuree = this.addOffreData.reductionDuree;
        var reductionMontant = this.addOffreData.reductionMontant;
        var description = this.addOffreData.description;
         // // // // // // // // // // // // // // // // // //
         console.log("http://localhost:8080/api/vouchers?token=" + token() + "&title=" + nameOffer + "&shop=" + boutique + "&expiration=" + reductionDuree + "&value=" + reductionMontant + "&description=" + description);
        $http.post("http://localhost:8080/api/vouchers?token=" + token() + "&title=" + nameOffer + "&shop=" + boutique + "&expiration=" + reductionDuree + "&value=" + reductionMontant + "&description=" + description)
        .then(function(response) {
          console.log(response);
          console.log("voucher created");
          $scope.addOffreModal.hide();
          $window.location.reload(true);
        });


    }    // // // // // // // // // // // // // // // // // // // // // //

    $http.get("http://localhost:8080/api/users/" + getToken().username + "/vouchers?token=" + token())
    .then(function(response) {
        console.log(response.data.vouchers);
        $scope.myoffers = response.data.vouchers;
    });

    //  popup de confirmations
    $scope.showConfirm = function(id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Supprimer l\'offre',
            template: 'Etes-vous sûr de vouloir supprimer cette offre ?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('Vous êtes sûr');
                console.log(id);
                 // // // // // // // // // // // // // // // // // //
                $http.delete("http://localhost:8080/api/vouchers/" + id + "?token=" + token())
                .then(function(response) {
                  console.log("Voucher deleted");
                  $window.location.reload(true);
                }); // // // // // // // // // // // // // // // // //
            } else {
                console.log('Vous n\'êtes pas sûr');
            }
        });
    };
})

// Onglet
// Offres Populaires
.controller('PopulairesCtrl', function($scope, $http) {
    $http.get("http://localhost:8080/api/vouchers?top=5")
    .then(function(response) {
        console.log(response.data.vouchers);
        $scope.offersPop = response.data.vouchers;
    });
})

// Toutes les offres
.controller('OffresCtrl', function($scope, $http) {
    $http.get("http://localhost:8080/api/vouchers")
    .then(function(response) {
        $scope.offers = response.data.vouchers;
    });
})

// Offres details
.controller('OffreDetailCtrl', function($scope, $stateParams, $ionicPopup, $http) {
    $http.get("http://localhost:8080/api/vouchers/" + $stateParams.offerId)
    .then(function(response) {
        $scope.offer = response.data.voucher;

        if(getToken()){
            console.log(getToken());
            if(getToken().seller == "true"){
                $scope.client = false;
            }
            else{
                $scope.client = true;
            }
        }
        else{
            $scope.client = false;
        }

        //  popup de confirmations selection coupon
        $scope.showConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Sélectionner l\'offre',
                template: 'Etes-vous sûr de vouloir choisir cette offre ?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    // confirmation
                    console.log('Vous êtes sûr');

                    $http.post("http://localhost:8080/api/users/" + getToken().username + "/vouchers?id=" + $stateParams.offerId + "&token=" + token())
                    .then(function(response) {
                      console.log(response);
                      if(response.data.success){
                        alert("You now have this voucher!");
                        $window.location.reload(true);
                      }
                      else{
                        alert(response.data.message);
                      }

                    });
                } else {
                    console.log('Vous n\'êtes pas sûr');
                }
            });
        };
    });
})

.controller('PosterCtrl', function($scope, $ionicModal){
  $ionicModal.fromTemplateUrl('templates/posteroffre.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.posterOffreModal = modal;
  });

});

function token(){
	return window.localStorage.getItem("dealapp-token");
}

function getToken(){
	return parseJwt(token());
}

function setToken(token){
	window.localStorage.setItem("dealapp-token", token);
}

function deleteToken(){
	window.localStorage.removeItem("dealapp-token");
}

function parseJwt (token) {
	if(token){
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		return JSON.parse(window.atob(base64));
	}
	else{
		return null;
	}
};
