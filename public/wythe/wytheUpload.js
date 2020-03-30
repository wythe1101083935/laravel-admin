
layui.define(['wytheTable','storage','table','wytheInfo'],function(exports)
{
	var wytheTable = layui.wytheTable,
		storage = layui.storage,
		table = layui.table,
		$ = layui.jquery,
		element = layui.element,
		wytheInfo = layui.wytheInfo;

	var WytheUpload = function()
	{

	}

	WytheUpload.prototype.setConfig = function(option)
	{
		this.config = 
		{
			id:option.id,
			fields:option.fields,
			name:option.name,
			templateUrl:option.templateUrl,
			uploadUrl:option.uploadUrl,
			quotes:option.quotes,
			exportUrl:option.exportUrl,
		} 

		this.lang = option.lang;

		this.storageKey = 'upload_data_'+option.name;
	}

	WytheUpload.prototype.render = function(option)
	{
		this.setConfig(option);

		this.formatterFields();

		let html = '';

		html += this.getToolbarHtml();

		html += this.getTableHtml();

		$('#'+this.config.id).html(html);

		this.formatterCols();

		element.render();

		this.renderTable();

		this.registerEvents();

	}

	WytheUpload.prototype.formatterCols = function()
	{
		this.cols = [];

		this.cols[this.cols.length] = [];

		this.cols[0].push({field:'prompt__index',title:this.lang.indexLang,fixed:'left',width:'70'});

		this.cols[0].push({field:'prompt__status',title:this.lang.statusLang,fixed:'left',width:'90'});

		this.cols[0].push({field:'prompt__msg',title:this.lang.promptLang,fixed:'left',width:'200'});

		for(let fields of Object.values(this.config.fields))
		{
			this.cols[0].push(
				{
					field:fields.table+'__'+fields.name,
					title:fields.title,
					edit:'text',
					type:'normal',
					width:fields.width,
				});
		}
	}

	WytheUpload.prototype.renderTable = function()
	{
		table.render({
          elem: '#upload_table'
          ,height: 500
          ,page: true//开启分页
          ,limit:120
          ,limits:[120,200]
          ,height:'full-60'
          ,cols: this.cols
          ,data: storage.get(this.storageKey) ? storage.get(this.storageKey) : []
		});
	}

	WytheUpload.prototype.formatterFields = function()
	{
		this.cols = [];

		this.cols[this.cols.length] = [];

		for(let fields of Object.values(this.config.fields))
		{
			let col = 
			{
				fields:fields.name,
				title:fields.title,
				type:'normal',
				edit:'text',
			};

			this.cols[0].push(col);
		}
	}

	WytheUpload.prototype.getToolbarHtml = function()
	{
		let html = '<div id="table-tool-bar">';

		html += '<ul class="layui-nav layui-layout-left" lay-filter="table-tool-bar">';

		html += wytheTable.getBtn({name:'select_file',title:this.lang.selectFileLang});

		html += '<form style="display:none"><input type="file" id="upload_hide_input"></form>';

		html += wytheTable.getBtn({name:'start_upload',title:this.lang.startUploadLang});

		html += wytheTable.getBtn({name:'download_model',title:this.lang.downloadModelLang});

		html += '</ul>'

		html += '<ul class="layui-nav layui-layout-right" lay-filer="table-tool-bar-right">';

		html += wytheTable.getBtn({name:'export_tmp',title:this.lang.exportLang});
		html += '</ul>'; 

		html += '</div>';

		return html;		
	}

	WytheUpload.prototype.getTableHtml = function()
	{
		return '<table id="upload_table" lay-filter="upload_table" style="margin-top:60px;"></table>';
	}

	WytheUpload.prototype.registerEvents = function()
	{
		this.registerToolbar();

		this.registerTable();
	}

	WytheUpload.prototype.registerToolbar = function()
	{
		let that = this;

		$('#action_select_file').click(function()
		{
			$('#upload_hide_input').val('');

			$('#upload_hide_input').click();
		});

		$('#upload_hide_input').change(function(e)
		{
			that.getData(e);
		})

		$('#action_start_upload').click(function()
		{
			if(!storage.get(that.storageKey))
			{
				layer.msg(this.lang.notSelectTableLang);
				return;
			}
			
			let data = storage.get(that.storageKey);

			wytheInfo.setProgress(data.length,function(){ that.renderTable(); });

			that.requestTotal = data.length;

			for(let [index,val] of Object.entries(data))
			{
				if(val.prompt__status != undefined && 
					(val.prompt__status == that.lang.successLang || 
						val.prompt__status == '<div style="color:#5FB878">'+that.lang.successLang+'</div>')
					)
				{
					wytheInfo.setProgressTotal(data.length-1);

					continue;
				}

				let sendData = that.formatterRequestData(val);
				setTimeout(function(){},100);
				that.request(index,sendData);
			}

		});

		$('#action_download_model').click(function()
		{
			wytheTable.postSubmit(that.config.templateUrl,{});
		})

		$('#action_export_tmp').click(function(){
			wytheTable.postSubmit(that.config.exportUrl,storage.get(that.storageKey));
		});
	}

	WytheUpload.prototype.request = function(index,sendData)
	{
		let that = this;

		$.ajax(
			{
				url:this.config.uploadUrl,
				type:'post',
				dataType:'json',
				headers:
				{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				},
				data:sendData,
				success(res)
				{
					let data = storage.get(that.storageKey);

					that.setMsgToData(res.status,data,index,res.data.id);

					storage.set(that.storageKey,data);

					wytheInfo.progress(that.requestTotal);
				},
				error(res)
				{
		            let data = storage.get(that.storageKey);

		            let msg = '';

		            if(res.status == 422)
		            {  
		            	msg = that.getValidateMsg(res.responseJSON.errors,sendData);
		            }else if(res.status == 500)
		            {
		              msg = '<div style="color:#FF5722">'+
		              'Message:'+res.responseJSON.message+'<br>'+
		              'File:'+res.responseJSON.file+'<br>'+
		              'Line:'+res.responseJSON.line+'<br>'+
		              '</div>';                     
		            }

		            that.setMsgToData(false,data,index,msg);

		            storage.set(that.storageKey,data); 

		            wytheInfo.progress(that.requestTotal);				
				}
			});	
	}

	WytheUpload.prototype.getValidateMsg = function(msgs,sendData)
	{
		let msg = '';

		for(let val of Object.values(this.config.quotes))
		{
            if(val.type == 'form')
            {
                for(let fields of Object.values(val.fields))
                {
                  if(msgs['formData.'+fields.name] != undefined)
                  {
                  	let msgTmp = fields.title+':'+msgs['formData.'+fields.name][0].replace('The form data.'+fields.name.replace('_',' '),'')+'<br>';
                    msg += msgTmp;
                  }
                }
                
            }

            if(val.type == 'table')
            {
            	let tableData = sendData[val.name];

                for(let [row,v] of Object.entries(tableData))
                {
                    for(let [col,field] of val.fields.entries())
                    {
                      if(msgs[val.name+'.'+row+'.'+field.name] != undefined)
                      {
                      	let msgTmp = 'col:'+parseInt(row+1)+'.'+field.title+':'+msgs[val.name+'.'+row+'.'+field.name][0].replace('The '+val.name+'.'+row+'.'+field.name,'')+'<br>';
                      	msg += msgTmp;
                      }                             
                    }                
                }
            }			
		}

		return msg;
	}

	WytheUpload.prototype.setMsgToData = function(status,data,index,msg)
	{
		if(status)
		{
			data[index].prompt__status = '<div style="color:#5FB878">'+this.lang.successLang+'</div>';
			data[index].prompt__msg = '<div style="color:#5FB878">'+msg+'</div>';			
		}else
		{
			data[index].prompt__status = '<div style="color:#FF5722">'+this.lang.errorLang+'</div>';
			data[index].prompt__msg = '<div style="color:#FF5722">'+msg+'</div>';				
		}
	}

	WytheUpload.prototype.formatterRequestData = function(val)
	{
		let sendData = {};

		sendData.formData = {};

		for(let quote of Object.values(this.config.quotes))
		{
			if(quote.type == 'form')
			{
				for(let fields of Object.values(quote.fields))
				{
					sendData.formData[fields.name] = val[fields.table+'__'+fields.name]
				}				
			}else
			{
				sendData[quote.name] = [];

				for(let fields of Object.values(quote.fields))
				{
					if(val[fields.table+'__'+fields.name] == undefined)
					{
						continue;
					}

					let arr = val[fields.table+'__'+fields.name].replace(/,-、，/,',').split(',');

					if(arr.length < 1)
					{
						continue;
					}

					for(let [index,v] of Object.entries(arr))
					{
						if(sendData[quote.name][index] == undefined)
						{
							sendData[quote.name][sendData[quote.name].length] = {};
						}

						sendData[quote.name][index][fields.name] = v;
					}
				}
			}

		}

		return sendData;
	}

	WytheUpload.prototype.registerTable = function()
	{
		let that = this;

		table.on('edit(upload_table)',function(obj)
		{
			let data = storage.get(that.storageKey);

			let index = obj.data.prompt__index;

			data[index-1][obj.field] = obj.value;

			storage.set(that.storageKey,data);
		})
	}

	WytheUpload.prototype.getData = function(e)
	{
		let that = this;

		handleFile(e,function(sheets)
		{
			if(sheets.sheet1 != undefined)
			{
				that.handleData(sheets.sheet1);
				return;
			}

			if(sheets.winlink != undefined)
			{
				that.handleData(sheets.winlink);
				return;
			}

			layer.msg('{{ trans("action.upload.sheets-error") }}');
		});
	}

	WytheUpload.prototype.handleData = function(data)
	{
		//格式化上传的数据
		data = this.oldOrderUpload(data);
		//数据添加索引
		data = this.setIndex(data);

		storage.set(this.storageKey,data);

		this.renderTable();
	}

	WytheUpload.prototype.oldOrderUpload = function($data)
	{
        for(let val of Object.values($data))
        {
          if(val.TotalWeight !== undefined)
          {
            val.order__product_type = val.product == 'XPS' ? 'XPS':'DOC';
            val.order__service_type = val.ServiceType;
            val.order__client_weight = val.TotalWeight;
            val.order__parcels_num = val.noofpieces;
            val.order__shipper_order_id = val.ShipperRef;
            val.order__inamt = val.Inamt;
            val.order__with_battery = val.WithBattery ? 'YES':'NO';   
            val.order__remarks = val.customnote;
            
            val.order__consignee_company = val.Consignee;
            val.order__consignee_people = val.ConsigneeName;
            val.order__consignee_address = val.ConsigneeAddress1;
            val.order__consignee_country = this.getCountry(val.Destination);
            val.order__consignee_city = val.ConsigneeCity;
            val.order__consignee_tel = val. ConsigneeTel;
            val.order__consignee_phone = val.ConsigneePhone;
            val.order__consignee_postcode = val.Zipcode;

            val.order__shipper_address_id = val.Origin == 'CZX' ? 'China' : 'Dubai Warehouse';
            val.goods__weight = val.weights;
            val.goods__en_name = val.GoodsDesc;
            val.order_goods__number = val.PCS;
            val.goods__insvalue = ValueOfShipment;
            val.goods__id = val.Description;
            val.goods__hscode = val['Retail Code'];
          }
        }
        return $data;
	}

	WytheUpload.prototype.setIndex = function(data)
	{
        let i = 1;

        for(let val of Object.values(data))
        {
          val.prompt__index = i;
          i++;
        }

        return data;		
	}

	var wytheUpload = new WytheUpload();

	exports('wytheUpload',wytheUpload);

})