<?php


namespace App\Http\Middleware;

use App\Models\Permission;
use Closure;

class PermissionAuth
{
    /**
     * 权限控制
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $routeName = $request->route()->getName();

        if(is_null($routeName))
        {
            return $next($request);
        }

        $permission = Permission::where('url',$routeName)->first();

        if(is_null($permission))
        {
            return $next($request);
        }

        if(!$request->user()->can($permission->name))
        {
            throw new \Exception('没有权限访问',401);
        }

        return $next($request);
    }
}