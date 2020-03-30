<?php
/**
 * 后台管理员用户管理.
 * User: wythe
 * Date: 2020/3/19
 * Time: 9:50
 */

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Illuminate\Validation\Rule;


class AdminController extends ReportController
{
    protected function modelName()
    {
        return 'admin';
    }

    protected function query()
    {
        return new Admin();
    }

    protected function selectId()
    {
        return 'id as admin__id';
    }

    protected function actions()
    {
        return [            [
            "name"=> "create",
            "title"=> "新增",
            "icon"=> null,
            "type"=> "open",
            "url"=> "/admin/create",
            "returnType"=> "request"
        ],
            [
                "name"=> "update",
                "title"=> "修改",
                "icon"=> null,
                "link"=>true,
                "type"=> "open_with_one",
                "url"=> "/admin/update",
                "returnType"=> "request"
            ]];
    }

    protected function tableFields()
    {
        return
       [
            [
                "name"=> "name",
                "table"=> "admin",
                "type"=> "text",
                "width"=> 160,
                "title"=> "用户名",
                "sort"=> false,
            ],
            [
               "name"=> "email",
               "table"=> "admin",
               "type"=> "text",
               "width"=> 160,
               "title"=> "邮箱",
               "sort"=> false,
            ],
        ];
    }

    protected function createQuotesFields()
    {
        return [
            [
                'name'=>'info',
                'title'=>'新增表格',
                'type'=>'form',
                'fields'=>[
                    [
                        'name'=>'name',
                        'table'=>'admin',
                        'type'=>'text',
                        'title'=>'用户名'
                    ],
                    [
                        'name'=>'email',
                        'table'=>'admin',
                        'type'=>'text',
                        'title'=>'邮箱'
                    ],
                    [
                        'name'=>'password',
                        'table'=>'admin',
                        'type'=>'password',
                        'title'=>'密码'
                    ],
                    [
                        'name'=>'password_confirmation',
                        'table'=>'admin',
                        'type'=>'password',
                        'title'=>'重复密码'
                    ],
                ],
                'default'=>['name'=>'','email'=>'','password'=>'','password_confirmation'=>'']
            ]
        ];
    }

    protected function updateQuotesFields()
    {
        $admin = Admin::find($this->id);
        return [
            [
                'name'=>'info',
                'title'=>'更新',
                'type'=>'form',
                'fields'=>[
                    [
                        'name'=>'name',
                        'table'=>'admin',
                        'type'=>'text',
                        'title'=>'用户名'
                    ],
                    [
                        'name'=>'email',
                        'table'=>'admin',
                        'type'=>'text',
                        'title'=>'邮箱'
                    ],
                    [
                        'name'=>'password',
                        'table'=>'admin',
                        'type'=>'password',
                        'title'=>'密码'
                    ],
                    [
                        'name'=>'password_confirmation',
                        'table'=>'admin',
                        'type'=>'password',
                        'title'=>'重复密码'
                    ],
                ],
                'value'=>$admin->toArray()
            ]
        ];
    }
    public function create(Request $request)
    {
        $this->validate($request,$this->adminValidate(),$this->adminValidateMessage());

        $admin = new Admin();

        $admin->name = $request->formData['name'];

        $admin->email = $request->formData['email'];

        $admin->password = Hash::make($request->formData['password']);

        $admin->save();

        return response(['status'=>true,'msg'=>'创建成功']);
    }

    public function update(Request $request)
    {
        $this->validate($request,$this->adminValidate($request->id),$this->adminValidateMessage($request->id));

        $admin = Admin::find($request->id);

        $admin->name = $request->formData['name'];

        $admin->email = $request->formData['email'];

        $admin->password = Hash::make($request->formData['password']);

        $admin->roles()->sync(json_decode($request->formData['roles']));

        $admin->save();

        return response(['status'=>true,'msg'=>'更新成功']);
    }

    public function adminValidate($id=0)
    {
        $rules = [
            'formData.password'=>'required|confirmed',
            'formData.password_confirmation'=>'required',
        ];
        if($id)
        {
            $rules['formData.name'] = ['required',Rule::unique('admins','name')->ignore($id)];
            $rules['formData.email']= ['required','email',Rule::unique('admins','email')->ignore($id)];
        }else
        {
            $rules['formData.name'] = 'required|unique:admins,name';
            $rules['formData.email']= 'required|email|unique:admins,email';
        }

        return $rules;
    }

    public function adminValidateMessage()
    {
        return [
            'formData.name.required'=>'名称不能为空',
            'formData.email.required'=>'邮箱不能为空',
            'formData.password.required'=>'密码不能为空',
            'formData.password.confirmed'=>'两次输入的密码不一致',
            'formData.password_confirmation.required'=>'确认密码未输入',
        ];
    }


}