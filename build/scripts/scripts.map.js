'use strict';

/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
angular
  .module('dashboardApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/dbcfg/:table', {
        templateUrl: 'views/dbcfg.html',
        controller: 'DbCfgCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('dashboardApp')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('dashboardApp')
  .controller('DbCfgCtrl', ['$scope','$rootScope','$http','$q','$routeParams','$location',function ($scope, $rootScope, $http, $q,$routeParams,$location) {
    
        $rootScope.checkActive   = function(currentActiveRoute, route){
            if(route === '/'){
                return currentActiveRoute === route;
            }else{
                return new RegExp('^'+ route, 'i').test(currentActiveRoute);
            }
        };
        $rootScope.currentActiveRoute    = $location.path();
        //监听路由变化
        $rootScope.$on('$routeChangeSuccess', function() {
            $scope.currentActiveRoute  = $location.path();
        });

        var apiUrl = 'http://'+location.host.split(':')[0]+':3000/dbcfg';
        $scope.condition = {};

        $scope.showAdd = false;

        function onMsgBox(msg,type) {
            $rootScope.$broadcast('msgBox', {
                msg: {
                    content: msg||"更新成功",
                    type: type||"error"
                },
                time: 3000,
            });                    
        }
        function dealData(param){
            var defer = $q.defer();

            $http({
                method: 'POST',
                url: apiUrl,
                data: param,
                cache: false
            })
            .success(function(data) {
                defer.resolve(data);
            }).error(function() {
                defer.reject();
            });

            return defer.promise;
        }
        function queryData() {       
            dealData({
                op:'query',
                table: $routeParams.table,
                condition:JSON.stringify($scope.condition)
            }).then(function(data){
                $scope.columns = data.result.columns;
                $scope.list = data.result.list;
                $scope.condition = data.result.condition;
            });
        }
        queryData();

        $scope.addDataOnclick = function() {
            $scope.showAdd=true;
            $scope.selectAllAdd = true;
            setTimeout(function(){
                $("body").animate({scrollTop:$("#myform_add").offset().top},500);
            },10);
        }

        function getSelectList(formid) {
            var list = [];
            $('#'+formid+' .J-data-list').each(function(){
                var data = {};
                var checkbox = $(this).find('input.J-selected');
                if (!checkbox.prop('checked')) {
                    return;
                };
                $(this).find('input').each(function(){
                    var name = $(this).attr('name');
                    if (!name) {
                        return;
                    };
                    var val = $(this).val();
                    data[name]=val;
                });
                list.push(data);
            });
            return list;
        }

        $scope.modifyDataOnclick = function(){
            var list = getSelectList('myform');
            if (list.length==0) {
                onMsgBox('请勾选需要更新的行');
                return;
            };

            dealData({
                op:'update',
                table:  $routeParams.table,
                list:JSON.stringify(list)
            }).then(function(data){
                if (data.result&&data.result.code==0) {
                    onMsgBox(data.result.msg,'success');
                    queryData();
                };
            })
        }

        $scope.deleteDataOnclick = function(){
            var list = getSelectList('myform');
            if (list.length==0) {
                onMsgBox('请勾选需要删除的行');
                return;
            };

            dealData({
                op:'delete',
                table:  $routeParams.table,
                list:JSON.stringify(list)
            }).then(function(data){
                if (data.result&&data.result.code==0) {
                    onMsgBox(data.result.msg,'success');
                    queryData();
                };
            })
        }

        $scope.submitData = function(){
            var list = getSelectList('myform_add');
            if (list.length==0) {
                onMsgBox('请至少勾选一个需要添加的数据');
                return;
            };

            dealData({
                op:'insert',
                table:  $routeParams.table,
                list:JSON.stringify(list)
            }).then(function(data){
                if (data.result&&data.result.code==0) {
                    onMsgBox(data.result.msg,'success');
                    queryData();
                };
            })
        }

        $scope.searchOnclick = function(){
            $scope.condition = {};
            $('#myform_search input').each(function(){
                var name = $(this).attr('name');
                if (!name) {
                    return;
                };
                var val = $(this).val();
                if (val) {
                    $scope.condition[name]=val;
                };
            });

            queryData();
        }
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name taeDashboardApp.directive:myDirective
 * @description
 * # myDirective
 */
angular.module('dashboardApp')
    .directive('msgBox', ['$rootScope','$timeout', '$sce', function ($rootScope,$timeout,$sce) {
        return {
            restrict: 'A',
            scope: true,
            transclude: true,
            replace: true,
            templateUrl: 'views/msgbox.html',

            link: function (scope,element,attrs) {
                scope.messages = [];//历史消息
                scope.hide = function (index) {
                    scope.messages[index].time = -3;
                };

                //监听全局消息
                /**
                 *   {
                 *      key:"unique", 消息的唯一标示, 通常在有些消息需要手动程序通知其关闭的时候用到，比如上传文件需要不定期的等待。否则可以为空
                 *       msg:{
                 *           content:消息具体信息,
                 *           type:error/success/warning/info, 消息类型
                 *      }
                 *      time:-1/-2/-3/>1 大于1为默认time后消息消失，-1等待用户手动关闭，-2 等待程序通知 -3 为关闭状态,指令内部使用
                 *   }
                 */
                $rootScope.$on('msgBox', function (event, notify, order) {
                    if (!order || order == "show") {
                        // console.log('show');
                        notify.msg.content = $sce.trustAsHtml(notify.msg.content);
                        // console.log(notify);

                        if (notify.key != ''){
                            // console.log('this is a unique msg');
                            var found=false;
                            for (var i = 0; i < scope.messages.length; i++) {
                                if (scope.messages[i].key === notify.key) {
                                    found=true;
                                    scope.messages[i].time = notify.msg.time;
                                    scope.messages[i].msg.content = notify.msg.content;
                                    if (notify.time > 0) {
                                        $timeout(function () {
                                            scope.messages[i].time = -3;
                                        }, notify.time);
                                    }
                                    break;
                                }
                            }
                            if (!found){
                                scope.messages.push(notify);
                                // console.log($scope.messages);
                                var index = scope.messages.length - 1;
                                if (notify.time > 0) {
                                    // console.log(notify.time);
                                    $timeout(function () {
                                        scope.messages[index].time = -3;
                                    }, notify.time)
                                }
                            }
                        }
                        else {
                            scope.messages.push(notify);
                            // console.log($scope.messages);
                            var index = scope.messages.length - 1;
                            if (notify.time > 0) {
                                // console.log(notify.time);
                                $timeout(function () {
                                    scope.messages[index].time = -3;
                                }, notify.time)
                            }
                        }
                    } else if (order && order == "hide") {
                        // console.log('hide');
                        for (var i = 0; i < scope.messages.length; i++) {
                            if (scope.messages[i].key === notify.key) {
                                scope.messages[i].time = -3;
                            }
                        }
                    }

                });
            }
        }
    }])
    .directive('dateptimepicker', ['$cacheFactory','$filter',
        function($cacheFactory,$filter) {
            return {
                restrict: 'A',
                require: '?ngModel',
                scope: {
                    select: '&',
                    startTime: '=',
                    endTime: '='
                },
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;

                    var optionsObj = {
                        format: 'Y-m-d',
                        lang: 'ch',
                        timepicker: false,
                        maxDate: $filter('date')(new Date(),'yyyy/MM/dd')
                    };

                    //startDate和endDate配合使用
                    optionsObj.onShow = function(ct){
                        if(scope.startTime && scope.startTime != ""){
                            var st = scope.startTime.split(" ");
                            if(st[0]){
                                var min = st[0].replace(/-/g, '/');
                                var max = new Date(min).getTime() + (90*24*60*60*1000);
                                if(max>new Date().getTime()){
                                    max = new Date().getTime();
                                }
                                this.setOptions({
                                    minDate: min,
                                    maxDate: $filter('date')(new Date(max),'yyyy/MM/dd')
                                })
                            }
                        }
                        if(scope.endTime && scope.endTime != ""){
                            var st = scope.endTime.split(" ");
                            if(st[0]){
                                var max = st[0].replace(/-/g, '/');
                                this.setOptions({
                                    maxDate: max,
                                    minDate: $filter('date')(new Date(new Date(max).getTime() - (90*24*60*60*1000)),'yyyy/MM/dd')
                                })
                            }
                        }
                    }

                    var updateModel = function(dateTxt) {
                        scope.$apply(function(){
                            ngModel.$setViewValue(dateTxt);
                        });
                    };

                    optionsObj.onSelectDate = function(dateTxt, input$) {
                        updateModel(dateTxt.dateFormat('Y-m-d'));
                        if (scope.select){
                            scope.$apply(function(){
                                scope.select({datetime: dateTxt.dateFormat('Y-m-d')});
                            })
                        }
                        // console.log(dateTxt.dateFormat('Y-m-d H:i'));
                    };

                    optionsObj.onSelectTime = function(timeTxt, input$) {
                        updateModel(timeTxt.dateFormat('Y-m-d'));
                        if (scope.select){
                            scope.$apply(function(){
                                scope.select({datetime: timeTxt.dateFormat('Y-m-d')});
                            })
                        }
                        // console.log(timeTxt.dateFormat('Y-m-d H:i'));
                    };

                    ngModel.$render = function(){
                        if(ngModel.$viewValue == ""){
                            element.val("");
                        }else{
                            element.datetimepicker({value: ngModel.$viewValue || '', format: 'Y-m-d'});
                        }
                    };
                    element.datetimepicker(optionsObj);
                }
            }
        }
    ])
;




angular.module('dashboardApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/dbcfg.html',
    "<ol class=breadcrumb><li><a href=#>Home</a></li><li><a href=#>Library</a></li><li class=active>Data</li></ol><div class=search-wrap><div class=search-content><form id=myform_search method=post><table class=\"table table-striped\"><tbody><tr><td ng-repeat=\"column in columns\">{{column.name}}:<input name={{column.name}} value={{condition[column.name]}}></td></tr></tbody></table><input class=\"btn btn-primary\" value=搜索 type=submit ng-click=searchOnclick()></form></div></div><div class=result-wrap><form name=myform id=myform method=post><div class=result-title><div class=result-list><a ng-click=addDataOnclick() href=javascript:;><i class=icon-font></i>新增数据</a> <a href=javascript:void(0) ng-click=modifyDataOnclick()><i class=icon-font></i>批量更新</a> <a href=javascript:void(0) ng-click=deleteDataOnclick()><i class=icon-font></i>批量删除</a></div></div><div class=result-content><table class=\"table table-striped table-bordered\"><thead><tr><th class=tc width=5%><input class=allChoose type=checkbox ng-model=selectAll></th><th ng-repeat=\"column in columns\">{{column.name}}</th></tr></thead><tbody><tr ng-repeat=\"item in list\" class=J-data-list><td class=tc><input type=checkbox ng-checked=selectAll class=J-selected><input type=hidden name=_id value=\"{{item._id}}\"></td><td ng-repeat=\"column in columns\"><input name={{column.name}} value={{item[column.name]}}></td></tr></tbody></table></div><div class=result-title><div class=result-list><a ng-click=addDataOnclick(); href=javascript:;><i class=icon-font></i>新增数据</a> <a href=javascript:void(0) ng-click=modifyDataOnclick()><i class=icon-font></i>批量更新</a> <a href=javascript:void(0) ng-click=deleteDataOnclick()><i class=icon-font></i>批量删除</a></div></div><div class=list-page>2 条 1/1 页</div></form><form name=myform id=myform_add method=post ng-show=showAdd><div class=result-content><table class=\"table table-striped table-bordered\" width=100%><tbody><tr><th class=tc width=5%><input class=allChoose type=checkbox ng-model=selectAllAdd></th><th ng-repeat=\"column in columns\">{{column.name}}</th></tr><tr ng-repeat=\"item in [0,1,2,3,4,5]\" class=J-data-add><td class=tc><input type=checkbox ng-checked=selectAllAdd class=J-selected></td><td ng-repeat=\"column in columns\"><input name={{column.name}}></td></tr></tbody></table></div><button type=button class=\"btn btn-primary btn-lg\" ng-click=submitData()>提交</button> <button type=button class=\"btn btn-default btn-lg\" ng-click=\"showAdd=false\">取消</button></form></div>"
  );


  $templateCache.put('views/main.html',
    "<div class=jumbotron><h1>'Allo, 'Allo!</h1><p class=lead><img src=images/yeoman.png alt=\"I'm Yeoman\"><br>Always a pleasure scaffolding your apps.</p><p><a class=\"btn btn-lg btn-success\" ng-href=\"#/\">Splendid!<span class=\"glyphicon glyphicon-ok\"></span></a></p></div><div class=\"row marketing\"><h4>HTML5 Boilerplate</h4><p>HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.</p><h4>Angular</h4><p>AngularJS is a toolset for building the framework most suited to your application development.</p><h4>Karma</h4><p>Spectacular Test Runner for JavaScript.</p></div>"
  );


  $templateCache.put('views/msgbox.html',
    "<div class=\"page-notification-wrap page-notification-bottom-right\"><div ng-repeat=\"notify in messages\" ng-show=\"notify.time !== -3\" class=\"page-notification page-notification-{{notify.msg.type}}\"><button ng-show=\"notify.time !==-2\" ng-click=hide($index) class=page-notification-close-button>×</button><div class=page-notification-message ng-bind-html=notify.msg.content></div></div></div>"
  );

}]);