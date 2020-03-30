<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function show()
    {
        return view('admin.table',['data'=>$this->tableQuotes()]);
    }

    public function showCreateForm()
    {
        return view('admin.form',['data'=>$this->createQuotes()]);
    }

    public function showUpdateForm($id)
    {
        $this->id = $id;
        return view('admin.form',['data'=>$this->updateQuotes()]);
    }

    protected function modelName(){return '';}

    protected function listDataUrl(){return '/'.$this->modelName().'/list';}

    protected function exportUrl(){return '/'.$this->modelName().'/export';}

    protected function createUrl(){ return '/'.$this->modelName().'/create'; }

    protected function updateUrl(){ return '/'.$this->modelName().'/update'; }

    protected function tableFields(){return [];}

    protected function createQuotesFields(){ return [];}

    protected function updateQuotesFields(){ return []; }

    protected function search(){return [];}

    protected function keywords(){return [];}

    protected function orderBy(){return [];}

    protected function query(){ }

    protected function createQuotes()
    {
        return [
            'name'=>$this->modelName(),
            'type'=>'create',
            'url'=>$this->createUrl(),
            'id'=>0,
            'quotes'=>$this->createQuotesFields(),
            'lang'=>$this->formLang()
        ];
    }

    protected function updateQuotes()
    {
        return [
            'name'=>$this->modelName(),
            'type'=>'update',
            'url'=>$this->updateUrl(),
            'id'=>$this->id,
            'quotes'=>$this->updateQuotesFields(),
            'lang'=>$this->formLang()
        ];
    }

    protected function infoQuotes()
    {
        return [
            'name'=>$this->modelName(),
            'type'=>'info',
            'url'=>$this->createUrl(),
            'id'=>0,
            'quotes'=>$this->createQuotesFields(),
            'lang'=>$this->formLang()
        ];
    }

    protected function tableQuotes()
    {
        return
            [
                "name"=> $this->modelName(),
                "fields"=> $this->tableFields(),
                "action"=> $this->actions(),
                "search"=> $this->search(),
                "keywords"=> $this->keywords(),
                "url"=> $this->listDataUrl(),
                "exportUrl"=>$this->exportUrl(),
                "orderBy"=> $this->orderBy()
            ];
    }

    public function listData(Request $request)
    {
        $data = $this->query()->select($this->createSelectFields())
            ->where($this->where($request))
            ->paginate($request->pageSize)->all();

        return response(['data'=>$data,'count'=>$this->query()->count()]);
    }

    public function export(Request $request)
    {
        $data = $this->query()->select($this->createSelectFields())
            ->where($this->where($request))
            ->paginate($request->pageSize)->all();

        return (new ExportTemplate($this->tableFields(),$data))->response();
    }

    protected function where($request){ return function(){}; }

    protected function selectId()
    {
        return '';
    }

    protected function createSelectFields()
    {
        $selectString = $this->selectId() .',';

        foreach($this->tableFields()  as $fields)
        {
            $selectString .= $fields['name'].' as '.$fields['table'].'__'.$fields['name'].',';
        }

        $selectString = rtrim($selectString,',');

        return DB::raw($selectString);
    }





    protected function actions()
    {
        return [];
    }

    protected function formLang()
    {
        return [];
    }


}
