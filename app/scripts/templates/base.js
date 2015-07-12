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
