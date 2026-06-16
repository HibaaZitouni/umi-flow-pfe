<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    // GET /api/users — liste (super admin only)
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, fn($q,$s) => $q->where(fn($q) =>
                $q->where('nom','like',"%$s%")
                  ->orWhere('prenom','like',"%$s%")
                  ->orWhere('email','like',"%$s%")
                  ->orWhere('service','like',"%$s%")))
            ->when($request->role,   fn($q,$r) => $q->where('db_role',$r))
            ->when($request->statut, fn($q,$s) => $q->where('statut',$s))
            ->orderBy('created_at','desc')
            ->paginate(20);
        return response()->json($users);
    }

    // GET /api/users/{id}
    public function show(User $user) {
        return response()->json($user);
    }

    // POST /api/users — créer un compte
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string',
            'prenom'     => 'required|string',
            'email'      => 'required|email|unique:users',
            'db_role'    => 'required|in:SUPER_ADMIN,ADMIN_EDT,ADMIN_BIB,ADMIN_ATTEST,PROFESSEUR,ETUDIANT',
            'service'    => 'nullable|string',
            'admin_type' => 'nullable|string',
        ]);

        $pwd = $this->generatePassword();
        $user = User::create(array_merge($data, [
            'password'   => Hash::make($pwd),
            'statut'     => 'inactif',
            'first_login'=> true,
        ]));

        return response()->json([
            'user'              => $user,
            'generated_password'=> $pwd,
            'message'           => 'Compte créé avec succès.',
        ], 201);
    }

    // PUT /api/users/{id} — modifier
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'nom'        => 'sometimes|string',
            'prenom'     => 'sometimes|string',
            'service'    => 'sometimes|string',
            'statut'     => 'sometimes|in:actif,inactif,suspendu',
            'db_role'    => 'sometimes|in:SUPER_ADMIN,ADMIN_EDT,ADMIN_BIB,ADMIN_ATTEST,PROFESSEUR,ETUDIANT',
            'grade'      => 'sometimes|nullable|string',
            'specialite' => 'sometimes|nullable|string',
            'telephone'  => 'sometimes|nullable|string',
        ]);
        $user->update($data);
        return response()->json(['user'=>$user,'message'=>'Compte mis à jour.']);
    }

    // DELETE /api/users/{id}
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message'=>'Compte supprimé.']);
    }

    // POST /api/users/{id}/toggle-statut
    public function toggleStatut(User $user)
    {
        $user->update(['statut' => $user->statut === 'actif' ? 'suspendu' : 'actif']);
        return response()->json(['statut'=>$user->statut,'message'=>'Statut mis à jour.']);
    }

    // POST /api/users/{id}/reset-password
    public function resetPassword(User $user)
    {
        $pwd = $this->generatePassword();
        $user->update(['password'=>Hash::make($pwd),'first_login'=>true]);
        // TODO: dispatch notification mail
        return response()->json(['generated_password'=>$pwd,'message'=>'MDP réinitialisé.']);
    }

    // POST /api/users/import — import Excel/CSV
    public function import(Request $request)
    {
        $request->validate(['file'=>'required|file|mimes:csv,xlsx,xls|max:10240']);
        // TODO: intégrer Laravel Excel (maatwebsite/excel)
        return response()->json(['message'=>'Import traité.','imported'=>0]);
    }

    private function generatePassword(): string
    {
        $chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
        return substr(str_shuffle(str_repeat($chars,4)),0,12);
    }
}