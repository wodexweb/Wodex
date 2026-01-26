-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2026 at 01:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `corporate_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`, `avatar`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(6, 'ayush', 'ayush@gmail.com', '$2y$10$y8u8/VqUrXG5PS.KGolk8.hebeHmXHDdt57TPKINK80MQEFpURlZy', 'avatars/q57EKeit8qXCf63dA5HyB1HRl6vXRNRLZIMJrrQq.png', NULL, NULL, '2026-01-10 07:40:40', '2026-01-10 10:24:21'),
(7, 'Ayush', 'srayush11201@gmail.com', '$2y$10$xWVT14U8xkoapIBtjYy3V.WwI.dtil3WZZR/Dsg41s8KuawNcarZm', 'avatars/Ey2VPzhZYaFNuQoe8nLWM7NkdtoejuF0zCKmnRH5.jpg', NULL, NULL, '2026-01-10 10:44:25', '2026-01-17 05:05:04'),
(8, 'rehan', 'jangadrehansan@gmail.com', '$2y$10$XrkhRWEWKlrDQKSZm1EM0e/yJuj5KnwmAra4TUNtLjgKQDPII97i2', 'avatars/QNjj1oxWrBed9QnIKPD009tN5xhDOimG8ftuz80z.jpg', NULL, NULL, '2026-01-19 05:43:38', '2026-01-19 05:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `admin_profiles`
--

CREATE TABLE `admin_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `photo` longtext DEFAULT NULL,
  `link` varchar(191) DEFAULT NULL,
  `end_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `photo`, `link`, `end_date`, `description`, `created_at`, `updated_at`) VALUES
(1, 'aWFEWFWEFQF', 'announcements/oGPhMCiTBsho4KGW94OuKVNGFW2R55j8ZIaCBGtj.jpg', 'https://grok.com/', '2026-01-09', 'SWFWEFWERFWRDEWDWQWDWDWDW', '2026-01-09 06:28:08', '2026-01-09 06:28:08'),
(2, 'efwgfwedgf', 'announcements/3tHVmKiiyixgx0KKmD49NuItjkpvc5kNc6gsBknN.jpg', 'http://localhost:5174/add/announcement', '2026-01-10', 'eqdfqewfdsc', '2026-01-10 11:53:35', '2026-01-10 11:53:35'),
(3, 'erwetergergrgrgt', 'announcements/IpuV4wqNwrcXntNVgs4uVSDdOZem00SadS3pjV9y.jpg', 'https://grok.com/', '2026-01-20', 'dqwdqwdqwdqweqwedew', '2026-01-20 05:42:56', '2026-01-20 05:42:56'),
(4, 'dqwdwqdqwdwdwd', 'announcements/tJkaH8IOg1Td1E0QdFFrOmbGSzVDLqjAvntxkp1S.png', 'http://localhost:5174/add/announcement', '2026-01-20', 'wdqdqwdwdwdwd', '2026-01-20 05:43:39', '2026-01-20 05:43:39'),
(5, 'wfffffeeed', 'announcements/d2s6gO3TiqqzV2uJhJV226DdaH7pIW7ERDslQJXo.jpg', 'http://localhost:5174/add/announcement', '2026-01-20', 'efwefffdwddeded', '2026-01-20 05:44:13', '2026-01-20 05:44:13'),
(6, 'dewfwfwefe', 'announcements/596NyRCOeWlLydGU41RRx8dobW2dntC4LIeriDX0.jpg', 'http://localhost:5174/add/announcement', '2026-01-20', 'dqdqwdwdwd', '2026-01-20 05:44:47', '2026-01-20 05:44:47');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(191) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(191) NOT NULL,
  `owner` varchar(191) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_settings`
--

CREATE TABLE `contact_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `contact_number` varchar(191) DEFAULT NULL,
  `contact_number_1` varchar(191) DEFAULT NULL,
  `whatsapp_number` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `working_hours` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `google_map_link` varchar(191) DEFAULT NULL,
  `facebook_url` varchar(191) DEFAULT NULL,
  `instagram_url` varchar(191) DEFAULT NULL,
  `youtube_url` varchar(191) DEFAULT NULL,
  `linkedin_url` varchar(191) DEFAULT NULL,
  `x_url` varchar(191) DEFAULT NULL,
  `custom_url` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `link` varchar(191) NOT NULL,
  `photo` longtext DEFAULT NULL,
  `description` text NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('upcoming','recent','past') NOT NULL DEFAULT 'upcoming',
  `is_manual` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `link`, `photo`, `description`, `end_date`, `status`, `is_manual`, `created_at`, `updated_at`) VALUES
(3, 'dvfvdf', 'http://localhost:5174/add/announcement', 'events/O22iVwC9pY43YvPbbvu5q5kKyVwdpEPiux8fC2lm.png', 'fesfefefe', '2026-01-17', 'upcoming', 0, '2026-01-17 05:04:12', '2026-01-17 05:04:12'),
(4, 'jhijhihhihoi', 'http://localhost:5174/add/announcement', 'events/QWiNEXzBetFpYtVFUnnRZ1nb4mbuV2c2Dze4TI0M.jpg', 'vsdfnfwefeofewofjewofoefofonfoewnnfewofnewfnonoeofnoewnnewnfwfoweonojewfnewonwennnnnfcvbhnjkmlwndjwdodjoidowodoqwjdjodjwdwdwwdwdwd', '2026-01-20', 'upcoming', 0, '2026-01-20 04:38:18', '2026-01-20 04:38:18'),
(5, 'wdqdqwwee', 'http://localhost:5174/add/announcement', 'events/N7JbPAJFHznmHFKiIJmRkXMrD7VGmLFqR29sZOrM.png', 'wdwdwdwdwdw', '2026-01-21', 'upcoming', 0, '2026-01-21 05:30:27', '2026-01-21 05:30:27');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(191) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `header_settings`
--

CREATE TABLE `header_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `header_title` varchar(191) DEFAULT NULL,
  `drive_link` varchar(191) DEFAULT NULL,
  `title_color` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_files`
--

CREATE TABLE `media_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `media_name` varchar(191) NOT NULL,
  `file_path` varchar(191) NOT NULL,
  `media_type` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media_files`
--

INSERT INTO `media_files` (`id`, `media_name`, `file_path`, `media_type`, `created_at`, `updated_at`) VALUES
(1, 'rewewffed', 'media_library/8u4PaAOVecqhJ0Pdese4hLUTVRnNk0L87lyJ1fnP.jpg', 'Banner image', '2026-01-26 06:19:04', '2026-01-26 06:19:04');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `position` varchar(191) NOT NULL,
  `rank` int(11) NOT NULL DEFAULT 0,
  `category` varchar(191) DEFAULT NULL,
  `photo` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `name`, `position`, `rank`, `category`, `photo`, `created_at`, `updated_at`) VALUES
(1, 'arise', 'pr', 1, NULL, 'members/s2vaqUMCcPbnYuga94Eq2oulUo5nclc7YhpiOngs.jpg', '2026-01-09 06:36:57', '2026-01-09 06:36:57'),
(2, 'Yadav', 'werewede', 2, NULL, 'members/qI39RN89IG1nTT9LmA1ZVDK2y8N0F4zJQ2rFk0hz.png', '2026-01-21 04:33:23', '2026-01-21 04:33:23'),
(3, 'eesdvsdwefew', 'fdwfdvdvvdfe', 3, NULL, 'members/4j9uFtnCkgcAOlVDUxEKVE3y1qruTBTPvyJGVLy0.jpg', '2026-01-21 04:33:53', '2026-01-21 04:33:53'),
(4, 'vfffeed', 'dwdwdws', 4, NULL, 'members/QgRycuvQu7KnCbnzxIO4kPOskCKYgmAcKQVPl3u5.jpg', '2026-01-21 04:34:25', '2026-01-21 04:34:25');

-- --------------------------------------------------------

--
-- Table structure for table `membership_plans`
--

CREATE TABLE `membership_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration_months` int(11) NOT NULL,
  `benefits` text NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `location` enum('header','footer') NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `menu_id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `target` enum('_self','_blank') NOT NULL DEFAULT '_self',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_100000_create_password_resets_table', 1),
(2, '2019_08_19_000000_create_failed_jobs_table', 1),
(3, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(4, '2026_01_03_041227_create_admin_table', 1),
(5, '2026_01_03_045325_add_expires_at_to_personal_access_tokens_table', 1),
(6, '2026_01_04_065727_create_events_table', 1),
(7, '2026_01_04_065828_add_is_manual_to_events_table', 1),
(8, '2026_01_04_065920_create_members_table', 1),
(9, '2026_01_04_065950_create_announcement_table', 1),
(10, '2026_01_04_070259_create_registrations_table', 1),
(11, '2026_01_04_070317_create_payments_table', 1),
(12, '2026_01_04_070412_create_cache_table', 1),
(13, '2026_01_10_133434_create_admin_profiles_table', 2),
(14, '2026_01_16_113646_create_settings_table', 3),
(15, '2026_01_17_105129_create_contact_settings_table', 3),
(16, '2026_01_21_103824_create_header_settings_table', 3),
(17, '2026_01_22_094956_create_menus_table', 3),
(18, '2026_01_22_095144_create_menu_items_table', 3),
(19, '2026_01_24_073510_create_notices_table', 4),
(20, '2026_01_24_102541_create_pdf_pages_table', 4),
(21, '2026_01_24_105147_create_achievements_table', 4),
(22, '2026_01_25_171425_create_membership_plans_table', 4),
(23, '2026_01_25_174141_create_media_files_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `notice_title` varchar(191) NOT NULL,
  `notice_description` longtext NOT NULL,
  `publish_date` date NOT NULL,
  `visibility` varchar(191) NOT NULL DEFAULT 'public',
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `attachment_path` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) NOT NULL,
  `otp` varchar(191) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`email`, `otp`, `expires_at`, `created_at`, `updated_at`) VALUES
('arise@gmail.com', '$2y$10$0neuAU9sAraTSmhs.Fc4Cen0eshfE7TekrO/uZofAm/AsfQQT59Qy', '2026-01-09 08:23:47', '2026-01-09 02:53:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_id` varchar(191) NOT NULL,
  `order_id` varchar(191) DEFAULT NULL,
  `signature` varchar(191) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(191) NOT NULL DEFAULT 'success',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pdf_pages`
--

CREATE TABLE `pdf_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `link` text DEFAULT NULL,
  `pdf_for` varchar(191) DEFAULT NULL,
  `file_path` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `expires_at`, `last_used_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Admin', 1, 'auth_token', '00a0e750f4d3305c85c3096dd45570276d1894538b449ec006cbd5a5d9b6c990', '[\"*\"]', NULL, NULL, '2026-01-08 23:14:43', '2026-01-08 23:14:43'),
(2, 'App\\Models\\Admin', 1, 'auth_token', 'ba635e3bc7bac4d7edf62e3b5b24b8d4757f6a3ee7d8dfa04bd6102187469ea0', '[\"*\"]', NULL, NULL, '2026-01-08 23:17:09', '2026-01-08 23:17:09'),
(3, 'App\\Models\\Admin', 1, 'auth_token', 'f3efd15f533ebd0b2487bfb0ebc265df81e779a89df642a3a5b8076057ac464c', '[\"*\"]', NULL, NULL, '2026-01-09 01:11:09', '2026-01-09 01:11:09'),
(4, 'App\\Models\\Admin', 1, 'auth_token', '6e9c184378599a9f6d6ccc794df6f1e5fb6c5206864e77e4f517454166973643', '[\"*\"]', NULL, '2026-01-09 01:33:28', '2026-01-09 01:24:56', '2026-01-09 01:33:28'),
(5, 'App\\Models\\Admin', 1, 'auth_token', '360815c06c11955be4928d1913ed4d924353b960ff46ce9d8f6c16e8352ca88b', '[\"*\"]', NULL, '2026-01-09 02:49:51', '2026-01-09 02:32:51', '2026-01-09 02:49:51'),
(6, 'App\\Models\\Admin', 2, 'auth_token', 'ad4ef7d39d5fb52128d45101c51fa40663acf43570850536236629293e4d173d', '[\"*\"]', NULL, NULL, '2026-01-09 02:53:18', '2026-01-09 02:53:18'),
(7, 'App\\Models\\Admin', 3, 'auth_token', 'f5cdef4babf80c160a959fc51907e49081c639e9cc3bd34c58ecfd6223b20f7f', '[\"*\"]', NULL, NULL, '2026-01-09 03:13:31', '2026-01-09 03:13:31'),
(8, 'App\\Models\\Admin', 3, 'auth_token', '36ba64efc84f5b06061fa6ae8de5dfe00b0b6acd005f014eb2db3decd7963cc1', '[\"*\"]', NULL, '2026-01-09 03:14:33', '2026-01-09 03:14:15', '2026-01-09 03:14:33'),
(9, 'App\\Models\\Admin', 3, 'auth_token', '652432e54160516ad3c2d12eca611f02208e7564aea002ba55be5edb1d255198', '[\"*\"]', NULL, '2026-01-09 03:51:33', '2026-01-09 03:44:11', '2026-01-09 03:51:33'),
(10, 'App\\Models\\Admin', 3, 'auth_token', '7f515d5d74be3dfdb9b0c8c9acbf00571d81c44a1229ed7852c09e2fc6c84671', '[\"*\"]', NULL, '2026-01-09 05:04:52', '2026-01-09 03:52:20', '2026-01-09 05:04:52'),
(11, 'App\\Models\\Admin', 3, 'auth_token', 'f180b41033d4b226c0d68847197714bd82b2db9f59c43468b4d0aa2b4d6d76bb', '[\"*\"]', NULL, '2026-01-09 05:20:26', '2026-01-09 04:17:55', '2026-01-09 05:20:26'),
(12, 'App\\Models\\Admin', 3, 'auth_token', '1979c37b4cd1d4c32685f6f58239bdc52c91b42dda10e850cf83146ae1a340f1', '[\"*\"]', NULL, '2026-01-09 05:30:01', '2026-01-09 05:06:01', '2026-01-09 05:30:01'),
(13, 'App\\Models\\Admin', 3, 'auth_token', '9ee9e9eb9ed7ef612fdbd712664401b454ae35e667fc853db11443839dbbf65d', '[\"*\"]', NULL, '2026-01-09 06:49:55', '2026-01-09 05:31:56', '2026-01-09 06:49:55'),
(14, 'App\\Models\\Admin', 4, 'auth_token', '80ceacb2693e659b2e9f9e5c6bc50b4c9358303583f890be9f524cc593c27f47', '[\"*\"]', NULL, NULL, '2026-01-09 06:51:22', '2026-01-09 06:51:22'),
(15, 'App\\Models\\Admin', 4, 'auth_token', 'c4a7b788fcde3853ed6bf49958a723e69690ab96cc7bc030b7773bf5b940ae50', '[\"*\"]', NULL, NULL, '2026-01-09 06:52:23', '2026-01-09 06:52:23'),
(17, 'App\\Models\\Admin', 6, 'auth_token', 'd719deda94e794a03b4ed933b1b23f02cdfa364ff0b5144929f5c628a22fe5fd', '[\"*\"]', NULL, NULL, '2026-01-10 07:40:40', '2026-01-10 07:40:40'),
(18, 'App\\Models\\Admin', 6, 'auth_token', '17aaa728c6b0116a2e8ce39baad898a406a5fd4e3548ea4e01813a0bcb245d6e', '[\"*\"]', NULL, '2026-01-10 10:31:59', '2026-01-10 07:41:59', '2026-01-10 10:31:59'),
(26, 'App\\Models\\Admin', 8, 'auth_token', '8435a648c3c0811e721ffeb81c3890a65e999eb07f80d2a0e27529a1870ff0ef', '[\"*\"]', NULL, NULL, '2026-01-19 05:43:38', '2026-01-19 05:43:38'),
(27, 'App\\Models\\Admin', 7, 'auth_token', 'abeaa65f7230a90ad00a9bed61c263792ab4518e6e06151a7c210031a006e124', '[\"*\"]', NULL, '2026-01-20 05:42:02', '2026-01-20 04:33:04', '2026-01-20 05:42:02'),
(28, 'App\\Models\\Admin', 7, 'auth_token', '13a285a0264d0b11d66e8caeddf8c204943f80b9efa9587c10d6209853701fb4', '[\"*\"]', NULL, '2026-01-21 04:32:27', '2026-01-20 05:42:28', '2026-01-21 04:32:27'),
(29, 'App\\Models\\Admin', 7, 'auth_token', '7ca76d60fc7de222dda5e6ccc4d19c54a6e503fc322fa8474bad08344666861a', '[\"*\"]', NULL, '2026-01-26 03:15:26', '2026-01-21 04:32:47', '2026-01-26 03:15:26'),
(30, 'App\\Models\\Admin', 7, 'auth_token', '50dd0662b6ee4fd2e027ed1b62ffcc61a2c62fd187c75539772077516ce0241f', '[\"*\"]', NULL, NULL, '2026-01-26 03:15:58', '2026-01-26 03:15:58'),
(31, 'App\\Models\\Admin', 7, 'auth_token', '869fbaf001017678c23bf65dd426c427b3e9560b226c995d721e2c812f9ed63f', '[\"*\"]', NULL, '2026-01-26 04:48:26', '2026-01-26 03:31:46', '2026-01-26 04:48:26'),
(32, 'App\\Models\\Admin', 7, 'auth_token', '207e62d5f69ae7df3f33ddccb685862b884970fb9b41c67889194a32aa59ac31', '[\"*\"]', NULL, '2026-01-26 06:24:03', '2026-01-26 04:48:51', '2026-01-26 06:24:03');

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `surname` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `address` text NOT NULL,
  `state` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `ciap` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `system_name` varchar(191) DEFAULT NULL,
  `application_title` varchar(191) DEFAULT NULL,
  `website_url` varchar(191) DEFAULT NULL,
  `website_title` varchar(191) DEFAULT NULL,
  `website_description` text DEFAULT NULL,
  `website_keywords` varchar(191) DEFAULT NULL,
  `site_copyright` varchar(191) DEFAULT NULL,
  `website_logo` varchar(191) DEFAULT NULL,
  `admin_logo` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `system_name`, `application_title`, `website_url`, `website_title`, `website_description`, `website_keywords`, `site_copyright`, `website_logo`, `admin_logo`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-26 05:05:41', '2026-01-26 05:05:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_email_unique` (`email`);

--
-- Indexes for table `admin_profiles`
--
ALTER TABLE `admin_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_profiles_email_unique` (`email`),
  ADD KEY `admin_profiles_admin_id_foreign` (`admin_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `contact_settings`
--
ALTER TABLE `contact_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `header_settings`
--
ALTER TABLE `header_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media_files`
--
ALTER TABLE `media_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `membership_plans`
--
ALTER TABLE `membership_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_items_menu_id_foreign` (`menu_id`),
  ADD KEY `menu_items_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD UNIQUE KEY `password_resets_email_unique` (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_payment_id_unique` (`payment_id`),
  ADD KEY `payments_user_id_foreign` (`user_id`);

--
-- Indexes for table `pdf_pages`
--
ALTER TABLE `pdf_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registrations_email_unique` (`email`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admin_profiles`
--
ALTER TABLE `admin_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact_settings`
--
ALTER TABLE `contact_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `header_settings`
--
ALTER TABLE `header_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_files`
--
ALTER TABLE `media_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `membership_plans`
--
ALTER TABLE `membership_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pdf_pages`
--
ALTER TABLE `pdf_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_profiles`
--
ALTER TABLE `admin_profiles`
  ADD CONSTRAINT `admin_profiles_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `menu_items_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
