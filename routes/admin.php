<?php

/*Route::get('/login','Admin\AuthController@showLoginForm')->name('admin.login.form');

Route::post('/login','Admin\AuthController@login')->name('admin.login');*/

Route::get('/','Admin\HomeController@index')->name('admin.home');

//管理员管理
Route::get('/admin/show','Admin\AdminController@show')->name('admin.list.view');
Route::post('/admin/list','Admin\AdminController@listData')->name('admin.list.data');
Route::get('/admin/create','Admin\AdminController@showCreateForm')->name('admin.create.view');
Route::post('/admin/create','Admin\AdminController@create')->name('admin.create');
Route::get('/admin/update/{id}','Admin\AdminController@showUpdateForm')->name('admin.update.view');
Route::post('/admin/update','Admin\AdminController@update')->name('admin.update');

Route::get('/config/show','Admin\ConfigController@show')->name('config.list.view');
Route::post('/config/list','Admin\ConfigController@listData')->name('config.list.data');
Route::get('/config/create','Admin\ConfigController@showCreateForm')->name('config.create.view');
Route::post('/config/create','Admin\ConfigController@create')->name('config.create');
Route::get('/config/update/{id}','Admin\ConfigController@showUpdateForm')->name('config.update.view');
Route::post('/config/update','Admin\ConfigController@update')->name('config.update');

Route::get('/permission/show','Admin\PermissionController@show')->name('permission.list.view');
Route::post('/permission/list','Admin\PermissionController@listData')->name('permission.list.data');
Route::get('/permission/create','Admin\PermissionController@showCreateForm')->name('permission.create.view');
Route::post('/permission/create','Admin\PermissionController@create')->name('permission.create');
Route::get('/permission/update/{id}','Admin\PermissionController@showUpdateForm')->name('permission.update.view');
Route::post('/permission/update','Admin\PermissionController@update')->name('permission.update');