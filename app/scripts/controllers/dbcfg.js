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

        var apiUrl = 'http://localhost:3000/dbcfg';
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
