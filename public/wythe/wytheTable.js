
layui.define(['form','table','element','laydate','jquery','wytheInfo','upload'],function(exports)
{
	var table = layui.table,
		form = layui.form,
		element = layui.element,
		laydate = layui.laydate,
		wytheInfo = layui.wytheInfo,
		upload = layui.upload,
		$ = layui.jquery;

	var  defaultLang =
	{
		"exportLang": {
			"title": "\u5bfc\u51fa",
					"all": "\u5bfc\u51fa\u5168\u90e8",
					"select": "\u5bfc\u51fa\u9009\u4e2d",
					"page": "\u5bfc\u51fa\u672c\u9875"
		},
		"searchLang": "\u641c\u7d22",
				"advancedLang": "\u9ad8\u7ea7\u641c\u7d22",
				"confirmLang": "\u786e\u8ba4",
				"resetLang": "\u91cd\u7f6e",
				"leastOneLang": "\u8bf7\u81f3\u5c11\u9009\u4e2d\u4e00\u6761\uff01",
				"selectOneLang": "\u8bf7\u53ea\u9009\u62e9\u4e00\u6761\uff01",
				"actionListLang": "\u64cd\u4f5c",
				"confirmPromptLang": "\u786e\u5b9a\u6267\u884c\u5417\uff1f\u6267\u884c\u540e\u4e0d\u53ef\u64a4\u9500\uff01"
	}

	var WytheTable = function()
	{
		this.tableRender = 
		{
	        elem: '#table',
	        method:'post',
	        autoSort:false,
	        headers:{
	          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
	        where:
	        {
	          keywordsField:'',
	          keywordsValues:'',
	      	  sort_field:'',
	      	  sort_order:'',
	          where:{},
	        },
	        request:{pageNme:'page',limitName:'pageSize'},
	        height: 'full-91',
	        url:'', //数据接口
	        page: true, //开启分页
	        limit:20,
	        limits:[20,50,100,500],
	        parseData(res)
	        {
	            return {
	              "code": 0,
	              "msg": "Success",
	              "count": res.count,
	              "data": res.data
	            };                
	        },
	        cols:[]	
		};
	}

	WytheTable.prototype.setConfig = function(option)
	{
		this.id = option.id;

		this.fields = option.fields;

		this.modelName = option.modelName;

		this.actions = option.actions;

		this.search = option.search;

		this.keywords = option.keywords;

		this.modelType = 'table';

		this.url = option.url;

		this.exportSign = option.exportSign;

		this.exportUrl = option.exportUrl;


		if(option.lang == undefined || !option.lang)
		{
			this.lang = defaultLang;
		}else
		{
			this.lang = option.lang;
		}

		this.searchHtml = '';

		this.searchSwitch = false;

		this.searchIndex = 0;

		this.tableRender.where.sort_field = option.orderBy.field;

		this.tableRender.where.sort_order = option.orderBy.order;

		return this;
	}

	WytheTable.prototype.render = function(option)
	{
		$('body').css('overflow','hidden');
		this.setConfig(option);

		//设置html
		let html = '';

		html += this.getToolbar();

		html += this.getTable();

		this.searchHtml =  this.search.length > 0 ?  this.getFormHtml(this.search,'advanced_search'): '';;

		$('#'+this.id).html(html);

		//格式化表格数据
		this.tableRender.cols.push([]);

		this.tableRender.cols[0].push({type:'checkbox',fixed:'left'});

		for(let fields of Object.values(this.fields))
		{
			if(this.mainTable == undefined)
			{
				this.mainTable = fields.table;
			}

			this.tableRender.cols[0].push(this.createHeadFields(fields));
		}

		let linkAction = [];
		for(let action of Object.values(this.actions))
		{
			if(action.link != undefined && action.link)
			{
				linkAction.push(action);
			}
		}
		this.actionTemplate(linkAction);

		if(this.actionHead != undefined)
		{
			this.tableRender.cols[0].push(this.actionHead);
		}

		this.tableRender.url = this.url;

		//渲染
		element.render();

		form.render();

		this.tableRendered();

		//注册事件
		this.registerEvents();

		return this;
	}

	WytheTable.prototype.tableRendered = function()
	{
		this.assignTableRender();

		this.tableRender.page = {curr:1};
		if(this.table != undefined)
		{
			this.table.reload(this.tableRender);
		}else
		{
			this.table = table.render(this.tableRender);
		}

	}

	//创建表头
	WytheTable.prototype.createHeadFields = function(fields)
	{
		let tmp = {};

		tmp.field = fields.table+'__'+fields.name;

		tmp.type = 'normal';

		tmp.width = fields.width;

		tmp.title = fields.title;

		if(fields.type == 'file')
		{
			tmp.templet = this.createFileTemplate(fields);
		}

		if(fields.type == 'templet')
		{
			tmp.templet = fields.templet(fields);
			if(fields.register != undefined)
			{
				fields.register();
			}
		}

		if(fields.sort)
		{
			tmp.sort = true;
		}

		if(fields.table == 'order' && fields.name =='id')
		{
			tmp.fixed = 'left';
		}


		return tmp;
	}

	WytheTable.prototype.actionTemplate = function(actions)
	{
		let that = this;

		if(!actions.length)
		{
			return;
		}

		this.actionHead = {field:'action_field_wythe',templet:that.createActionTemplate(actions),width:actions.length*100,title:'操作'};

	}

	WytheTable.prototype.createFileTemplate = function(fields)
	{
		return function(d)
		{
			if(d[fields.table+'__'+fields.name] != '')
			{
				return '<a class="layui-btn layui-btn-xs" download="'+fields.title+d.id+'" href="/'+d[fields.table+'__'+fields.name]+'">'+fields.title+'</a>' ;
			}else
			{
				return '';
			}
		}
	}

	WytheTable.prototype.createActionTemplate = function(actions)
	{
		let that = this;
		return function(d)
		{
			let html = '';
			for(let action of Object.values(actions))
			{
				html += that.createActionTemplateContent(action,d)
			}
			return html;
		}
	}

	WytheTable.prototype.createActionTemplateContent = function(action,d)
	{
		let that = this;
		let name = action.name+'_wythe_'+ d.LAY_INDEX;
		window[name] = function()
		{
			let index = layer.open(
				{
					title: action.title,
					type: 2,
					maxmin:true,
					area:['600px','400px'],
					content: action.url + '/' + d[that.mainTable+'__id']
				});
		}

		return '<button class="layui-btn layui-btn-sm" onclick="'+name+'()">'+action.title+'</button>';
	}

	WytheTable.prototype.assignTableRender = function()
	{
		this.tableRender.where.keywordsField = $('#keywordsField').val();

		this.tableRender.where.keywordsValues = $('#keywordsValue').val();	
	}

	WytheTable.prototype.getToolbar = function()
	{
		let html = '<div id="table-tool-bar">';

		html += this.getLeftToolbar();

		html += this.getSearchToolbar();

		html += this.getRightToolbar();

		html += '</div>';

		return html;
	}

	WytheTable.prototype.getTable = function()
	{
		return '<table id="table" lay-filter="table" style="margin-top:60px"></table>';
	}

	WytheTable.prototype.getLeftToolbar = function()
	{
		let html = '<ul class="layui-nav layui-layout-left" lay-filter="table-tool-bar">';

		//html += this.getSearchFirst();

		for(let [key,val] of Object.entries(this.actions))
		{
			if(key >= 3) break;

			html += this.getBtn(val);
		}

		let actionList = this.actions.slice(3);

		if(actionList.length > 0)
		{
			html += this.getBtn({name:'actionList',title:this.lang.actionListLang,childs:actionList});
		}

		html += '</ul>';

		return html;	
	}

	WytheTable.prototype.getSearchToolbar = function()
	{
		let html = '';

		if(this.keywords.length > 0)
		{
			html += '<form class="layui-layout-left layui-form" style="left:250px;height:40px;">'
			html += '<div class="layui-form-item keywords">';
			html += '<div class="layui-inline">';
			html += '<div class="layui-input-inline">';
			html += ' <select lay-search id="keywordsField" lay-filter="keywordsField">'
			for(let val of Object.values(this.keywords))
			{
				html += '<option value="'+val.table+'.'+val.name+'" >'+val.title+'</option>';
			}
			html += '</select>';
			html += '</div>';
			html += '</div>';
			html += '<div class="layui-inline">';
			html +='<div class="layui-input-inline">'
			html +='<textarea id="keywordsValue"  style="min-height:38px;height:38px;max-height:38px;" placeholder="Search" class="layui-textarea"></textarea>'
			html += '</div>'
			html += '</div>'
			html += '</div>'
			html +='</form>';
		}

		return html;
	}

	WytheTable.prototype.getRightToolbar = function()
	{
		let html = '';

		html += '<ul class="layui-nav layui-layout-right" lay-filer="table-tool-bar-right">';

		if(this.search.length > 0)
		{
			html += this.getSearchBtn();
		}
		html += this.getExport();

		html += this.getSearchLast();

		html += '</ul>';

		return html;
	}

	WytheTable.prototype.getSearchFirst = function()
	{
		return this.getBtn({name:'searchFirst',title:this.lang.searchLang});
	}

	WytheTable.prototype.getSearchLast = function()
	{
		return this.getBtn({name:'searchLast',title:this.lang.searchLang});
	}

	WytheTable.prototype.getSearchBtn = function()
	{
		return this.getBtn({name:'advanced',title:this.lang.advancedLang});
	}

	WytheTable.prototype.getExport = function()
	{
	  if(this.exportSign == undefined || !this.exportSign)
	  {
		return '';
	  }
      let exp = 
      {
        name:'export',
        title:this.lang.exportLang.title,
        childs:
        [
          {
            name:'export.all',
            title:this.lang.exportLang.all  
          },
          {
            name:'export.select',
            title:this.lang.exportLang.select
          },
          {
            name:'export.page',
            title:this.lang.exportLang.page
          }
        ]

      };

      return this.getBtn(exp);		
	}


	WytheTable.prototype.getBtn = function(val)
	{
		if(val.link != undefined && val.link)
		{
			return '';
		}

		let html = '<li class="layui-nav-item"><a id="action_'+val.name+'" href="javascript:;">'+val.title+'</a>';

		if(val.childs != undefined && val.childs.length > 0)
		{
			html += '<dl class="layui-nav-child">';

		 	for(let v of Object.values(val.childs))
		  	{
		  		this.formatterAction(v);

		    	html += '<dd><a href="javascript:;" id="action_'+v.name.replace(/\./g,'_')+'">'+v.title;

		    	html += '</a></dd>';
		  	}

			html += '</dl>';
		}

		html += '</li>';

		this.formatterAction(val);

		return html;
	}

	WytheTable.prototype.formatterAction = function(val)
	{
		if(val.type == 'open_content_request')
		{
			val.formId = val.name.replace('.','_')+'form';

			val.html = this.getFormHtml(val.fields,val.formId);
		}
	}

	WytheTable.prototype.getFormHtml = function(fieldsList,formId)
	{
		let html = '';

		html += '<form class="layui-form advanced" id="'+formId+'">'

		html += '<div class="layui-form-item">'

		for(let fields of Object.values(fieldsList))
		{
			html += '<div class="layui-input-inline layui-col-xs6 layui-col-sm6 layui-col-md4">'

			if(fields.type == 'select')
			{
				html += this.getSelectHtml(fields);
			}else
			{
				html += this.getTextHtml(fields);
			}
			html += '</div>';
		}

		html += '</div>';
		html += '</form>'

		return html;
	}

	WytheTable.prototype.getTextHtml = function(val)
	{
      let html = '';
      html += '  <input type="text" style="margin-left:10px;margin-bottom:10px;" placeholder="'+val.title+'" class="layui-input searchField"  name="'+val.name+'">'
      return html;		
	}

	WytheTable.prototype.getSelectHtml = function(val)
	{
      let html = '';
      html += ' <select lay-search class="searchField" name="'+val.name+'"   lay-filter="'+val.name+'">'
      html += '<option value="" selected>'+val.title+'</option>';

      for(let optionValue of Object.values(val.options))
      {
        html += ' <option value="'+optionValue.id+'">'+optionValue.name+'</option>'
      }                      
      html += '</select>'; 
      return html;
	}


	WytheTable.prototype.registerEvents = function()
	{
		this.registerTableSort();

		this.registerToolbarEvents();

		this.registerKeywordsEvents();
	}

	WytheTable.prototype.registerTableSort = function()
	{
		let that = this;
		//监听排序事件 
		table.on('sort(table)', function(obj){ 
		 
		  that.tableRender.where.sort_field = obj.field;

		  that.tableRender.where.sort_order = obj.type;

		  that.tableRendered();
		  
		});		

	}

	WytheTable.prototype.registerToolbarEvents = function()
	{
		for(let action of Object.values(this.actions))
		{
			this. registerAction(action);
		}

		this.registerDefaultToolbar();
	}

	WytheTable.prototype.registerKeywordsEvents = function()
	{
      let that = this;
      $('#keywordsValue').on('keydown',function(e)
        {
          if(e.keyCode == 13)
          {
            that.tableRendered();
          }
        });		
	}

	WytheTable.prototype.registerDefaultToolbar = function()
	{
		let that = this;

		this.registerSearchEvents();

		$('#action_searchFirst').click(function()
		{
			that.tableRendered();
		})
		$('#action_searchLast').click(function()
		{
			that.tableRendered();
		})
		$('#action_export_all').click(function(e)
		{
			that.exportAll();
		})
		$('#action_export_select').click(function(e)
		{
			that.exportSelect();
		})
		$('#action_export_page').click(function(e)
		{
			that.exportPage();
		})		
	}
	WytheTable.prototype.registerSearchEvents = function()
	{
		let that = this;
		$('#action_advanced').click(function()
		{
			if(!that.searchSwitch)
			{
				that.openSearch();
			}else
			{
				that.closeSearch();
			}
		});
	}

	WytheTable.prototype.openSearch = function()
	{
		let that = this;

		if(this.searchIndex === 0)
		{
			this.searchIndex = layer.open(
			{
				title:that.lang.searchLang,
				content:that.searchHtml,
				shade:0,
				anim:3,
				skin:'wythe-content-visible',
				offset:'r',
				zIndex:333,
				area:['270px','500px'],
				btn:[that.lang.confirmLang,that.lang.resetLang],
				success()
				{
					form.render();

					that.registerAdvancedForm();

					form.render();
				},
				yes()
				{
					that.tableRendered();

					return false;
				},
				btn2()
				{
					that.tableRender.where.where = {};

					$('#advanced_search').get(0).reset();

					return false;
				},
				cancel()
				{
					that.closeSearch();

					return false;
				}

			});


		}else
		{
			layer.restore(this.searchIndex);
		}

		this.searchSwitch = true;
	}

	WytheTable.prototype.closeSearch = function()
	{
		layer.close(this.searchIndex);

		this.searchIndex = 0;

		this.searchSwitch = false;
	}

	WytheTable.prototype.registerAdvancedForm = function()
	{
		for(let fields of Object.values(this.search))
		{
			if(this.tableRender.where.where[fields.table+'.'+fields.name] != undefined)
			{
				$('[name='+fields.name+']').val(this.tableRender.where.where[fields.table+'.'+fields.name]);
			}

			this.registerAdvancedFields(fields);
		}
	}

	WytheTable.prototype.registerAdvancedFields = function(val)
	{
      let that = this;
      if(val.type == 'datetime')
      {
      	laydate.render(
      		{
	          elem:'[name='+val.name+']',
	          type:'datetime',
	          range:'~',
	          position:'fixed',     
	          done(v)
	          {
	          	that.tableRender.where.where[val.table+'.'+val.name] = v;
	          }			
      		});
      }else if(val.type == 'select')
      {
      	form.on('select('+val.name+')',function(data)
      	{
      		that.tableRender.where.where[val.table+'.'+val.name] = data.value;
      	})
      }else
      {
      	$('[name='+val.name+']').blur(function()
  		{
  			that.tableRender.where.where[val.table+'.'+val.name] = $(this).val();
  		});
      }
	}


	WytheTable.prototype.registerAction = function(action)
	{
		if(action.childs != undefined && action.childs.length > 0)
		{
			for(let act of Object.values(action.childs))
			{
				this.registerAction(act);
			}
		}else
		{
			let that = this;

			$('#action_'+action.name.replace(/\./g,'_')).click(function()
			{
				that.actionResponse(action);
			})
		}
	}

	WytheTable.prototype.actionResponse = function(action)
	{
		switch(action.type)
		{
			case 'open':
				this.openWindow(action);
				break;
			case 'open_with_one':
				this.openWithOneRow(action);
				break;
			case 'open_content_request':
				this.openContent(action);
				break;
			case 'multi_upload':
				this.multiUpload(action);
				break;
			case 'request_with_one':
				this.requestDataWithOne(action);
				break;
			case 'request':
				if(action.name.startsWith('print'))
				{
					this.formSubmit(action);
				}else if(action.name == 'delete')
				{
					this.confirmRequestData(action);
				}else
				{
					this.requestData(action);
				}
				break;
		}
	}

	WytheTable.prototype.openWindow = function(action)
	{
		let that = this;

		let index = layer.open(
			{
				title:action.title,
				type:2,
				maxmin:true,
				area:['600px','400px'],
				content:action.url,
				success()
				{
					//layer.full(index);
				}
			});

		//$(window).resize(function(){ layer.full(index)});
	}

	WytheTable.prototype.multiUpload = function(action)
	{

		let id = 'wythe-multi-upload-'+action.name.replace('.','-');
		if($('#'+id).length <1)
		{
			let msg = '';
			let btn = $('<button type="button"  style="display:none" id="'+id+'"></button>')
			$('#'+this.id).append(btn);
			upload.render({
				elem: '#'+id //绑定元素
				,accept:'file'
				,url: action.url //上传接口
				,headers:{
							'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
						}
				,multiple: true
				,done: function(res)
				{
					msg += res.msg+'<br>';
				}
				,allDone()
				{
					layer.open({content:msg});
				}
				,error: function(){

				}
			});
		}
		$('#'+id).click();
	}

	WytheTable.prototype.openContent = function(action)
	{
		let that = this;

		let data = this.getTableSelectData();

		if(data.length < 1)
		{
        	layer.msg(this.lang.leastOneLang);

        	return;
		}

		let index = layer.open(
			{
				title:action.title,
				content:action.html,
				shade:0,
				anim:3,
				skin:'wythe-content-visible',
				area:['260px','400px'],
				success()
				{
					form.render();
					for(let fields of Object.values(action.fields))
					{
						if(fields.type == 'datetime')
						{
							laydate.render(
									{
										elem:'[name='+fields.name+']',
										type:'datetime',
										position:'fixed'
									});
						}
					}
				},
				yes()
				{
					let formData = $('#'+action.formId).serializeArray();

					let sendData = {};

					for(let val of Object.values(formData))
					{
						sendData[val.name] = val.value;
					}

					sendData.data = data;

					if(action.returnType != undefined && action.returnType == 'submitForm')
					{
						that.postSubmit(action.requestUrl,sendData);
					}else
					{
						$.ajax(
						{
							url:action.requestUrl,
							type:'post',
							dataType:'json',
							headers:
							{
								'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
							},
							data:sendData,
							success(res)
							{
								wytheInfo.displayNormal(res);
							},
							error(res)
							{
								wytheInfo.displayException(res);
							}
						})
					}

					return false;
				}
			});
	}

	WytheTable.prototype.openWithOneRow = function(action)
	{
		let that = this;

		let data = this.getTableSelectData();

		if(data.length != 1)
		{
			layer.msg(this.lang.selectOneLang);
			return;
		}	

		let index = layer.open(
			{
				title:action.title,
				type:2,
				maxmin:true,
				area:['600px','400px'],
				content:action.url+'/'+data[0],
				success()
				{
					//layer.full(index);
				}
			});	

		//$(window).resize(function(){ layer.full(index)});
	}

	WytheTable.prototype.formSubmit = function(action)
	{
		let data = this.getTableSelectData();

		if(data.length < 1)
		{
			layer.msg(this.lang.leastOneLang);
			return;
		} 

  		this.postSubmit(action.url,data);
	}

	WytheTable.prototype.getSubmit = function(url,data)
	{
		this.virtualFormSubmit(url,data,'get');
	}

	WytheTable.prototype.postSubmit = function(url,data)
	{
		this.virtualFormSubmit(url,data,'post');
	}

	WytheTable.prototype.virtualFormSubmit = function(url,data,type)
	{
		let form = $('<form style="display:none" id="submit_virtual_form"></form>');

		let input1 = $('<input type="hidden" name="jsonData">');

		input1.val(JSON.stringify(data));

		let input2 = $('<input type="hidden" name="_token">');

		input2.val($('meta[name="csrf-token"]').attr('content'));

		form.append(input1);form.append(input2);

		form.attr('action',url);

		form.attr('method',type);

		if(url != '/logout')
		{
			form.attr('target','_blank');
		}

		$('body').append(form);

		form.submit();

		form.remove();
	}

	WytheTable.prototype.requestDataWithOne = function(action)
	{
		let data = this.getTableSelectData();

		if(data.length != 1)
		{
			layer.msg(this.lang.selectOneLang);
			return;
		}

		this.requestCore(action.url,data);
	}

	WytheTable.prototype.requestData = function(action)
	{
		let data = this.getTableSelectData();

		if(data.length < 1)
		{
			layer.msg(this.lang.leastOneLang);
			return;
		} 	

		this.requestCore(action.url,data);
	}



	WytheTable.prototype.confirmRequestData = function(action)
	{
		let that = this;

		let data = this.getTableSelectData();

		if(data.length < 1)
		{
			layer.msg(this.lang.leastOneLang);
			return;
		}

		layer.confirm(this.lang.confirmPromptLang,function()
		{
			that.requestCore(action.url,data);
		})
	}

	WytheTable.prototype.requestCore = function(url,data)
	{
		$.ajax(
		{
			url:url,
			type:'post',
			dataType:'json',
			headers:
			{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			data:{data:data},
			success(res)
			{
				wytheInfo.displayNormal(res);
			},
			error(res)
			{
				wytheInfo.displayException(res);
			}
		});			
	}

	WytheTable.prototype.getTableSelectData = function()
	{
		let data = [];

	    for(let item of Object.values(table.checkStatus(this.table.config.id).data))
	    {
	        data.push(item[this.mainTable+'__id']);
	    }

		return data;
	}

	WytheTable.prototype.exportAll = function()
	{
		this.export(this.getTableParam());
	}

	WytheTable.prototype.exportSelect = function()
	{
		let data = this.getTableSelectData();

		if(data.length < 1)
		{
			layer.msg(this.lang.leastOneLang);

			return;
		}

		let param = this.getTableParam();

		let field = this.fields[0];

		param.keywordsField = field.table+'.'+field.name;

		param.keywordsValues = data;

		this.export(param);
	}

	WytheTable.prototype.exportPage = function()
	{
		let param = this.getTableParam();

		param.page = this.table.config.page.curr;

		param.pageSize = this.table.config.page.limit;

		this.export(param);
	}

	WytheTable.prototype.getTableParam = function()
	{
		let data = this.tableRender.where;

		data.page = 1;

		data.pageSize = 3000;

		return data;
	}

	WytheTable.prototype.export = function(param)
	{
      this.postSubmit(this.exportUrl,param);
	}

    var wytheTable = new WytheTable();

    exports('wytheTable',wytheTable);
})