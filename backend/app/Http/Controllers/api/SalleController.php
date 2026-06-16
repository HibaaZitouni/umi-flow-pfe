<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Salle;

class SalleController extends Controller
{
    public function index()
    {
        return response()->json(Salle::orderBy('code')->get());
    }
}
