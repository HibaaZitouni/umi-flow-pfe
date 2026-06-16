-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 16 juin 2026 à 14:36
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pfe_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `absences`
--

DROP TABLE IF EXISTS `absences`;
CREATE TABLE IF NOT EXISTS `absences` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `etudiant_id` bigint UNSIGNED NOT NULL,
  `seance_id` bigint UNSIGNED NOT NULL,
  `justifiee` tinyint(1) NOT NULL DEFAULT '0',
  `motif` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `absences_etudiant_id_foreign` (`etudiant_id`),
  KEY `absences_seance_id_foreign` (`seance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `archive_policies`
--

DROP TABLE IF EXISTS `archive_policies`;
CREATE TABLE IF NOT EXISTS `archive_policies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` enum('Livre','Thèse','PFE','Article','Rapport') COLLATE utf8mb4_unicode_ci NOT NULL,
  `libelle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duree_conservation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('actif','expire') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `date_debut` date NOT NULL,
  `nb_docs` int NOT NULL DEFAULT '0',
  `action` enum('conserver','anonymiser','supprimer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `archive_policies_created_by_foreign` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `attestations`
--

DROP TABLE IF EXISTS `attestations`;
CREATE TABLE IF NOT EXISTS `attestations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `demandeur_id` bigint UNSIGNED NOT NULL,
  `type` enum('Scolarité','Réussite','Relevé notes','Participation') COLLATE utf8mb4_unicode_ci NOT NULL,
  `motif` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cin_beneficiaire` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom_beneficiaire` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('en_attente','validee','generee','refusee','signee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `validated_by` bigint UNSIGNED DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `signature_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `club_id` bigint UNSIGNED DEFAULT NULL,
  `evenement_id` bigint UNSIGNED DEFAULT NULL,
  `hash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attestations_reference_unique` (`reference`),
  KEY `attestations_demandeur_id_foreign` (`demandeur_id`),
  KEY `attestations_validated_by_foreign` (`validated_by`),
  KEY `attestations_club_id_foreign` (`club_id`),
  KEY `attestations_evenement_id_foreign` (`evenement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_id` bigint UNSIGNED DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('actif','en_attente','suspendu') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `description` text COLLATE utf8mb4_unicode_ci,
  `reglement` text COLLATE utf8mb4_unicode_ci,
  `president_nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tresorier_nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prof_referent_id` bigint UNSIGNED NOT NULL,
  `prof_role` enum('Président','Membre','Conseiller') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Membre',
  `budget` decimal(10,2) NOT NULL DEFAULT '0.00',
  `validated_by` bigint UNSIGNED DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clubs_prof_referent_id_foreign` (`prof_referent_id`),
  KEY `clubs_validated_by_foreign` (`validated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `club_membres`
--

DROP TABLE IF EXISTS `club_membres`;
CREATE TABLE IF NOT EXISTS `club_membres` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `club_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `role_club` enum('president','tresorier','membre') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'membre',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `club_membres_club_id_user_id_unique` (`club_id`,`user_id`),
  KEY `club_membres_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demandes_stages`
--

DROP TABLE IF EXISTS `demandes_stages`;
CREATE TABLE IF NOT EXISTS `demandes_stages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `etudiant_id` bigint UNSIGNED NOT NULL,
  `offre_id` bigint UNSIGNED DEFAULT NULL,
  `entreprise` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poste` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lettre_motivation` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('en_attente','accepte','refuse') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `commentaire_admin` text COLLATE utf8mb4_unicode_ci,
  `traite_par` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `demandes_stages_etudiant_id_foreign` (`etudiant_id`),
  KEY `demandes_stages_offre_id_foreign` (`offre_id`),
  KEY `demandes_stages_traite_par_foreign` (`traite_par`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` enum('livre','these','pfe','article','rapport') COLLATE utf8mb4_unicode_ci NOT NULL,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `auteurs` json NOT NULL,
  `annee` year NOT NULL,
  `domaine` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isbn` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exemplaires` int NOT NULL DEFAULT '1',
  `dispo` int NOT NULL DEFAULT '1',
  `description` text COLLATE utf8mb4_unicode_ci,
  `fichier_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archive` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `documents_created_by_foreign` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `emprunts`
--

DROP TABLE IF EXISTS `emprunts`;
CREATE TABLE IF NOT EXISTS `emprunts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `document_id` bigint UNSIGNED NOT NULL,
  `emprunteur_id` bigint UNSIGNED NOT NULL,
  `emprunteur_type` enum('etudiant','prof','staff') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_emprunt` date NOT NULL,
  `date_retour` date NOT NULL,
  `date_retour_effective` date DEFAULT NULL,
  `statut` enum('en_cours','en_retard','retourne') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_cours',
  `renouvellements` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emprunts_document_id_foreign` (`document_id`),
  KEY `emprunts_emprunteur_id_foreign` (`emprunteur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evenements`
--

DROP TABLE IF EXISTS `evenements`;
CREATE TABLE IF NOT EXISTS `evenements` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('academique','institutionnel','club') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `heure` time DEFAULT NULL,
  `lieu` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` enum('planifie','publie','termine','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planifie',
  `description` text COLLATE utf8mb4_unicode_ci,
  `capacite` int NOT NULL DEFAULT '50',
  `inscrits` int NOT NULL DEFAULT '0',
  `organisateur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ressources` json DEFAULT NULL,
  `budget_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `budget_depenses` decimal(10,2) NOT NULL DEFAULT '0.00',
  `club_id` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `evenements_club_id_foreign` (`club_id`),
  KEY `evenements_created_by_foreign` (`created_by`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `evenements`
--

INSERT INTO `evenements` (`id`, `titre`, `type`, `date`, `heure`, `lieu`, `statut`, `description`, `capacite`, `inscrits`, `organisateur`, `ressources`, `budget_total`, `budget_depenses`, `club_id`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Conference IA & Societe', 'academique', '2025-02-15', '10:00:00', 'Amphi A', 'publie', 'Conference sur l intelligence artificielle et son impact sur la societe.', 100, 88, 'Departement Informatique', NULL, 5000.00, 0.00, NULL, 4, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(2, 'Journee Portes Ouvertes', 'institutionnel', '2025-02-20', '09:00:00', 'Campus UMI', 'planifie', 'Journee decouverte de l universite pour les futurs etudiants.', 500, 0, 'Direction UMI', NULL, 15000.00, 0.00, NULL, 4, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(3, 'Hackathon Web 2025', 'club', '2025-03-01', '08:00:00', 'Salle D401', 'publie', '48h de coding pour creer des solutions innovantes. Equipes de 3 a 5 personnes.', 60, 34, 'Club Programmation', NULL, 3000.00, 0.00, NULL, 4, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(4, 'Nuit du Theatre UMI', 'club', '2025-03-15', '19:00:00', 'Amphi B', 'planifie', 'Soiree theatrale organisee par le Club Theatre.', 200, 0, 'Club Theatre', NULL, 2000.00, 0.00, NULL, 4, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(5, 'Soutenance PFE Promotion 2025', 'academique', '2025-03-20', '08:00:00', 'Amphi A', 'publie', 'Soutenances de projets de fin d etudes — Promotion 2025.', 150, 45, 'Departement Informatique', NULL, 0.00, 0.00, NULL, 4, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

DROP TABLE IF EXISTS `filieres`;
CREATE TABLE IF NOT EXISTS `filieres` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departement` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filieres_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `filieres`
--

INSERT INTO `filieres` (`id`, `code`, `label`, `departement`, `actif`, `created_at`, `updated_at`) VALUES
(1, 'GI', 'Génie Informatique', 'Informatique', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(2, 'AI', 'Intelligence Artificielle', 'Informatique', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(3, 'DWM', 'Développement Web et Multimédia', 'Informatique', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(4, 'GE', 'Génie Électrique', 'Génie Électrique & Énergies', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(5, 'GTE', 'Génie Thermique et Électrique', 'Génie Électrique & Énergies', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(6, 'GETE', 'Génie Électrique et Techniques Énergétiques', 'Génie Électrique & Énergies', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(7, 'GC', 'Génie Civil', 'Génie Civil & Mécanique', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(8, 'PMD', 'Production et Maintenance des Dispositifs', 'Génie Civil & Mécanique', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(9, 'TM', 'Technique de Management', 'Techniques de Management', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(10, 'FBA', 'Finance, Banque et Assurance', 'Techniques de Management', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(11, 'TCC', 'Technique de Communication et Création', 'Communication & Multimédia', 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11');

-- --------------------------------------------------------

--
-- Structure de la table `inscriptions`
--

DROP TABLE IF EXISTS `inscriptions`;
CREATE TABLE IF NOT EXISTS `inscriptions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `evenement_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `statut` enum('confirme','en_attente','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirme',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inscriptions_evenement_id_user_id_unique` (`evenement_id`,`user_id`),
  KEY `inscriptions_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('CM','TD','TP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `coefficient` double NOT NULL DEFAULT '1',
  `filiere_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matieres_code_unique` (`code`),
  KEY `matieres_filiere_id_foreign` (`filiere_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `code`, `type`, `coefficient`, `filiere_id`, `created_at`, `updated_at`) VALUES
(1, 'Algorithmique avancée', 'GI301', 'CM', 2, 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(2, 'Base de Données', 'GI302', 'CM', 2, 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(3, 'Réseaux informatiques', 'GI303', 'CM', 1.5, 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(4, 'POO & Génie Logiciel', 'GI304', 'TP', 1.5, 1, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(5, 'Machine Learning', 'AI301', 'CM', 2, 2, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(6, 'Python & Data Science', 'AI302', 'TP', 1.5, 2, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(7, 'Deep Learning', 'AI303', 'CM', 2, 2, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(8, 'NLP', 'AI304', 'CM', 1.5, 2, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(9, 'HTML/CSS & Design', 'DWM201', 'TP', 1, 3, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(10, 'JavaScript', 'DWM202', 'TP', 1.5, 3, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(11, 'PHP/MySQL', 'DWM203', 'TP', 1.5, 3, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(12, 'UI/UX Design', 'DWM204', 'TD', 1, 3, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(13, 'Circuits électriques', 'GE301', 'CM', 2, 4, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(14, 'Électronique de puissance', 'GE302', 'TP', 1.5, 4, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(15, 'Automatique', 'GE303', 'CM', 2, 4, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(16, 'Thermodynamique', 'GTE301', 'CM', 2, 5, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(17, 'Machines électriques', 'GTE302', 'CM', 1.5, 5, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(18, 'Énergies renouvelables', 'GETE301', 'CM', 2, 6, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(19, 'Smart Grid', 'GETE302', 'CM', 1.5, 6, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(20, 'Résistance des matériaux', 'GC301', 'CM', 2, 7, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(21, 'Béton armé', 'GC302', 'TD', 1.5, 7, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(22, 'Maintenance industrielle', 'PMD301', 'CM', 2, 8, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(23, 'CAO/DAO', 'PMD302', 'TP', 1.5, 8, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(24, 'Management des organisations', 'TM301', 'CM', 2, 9, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(25, 'Marketing stratégique', 'TM302', 'CM', 1.5, 9, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(26, 'Comptabilité générale', 'FBA301', 'CM', 2, 10, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(27, 'Analyse financière', 'FBA302', 'CM', 2, 10, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(28, 'Marchés financiers', 'FBA303', 'CM', 1.5, 10, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(29, 'Communication orale', 'TCC301', 'CM', 2, 11, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(30, 'Marketing digital', 'TCC302', 'TD', 1.5, 11, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(31, 'Relations publiques', 'TCC303', 'CM', 1.5, 11, '2026-06-14 22:57:11', '2026-06-14 22:57:11'),
(32, 'Communication visuelle', 'TCC304', 'TD', 1, 11, '2026-06-14 22:57:11', '2026-06-14 22:57:11');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000002_create_core_tables', 1),
(5, '2024_01_01_000003_create_student_tables', 1),
(6, '2026_06_02_201552_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

DROP TABLE IF EXISTS `notes`;
CREATE TABLE IF NOT EXISTS `notes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `etudiant_id` bigint UNSIGNED NOT NULL,
  `matiere_id` bigint UNSIGNED NOT NULL,
  `cc` double DEFAULT NULL,
  `tp` double DEFAULT NULL,
  `examen` double DEFAULT NULL,
  `moyenne` double GENERATED ALWAYS AS ((((`cc` * 0.30) + (`tp` * 0.20)) + (`examen` * 0.50))) STORED,
  `semestre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `annee_universitaire` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notes_etudiant_id_matiere_id_semestre_annee_universitaire_unique` (`etudiant_id`,`matiere_id`,`semestre`,`annee_universitaire`),
  KEY `notes_matiere_id_foreign` (`matiere_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `notes`
--

INSERT INTO `notes` (`id`, `etudiant_id`, `matiere_id`, `cc`, `tp`, `examen`, `semestre`, `annee_universitaire`, `created_at`, `updated_at`) VALUES
(1, 12, 1, 14, 15, 18, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(2, 12, 2, 15, 16, 18, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(3, 12, 3, 11, 10, 10, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(4, 12, 4, 15, 13, 13, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(5, 13, 1, 15, 18, 10, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(6, 13, 2, 10, 10, 13, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(7, 13, 3, 11, 14, 10, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(8, 13, 4, 10, 10, 17, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(9, 14, 1, 10, 13, 11, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(10, 14, 2, 13, 10, 18, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(11, 14, 3, 10, 14, 16, 'S1', '2024-2025', '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(12, 14, 4, 12, 11, 13, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(13, 15, 5, 18, 16, 15, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(14, 15, 6, 14, 12, 16, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(15, 15, 7, 13, 11, 14, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(16, 15, 8, 17, 18, 15, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(17, 16, 5, 15, 13, 14, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(18, 16, 6, 18, 12, 16, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(19, 16, 7, 12, 16, 18, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(20, 16, 8, 11, 14, 18, 'S1', '2024-2025', '2026-06-14 22:57:16', '2026-06-14 22:57:16');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offres_stages`
--

DROP TABLE IF EXISTS `offres_stages`;
CREATE TABLE IF NOT EXISTS `offres_stages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entreprise` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Maroc',
  `type` enum('stage_initiation','stage_fin_etudes','alternance') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `competences_requises` text COLLATE utf8mb4_unicode_ci,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `date_limite_candidature` date NOT NULL,
  `statut` enum('ouvert','ferme') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ouvert',
  `contact_email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `places` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `offres_stages`
--

INSERT INTO `offres_stages` (`id`, `titre`, `entreprise`, `ville`, `pays`, `type`, `description`, `competences_requises`, `date_debut`, `date_fin`, `date_limite_candidature`, `statut`, `contact_email`, `places`, `created_at`, `updated_at`) VALUES
(1, 'Dev Web Full-Stack', 'InfoTech', 'Casablanca', 'Maroc', 'stage_fin_etudes', 'Developpement React et Laravel.', NULL, '2025-07-01', '2025-09-30', '2025-06-15', 'ouvert', NULL, 3, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(2, 'Stage Data Science', 'Analytics Maroc', 'Rabat', 'Maroc', 'stage_initiation', 'Python et machine learning.', NULL, '2025-06-15', '2025-08-15', '2025-06-01', 'ouvert', NULL, 2, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(3, 'Stagiaire Comptabilite', 'Cabinet Audit', 'Fes', 'Maroc', 'stage_initiation', 'Assistance comptable.', NULL, '2025-06-01', '2025-07-31', '2025-05-20', 'ouvert', NULL, 2, '2026-06-14 22:57:15', '2026-06-14 22:57:15');

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 2, 'umi-flow-token', '396e8b1bf8ff39cf778bb089b60ec046273f8ce299dbadc45304f24113a0c6fb', '[\"*\"]', '2026-06-14 23:02:42', '2026-06-21 23:01:19', '2026-06-14 23:01:19', '2026-06-14 23:02:42'),
(3, 'App\\Models\\User', 12, 'umi-flow-token', '0816f145bffcf79e3363d756758cf7a5840dcae5ec069fb003abac0066ce1155', '[\"*\"]', NULL, '2026-06-21 23:03:00', '2026-06-14 23:03:00', '2026-06-14 23:03:00'),
(6, 'App\\Models\\User', 1, 'umi-flow-token', 'd80a598db571497ec4feded777aa7eb6f5acf972fd630cf07b0fa7b93dd942fc', '[\"*\"]', '2026-06-14 23:19:02', '2026-06-21 23:16:07', '2026-06-14 23:16:07', '2026-06-14 23:19:02'),
(7, 'App\\Models\\User', 4, 'umi-flow-token', 'a08abc91b333eff44e30f8bb465072789f4b324e304d789264248283b06e0210', '[\"*\"]', '2026-06-14 23:27:01', '2026-06-21 23:19:44', '2026-06-14 23:19:44', '2026-06-14 23:27:01'),
(8, 'App\\Models\\User', 13, 'umi-flow-token', 'e928f044df04615f5dbfa1793a654ca206ba5786ea8aa814e4c7cd8034856a73', '[\"*\"]', '2026-06-15 00:23:10', '2026-06-21 23:41:03', '2026-06-14 23:41:03', '2026-06-15 00:23:10');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `salle_id` bigint UNSIGNED NOT NULL,
  `demandeur_id` bigint UNSIGNED NOT NULL,
  `jour` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `motif` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('cours','evenement','club') COLLATE utf8mb4_unicode_ci NOT NULL,
  `priorite` int NOT NULL,
  `statut` enum('en_attente','confirmee','annulee','conflit') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_resa_creneau` (`salle_id`,`jour`,`slot`),
  KEY `reservations_demandeur_id_foreign` (`demandeur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `salles`
--

DROP TABLE IF EXISTS `salles`;
CREATE TABLE IF NOT EXISTS `salles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacite` int NOT NULL,
  `type` enum('CM','TD','TP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipements` json DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `salles_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `salles`
--

INSERT INTO `salles` (`id`, `code`, `nom`, `capacite`, `type`, `equipements`, `disponible`, `created_at`, `updated_at`) VALUES
(1, 'A101', 'Salle A101', 40, 'CM', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(2, 'A102', 'Salle A102', 35, 'CM', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(3, 'B204', 'Labo B204', 25, 'TP', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(4, 'C301', 'Labo C301', 20, 'TP', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(5, 'C302', 'Salle C302', 30, 'TD', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(6, 'D401', 'Salle D401', 45, 'CM', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(7, 'E101', 'Salle E101', 40, 'CM', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15'),
(8, 'AMP_A', 'Amphi A', 200, 'CM', '\"[\\\"Projecteur\\\",\\\"Tableau\\\"]\"', 1, '2026-06-14 22:57:15', '2026-06-14 22:57:15');

-- --------------------------------------------------------

--
-- Structure de la table `seances`
--

DROP TABLE IF EXISTS `seances`;
CREATE TABLE IF NOT EXISTS `seances` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `matiere` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jour` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('CM','TD','TP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `couleur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#10b981',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `enseignant_id` bigint UNSIGNED NOT NULL,
  `salle_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_salle_creneau` (`salle_id`,`jour`,`slot`),
  UNIQUE KEY `unique_prof_creneau` (`enseignant_id`,`jour`,`slot`),
  UNIQUE KEY `unique_groupe_creneau` (`groupe`,`jour`,`slot`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `seances`
--

INSERT INTO `seances` (`id`, `matiere`, `groupe`, `jour`, `slot`, `type`, `couleur`, `locked`, `enseignant_id`, `salle_id`, `created_at`, `updated_at`) VALUES
(1, 'Algorithmique avancée', 'GI-L3-G1', 'Lundi', 'S1', 'CM', '#3b82f6', 0, 5, 1, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(2, 'Algorithmique avancée', 'GI-L3-G1', 'Jeudi', 'S2', 'TD', '#3b82f6', 0, 5, 5, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(3, 'Base de Données', 'GI-L3-G1', 'Mardi', 'S1', 'CM', '#3b82f6', 0, 6, 1, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(4, 'Base de Données', 'GI-L3-G1', 'Vendredi', 'S2', 'TD', '#3b82f6', 0, 6, 3, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(5, 'Machine Learning', 'AI-L3-G1', 'Lundi', 'S2', 'CM', '#3b82f6', 0, 7, 1, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(6, 'Machine Learning', 'AI-L3-G1', 'Mercredi', 'S3', 'TP', '#3b82f6', 0, 7, 4, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(7, 'Deep Learning', 'AI-L3-G1', 'Jeudi', 'S1', 'CM', '#3b82f6', 0, 7, 1, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(8, 'Développement Web', 'DWM-L2-G1', 'Mardi', 'S3', 'TP', '#3b82f6', 0, 6, 3, '2026-06-14 22:57:16', '2026-06-14 22:57:16'),
(9, 'Développement Web', 'DWM-L2-G1', 'Vendredi', 'S1', 'CM', '#3b82f6', 0, 6, 1, '2026-06-14 22:57:16', '2026-06-14 22:57:16');

-- --------------------------------------------------------

--
-- Structure de la table `sponsors`
--

DROP TABLE IF EXISTS `sponsors`;
CREATE TABLE IF NOT EXISTS `sponsors` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `evenement_id` bigint UNSIGNED NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `type` enum('financier','materiel','institutionnel') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sponsors_evenement_id_foreign` (`evenement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stages`
--

DROP TABLE IF EXISTS `stages`;
CREATE TABLE IF NOT EXISTS `stages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `etudiant_id` bigint UNSIGNED NOT NULL,
  `entreprise` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poste` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Maroc',
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `type` enum('stage_initiation','stage_fin_etudes','alternance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'stage_initiation',
  `statut` enum('en_cours','termine','valide','refuse') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_cours',
  `description` text COLLATE utf8mb4_unicode_ci,
  `tuteur_nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tuteur_email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rapport_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` double DEFAULT NULL,
  `appreciation` text COLLATE utf8mb4_unicode_ci,
  `validated_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stages_etudiant_id_foreign` (`etudiant_id`),
  KEY `stages_validated_by_foreign` (`validated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `stages`
--

INSERT INTO `stages` (`id`, `etudiant_id`, `entreprise`, `poste`, `ville`, `pays`, `date_debut`, `date_fin`, `type`, `statut`, `description`, `tuteur_nom`, `tuteur_email`, `rapport_path`, `note`, `appreciation`, `validated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 13, 'kk', 'test', 'Casablanca', 'Maroc', '2026-06-15', '2026-09-13', 'stage_initiation', 'en_cours', NULL, 'tkt', 'yyy@gmail.com', NULL, NULL, NULL, NULL, '2026-06-15 00:22:51', '2026-06-15 00:22:51', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `db_role` enum('SUPER_ADMIN','ADMIN_EDT','ADMIN_BIB','ADMIN_ATTEST','PROFESSEUR','ETUDIANT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ETUDIANT',
  `grade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cne` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filiere` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filieres` json DEFAULT NULL,
  `statut` enum('actif','inactif','suspendu') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inactif',
  `first_login` tinyint(1) NOT NULL DEFAULT '1',
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_cin_unique` (`cin`),
  UNIQUE KEY `users_cne_unique` (`cne`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `cin`, `telephone`, `password`, `db_role`, `grade`, `specialite`, `departement`, `service`, `cne`, `filiere`, `filieres`, `statut`, `first_login`, `photo`, `admin_type`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Raji', 'Omar', 'omar.raji@admin.ac.ma', NULL, NULL, '$2y$12$fjRUkMOfRV7Ms2Z1RP/CzecZyCVeeh7Ss5g/JUJJRGmyLcwGwcoVS', 'SUPER_ADMIN', NULL, NULL, NULL, 'Direction', NULL, NULL, NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:10', '2026-06-14 22:57:10', NULL),
(2, 'Moujahid', 'Lina', 'lina.moujahid@admin.ac.ma', NULL, NULL, '$2y$12$sCJpL6LDSsapdWu8sm8nY.UbLhtuD/sWkPo0OXRFGgo.VVv4Ztmhu', 'ADMIN_ATTEST', NULL, NULL, NULL, 'Scolarité', NULL, NULL, NULL, 'actif', 0, NULL, 'attest', NULL, '2026-06-14 22:57:10', '2026-06-14 22:57:10', NULL),
(3, 'El Amrani', 'Sara', 'sara.amrani@admin.ac.ma', NULL, NULL, '$2y$12$u316rNLSqC0S.tPbig1F0eLTxqQn/oy.RV7.BEVc9zHBEJZwXcrQ.', 'ADMIN_BIB', NULL, NULL, NULL, 'Bibliothèque', NULL, NULL, NULL, 'actif', 0, NULL, 'bib', NULL, '2026-06-14 22:57:10', '2026-06-14 22:57:10', NULL),
(4, 'Kaddouri', 'Youssef', 'youssef.kaddouri@admin.ac.ma', NULL, NULL, '$2y$12$M1vF3s9TVuC9n49c2o6E8uhF36FKF/iWI3BizwCJ4eDC3bSYtbmou', 'ADMIN_EDT', NULL, NULL, NULL, 'Emploi du temps', NULL, NULL, NULL, 'actif', 0, NULL, 'edt', NULL, '2026-06-14 22:57:11', '2026-06-14 22:57:11', NULL),
(5, 'Benali', 'Ahmed', 'ahmed.benali@umi.ac.ma', NULL, NULL, '$2y$12$zZ6M8fBfVRJublGxAxB4H.BiAxFKOKpedd3mx/Zd.x545WYhbA88u', 'PROFESSEUR', 'Professeur Habilité', 'Intelligence Artificielle', 'Informatique', NULL, NULL, 'GI', '[\"GI\", \"AI\"]', 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:11', '2026-06-14 22:57:11', NULL),
(6, 'Berrada', 'Nadia', 'nadia.berrada@umi.ac.ma', NULL, NULL, '$2y$12$0/qMy/RDpJvg1WLjDdF66uW1YfYYMJfhs.7.Nx.Xie55X4nQ51sSy', 'PROFESSEUR', 'Prof. Enseignement Supérieur', 'Base de Données', 'Informatique', NULL, NULL, 'GI', '[\"GI\", \"DWM\"]', 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:11', '2026-06-14 22:57:11', NULL),
(7, 'Tazi', 'Karim', 'karim.tazi@umi.ac.ma', NULL, NULL, '$2y$12$KWsaxxecspHqttj/cM6W6.yD1AMG0S.8y8Q4c3Dsko7f2z9QF5IO6', 'PROFESSEUR', 'Professeur Habilité', 'Machine Learning', 'Informatique', NULL, NULL, 'AI', '[\"AI\"]', 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:11', '2026-06-14 22:57:11', NULL),
(8, 'Alaoui', 'Hassan', 'hassan.alaoui@umi.ac.ma', NULL, NULL, '$2y$12$orFyGJdwEqKniwNhW5JfQuTSVtylad/DmF4E.tIIjVhk8WCyQnONS', 'PROFESSEUR', 'Maître de Conférences', 'Génie Électrique', 'Génie Électrique & Énergies', NULL, NULL, 'GE', '[\"GE\", \"GTE\", \"GETE\"]', 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:12', '2026-06-14 22:57:12', NULL),
(9, 'Mansouri', 'Sara', 'sara.mansouri@umi.ac.ma', NULL, NULL, '$2y$12$udyqxPRxD0ypBWaig6hbEeGFalBofwpJCTmvL4pTfQqranBGmkh6O', 'PROFESSEUR', 'Maître de Conf. Agrégé', 'Finance & Marchés', 'Techniques de Management', NULL, NULL, 'FBA', '[\"FBA\", \"TM\"]', 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:12', '2026-06-14 22:57:12', NULL),
(10, 'Rachidi', 'Youssef', 'youssef.rachidi@umi.ac.ma', NULL, NULL, '$2y$12$8V8tA4ZIVGrI4fzj8LHwAuULKk/U65JCEWrDS/u9uZzVR/xTFnX4C', 'PROFESSEUR', 'Professeur Habilité', 'Communication & Médias', 'Communication & Multimédia', NULL, NULL, 'TCC', '[\"TCC\"]', 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:12', '2026-06-14 22:57:12', NULL),
(11, 'Ouali', 'Mohammed', 'm.ouali@umi.ac.ma', NULL, NULL, '$2y$12$zsTSEZBrDsdVuHnwKkFiQ.bn16oUP3NnWwaFV8xe4w4/m4ZCEl1UO', 'PROFESSEUR', 'Maître de Conférences', 'Génie Civil', 'Génie Civil & Mécanique', NULL, NULL, 'GC', '[\"GC\", \"PMD\"]', 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:12', '2026-06-14 22:57:12', NULL),
(12, 'Amrani', 'Yassine', 'y.amrani@edu.umi.ac.ma', NULL, NULL, '$2y$12$NY6Sn5n6RFncSDv/c0ox2uWIzMS.zwXiBhfCMUUZLBvZBkBU9itDO', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R130045678', 'GI', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:12', '2026-06-14 22:57:12', NULL),
(13, 'Benchekroun', 'Salma', 's.benchekroun@edu.umi.ac.ma', NULL, NULL, '$2y$12$.vTJim5.k4Z8FbBL8h07yeNEM4MCcP5SpmMaIUoeQFxxim9oYUnDm', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R130034521', 'GI', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:13', '2026-06-14 22:57:13', NULL),
(14, 'El Idrissi', 'Fatima', 'f.elidrissi@edu.umi.ac.ma', NULL, NULL, '$2y$12$XFM4Mtgl44c5vEIH1gnOJOnXciQXx3LWWVXN666Bgf1FEiJfGkNWq', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R130023456', 'GI', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:13', '2026-06-14 22:57:13', NULL),
(15, 'Tazi', 'Mehdi', 'm.tazi@edu.umi.ac.ma', NULL, NULL, '$2y$12$Nz8jVxVNG/nPJdPa6DVTmelabLCrCtgQeet1VFDqnAy7dB/.HqZLO', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R130056789', 'AI', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:13', '2026-06-14 22:57:13', NULL),
(16, 'Benmoussa', 'Aicha', 'a.benmoussa@edu.umi.ac.ma', NULL, NULL, '$2y$12$6.gz7.oFduUsFHpWLSdzV.UgaT3VPh0rLam0nt2htnOdiwEJC98oC', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R130067890', 'AI', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:13', '2026-06-14 22:57:13', NULL),
(17, 'Filali', 'Omar', 'o.filali@edu.umi.ac.ma', NULL, NULL, '$2y$12$4WmwPGTSukoR1UViTclvg.j65YL2xcjKMXThdHIcyvJKLKYG7XfFi', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R130078901', 'DWM', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:13', '2026-06-14 22:57:13', NULL),
(18, 'Khattabi', 'Rim', 'r.khattabi@edu.umi.ac.ma', NULL, NULL, '$2y$12$axKdVVaMGJNwejigBpnYPue48.ZbEDmPBbuZ1mA83mC/D0LUuctcK', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R140011111', 'TCC', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:14', '2026-06-14 22:57:14', NULL),
(19, 'Alami', 'Nour', 'n.alami@edu.umi.ac.ma', NULL, NULL, '$2y$12$AKLGAJqqBtHiHz7akk0C8Oh80cW3LoWJ75esTdOP0GpWK9ljsILvm', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R140022222', 'TCC', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:14', '2026-06-14 22:57:14', NULL),
(20, 'Ziani', 'Tariq', 't.ziani@edu.umi.ac.ma', NULL, NULL, '$2y$12$ei7hacMhwvpf8VGWNyAbW.7Y2A.7jlAYrrKETWfVLnCSPT5mrm5Au', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R140044444', 'TCC', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:14', '2026-06-14 22:57:14', NULL),
(21, 'Bensouda', 'Amine', 'a.bensouda@edu.umi.ac.ma', NULL, NULL, '$2y$12$6sh/5MtKhooDihxtw6mNbemYYdpbqpk0GINatkhn5a7HF8IwjtHGS', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R150011111', 'FBA', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:14', '2026-06-14 22:57:14', NULL),
(22, 'Lahlou', 'Meryem', 'm.lahlou@edu.umi.ac.ma', NULL, NULL, '$2y$12$azbWP9Jk1exY9VsNvxHaxupgPH6L9zkX6El4HlRw9Rc7ued0Pkf0i', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R150022222', 'FBA', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(23, 'Tahiri', 'Zineb', 'z.tahiri@edu.umi.ac.ma', NULL, NULL, '$2y$12$XDKGpSk3Xg0/glLz5Q5k9.GqqzcFebsiKuSU72r04y0UURG5LlSv2', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R150033333', 'TM', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(24, 'Qasmi', 'Said', 's.qasmi@edu.umi.ac.ma', NULL, NULL, '$2y$12$Pt5czRZYFCdV79JJ9psDcOfmdsH8/oYIS68BUswVlfoLSxPDLznb2', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R160011111', 'GE', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(25, 'Ouali', 'Hassan', 'h.ouali@edu.umi.ac.ma', NULL, NULL, '$2y$12$cuOWrgea9fZvBqSKRnJFOe4iGYYVzVABbY1clLenAThqE4PW0/uai', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R160022222', 'GE', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL),
(26, 'Saidi', 'Karim', 'k.saidi@edu.umi.ac.ma', NULL, NULL, '$2y$12$4.q1aQuc3AvjSaXxoHyzLuS5NL6sauNzB7ap4r2Ni.JEJAGkPWrnK', 'ETUDIANT', NULL, NULL, NULL, NULL, 'R170011111', 'GC', NULL, 'actif', 0, NULL, NULL, NULL, '2026-06-14 22:57:15', '2026-06-14 22:57:15', NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `absences`
--
ALTER TABLE `absences`
  ADD CONSTRAINT `absences_etudiant_id_foreign` FOREIGN KEY (`etudiant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absences_seance_id_foreign` FOREIGN KEY (`seance_id`) REFERENCES `seances` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `archive_policies`
--
ALTER TABLE `archive_policies`
  ADD CONSTRAINT `archive_policies_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `attestations`
--
ALTER TABLE `attestations`
  ADD CONSTRAINT `attestations_club_id_foreign` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `attestations_demandeur_id_foreign` FOREIGN KEY (`demandeur_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `attestations_evenement_id_foreign` FOREIGN KEY (`evenement_id`) REFERENCES `evenements` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `attestations_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `clubs`
--
ALTER TABLE `clubs`
  ADD CONSTRAINT `clubs_prof_referent_id_foreign` FOREIGN KEY (`prof_referent_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `clubs_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `club_membres`
--
ALTER TABLE `club_membres`
  ADD CONSTRAINT `club_membres_club_id_foreign` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `club_membres_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `demandes_stages`
--
ALTER TABLE `demandes_stages`
  ADD CONSTRAINT `demandes_stages_etudiant_id_foreign` FOREIGN KEY (`etudiant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `demandes_stages_offre_id_foreign` FOREIGN KEY (`offre_id`) REFERENCES `offres_stages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `demandes_stages_traite_par_foreign` FOREIGN KEY (`traite_par`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `emprunts`
--
ALTER TABLE `emprunts`
  ADD CONSTRAINT `emprunts_document_id_foreign` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `emprunts_emprunteur_id_foreign` FOREIGN KEY (`emprunteur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `evenements`
--
ALTER TABLE `evenements`
  ADD CONSTRAINT `evenements_club_id_foreign` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `evenements_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD CONSTRAINT `inscriptions_evenement_id_foreign` FOREIGN KEY (`evenement_id`) REFERENCES `evenements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `matieres`
--
ALTER TABLE `matieres`
  ADD CONSTRAINT `matieres_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`);

--
-- Contraintes pour la table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_etudiant_id_foreign` FOREIGN KEY (`etudiant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_matiere_id_foreign` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_demandeur_id_foreign` FOREIGN KEY (`demandeur_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservations_salle_id_foreign` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`id`);

--
-- Contraintes pour la table `seances`
--
ALTER TABLE `seances`
  ADD CONSTRAINT `seances_enseignant_id_foreign` FOREIGN KEY (`enseignant_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `seances_salle_id_foreign` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`id`);

--
-- Contraintes pour la table `sponsors`
--
ALTER TABLE `sponsors`
  ADD CONSTRAINT `sponsors_evenement_id_foreign` FOREIGN KEY (`evenement_id`) REFERENCES `evenements` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `stages_etudiant_id_foreign` FOREIGN KEY (`etudiant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stages_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
