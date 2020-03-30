<?php
/**
 * 权限增删改查-后台权限与路由一一对应.
 * User: wythe
 * Date: 2020/3/19
 * Time: 9:49
 */

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\Permission;
use Illuminate\Validation\Rule;
use App\FilesGenerate\ExportTemplate;

class PermissionController extends ReportController
{

    protected function selectId()
    {
        return 'id as permission__id';
    }

    protected function modelName()
    {
        return 'permission';
    }

    protected function query()
    {
        return new Permission;
    }

    protected function actions()
    {
        return [            [
            "name"=> "create",
            "title"=> "新增",
            "icon"=> null,
            "type"=> "open",
            "url"=> "/permission/create",
            "returnType"=> "request"
        ],
            [
                "name"=> "update",
                "title"=> "修改",
                "icon"=> null,
                "link"=>true,
                "type"=> "open_with_one",
                "url"=> "/permission/update",
                "returnType"=> "request"
            ]];
    }

    protected function tableFields()
    {
        return
            [
                [
                    "name"=> "name",
                    "table"=> "permission",
                    "type"=> "text",
                    "width"=> 160,
                    "title"=> "名称",
                    "sort"=> false,
                ],
                [
                    "name"=> "title",
                    "table"=> "permission",
                    "type"=> "text",
                    "width"=> 160,
                    "title"=> "标题",
                    "sort"=> false,
                ],
                [
                    "name"=> "url",
                    "table"=> "permission",
                    "type"=> "text",
                    "width"=> 160,
                    "title"=> "路由",
                    "sort"=> false,
                ],
                [
                    "name"=> "guard_name",
                    "table"=> "permission",
                    "type"=> "text",
                    "width"=> 160,
                    "title"=> "看守器",
                    "sort"=> false,
                ],
            ];
    }

    protected function createQuotesFields()
    {
        return [
            [
                'name'=>'info',
                'title'=>'新增权限',
                'type'=>'form',
                'fields'=>[
                    [
                        "name"=> "name",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "名称",
                        "sort"=> false,
                    ],
                    [
                        "name"=> "title",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "标题",
                        "sort"=> false,
                    ],
                    [
                        "name"=> "url",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "路由",
                        "sort"=> false,
                    ],
                    [
                        "name"=> "guard_name",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "看守器",
                        "sort"=> false,
                    ],
                ],
                'default'=>['name'=>'','url'=>'','title'=>'','guard_name'=>'']
            ]

        ];
    }

    protected function updateQuotesFields()
    {
        $permission = Permission::find($this->id);
        return [
            [
                'name'=>'info',
                'title'=>'新增权限',
                'type'=>'form',
                'fields'=>[
                    [
                        "name"=> "name",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "名称",
                        "sort"=> false,
                    ],
                    [
                        "name"=> "title",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "标题",
                        "sort"=> false,
                    ],
                    [
                        "name"=> "url",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "路由",
                        "sort"=> false,
                    ],
                    [
                        "name"=> "guard_name",
                        "table"=> "permission",
                        "type"=> "text",
                        "width"=> 160,
                        "title"=> "看守器",
                        "sort"=> false,
                    ],
                ],
                'value'=>$permission
            ]

        ];
    }

    public function create(Request $request)
    {
        $this->validate($request,$this->permissionValidate(),$this->permissionValidateMessage());

        $permission = new Permission();

        $this->fillPermission($permission,$request->formData);

        return response(['status'=>true,'msg'=>'新增成功']);
    }

    public function update(Request $request)
    {
        $id = $request->id;

        $this->validate($request,$this->permissionValidate($id),$this->permissionValidateMessage());

        $permission = Permission::find($id);

        $this->fillPermission($permission,$request->formData);

        return response(['status'=>true,'msg'=>'更新成功']);
    }

    protected function fillPermission($permission,$formData)
    {
        $permission->name = $formData['name'];

        $permission->guard_name = $formData['guard_name'];

        $permission->url = $formData['url'];

        $permission->title = $formData['title'];

        return $permission->save() ? true : false;
    }

    /**
     * permissionValidate
     *
     * @param
     * @return
     */
    protected function permissionValidate($id=0)
    {
        $rule = ['formData.guard_name'=>'required'];
        if($id>0)
        {
            $rule['formData.name'] = ['required',Rule::unique('permissions','name')->ignore($id)];
            $rule['formData.url'] = ['required',Rule::unique('permissions','url')->ignore($id)];
        }else{
            $rule['formData.name'] = 'required|unique:permissions,name';
            $rule['formData.url'] = 'required|unique:permissions,url';
        }
        return $rule;
    }

    /**
     * permissionValidateMsg
     *
     * @param
     * @return
     */
    protected function permissionValidateMessage()
    {
        return [
            'formData.name.required'=>'权限名不能为空',
            'formData.url.unique'=>'已有对应的此路由',
            'formData.name.unique'=>'已有此权限',
            'formData.guard_name'=>'看守器不能为空',
            'formData.url'=>'url不能为空',
        ];
    }

    /**
     * 导出
     *
     * @param
     * @return
     */
    public function export(Request $request)
    {
        $head = [
            [
                'name'=>'name',
                'title'=>'名称',
                'table'=>'permission',
            ],
        ];

        $data = [
            ['permission__name'=>123],
            ['permission__name'=>4234],
        ];

        return (new ExportTemplate($head,$data))->response();

    }
}