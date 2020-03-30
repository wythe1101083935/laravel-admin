<?php


namespace App\Http\Controllers\Admin;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{




    protected function getAuthList()
    {
        $data = [];
        foreach(Permission::where('guard_name','admin')->get() as $value)
        {
            $data [] = ['id'=>$value->id,'name'=>$value->name];
        }

        return $data;
    }

    public function create(Request $request)
    {
        $this->validate($request,$this->validateRule(0),$this->validateRuleMsg());

        $role = new Role();

        $role->name = $request->formData['name'];

        $role->guard_name = $request->formData['guard_name'];

        $role->givePermissionTo(json_decode($request->formData['auth']));

        $role->save();

        return response(['status'=>true,'msg'=>$role->name.' 创建成功']);
    }

    public function update(Request $request)
    {
        $this->validate($request,$this->validateRule($request->id),$this->validateRuleMsg());

        $role = Role::find($request->id);

        $role->name = $request->formData['name'];

        $role->guard_name = $request->formData['guard_name'];

        $role->permissions()->sync(json_decode($request->formData['auth']));

        $role->save();

        return response(['status'=>true,'msg'=>$role->name.' 更新成功']);
    }

    protected function validateRule($id)
    {
        return [];
    }

    protected function validateRuleMsg()
    {
        return [];
    }
}