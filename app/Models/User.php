<?php

namespace App\Models;


use App\Models\Currency;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     *
     * @return mixed
     */
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    /**
     *
     * @return array
     */
    public function getJWTCustomClaims() {
        return [];
    }

    /**
     * 收藏的货币
     *
     * @param
     * @return \App\Models\Currency
     */
    public function currencies()
    {
        return $this->belongsToMany(Currency::class,'user_id','currencie_id');
    }

    /**
     * 是否收藏指定货币
     *
     * @param Currency
     * @return Bool
     */
    public function hasCurrency($currency)
    {
        return empty($this->currencies()->where('currencie_id',$currency->id)->get()) ? false : true;
    }
}
