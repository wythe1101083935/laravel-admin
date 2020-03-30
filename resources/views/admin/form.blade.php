<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="renderer" content="webkit">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="stylesheet" href="{{ asset('layui/css/layui.css') }}">
    <script src="{{ asset('layui/layui.js') }}"></script>
    <style>

        .layui-table-view {margin: 0px;}

        .advanced .layui-form-select .layui-input
        {
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .advanced .layui-form-select dl
        {
            margin-left:10px;
        }
        .layui-layout-left {
            left:7.5px;
            top:7.5px;
            right:7.5px;
            width:100%-7.5px;
            background-color: #c2c2c2;
        }
        .layui-layout-right{
            top:7.5px;
            right:7.5px;
            background-color: #c2c2c2;
        }
        .keywords .layui-input-inline{
            margin-top:11px;
        }
        .layui-table tbody tr:hover, .layui-table thead tr, .layui-table-click, .layui-table-header, .layui-table-hover, .layui-table-mend, .layui-table-patch, .layui-table-tool, .layui-table-total, .layui-table-total tr, .layui-table[lay-even] tr:nth-child(2n) {
            background-color: #e2e2e2;
        }
        body .wythe-content-visible .layui-layer-content {
            overflow: visible;
        }
        body{
            font-size:12px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

        }
    </style>
</head>
<body>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12" id="bodyMain">

        </div>
    </div>
</div>
<script>
    layui.config({ base: "/wythe/"}).use(['wytheForm'],function() {
        let wytheForm = layui.wytheForm;

        //数据驱动
        let data = @json($data)

        wytheForm.render(
            {
                id:'bodyMain',
                modelName:data.name,
                modelType:data.type,
                quotes:data.quotes,
                url:data.url,
                lang:data.lang,
                dataId:data.id,
            });
    })
</script>
</body>
</html>