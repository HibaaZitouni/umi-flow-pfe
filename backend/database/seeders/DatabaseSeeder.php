<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Salle;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\Stage;
use App\Models\OffreStage;
use App\Models\Note;
use App\Models\Evenement;
use App\Models\Seance;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── SUPER ADMIN ──────────────────────────────────────────
        User::create([
            'nom'=>'Raji','prenom'=>'Omar','email'=>'omar.raji@admin.ac.ma',
            'password'=>Hash::make('Admin@2025!'),'db_role'=>'SUPER_ADMIN',
            'statut'=>'actif','first_login'=>false,'service'=>'Direction',
        ]);

        // ── ADMINS SERVICE ───────────────────────────────────────
        foreach ([
            ['nom'=>'Moujahid','prenom'=>'Lina', 'email'=>'lina.moujahid@admin.ac.ma', 'db_role'=>'ADMIN_ATTEST','service'=>'Scolarité',       'admin_type'=>'attest'],
            ['nom'=>'El Amrani','prenom'=>'Sara', 'email'=>'sara.amrani@admin.ac.ma',   'db_role'=>'ADMIN_BIB',   'service'=>'Bibliothèque',    'admin_type'=>'bib'],
            ['nom'=>'Kaddouri', 'prenom'=>'Youssef','email'=>'youssef.kaddouri@admin.ac.ma','db_role'=>'ADMIN_EDT','service'=>'Emploi du temps','admin_type'=>'edt'],
        ] as $a) {
            User::create(array_merge($a, ['password'=>Hash::make('Admin@2025!'),'statut'=>'actif','first_login'=>false]));
        }

        // ── FILIÈRES — exactement celles de RegisterPage ─────────
        // Codes : GI, AI, DWM | GE, GTE, GETE | GC, PMD | TM, FBA | TCC
        $filieresData = [
            // Informatique
            ['code'=>'GI',   'label'=>'Génie Informatique',                         'departement'=>'Informatique'],
            ['code'=>'AI',   'label'=>'Intelligence Artificielle',                  'departement'=>'Informatique'],
            ['code'=>'DWM',  'label'=>'Développement Web et Multimédia',            'departement'=>'Informatique'],
            // Génie Électrique & Énergies
            ['code'=>'GE',   'label'=>'Génie Électrique',                           'departement'=>'Génie Électrique & Énergies'],
            ['code'=>'GTE',  'label'=>'Génie Thermique et Électrique',              'departement'=>'Génie Électrique & Énergies'],
            ['code'=>'GETE', 'label'=>'Génie Électrique et Techniques Énergétiques','departement'=>'Génie Électrique & Énergies'],
            // Génie Civil & Mécanique
            ['code'=>'GC',   'label'=>'Génie Civil',                                'departement'=>'Génie Civil & Mécanique'],
            ['code'=>'PMD',  'label'=>'Production et Maintenance des Dispositifs',  'departement'=>'Génie Civil & Mécanique'],
            // Techniques de Management
            ['code'=>'TM',   'label'=>'Technique de Management',                    'departement'=>'Techniques de Management'],
            ['code'=>'FBA',  'label'=>'Finance, Banque et Assurance',               'departement'=>'Techniques de Management'],
            // Communication & Multimédia
            ['code'=>'TCC',  'label'=>'Technique de Communication et Création',     'departement'=>'Communication & Multimédia'],
        ];
        foreach ($filieresData as $f) Filiere::create($f);

        // ── MATIÈRES PAR FILIÈRE ─────────────────────────────────
        $matieresData = [
            // GI
            ['nom'=>'Algorithmique avancée',  'code'=>'GI301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'GI'],
            ['nom'=>'Base de Données',        'code'=>'GI302','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'GI'],
            ['nom'=>'Réseaux informatiques',  'code'=>'GI303','type'=>'CM','coefficient'=>1.5,'filiere_code'=>'GI'],
            ['nom'=>'POO & Génie Logiciel',   'code'=>'GI304','type'=>'TP','coefficient'=>1.5,'filiere_code'=>'GI'],
            // AI
            ['nom'=>'Machine Learning',       'code'=>'AI301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'AI'],
            ['nom'=>'Python & Data Science',  'code'=>'AI302','type'=>'TP','coefficient'=>1.5,'filiere_code'=>'AI'],
            ['nom'=>'Deep Learning',          'code'=>'AI303','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'AI'],
            ['nom'=>'NLP',                    'code'=>'AI304','type'=>'CM','coefficient'=>1.5,'filiere_code'=>'AI'],
            // DWM
            ['nom'=>'HTML/CSS & Design',      'code'=>'DWM201','type'=>'TP','coefficient'=>1.0,'filiere_code'=>'DWM'],
            ['nom'=>'JavaScript',             'code'=>'DWM202','type'=>'TP','coefficient'=>1.5,'filiere_code'=>'DWM'],
            ['nom'=>'PHP/MySQL',              'code'=>'DWM203','type'=>'TP','coefficient'=>1.5,'filiere_code'=>'DWM'],
            ['nom'=>'UI/UX Design',           'code'=>'DWM204','type'=>'TD','coefficient'=>1.0,'filiere_code'=>'DWM'],
            // GE
            ['nom'=>'Circuits électriques',   'code'=>'GE301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'GE'],
            ['nom'=>'Électronique de puissance','code'=>'GE302','type'=>'TP','coefficient'=>1.5,'filiere_code'=>'GE'],
            ['nom'=>'Automatique',            'code'=>'GE303','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'GE'],
            // GTE
            ['nom'=>'Thermodynamique',        'code'=>'GTE301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'GTE'],
            ['nom'=>'Machines électriques',   'code'=>'GTE302','type'=>'CM','coefficient'=>1.5,'filiere_code'=>'GTE'],
            // GETE
            ['nom'=>'Énergies renouvelables', 'code'=>'GETE301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'GETE'],
            ['nom'=>'Smart Grid',             'code'=>'GETE302','type'=>'CM','coefficient'=>1.5,'filiere_code'=>'GETE'],
            // GC
            ['nom'=>'Résistance des matériaux','code'=>'GC301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'GC'],
            ['nom'=>'Béton armé',             'code'=>'GC302','type'=>'TD','coefficient'=>1.5,'filiere_code'=>'GC'],
            // PMD
            ['nom'=>'Maintenance industrielle','code'=>'PMD301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'PMD'],
            ['nom'=>'CAO/DAO',                'code'=>'PMD302','type'=>'TP','coefficient'=>1.5,'filiere_code'=>'PMD'],
            // TM
            ['nom'=>'Management des organisations','code'=>'TM301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'TM'],
            ['nom'=>'Marketing stratégique',  'code'=>'TM302','type'=>'CM','coefficient'=>1.5,'filiere_code'=>'TM'],
            // FBA
            ['nom'=>'Comptabilité générale',  'code'=>'FBA301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'FBA'],
            ['nom'=>'Analyse financière',     'code'=>'FBA302','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'FBA'],
            ['nom'=>'Marchés financiers',     'code'=>'FBA303','type'=>'CM','coefficient'=>1.5,'filiere_code'=>'FBA'],
            // TCC
            ['nom'=>'Communication orale',    'code'=>'TCC301','type'=>'CM','coefficient'=>2.0,'filiere_code'=>'TCC'],
            ['nom'=>'Marketing digital',      'code'=>'TCC302','type'=>'TD','coefficient'=>1.5,'filiere_code'=>'TCC'],
            ['nom'=>'Relations publiques',    'code'=>'TCC303','type'=>'CM','coefficient'=>1.5,'filiere_code'=>'TCC'],
            ['nom'=>'Communication visuelle', 'code'=>'TCC304','type'=>'TD','coefficient'=>1.0,'filiere_code'=>'TCC'],
        ];
        $filiereMap = Filiere::pluck('id','code');
        foreach ($matieresData as $m) {
            $fid = $filiereMap[$m['filiere_code']] ?? null;
            if ($fid) Matiere::create(['nom'=>$m['nom'],'code'=>$m['code'],'type'=>$m['type'],'coefficient'=>$m['coefficient'],'filiere_id'=>$fid]);
        }

        // ── ENSEIGNANTS ──────────────────────────────────────────
        $profs = [
            ['nom'=>'Benali',  'prenom'=>'Ahmed', 'email'=>'ahmed.benali@umi.ac.ma',    'grade'=>'Professeur Habilité',          'specialite'=>'Intelligence Artificielle','departement'=>'Informatique',               'filieres'=>['GI','AI']],
            ['nom'=>'Berrada', 'prenom'=>'Nadia',  'email'=>'nadia.berrada@umi.ac.ma',   'grade'=>'Prof. Enseignement Supérieur', 'specialite'=>'Base de Données',          'departement'=>'Informatique',               'filieres'=>['GI','DWM']],
            ['nom'=>'Tazi',    'prenom'=>'Karim',  'email'=>'karim.tazi@umi.ac.ma',      'grade'=>'Professeur Habilité',          'specialite'=>'Machine Learning',         'departement'=>'Informatique',               'filieres'=>['AI']],
            ['nom'=>'Alaoui',  'prenom'=>'Hassan', 'email'=>'hassan.alaoui@umi.ac.ma',   'grade'=>'Maître de Conférences',        'specialite'=>'Génie Électrique',         'departement'=>'Génie Électrique & Énergies','filieres'=>['GE','GTE','GETE']],
            ['nom'=>'Mansouri','prenom'=>'Sara',   'email'=>'sara.mansouri@umi.ac.ma',   'grade'=>'Maître de Conf. Agrégé',       'specialite'=>'Finance & Marchés',        'departement'=>'Techniques de Management',   'filieres'=>['FBA','TM']],
            ['nom'=>'Rachidi', 'prenom'=>'Youssef','email'=>'youssef.rachidi@umi.ac.ma', 'grade'=>'Professeur Habilité',          'specialite'=>'Communication & Médias',   'departement'=>'Communication & Multimédia', 'filieres'=>['TCC']],
            ['nom'=>'Ouali',   'prenom'=>'Mohammed','email'=>'m.ouali@umi.ac.ma',        'grade'=>'Maître de Conférences',        'specialite'=>'Génie Civil',              'departement'=>'Génie Civil & Mécanique',    'filieres'=>['GC','PMD']],
        ];
        foreach ($profs as $p) {
            $f = $p['filieres']; unset($p['filieres']);
            User::create(array_merge($p, [
                'password'=>Hash::make('Prof@2025!'),'db_role'=>'PROFESSEUR',
                'statut'=>'actif','first_login'=>false,
                'filiere'=>$f[0],'filieres'=>$f,
            ]));
        }

        // ── ÉTUDIANTS ────────────────────────────────────────────
        $etudiants = [
            ['nom'=>'Amrani',    'prenom'=>'Yassine','email'=>'y.amrani@edu.umi.ac.ma',     'cne'=>'R130045678','filiere'=>'GI'],
            ['nom'=>'Benchekroun','prenom'=>'Salma', 'email'=>'s.benchekroun@edu.umi.ac.ma','cne'=>'R130034521','filiere'=>'GI'],
            ['nom'=>'El Idrissi','prenom'=>'Fatima', 'email'=>'f.elidrissi@edu.umi.ac.ma',  'cne'=>'R130023456','filiere'=>'GI'],
            ['nom'=>'Tazi',      'prenom'=>'Mehdi',  'email'=>'m.tazi@edu.umi.ac.ma',       'cne'=>'R130056789','filiere'=>'AI'],
            ['nom'=>'Benmoussa', 'prenom'=>'Aicha',  'email'=>'a.benmoussa@edu.umi.ac.ma',  'cne'=>'R130067890','filiere'=>'AI'],
            ['nom'=>'Filali',    'prenom'=>'Omar',   'email'=>'o.filali@edu.umi.ac.ma',     'cne'=>'R130078901','filiere'=>'DWM'],
            ['nom'=>'Khattabi',  'prenom'=>'Rim',    'email'=>'r.khattabi@edu.umi.ac.ma',   'cne'=>'R140011111','filiere'=>'TCC'],
            ['nom'=>'Alami',     'prenom'=>'Nour',   'email'=>'n.alami@edu.umi.ac.ma',      'cne'=>'R140022222','filiere'=>'TCC'],
            ['nom'=>'Ziani',     'prenom'=>'Tariq',  'email'=>'t.ziani@edu.umi.ac.ma',      'cne'=>'R140044444','filiere'=>'TCC'],
            ['nom'=>'Bensouda',  'prenom'=>'Amine',  'email'=>'a.bensouda@edu.umi.ac.ma',   'cne'=>'R150011111','filiere'=>'FBA'],
            ['nom'=>'Lahlou',    'prenom'=>'Meryem', 'email'=>'m.lahlou@edu.umi.ac.ma',     'cne'=>'R150022222','filiere'=>'FBA'],
            ['nom'=>'Tahiri',    'prenom'=>'Zineb',  'email'=>'z.tahiri@edu.umi.ac.ma',     'cne'=>'R150033333','filiere'=>'TM'],
            ['nom'=>'Qasmi',     'prenom'=>'Said',   'email'=>'s.qasmi@edu.umi.ac.ma',      'cne'=>'R160011111','filiere'=>'GE'],
            ['nom'=>'Ouali',     'prenom'=>'Hassan', 'email'=>'h.ouali@edu.umi.ac.ma',      'cne'=>'R160022222','filiere'=>'GE'],
            ['nom'=>'Saidi',     'prenom'=>'Karim',  'email'=>'k.saidi@edu.umi.ac.ma',      'cne'=>'R170011111','filiere'=>'GC'],
        ];
        foreach ($etudiants as $e) {
            User::create(array_merge($e, [
                'password'=>Hash::make('Etudiant@2025!'),'db_role'=>'ETUDIANT',
                'statut'=>'actif','first_login'=>false,
            ]));
        }

        // ── SALLES ───────────────────────────────────────────────
        foreach ([
            ['code'=>'A101','nom'=>'Salle A101','capacite'=>40,'type'=>'CM'],
            ['code'=>'A102','nom'=>'Salle A102','capacite'=>35,'type'=>'CM'],
            ['code'=>'B204','nom'=>'Labo B204', 'capacite'=>25,'type'=>'TP'],
            ['code'=>'C301','nom'=>'Labo C301', 'capacite'=>20,'type'=>'TP'],
            ['code'=>'C302','nom'=>'Salle C302','capacite'=>30,'type'=>'TD'],
            ['code'=>'D401','nom'=>'Salle D401','capacite'=>45,'type'=>'CM'],
            ['code'=>'E101','nom'=>'Salle E101','capacite'=>40,'type'=>'CM'],
            ['code'=>'AMP_A','nom'=>'Amphi A', 'capacite'=>200,'type'=>'CM'],
        ] as $s) {
            Salle::create(array_merge($s, ['equipements'=>json_encode(['Projecteur','Tableau'])]));
        }



        // -- EVENEMENTS -------------------------------------------
        $adminEdt = User::where('db_role','ADMIN_EDT')->first();
        $createdBy = $adminEdt ? $adminEdt->id : 1;
        $evenements = [
            ['titre'=>'Conference IA & Societe','type'=>'academique','date'=>'2025-02-15',
             'heure'=>'10:00','lieu'=>'Amphi A','statut'=>'publie','description'=>'Conference sur l intelligence artificielle et son impact sur la societe.',
             'capacite'=>100,'inscrits'=>88,'organisateur'=>'Departement Informatique','budget_total'=>5000,'created_by'=>$createdBy],
            ['titre'=>'Journee Portes Ouvertes','type'=>'institutionnel','date'=>'2025-02-20',
             'heure'=>'09:00','lieu'=>'Campus UMI','statut'=>'planifie','description'=>'Journee decouverte de l universite pour les futurs etudiants.',
             'capacite'=>500,'inscrits'=>0,'organisateur'=>'Direction UMI','budget_total'=>15000,'created_by'=>$createdBy],
            ['titre'=>'Hackathon Web 2025','type'=>'club','date'=>'2025-03-01',
             'heure'=>'08:00','lieu'=>'Salle D401','statut'=>'publie','description'=>'48h de coding pour creer des solutions innovantes. Equipes de 3 a 5 personnes.',
             'capacite'=>60,'inscrits'=>34,'organisateur'=>'Club Programmation','budget_total'=>3000,'created_by'=>$createdBy],
            ['titre'=>'Nuit du Theatre UMI','type'=>'club','date'=>'2025-03-15',
             'heure'=>'19:00','lieu'=>'Amphi B','statut'=>'planifie','description'=>'Soiree theatrale organisee par le Club Theatre.',
             'capacite'=>200,'inscrits'=>0,'organisateur'=>'Club Theatre','budget_total'=>2000,'created_by'=>$createdBy],
            ['titre'=>'Soutenance PFE Promotion 2025','type'=>'academique','date'=>'2025-03-20',
             'heure'=>'08:00','lieu'=>'Amphi A','statut'=>'publie','description'=>'Soutenances de projets de fin d etudes — Promotion 2025.',
             'capacite'=>150,'inscrits'=>45,'organisateur'=>'Departement Informatique','budget_total'=>0,'created_by'=>$createdBy],
        ];
        foreach ($evenements as $ev) Evenement::create($ev);

        // -- OFFRES DE STAGES ------------------------------------
        OffreStage::create(['titre'=>'Dev Web Full-Stack','entreprise'=>'InfoTech','ville'=>'Casablanca',
             'type'=>'stage_fin_etudes','description'=>'Developpement React et Laravel.',
             'date_debut'=>'2025-07-01','date_fin'=>'2025-09-30',
             'date_limite_candidature'=>'2025-06-15','statut'=>'ouvert','places'=>3]);
        OffreStage::create(['titre'=>'Stage Data Science','entreprise'=>'Analytics Maroc','ville'=>'Rabat',
             'type'=>'stage_initiation','description'=>'Python et machine learning.',
             'date_debut'=>'2025-06-15','date_fin'=>'2025-08-15',
             'date_limite_candidature'=>'2025-06-01','statut'=>'ouvert','places'=>2]);
        OffreStage::create(['titre'=>'Stagiaire Comptabilite','entreprise'=>'Cabinet Audit','ville'=>'Fes',
             'type'=>'stage_initiation','description'=>'Assistance comptable.',
             'date_debut'=>'2025-06-01','date_fin'=>'2025-07-31',
             'date_limite_candidature'=>'2025-05-20','statut'=>'ouvert','places'=>2]);

        // -- NOTES ETUDIANTS ------------------------------------
        $etudiants = User::where('db_role','ETUDIANT')->get();
        $filiereMap = \App\Models\Filiere::pluck('id','code');
        foreach ($etudiants->take(5) as $etudiant) {
            $fId = $filiereMap[$etudiant->filiere] ?? null;
            if (!$fId) continue;
            $matieres = \App\Models\Matiere::where('filiere_id',$fId)->take(4)->get();
            foreach ($matieres as $matiere) {
                Note::firstOrCreate([
                    'etudiant_id'=>$etudiant->id,'matiere_id'=>$matiere->id,
                    'semestre'=>'S1','annee_universitaire'=>'2024-2025',
                ],[
                    'cc'=>rand(10,18),'tp'=>rand(10,18),'examen'=>rand(10,18),
                ]);
            }
        }

        // ── SÉANCES EDT de démo ──────────────────────────────
        $profBenali  = User::where('email','ahmed.benali@umi.ac.ma')->first();
        $profBerrada = User::where('email','nadia.berrada@umi.ac.ma')->first();
        $profTazi    = User::where('email','karim.tazi@umi.ac.ma')->first();
        $sA101 = Salle::where('code','A101')->first();
        $sB204 = Salle::where('code','B204')->first();
        $sC301 = Salle::where('code','C301')->first();
        $sC302 = Salle::where('code','C302')->first();

        $seancesData = [
            ['matiere'=>'Algorithmique avancée','groupe'=>'GI-L3-G1','jour'=>'Lundi',    'slot'=>'S1','type'=>'CM','prof'=>$profBenali, 'salle'=>$sA101],
            ['matiere'=>'Algorithmique avancée','groupe'=>'GI-L3-G1','jour'=>'Jeudi',    'slot'=>'S2','type'=>'TD','prof'=>$profBenali, 'salle'=>$sC302],
            ['matiere'=>'Base de Données',      'groupe'=>'GI-L3-G1','jour'=>'Mardi',    'slot'=>'S1','type'=>'CM','prof'=>$profBerrada,'salle'=>$sA101],
            ['matiere'=>'Base de Données',      'groupe'=>'GI-L3-G1','jour'=>'Vendredi', 'slot'=>'S2','type'=>'TD','prof'=>$profBerrada,'salle'=>$sB204],
            ['matiere'=>'Machine Learning',     'groupe'=>'AI-L3-G1', 'jour'=>'Lundi',   'slot'=>'S2','type'=>'CM','prof'=>$profTazi,   'salle'=>$sA101],
            ['matiere'=>'Machine Learning',     'groupe'=>'AI-L3-G1', 'jour'=>'Mercredi','slot'=>'S3','type'=>'TP','prof'=>$profTazi,   'salle'=>$sC301],
            ['matiere'=>'Deep Learning',        'groupe'=>'AI-L3-G1', 'jour'=>'Jeudi',   'slot'=>'S1','type'=>'CM','prof'=>$profTazi,   'salle'=>$sA101],
            ['matiere'=>'Développement Web',    'groupe'=>'DWM-L2-G1','jour'=>'Mardi',   'slot'=>'S3','type'=>'TP','prof'=>$profBerrada,'salle'=>$sB204],
            ['matiere'=>'Développement Web',    'groupe'=>'DWM-L2-G1','jour'=>'Vendredi','slot'=>'S1','type'=>'CM','prof'=>$profBerrada,'salle'=>$sA101],
        ];
        foreach ($seancesData as $s) {
            if ($s['prof'] && $s['salle']) {
                Seance::firstOrCreate([
                    'jour'=>$s['jour'],'slot'=>$s['slot'],
                    'enseignant_id'=>$s['prof']->id,'groupe'=>$s['groupe'],
                ],[
                    'matiere'=>$s['matiere'],'type'=>$s['type'],
                    'salle_id'=>$s['salle']->id,'couleur'=>'#3b82f6',
                ]);
            }
        }
        

        $this->command->info('Umi-Flow seeded: '.User::count().' users, '.Filiere::count().' filieres, '.Matiere::count().' matieres');
    }
}