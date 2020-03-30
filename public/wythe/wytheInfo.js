
layui.define(['layer','storage','element'],function(exports)
{
	var layer = layui.layer,storage = layui.storage,$ = layui.jquery,element = layui.element;

	var WytheInfo = function(){ this.name = 'wythe';};

	WytheInfo.prototype.displayException = function(res)
	{
		if(res.status == 422)
		{
			this.displayValidate(res.responseJSON.errors);
		}else
		{
			this.displayError(res.responseJSON);
		}
	}

	WytheInfo.prototype.displayFormException = function(res,quotes)
	{
		if(res.status == 422)
		{
            this.displayValidate(res.responseJSON.errors);
			//this.displayValidateForm(res.responseJSON.errors,quotes);
		}else
		{
			this.displayError(res.responseJSON);
		}
	}

	WytheInfo.prototype.displayError = function(res)
	{
		//trans('index.system_error')
        layer.open(
        {
            title:'message',
            content:'<div><h5>Error</h5>'+
                    '  <div>message:'+res.message+'</div>'+
                    '  <div>file:'+res.file+'</div>'+
                    '  <div>line:'+res.line+'</div>'+
                    '</div>'
        });		
	}

	WytheInfo.prototype.displayValidateForm = function(msgs,quotes,tableData)
	{
        let sign = false;

        for(let val of Object.values(quotes))
        {
            if(val.type == 'form')
            {
                for(let fields of Object.values(val.fields))
                {
                  if(msgs['formData.'+fields.name] != undefined)
                  {
                    let msg = msgs['formData.'+fields.name][0].replace('The '+'form data.'+fields.name.replace('_',' '),'');
                    
                    if(!sign)
                    {
                        layer.open({title:'message',content:fields.title+msg});
                    }

                    if(fields.type == 'select')
                    {
                        this.layTips(msg,$('[name='+fields.id+']').next())
                    }else
                    {
                        this.layTips(msg,$('[name='+fields.id+']'));
                    }
                    
                  } 
                }
                
            }

            if(val.type == 'table')
            {
            	let tableData = storage.get(val.storageKey);

                for(let [row,v] of Object.entries(tableData))
                {
                    for(let [col,field] of val.fields.entries())
                    {
                      if(msgs[val.name+'.'+row+'.'+field.name] != undefined)
                      {
                        let tr = $('#'+val.tableId).next().find('.layui-table-body').find('tr').eq(row);

                        let td = tr.find('td').eq(col);

                        let msg = msgs[val.name+'.'+row+'.'+field.name][0].replace('The '+val.name+'.'+row+'.'+field.name,'');

                        if(!sign)
                        {
                            layer.msg({title:'message',content:val.title+':'+(row+1)+field.title+msg});
                        }
                        this.layTips(msg,td)
                      }                             
                    }                
                }
            }

        }
        //scrollTo(0,0);
	}

	WytheInfo.prototype.displayValidate = function(msgs)
	{

		for(let [key,msg] of Object.entries(msgs))
		{
			if(key.startsWith('formData.'))
			{
				let fieldsName = key.replace('formData.','');

				layer.msg(msg[0]);
			}else
			{
				let arr = key.split('.');

				let [quoteName,index,fieldsName] = arr;

			}
			break;
		}
	}

	WytheInfo.prototype.layTips = function(msg,$dom)
	{
        let index = layer.tips(msg, $dom, 
          { 
            time: 0, 
            tips: [2, '#ff9800'], 
            tipsMore: true ,
            success(lay,index)
            {
                $dom.click(function()
                {
                     layer.close(index);
                });
            }
          }
        );
	}

	WytheInfo.prototype.displayNormal = function(res)
	{
		layer.open(
		{
			content:res.msg
		}); 		
	}

    WytheInfo.prototype.setProgress = function(total,callback)
    {
        this.setProgressTotal(total);

        this.progressCount = 0;

        this.progressLayer = layer.open({title:'test',content:'<div id="wythe-progress" class="layui-progress layui-progress-big" lay-filter="wythe-progress" lay-showPercent="true"><div class="layui-progress-bar layui-bg-blue" lay-percent="0 / '+this.progressTotal+'"></div></div>'});

        this.progressCallback = callback;

        element.render('progress');
    }

    WytheInfo.prototype.setProgressTotal = function(total)
    {
        this.progressTotal = total;
    }

    WytheInfo.prototype.progress = function()
    {
        this.progressCount++;

        $('#wythe-progress').find('div').attr('lay-percent',this.progressCount+' / '+this.progressTotal)

        element.render('progress', );

        if(this.progressCount == this.progressTotal)
        {
            this.progressCallback();
        }

    }

	var wytheInfo = new WytheInfo();

	exports('wytheInfo',wytheInfo);
});