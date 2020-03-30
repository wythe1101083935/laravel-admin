<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * 登录表单
     *
     * @param
     * @return
     */
    public function showLoginForm()
    {
        return view('admin.login');
    }

    /**
     * username
     *
     * @param
     * @return
     */
    public function username()
    {
        return 'name';
    }

    /**
     * guard
     *
     * @param
     * @return
     */
    protected function guard()
    {
        return Auth::guard('admin');
    }
}
