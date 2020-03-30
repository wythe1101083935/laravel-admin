
layui.define(function(exports)
{
    let Storage = function()
    {
        this.pre = 'wythe_erp_';
    }

    Storage.prototype.set = function(key,value)
    {
        let data = {data:value};

        window.localStorage[this.pre+key] = JSON.stringify(data);
    }

    Storage.prototype.setKey = function(key,value,storageKey)
    {  
        let data;

        if(!window.localStorage[this.pre+storageKey])
        {
            data = {};
        }else
        {
            data = this.get(storageKey);
        }

        data[key] = value;

        this.set(storageKey,data);
    }

    Storage.prototype.getKey = function(key,storageKey)
    {
        if(!window.localStorage[this.pre+storageKey])
        {
            return false;
        }else
        {
            let data = this.get(storageKey);

            return data[key];
        }
    }

    Storage.prototype.get = function(key)
    {
        if(!window.localStorage[this.pre+key])
        {
            return false;
        }

        return JSON.parse(window.localStorage[this.pre+key]).data;
    }

    Storage.prototype.delete = function(key)
    {
        return window.localStorage.removeItem(this.pre+key);
    }

    var storage = new Storage();

    exports('storage',storage);
    
})


