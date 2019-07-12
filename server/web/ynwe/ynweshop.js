

let mxrEncryptionApp = angular.module('YNWEShopApp', []);

mxrEncryptionApp.controller('YNWEShopAppController', ['$scope', '$http', function ($scope, $http) {

  $scope.clickTabAction = function (event, section) {
    let $tabItem = $(event.target).closest(".tabItem");
    $tabItem.addClass('tab-selected')
    let $$topMenuTitle = $('#topMenuTitle');
    $$topMenuTitle.text($tabItem.text());

    let tabItems = $tabItem.siblings()
    for (let i = 0 ;i < tabItems.length; i++)
    {
      let $item = $(tabItems[i]);
      $item.removeClass('tab-selected');
    }

    let select = '#'+section;
    let $currentSection = $(select);
    $currentSection.removeClass('invisible')
    let sections = $currentSection.siblings();
    for (let i = 0 ;i < sections.length; i++)
    {
      let $section = $(sections[i]);
      $section.addClass('invisible');
    }
  }

  $scope.clickShopMenuItemAction = function () {
    let $shopMenuItem = $(event.target).closest(".shopMenuItem");
    $shopMenuItem.addClass('menuItemSelected');
    let shopMenuItems = $shopMenuItem.siblings();
    for (let i = 0; i < shopMenuItems.length; i++) {
      let item = $(shopMenuItems[i]);
      item.removeClass('menuItemSelected');
    }
  }

}]);
