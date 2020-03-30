
layui.extend({storage:'storage',formSelects:'formSelects-v4'}).define(['form','table','storage','laydate','formSelects','wytheInfo'],function(exports)
{
	var form = layui.form,
		formSelects = layui.formSelects,
		storage = layui.storage,
        table = layui.table,
        laydate = layui.laydate,
        wytheInfo = layui.wytheInfo,
		$ = layui.jquery;
    

	var WytheForm = function()
	{
		this.config = 
		{
			id:'test',
			modelName:'model',
			actionName:'create',
			quotes:[],
			relation:[],
		}
	}

    WytheForm.prototype.setConfig = function(option)
    {
        this.config = {
            id:option.id,
            modelName:option.modelName,
            quotes:option.quotes,
            modelType:option.modelType,
            url:option.url
        };

        this.id = option.dataId;

        this.lang = option.lang;
    }

	WytheForm.prototype.render = function(option)
	{
        this.setConfig(option);

        let html = '';

        html += '<form class="layui-form layui-form-pane">';

        for(let val of Object.values(this.config.quotes))
        {
            //格式化数据
            val.type == 'table' ? this.formatTableData(val) : this.formatFormData(val);
        	//初始化数据
            if(this.config.modelType == 'update')
            {
                storage.set(val.storageKey,val.value);
            }else
            {
                if(!storage.get(val.storageKey))
                {
                    storage.set(val.storageKey,val.default);
                }
            }
            //获取html
            html +=  this.getFormQuote(val);
        }
        html += this.getSubmit();

        html += '</form>'

        //输出html
        $('#'+this.config.id).html(html);

        //赋值数据并渲染页面
        this.renderAll();

        
        //全部渲染完毕后，注册事件
        for(let val of Object.values(this.config.quotes))
        {
        	val.type == 'table' ? this.registerTable(val) : this.registerForm(val);
        }

        this.registerReset();

        return this;
	}

    WytheForm.prototype.renderAll = function()
    {
        for(let val of Object.values(this.config.quotes))
        {
            this.renderFormQuote(val);
        }

        form.render();        
    }

    WytheForm.prototype.resetFormData = function(compose)
    {
        for(let val of Object.values(this.config.quotes))
        {
            //初始化数据
            if(this.config.modelType == 'update')
            {
                storage.set(val.storageKey,val.value);
            }else
            {
                storage.set(val.storageKey,val.default);
            }
        }

        this.renderAll();              
    }

    WytheForm.prototype.getId = function(quote)
    {
        return 'wythe_form_'+this.config.modelName.replace('.','_')+'_'+quote.name+'_'+quote.type;
    }

    //获取formquote的html
	WytheForm.prototype.getFormQuote = function(data)
	{
        let html  = '<fieldset class="layui-elem-field"style="margin-left:30px;margin-top:20px;">'
            html += ' <legend>'+data.title+'</legend>'
            html += ' <div class="layui-field-box">';
        for(let [field,val] of Object.entries(data.fields))
        {
            switch(val.type)
            {
                case 'text':
                case 'datetime':
                    html += this.getText(val);
                    break;
                case 'password':
                    html += this.getPassword(val);
                    break;
                case 'textarea':
                    html += this.getTextArea(val);
                    break;
                case 'select':
                    html += this.getSelect(val,data.storageKey);                               
                    break;
                case 'selects':
                    html += this.getSelects(val);
                    break;
                case 'switch':
                    html += this.getSwitch(val);
                    break;
                case 'file':
                    html += this.getFileHtml(val);
                    break;

            }
        }
        html += ' </div>'
        html += '</fieldset>';

        return html;
	}


    WytheForm.prototype.formatFormData = function(data)
    {
        data.id = this.getId(data);

        data.storageKey = this.getId(data);

        for(let val of Object.values(data.fields))
        {
            val.id = val.table+'_'+val.name;
        }

    }

    WytheForm.prototype.formatTableData = function(data)
    {
        data.id = this.getId(data);

        data.storageKey = this.getId(data);

        data.tableId = data.id+'table';

        data.cols = this.formatTableHeadData(data.fields);


        if(this.config.modelType == 'update')
        {
            this.formatTableBodyData(data.value);
        }

        this.formatTableBodyData(data.default);
    }

    WytheForm.prototype.formatTableHeadData = function(fieldsList)
    {
        //表头数据格式
        let cols = [];

        cols[cols.length] = [];

        for(let fields of fieldsList)
        {
            cols[0][cols[0].length] = {
                field:fields.name,
                type:'normal',
                edit:'text',
                title:fields.title,
                width:fields.width,
            };
        }  
        //增加操作栏
        cols[0].push({field:'action_add_delete',title:'<i class="layui-icon add" style="font-size: 30px; color: #1E9FFF;">&#xe61f;</i>'});

        return cols;
    }

    WytheForm.prototype.formatTableBodyData = function(value)
    {
        for(let [index,row] of Object.entries(value))
        {
            row.idIndex = index;

            row.action_add_delete = '<i class="layui-icon del" data-id="'+index+'" style="font-size: 30px; color: #FF5722;">&#xe640;</i>';
        }        
    }

    //渲染formquote
	WytheForm.prototype.renderFormQuote = function(data)
	{
		let formData = storage.get(data.storageKey);

        for(let fields of Object.values(data.fields))
        {
            switch(fields.type)
            {
                case 'selects':
                    formSelects.render(fields.id,{init:JSON.parse(formData[fields.name])});
                    formSelects.btns(fields.id, []);
                    break;
                case 'switch':
                    console.log(formData);
                    if(formData[fields.name])
                    {
                        $('[name="'+fields.id+'"]').prop('checked',1);
                        form.render();
                    }
                    break;
                case 'file':
                    $('[name="text_'+fields.id+'"]').val(formData[fields.name]);
                    break;
                default:
                    $('[name="'+fields.id+'"]').val(formData[fields.name]);
                    break;
            }
        }
	}


    WytheForm.prototype.registerReset = function()
    {
        let that = this;

        $('#reset').click(function()
        {
            that.resetFormData();
        });
    }

	WytheForm.prototype.registerForm = function(data)
	{
		for(let field of Object.values(data.fields))
		{
			switch(field.type)
			{
				case 'datetime':
					this.registerDatetime(field,data.storageKey);
					break;
				case 'file':
					this.registerFile(field,data.storageKey);
					break;
				case 'select':
					this.registerSelect(field,data.storageKey);
					break;
                case 'selects':
                    this.registerMultiSelect(field,data.storageKey);
                    break;
                case 'switch':
                    this.registerSwitch(field,data.storageKey);
                    break;
                default:
                    this.registerFields(field,data.storageKey);
                    break;
			}
		}

        this.registerFormSubmit();
	}

	WytheForm.prototype.registerDatetime = function(val,storageKey)
	{
          let that = this;
          laydate.render(
          {
              elem:'[name='+val.id+']',
              type:'datetime',
              position:'fixed',
              done(value)
              {
                storage.setKey(val.name,value,storageKey);
              }
          });		
	}

	WytheForm.prototype.registerFile = function(val,storageKey)
	{
        $('[name=file_'+val.id+']').click(function()
        {
          $('#file_'+val.id).click();  
        });
        $('#file_'+val.id).change(function(e)
        {
            let files = e.target.files != undefined ? e.target.files : e.dataTransfer.files;

            $('[name=text_'+val.id+']').val(files[0].name);

            storage.setKey(val.name,files[0],storageKey);
        });
       /* $('[name=text_'+val.id+']').click(function(){
            console.log($(this).val());
        });*/
	}

    WytheForm.prototype.registerSwitch = function(val,storageKey)
    {
        form.on('switch('+val.id+')', function(data){
            storage.setKey(val.name,parseInt(data.elem.checked),storageKey);
        });
    }

    WytheForm.prototype.registerFields = function(val,storageKey)
    {
        $('[name='+val.id+']').blur(function()
        {
            storage.setKey(val.name,$(this).val(),storageKey);
        });
    }

	WytheForm.prototype.registerSelect = function(val,storageKey)
	{
        let that = this;

        form.on('select('+val.id+')',function(data)
        {
            storage.setKey(val.name,data.value,storageKey);
        })

        if(val.relation != undefined)
        {
            let id = val.relation.table+'_'+val.relation.name;

            form.on('select('+id+')',function(data)
            {
                storage.setKey(val.relation.name,data.value,storageKey);

                $('[name='+val.id+']').html(that.getOptions(val,storageKey));

                form.render('select');

                $('[name='+val.id+']').next().find('dd').first().click();
            });
        }
	}

    WytheForm.prototype.registerMultiSelect = function(val,storageKey)
    {
        formSelects.on(val.id,function(id,vals,value,isAdd,isDisabled)
        {
            let data = JSON.parse(storage.getKey(val.name,storageKey));

            if(isAdd)
            {
                data.push(value.value);
            }else
            {
                data.splice(data.indexOf(val.value),1);
            }
            storage.setKey(val.name,JSON.stringify(data),storageKey);
        })
    }

    WytheForm.prototype.registerFormSubmit = function()
    {
        let that = this;

        form.on('submit(submit)',function()
        {
            let shadow = layer.load(2);

            $.ajax({
                url:that.config.url,
                type:'post',
                async:true,
                dataType:'json',
                contentType:false,
                processData:false,
                headers: 
                {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data:that.setFormData(),
                success(res)
                {
                    layer.close(shadow);

                    if(res.status && that.config.modelType != 'update') that.resetFormData();
                    
                    wytheInfo.displayNormal(res); 
                },
                error(res)
                {
                    layer.close(shadow);

                    wytheInfo.displayFormException(res,that.config.quotes);
                }
            });

            return false;
        })        
    }

    WytheForm.prototype.setFormData = function()
    {
        let data = new FormData();

        //if(this.config.modelType == 'update')
        //{
            data.append('id',this.id);
        //}

        for(let quote of Object.values(this.config.quotes))
        {
            if(quote.type == 'form')
            {
                let formData = storage.get(quote.storageKey);

                for(let fields of Object.values(quote.fields))
                {
                    this.setFormDataSubmit(fields,data,formData);
                }
            }

            if(quote.type == 'table')
            {
                let tableData = storage.get(quote.storageKey);

                for(let [index,row] of Object.entries(tableData))
                {
                    for(let [name,v] of Object.entries(row))
                    {
                        data.append(quote.name+'['+index+']['+name+']',v);
                    }
                }                 
            }
        }

        console.log(data);
        return data;        
    }

    WytheForm.prototype.setFormDataSubmit = function(fields,data,formData)
    {
        if(fields.type == 'file')
        {
            data.append('formData['+fields.name+']',document.getElementById("file_"+fields.id).files[0]);
        }else
        {
            let val = formData[fields.name];

            if(typeof val == 'object')
            {
                val = JSON.stringify(val);
            }

            data.append('formData['+fields.name+']',val);                        
        }        
    }

	WytheForm.prototype.getText = function(val)
	{
        let html = '';
        html += '<div class="layui-form-item">'
        html += '<label for="username" class="layui-form-label">'
        if(val.important != undefined)
        {
            html += '<span class="x-red">*</span>';
        }
        html += val.title;
        html += '</label>'
        html += '<div class="layui-input-inline">'
        html +=  '<input type="text" name="'+val.id+'" required="" lay-verify="required" autocomplete="off" class="layui-input">'
        html += '</div>'
        html += '<div class="layui-form-mid layui-word-aux">'
        if(val.remarks != undefined && val.remarks != '')
        {
            html +=  '<span class="x-red">*</span>'+val.remarks
        }
        html +=  '</div>'
        html += '</div>'

        return html;
	}

    WytheForm.prototype.getPassword = function(val)
    {
        let html = '';
        html += '<div class="layui-form-item">'
        html += '<label for="username" class="layui-form-label">'
        if(val.important != undefined)
        {
            html += '<span class="x-red">*</span>';
        }
        html += val.title;
        html += '</label>'
        html += '<div class="layui-input-inline">'
        html +=  '<input type="password" name="'+val.id+'" required="" lay-verify="required" autocomplete="off" class="layui-input">'
        html += '</div>'
        html += '<div class="layui-form-mid layui-word-aux">'
        if(val.remarks != undefined && val.remarks != '')
        {
            html +=  '<span class="x-red">*</span>'+val.remarks
        }
        html +=  '</div>'
        html += '</div>'

        return html;
    }


	WytheForm.prototype.getTextArea = function(val)
	{
        let html = '';
        html += '<div class="layui-form-item layui-form-text">';
        html += ' <label class="layui-form-label">'+val.title+'</label>'
        html += ' <div class="layui-input-block">';
        html += '  <textarea placeholder="" name="'+val.id+'" class="layui-textarea field"></textarea>';
        html += ' </div>'
        html += '</div>';
        return html;
	}

	WytheForm.prototype.getSelect = function(val,storageKey)
	{
        let html = '';
        html += '<div class="layui-form-item">'
        html += ' <label class="layui-form-label" title="'+val.title+'">'+val.title+'</label>'
        html += ' <div class="layui-input-inline">';
        html += ' <select lay-search name="'+val.id+'"  lay-filter="'+val.id+'">'
        html += this.getOptions(val,storageKey);
        html += '</select>';
        html += ' </div>'
        html += '</div>';     

        return html;  
	}

    WytheForm.prototype.getSwitch = function(val)
    {
        let html = '';
        html += '<div class="layui-form-item">'
        html += ' <label class="layui-form-label" title="'+val.title+'">'+val.title+'</label>'
        html += ' <div class="layui-input-block">';
        html += '  <input type="checkbox" lay-skin="switch"  name="'+val.id+'" lay-filter="'+val.id+'">';
        html += ' </div>'
        html += '</div>';
        return html;
    }

    WytheForm.prototype.getOptions = function(val,storageKey)
    {
        let html = '';

        let value = val.relation != undefined ? storage.getKey(val.relation.name,storageKey) : 'relationFilterString';

        html += ' <option value=""></option>';
        for(let optionValue of Object.values(val.options))
        {
            if(val.relation != undefined && optionValue.pid != value) continue;

            html += ' <option value="'+optionValue.id+'">'+optionValue.name+'</option>'
        } 
        return html;          
    }

	WytheForm.prototype.getSelects = function(val)
	{
        let html = '';
        html += '<div class="layui-form-item layui-form-text" style="margin-bottom:10px;">';
        html += ' <label class="layui-form-label" title="'+val.title+'">'+val.title+'</label>';
        html += ' <select name="'+val.id+'" xm-select="'+val.id+'" xm-select-skin="primary" xm-select-search>'
        for(let optionValue of Object.values(val.options))
        {
            html += ' <option value="'+optionValue.id+'">'+optionValue.name+'</option>'
        } 
        html += '</select>';
        html += ' </div>'
        return html;		
	}

	WytheForm.prototype.getFileHtml = function(val)
	{
        let html = '';
        html += '<div class="layui-form-item">';
        html += ' <label class="layui-form-label">'+val.title+'</label>'
        html += ' <div class="layui-input-inline" style="margin-right:0px;">';
        html += '  <input type="text" name="text_'+val.id+'" class="layui-input" disabled  style="border-radius: 0 0px 0px 0;" />';
        html += ' </div>';
        html += ' <div class="layui-input-inline">';
        html += '  <input type="button" name="file_'+val.id+'" class="layui-btn layui-btn-xm layui-btn" value="'+this.lang.selectFileLang+'" style="border-radius: 0;width:77px;padding:0 3px 3px 0;" />';
        html += ' </div>';
        html += '</div>';
        html += '<input type="file" style="display:none" id="file_'+val.id+'"/>'
        return html;
	}

	WytheForm.prototype.getSubmit = function(val)
	{
        let html = '<div style="margin-left:30px;margin-bottom:35px" id="submitForm">';

        html += '<div class="layui-form-item" id="formSubmit">';
        html += ' <div class="layui-input-block">';
        html += '  <input type="button" class="layui-btn" id="submit" lay-submit lay-filter="submit" value="'+this.lang.submitLang+'"/>';
        html += '  <input type="reset" class="layui-btn" id="reset" value="'+this.lang.resetLang+'"/>';
        html += ' </div>';
        html += '</div>';

        html += '</div>';
        return html;	
	}

    var wytheForm = new WytheForm();

    exports('wytheForm',wytheForm);
});