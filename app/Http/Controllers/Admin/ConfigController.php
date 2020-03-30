<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\Config;

class ConfigController extends ReportController
{
    protected $id = 0;
    protected function modelName()
    {
        return 'config';
    }

    protected function query()
    {
        return new Config();
    }

    protected function selectId()
    {
        return 'id as config__id';
    }
    protected function tableFields()
    {
        return [
            [
                'name'=>'name',
                'title'=>'名称',
                'table'=>'config',
                'type'=>'text',
                'width'=>'120'
            ],
            [
                'name'=>'type',
                'title'=>'类型',
                'table'=>'config',
                'type'=>'text',
                'width'=>'120'
            ],
            [
                'name'=>'title',
                'title'=>'标题',
                'table'=>'config',
                'type'=>'text',
                'width'=>'120'
            ],
            [
                'name'=>'content',
                'title'=>'值',
                'table'=>'config',
                'type'=>'text',
                'width'=>'120'
            ],
        ];
    }

    protected function actions()
    {
        return [
            [
                'name'=>'create',
                'title'=>'新增',
                'type'=>'open',
                'url'=>'/config/create',
                'returnType'=>'request'
            ],
            [
                "name"=> "update",
                "title"=> "修改",
                "link"=>true,
                "type"=> "open_with_one",
                "url"=> "/config/update",
                "returnType"=> "request"
            ]
        ];
    }

    protected function createQuotesFields()
    {
        return
            [
                [
                    'name'=>'info',
                    'title'=>'新增配置',
                    'type'=>'form',
                    'fields'=>[
                        [
                            "name"=> "name",
                            "table"=> "config",
                            "type"=> "text",
                            "title"=> "名称",
                        ],
                        [
                            "name"=> "type",
                            "table"=> "config",
                            "type"=> "text",
                            "title"=> "类型",
                        ],
                        [
                            "name"=> "title",
                            "table"=> "config",
                            "type"=> "text",
                            "title"=> "标题",
                        ],
                        [
                            "name"=> "content",
                            "table"=> "config",
                            "type"=> "textarea",
                            "title"=> "值",
                        ],
                    ],
                    'default'=>['name'=>'','type'=>'','title'=>'','content'=>'']
                ]

            ];
    }

    protected function updateQuotesFields()
    {
        $config = Config::find($this->id);

        return             [
            [
                'name'=>'info',
                'title'=>'修改配置',
                'type'=>'form',
                'fields'=>[
                    [
                        "name"=> "name",
                        "table"=> "config",
                        "type"=> "text",
                        "title"=> "名称",
                    ],
                    [
                        "name"=> "type",
                        "table"=> "config",
                        "type"=> "text",
                        "title"=> "类型",
                    ],
                    [
                        "name"=> "title",
                        "table"=> "config",
                        "type"=> "text",
                        "title"=> "标题",
                    ],
                    [
                        "name"=> "content",
                        "table"=> "config",
                        "type"=> "textarea",
                        "title"=> "值",
                    ],
                ],
                'value'=>$config
            ]

        ];
    }


    public function create(Request $request)
    {
        $config = new Config;

        $this->fillConfig($config,$request);

        return response(['status'=>true,'msg'=>'新增成功']);
    }

    public function update(Request $request)
    {
        $config = Config::find($request->id);

        $this->fillConfig($config,$request);

        return response(['status'=>true,'msg'=>'更新成功']);
    }

    protected function fillConfig($config,$request)
    {
        $config->name = $request->formData['name'];

        $config->type = $request->formData['type'];

        $config->title = $request->formData['title'];

        $config->content = $request->formData['content'];

        return $config->save() ? true : false;
    }

}
