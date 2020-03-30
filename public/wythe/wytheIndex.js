/**
 * Created by root on 2019/10/7.
 */
layui.define(['layer','element','jquery','wytheTable'],function(exports)
{
    var layer = layui.layer,
        element = layui.element,
        wytheTable = layui.wytheTable,
        $ = layui.jquery;

    var WytheIndex = function()
    {
        this.tabs = [];

        this.nowTab = 0;
    }

    WytheIndex.prototype.setConfig = function(option)
    {
        this.id = option.id;

        this.menus = option.menus;

        this.lang = option.lang;
    }

    /*初始化*/
    WytheIndex.prototype.render = function(option)
    {
        this.setConfig(option);

        $('#'+this.id).html(this.getHtml());

        element.render();

        this.registerEvents();
    }

    WytheIndex.prototype.getHtml = function()
    {
        let html = '';

        html += this.getHeadHtml();

        html += this.getMenusHtml();

        html += this.getTabsHtml();

        html += this.getFootHtml();

        return html;
    }

    WytheIndex.prototype.getHeadHtml = function()
    {
        let html = '';
        html += '<div class="layui-header header" style="background-color:#393D49">';
        html +=     '<div class="layui-main">';
        html +=     '<a href="#" class="logo">'+this.lang.appname+'</a>';
        html +=     '<a href="javascript:;" class="iconfont icon-suoyou hideMenu"></a>';
        html +=     '<ul class="layui-nav top_menu">';
        html +=         '<li class="layui-nav-item" mobile>';
        html +=             '<a class="signOut"><i class="iconfont"></i>'+this.lang.logoutLang+'</a>';
        html +=         '</li>';
        html +=         '<li class="layui-nav-item" pc>';
        html +=             '<a href="javascript:;">';
        html +=                 '<img src="'+this.lang.applogo+'" class="layui-circle" width="35" height="35">';
        html +=                 '<cite>'+this.lang.username+'</cite>';
        html +=             '</a>';
        html +=             '<dl class="layui-nav-child">';
        html +=                 '<dd><a href="javascript:;" data-url="javascript:;" id="switchLang"><i class="iconfont" data-icon="icon-zhanghu"></i><cite>'+this.lang.switchLang+'</cite></a></dd>';
        html +=                 '<dd id="changePass"><a href="javascript:;" data-url="javascript:;"><i class="iconfont" data-icon="icon-zhanghu"></i><cite>'+this.lang.changePassLang+'</cite></a></dd>';
        html +=                 '<dd><a href="javascript:;" class="signOut"><i class="iconfont"></i><cite>'+this.lang.logoutLang+'</cite></a></dd>';
        html +=             '</dl>';
        html +=         '</li>';
        html +=     '</ul>';
        html +=     '</div>';
        html += '</div>';

        return html;
    }

    WytheIndex.prototype.getMenusHtml = function()
    {
        let html = '<div class="layui-side layui-bg-black" style="overflow-y: hidden;">';
        html += '<div class="navBar layui-side-scroll">';
        html += '<ul class="layui-nav layui-nav-tree">';
        html += this.setHead();
        for (var i = 0; i < this.menus.length; i++)
        {
            html += this.setNavbarItem(this.menus[i],i);
        }
        html +=   '<span class="layui-nav-bar" style="top: 157.5px; height: 0px; opacity: 0;"></span>'
        html +=  '</ul>';
        html += '</div>';
        html += '</div>';
        return html;

    }

    WytheIndex.prototype.setHead = function()
    {
        let head = {id:0,pid:0,name:"index",title:this.lang.homeLang,icon:"icon-computer",url:"javascript:;"};
        return this.setNavbarItem(head);
    }

    WytheIndex.prototype.setNavbarItem = function(menu,index)
    {
        let html = '<li class="layui-nav-item" style="">';
        html +=        '<a href="javascript:;" data-url="'+menu.url+'" data-name="'+menu.name+'">'
        html +=          '<i class="iconfont '+menu.icon+'"></i>'
        html +=          '<cite>'+menu.title+'</cite>'
        html +=        '</a>'

        if(menu.menu_items != undefined && menu.menu_items.length > 0)
        {
            html += '<dl class="layui-nav-child">'
            for (let i = 0; i < menu.menu_items.length; i++) {
                html+=    '<dd>'
                html+=        '<a href="javascript:;" data-parent="'+index+'" data-id="'+i+'">',
                    html+=        '<i class="iconfont '+menu.menu_items[i].icon+'"></i>'
                html+=            '<cite>'+menu.menu_items[i].title+'</cite>'
                html+=        '</a>'
                html+=    '</dd>'
            }
            html += '</dl>'
        }
        html +=    '</li>'

        return html;
    }

    WytheIndex.prototype.getTabsHtml = function()
    {
        let html = '';
        html += '<div class="layui-body layui-form" style="overflow:hidden">';
        html +=     '<div class="layui-tab marg0" lay-filter="bodyTab" id="top_tabs_box">';
        html +=         '<ul class="layui-tab-title top_tab" id="top_tabs">';
        html +=             '<li class="layui-this" lay-id="0"><i class="iconfont"></i> <cite>'+this.lang.homeLang+'</cite></li>';
        html +=         '</ul>';
        html +=         '<ul class="layui-nav closeBox">';
        html +=             '<li class="layui-nav-item">';
        html +=                 '<a href="javascript:;"><i class="iconfont"></i>'+this.lang.tabActionLang+'</a>';
        html +=                 '<dl class="layui-nav-child">';
        html +=                     '<dd><a href="javascript:;" class="refresh refreshThis"><i class="iconfont "></i>'+this.lang.refreshThisLang+'</a></dd>';
        html +=                     '<dd><a href="javascript:;" class="closePageOther"><i class="iconfont"></i>'+this.lang.closeOthersLang+'</a></dd>';
        html +=                     '<dd><a href="javascript:;" class="closePageAll"><i class="iconfont"></i>'+this.lang.closeAllLang+'</a></dd>';
        html +=                 '</dl>';
        html +=             '</li>';
        html +=         '</ul>';
        html +=         '<div class="layui-tab-content clildFrame">';
        html +=             '<div class="layui-tab-item layui-show">';
        html +=                 '<iframe src="/homepage"></iframe>';
        html +=             '</div>';
        html +=         '</div>';
        html +=     '</div>';
        html += '</div>';

        return html;
    }

    WytheIndex.prototype.getFootHtml = function()
    {
        let html = '<div class="layui-footer footer" id="foot" style="text-align:left">';

        html += '</div>';

        return html;
    }

    WytheIndex.prototype.registerEvents = function()
    {
        let that = this;
        $(".hideMenu").click(function(){
            $(".layui-layout-admin").toggleClass("showMenu");
            //渲染顶部窗口
            that.registerTabMove();
        });

        this.registerMenu();

        this.registerHeadAction();

        this.registerTabAction();
    }

    WytheIndex.prototype.registerMenu = function()
    {
        let that = this;
        $(".navBar").on("click",".layui-nav .layui-nav-item a",function(){
            //如果不存在子级
            if($(this).siblings().length == 0)
            {
                let index = $(this).data('parent');

                let id = $(this).data('id');

                that.openTab(index,id);

                $('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
            }
        });

        this.registerDeleteTab();

        this.registerTabChange();
    }

    WytheIndex.prototype.openTab = function(index,id)
    {
        let layid = index+'__'+id;

        if(!this.tabs.includes(layid))
        {
            this.tabs.push(layid);

            let menu = this.menus[index].menu_items[id];

            let title = '<cite>'+menu.title+'</cite>';

            title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="'+layid+'">&#x1006;</i>';

            element.tabAdd('bodyTab', {
                title: title
                ,content: "<iframe src='"+menu.url+"' data-id='"+layid+"'></frame>"
                ,id:layid
            });

            this.registerTabMove();
        }

        element.tabChange('bodyTab',layid);

        this.nowTab = layid;
    }

    WytheIndex.prototype.registerTabChange = function()
    {
        let that = this;
        element.on('tab(bodyTab)', function(data)
        {
            let layId = $(this).attr('lay-id');

            let arr = layId.split('__');

            let index = arr[0],id = arr[1];

            if(that.menus[index] != undefined && that.menus[index].menu_items[id] != undefined)
            {
                $('#foot').html(that.menus[index].title+' '+that.menus[index].menu_items[id].title);
            }else
            {
                $('#foot').html('');
            }
        });
    }

    WytheIndex.prototype.registerDeleteTab = function()
    {
        let that = this;
        $("body").on("click",".top_tab li i.layui-tab-close",function(){
            let layid = $(this).data('id');
            element.tabDelete('bodyTab',layid);
            that.tabs.splice(that.tabs.indexOf(layid),1);
        })
    }

    WytheIndex.prototype.registerHeadAction = function()
    {
        this.registerChangePass();

        this.registerLogOut();

        this.registerSwitchLang();
    }

    WytheIndex.prototype.registerChangePass = function()
    {
        let that = this;
        $('#changePass').click(function()
        {
            let html = '<div style="padding:10px;margin-top:20px;">'+
                '<div class="layui-form-item">'
                +'  <label class="layui-form-label">'+that.lang.oldpasswordLang+'</label>'
        +'  <div class="layui-input-inline">'
        +'    <input type="password" id="oldpassword" required lay-verify="required"  autocomplete="off" class="layui-input">'
        +'  </div>'
        +'</div>'
            html +=
                '<div class="layui-form-item">'
                +'  <label class="layui-form-label">'+that.lang.newpasswordLang+'</label>'
        +'  <div class="layui-input-inline">'
        +'    <input type="password" id="newpassword" required lay-verify="required"  autocomplete="off" class="layui-input">'
        +'  </div>'
        +'</div>'
            html +=
                '<div class="layui-form-item">'
                +'  <label class="layui-form-label">'+that.lang.newpasswordConfirmLang+'</label>'
        +'  <div class="layui-input-inline">'
        +'    <input type="password" id="newpassword_confirm" required lay-verify="required" autocomplete="off" class="layui-input">'
        +'  </div>'
        +'</div>'
            html += '</div>'
            layer.open(
                {
                    title:that.lang.changePassLang,
                    type:1,
                    area:['370px','300px'],
                    btn:[that.lang.confirmLang],
                    content:html,
                    yes(index)
                    {
                        let oldpassword = $('#oldpassword').val();
                        let newpassword = $('#newpassword').val();
                        let newpassword_confirmation = $('#newpassword_confirm').val();
                        $.ajax(
                        {
                            url:"/repass",
                            type:'post',
                            dataType:'json',
                            headers:
                            {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            },
                            data:{oldpassword,newpassword,newpassword_confirmation},
                            success(res)
                            {
                                layer.msg(res.msg);
                                if(res.status)
                                {
                                    layer.close(index);
                                }
                            },
                            error(res)
                            {
                                if(res.status == 422)
                                {
                                    let msgs = res.responseJSON.errors;
                                    for(let value of Object.values(msgs))
                                    {
                                        layer.msg(value[0]);
                                        break;
                                    }
                                }else
                                {
                                    let res = res.responseJSON;
                                    layer.open(
                                        {
                                            title:'message',
                                            content:'<div><h5>'+that.lang.systemErrorLang+'</h5>'+
                                '  <div>message:'+res.message+'</div>'+
                                '  <div>file:'+res.file+'</div>'+
                                '  <div>line:'+res.line+'</div>'+
                                '</div>'
                                });
                                }
                            }
                         });
                    }
                });
        });
    }

    WytheIndex.prototype.registerLogOut = function()
    {
        let that = this;
        //退出
        $(".signOut").click(function(){
            wytheTable.postSubmit('/logout',[]);
        })
    }

    WytheIndex.prototype.registerSwitchLang = function()
    {
        let that = this;
        $('#switchLang').click(function()
        {
            $.ajax(
                {
                    url:'/lang',
                    type:'get',
                    success(res)
                    {
                        window.location.reload();
                    }
            });
        });
    }

    WytheIndex.prototype.registerTabAction = function()
    {
        this.registerRefresh();

        this.registerCloseOtheres();

        this.registerCloseAll();
    }

    WytheIndex.prototype.registerRefresh = function()
    {
        $(".refresh").on("click",function(){
            $(".clildFrame .layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload(true);
        })
    }

    WytheIndex.prototype.registerCloseOtheres = function()
    {
        let that = this;
        $(".closePageOther").on("click",function(){

            let layid = $(".clildFrame .layui-tab-item.layui-show").find("iframe").data('id');

            for(let val of Object.values(that.tabs))
            {
                if(val != layid)
                {
                    element.tabDelete('bodyTab',val);
                }
            }

            that.tabs = [layid];
            that.registerTabMove();
        });
    }

    WytheIndex.prototype.registerCloseAll = function()
    {
        let that = this;
        $(".closePageAll").on("click",function(){
            for(let val of Object.values(that.tabs))
            {
                element.tabDelete('bodyTab',val);
            }
            that.tabs = [];
            that.registerTabMove();
        })
    }

    WytheIndex.prototype.registerTabMove = function()
    {
        $(window).on("resize",function(){
            var topTabsBox = $("#top_tabs_box"),
                topTabsBoxWidth = $("#top_tabs_box").width(),
                topTabs = $("#top_tabs"),
                topTabsWidth = $("#top_tabs").width(),
                tabLi = topTabs.find("li.layui-this"),
                top_tabs = document.getElementById("top_tabs");;

            if(topTabsWidth > topTabsBoxWidth){
                if(tabLi.position().left > topTabsBoxWidth || tabLi.position().left+topTabsBoxWidth > topTabsWidth){
                    topTabs.css("left",topTabsBoxWidth-topTabsWidth);
                }else{
                    topTabs.css("left",-tabLi.position().left);
                }
                //拖动效果
                var flag = false;
                var cur = {
                    x:0,
                    y:0
                }
                var nx,dx,x ;
                function down(){
                    flag = true;
                    var touch ;
                    if(event.touches){
                        touch = event.touches[0];
                    }else {
                        touch = event;
                    }
                    cur.x = touch.clientX;
                    dx = top_tabs.offsetLeft;
                }
                function move(){
                    var self=this;
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                    if(flag){
                        var touch ;
                        if(event.touches){
                            touch = event.touches[0];
                        }else {
                            touch = event;
                        }
                        nx = touch.clientX - cur.x;
                        x = dx+nx;
                        if(x > 0){
                            x = 0;
                        }else{
                            if(x < topTabsBoxWidth-topTabsWidth){
                                x = topTabsBoxWidth-topTabsWidth;
                            }else{
                                x = dx+nx;
                            }
                        }
                        top_tabs.style.left = x +"px";
                        //阻止页面的滑动默认事件
                        document.addEventListener("touchmove",function(){
                            event.preventDefault();
                        },false);
                    }
                }
                //鼠标释放时候的函数
                function end(){
                    flag = false;
                }
                //pc端拖动效果
                topTabs.on("mousedown",down);
                topTabs.on("mousemove",move);
                $(document).on("mouseup",end);
                //移动端拖动效果
                topTabs.on("touchstart",down);
                topTabs.on("touchmove",move);
                topTabs.on("touchend",end);
            }else{
                //移除pc端拖动效果
                topTabs.off("mousedown",down);
                topTabs.off("mousemove",move);
                topTabs.off("mouseup",end);
                //移除移动端拖动效果
                topTabs.off("touchstart",down);
                topTabs.off("touchmove",move);
                topTabs.off("touchend",end);
                topTabs.removeAttr("style");
                return false;
            }
        }).resize();
    }

    var wytheIndex = new WytheIndex;

    exports('wytheIndex',wytheIndex);
})