"use strict";angular.module("dashboardApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/dbcfg/:table",{templateUrl:"views/dbcfg.html",controller:"DbCfgCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("dashboardApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("dashboardApp").controller("DbCfgCtrl",["$scope","$rootScope","$http","$q","$routeParams","$location",function(a,b,c,d,e,f){function g(a,c){b.$broadcast("msgBox",{msg:{content:a||"更新成功",type:c||"error"},time:3e3})}function h(a){var b=d.defer();return c({method:"POST",url:k,data:a,cache:!1}).success(function(a){b.resolve(a)}).error(function(){b.reject()}),b.promise}function i(){h({op:"query",table:e.table,condition:JSON.stringify(a.condition)}).then(function(b){b.result?(a.columns=b.result.columns,a.list=b.result.list,a.condition=b.result.condition,a.showAdd=!1):g(b.error.msg,"error")})}function j(a){var b=[];return $("#"+a+" .J-data-list").each(function(){var a={},c=$(this).find("input.J-selected");c.prop("checked")&&($(this).find("input").each(function(){var b=$(this).attr("name");if(b){var c=$(this).val();a[b]=c}}),b.push(a))}),b}b.checkActive=function(a,b){return"/"===b?a===b:new RegExp("^"+b,"i").test(a)},b.currentActiveRoute=f.path(),b.$on("$routeChangeSuccess",function(){a.currentActiveRoute=f.path()});var k="http://"+location.host.split(":")[0]+":3000/dbcfg";a.condition={},a.showAdd=!1,i(),a.addDataOnclick=function(){a.showAdd=!0,a.selectAllAdd=!0,setTimeout(function(){$("body").animate({scrollTop:$("#myform_add").offset().top},500)},10)},a.modifyDataOnclick=function(){var a=j("myform");return 0==a.length?void g("请勾选需要更新的行"):void h({op:"update",table:e.table,list:JSON.stringify(a)}).then(function(a){a.result&&0==a.result.code&&(g(a.result.msg,"success"),i())})},a.deleteDataOnclick=function(){var a=j("myform");return 0==a.length?void g("请勾选需要删除的行"):void h({op:"delete",table:e.table,list:JSON.stringify(a)}).then(function(a){a.result&&0==a.result.code&&(g(a.result.msg,"success"),i())})},a.submitData=function(){var a=j("myform_add");return 0==a.length?void g("请至少勾选一个需要添加的数据"):void h({op:"insert",table:e.table,list:JSON.stringify(a)}).then(function(a){a.result&&0==a.result.code?(g(a.result.msg,"success"),i()):g(a.error.msg,"error")})},a.searchOnclick=function(){a.condition={},$("#myform_search input").each(function(){var b=$(this).attr("name");if(b){var c=$(this).val();c&&(a.condition[b]=c)}}),i()}}]),angular.module("dashboardApp").directive("msgBox",["$rootScope","$timeout","$sce",function(a,b,c){return{restrict:"A",scope:!0,transclude:!0,replace:!0,templateUrl:"views/msgbox.html",link:function(d,e,f){d.messages=[],d.hide=function(a){d.messages[a].time=-3},a.$on("msgBox",function(a,e,f){if(f&&"show"!=f){if(f&&"hide"==f)for(var g=0;g<d.messages.length;g++)d.messages[g].key===e.key&&(d.messages[g].time=-3)}else if(e.msg.content=c.trustAsHtml(e.msg.content),""!=e.key){for(var h=!1,g=0;g<d.messages.length;g++)if(d.messages[g].key===e.key){h=!0,d.messages[g].time=e.msg.time,d.messages[g].msg.content=e.msg.content,e.time>0&&b(function(){d.messages[g].time=-3},e.time);break}if(!h){d.messages.push(e);var i=d.messages.length-1;e.time>0&&b(function(){d.messages[i].time=-3},e.time)}}else{d.messages.push(e);var i=d.messages.length-1;e.time>0&&b(function(){d.messages[i].time=-3},e.time)}})}}}]).directive("dateptimepicker",["$cacheFactory","$filter",function(a,b){return{restrict:"A",require:"?ngModel",scope:{select:"&",startTime:"=",endTime:"="},link:function(a,c,d,e){if(e){var f={format:"Y-m-d",lang:"ch",timepicker:!1,maxDate:b("date")(new Date,"yyyy/MM/dd")};f.onShow=function(c){if(a.startTime&&""!=a.startTime){var d=a.startTime.split(" ");if(d[0]){var e=d[0].replace(/-/g,"/"),f=new Date(e).getTime()+7776e6;f>(new Date).getTime()&&(f=(new Date).getTime()),this.setOptions({minDate:e,maxDate:b("date")(new Date(f),"yyyy/MM/dd")})}}if(a.endTime&&""!=a.endTime){var d=a.endTime.split(" ");if(d[0]){var f=d[0].replace(/-/g,"/");this.setOptions({maxDate:f,minDate:b("date")(new Date(new Date(f).getTime()-7776e6),"yyyy/MM/dd")})}}};var g=function(b){a.$apply(function(){e.$setViewValue(b)})};f.onSelectDate=function(b,c){g(b.dateFormat("Y-m-d")),a.select&&a.$apply(function(){a.select({datetime:b.dateFormat("Y-m-d")})})},f.onSelectTime=function(b,c){g(b.dateFormat("Y-m-d")),a.select&&a.$apply(function(){a.select({datetime:b.dateFormat("Y-m-d")})})},e.$render=function(){""==e.$viewValue?c.val(""):c.datetimepicker({value:e.$viewValue||"",format:"Y-m-d"})},c.datetimepicker(f)}}}}]),angular.module("dashboardApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/dbcfg.html",'<ol class=breadcrumb><li><a href=#>Home</a></li><li><a href=#>Library</a></li><li class=active>Data</li></ol><div class=search-wrap><div class=search-content><form id=myform_search method=post><table class="table table-striped"><tbody><tr><td ng-repeat="column in columns">{{column.name}}:<input name={{column.name}} value={{condition[column.name]}}></td></tr></tbody></table><input class="btn btn-primary" value=搜索 type=submit ng-click=searchOnclick()></form></div></div><div class=result-wrap><form name=myform id=myform method=post><div class=result-title><div class=result-list><a ng-click=addDataOnclick() href=javascript:;><i class=icon-font></i>新增数据</a> <a href=javascript:void(0) ng-click=modifyDataOnclick()><i class=icon-font></i>批量更新</a> <a href=javascript:void(0) ng-click=deleteDataOnclick()><i class=icon-font></i>批量删除</a></div></div><div class=result-content><table class="table table-striped table-bordered"><thead><tr><th class=tc width=5%><input class=allChoose type=checkbox ng-model=selectAll></th><th ng-repeat="column in columns">{{column.name}}</th></tr></thead><tbody><tr ng-repeat="item in list" class=J-data-list><td class=tc><input type=checkbox ng-checked=selectAll class=J-selected><input type=hidden name=_id value="{{item._id}}"></td><td ng-repeat="column in columns"><input name={{column.name}} value={{item[column.name]}}></td></tr></tbody></table></div><div class=result-title><div class=result-list><a ng-click=addDataOnclick(); href=javascript:;><i class=icon-font></i>新增数据</a> <a href=javascript:void(0) ng-click=modifyDataOnclick()><i class=icon-font></i>批量更新</a> <a href=javascript:void(0) ng-click=deleteDataOnclick()><i class=icon-font></i>批量删除</a></div></div><div class=list-page>2 条 1/1 页</div></form><form name=myform id=myform_add method=post ng-show=showAdd><div class=result-content><table class="table table-striped table-bordered" width=100%><tbody><tr><th class=tc width=5%><input class=allChoose type=checkbox ng-model=selectAllAdd></th><th ng-repeat="column in columns">{{column.name}}</th></tr><tr ng-repeat="item in [0,1,2]" class=J-data-list><td class=tc><input type=checkbox ng-checked=selectAllAdd class=J-selected></td><td ng-repeat="column in columns"><input name={{column.name}}></td></tr></tbody></table></div><button type=button class="btn btn-primary btn-lg" ng-click=submitData()>提交</button> <button type=button class="btn btn-default btn-lg" ng-click="showAdd=false">取消</button></form></div>'),a.put("views/main.html",'<div class=jumbotron><h1>\'Allo, \'Allo!</h1><p class=lead><img src=images/yeoman.png alt="I\'m Yeoman"><br>Always a pleasure scaffolding your apps.</p><p><a class="btn btn-lg btn-success" ng-href="#/">Splendid!<span class="glyphicon glyphicon-ok"></span></a></p></div><div class="row marketing"><h4>HTML5 Boilerplate</h4><p>HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.</p><h4>Angular</h4><p>AngularJS is a toolset for building the framework most suited to your application development.</p><h4>Karma</h4><p>Spectacular Test Runner for JavaScript.</p></div>'),a.put("views/msgbox.html",'<div class="page-notification-wrap page-notification-bottom-right"><div ng-repeat="notify in messages" ng-show="notify.time !== -3" class="page-notification page-notification-{{notify.msg.type}}"><button ng-show="notify.time !==-2" ng-click=hide($index) class=page-notification-close-button>×</button><div class=page-notification-message ng-bind-html=notify.msg.content></div></div></div>')}]);