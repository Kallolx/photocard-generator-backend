-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 21, 2026 at 12:00 PM
-- Server version: 10.11.16-MariaDB
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `onedigit_newscard`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `type`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 'signup', 'New User Signup', 'User Kamrul Hasan Kallol (lelabis898@ametitas.com) has registered.', 1, '2026-01-30 18:34:19'),
(2, 'signup', 'New User Signup', 'User Hk (ji@gmail.com) has registered.', 1, '2026-01-31 00:13:23'),
(3, 'signup', 'New User Signup', 'User kukun (falir14009@rograc.com) has registered.', 1, '2026-01-31 09:53:30'),
(4, 'signup', 'New User Signup', 'User Md.Jahid Hasan (zahidahmedjoy81@gmail.com) has registered.', 1, '2026-01-31 10:55:59'),
(5, 'signup', 'New User Signup', 'User John Doe (behejohon264@gmail.com) has registered.', 1, '2026-02-01 09:54:41');

-- --------------------------------------------------------

--
-- Table structure for table `api_keys`
--

CREATE TABLE `api_keys` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `status` enum('active','revoked') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `daily_usage` int(11) DEFAULT 0,
  `last_reset_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `api_keys`
--

INSERT INTO `api_keys` (`id`, `user_id`, `api_key`, `status`, `created_at`, `daily_usage`, `last_reset_date`) VALUES
(7, 6, 'pk_live_3e39f8015e7d47f583d4f397ef8d540b', 'active', '2026-02-08 15:31:02', 0, '2026-02-18');

-- --------------------------------------------------------

--
-- Table structure for table `card_generations`
--

CREATE TABLE `card_generations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_type` enum('url','custom') NOT NULL,
  `source_url` varchar(1000) DEFAULT NULL COMMENT 'URL for URL-based cards',
  `is_batch` tinyint(1) DEFAULT 0,
  `batch_count` int(11) DEFAULT 1,
  `theme` varchar(50) DEFAULT NULL,
  `font` varchar(50) DEFAULT NULL,
  `background_color` varchar(50) DEFAULT NULL,
  `download_allowed` tinyint(1) DEFAULT 1 COMMENT 'Can user download this card',
  `download_count` int(11) DEFAULT 0 COMMENT 'Times downloaded',
  `access_token` varchar(64) DEFAULT NULL COMMENT 'Secure token for download access',
  `access_expires_at` datetime DEFAULT NULL COMMENT 'When download access expires',
  `file_path` varchar(500) DEFAULT NULL COMMENT 'Server path to generated card',
  `file_size` int(11) DEFAULT NULL COMMENT 'File size in bytes',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `card_generations`
--

INSERT INTO `card_generations` (`id`, `user_id`, `card_type`, `source_url`, `is_batch`, `batch_count`, `theme`, `font`, `background_color`, `download_allowed`, `download_count`, `access_token`, `access_expires_at`, `file_path`, `file_size`, `ip_address`, `user_agent`, `created_at`) VALUES
(56, 13, 'url', 'https://www.songbadprokash.com/international/122888', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 10:57:20'),
(57, 13, 'url', 'https://www.prothomalo.com/entertainment/hollywood/19amvwvhzv', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 11:12:13'),
(58, 13, 'url', 'https://www.songbadprokash.com/lifestyle/122875', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 11:13:19'),
(59, 13, 'url', 'https://www.songbadprokash.com/entertainment/122867', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 11:15:06'),
(60, 13, 'url', 'https://www.songbadprokash.com/country/122882', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 11:27:43'),
(61, 13, 'url', 'https://www.songbadprokash.com/country/122869', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 11:32:06'),
(62, 13, 'url', 'https://www.songbadprokash.com/country/122869', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 11:36:25'),
(63, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174450/', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 11:46:55'),
(64, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174473/', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 11:47:05'),
(65, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174472/', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 11:48:20'),
(66, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174472/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 11:57:40'),
(67, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174446/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 11:57:58'),
(68, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174445/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:02:21'),
(69, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174445/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:03:06'),
(70, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174419/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:03:22'),
(71, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174419/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:06:29'),
(72, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174438/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:06:43'),
(73, 6, 'url', 'https://sangbad.net.bd/news/business/2026/174412/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:09:20'),
(74, 6, 'url', 'https://sangbad.net.bd/news/business/2026/174465/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:09:31'),
(75, 6, 'url', 'https://sangbad.net.bd/news/business/2026/174412/', 1, 2, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:22:21'),
(76, 6, 'url', 'https://sangbad.net.bd/news/politics/2026/174419/', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:22:38'),
(77, 6, 'url', 'https://sangbad.net.bd/news/business/2026/174465/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:38:45'),
(78, 6, 'url', 'https://sangbad.net.bd/news/business/2026/174478/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:39:04'),
(79, 6, 'url', 'https://sangbad.net.bd/news/business/2026/174478/', 1, 2, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-01-31 12:39:13'),
(80, 13, 'url', 'https://www.songbadprokash.com/international/122888', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 13:02:18'),
(81, 13, 'url', 'https://www.prothomalo.com/bangladesh/district/3ogkmtkkvn', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 13:55:29'),
(82, 13, 'url', 'https://www.songbadprokash.com/country/122869', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 16:40:15'),
(83, 13, 'url', 'https://www.songbadprokash.com/country/122869', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-01-31 16:47:22'),
(84, 13, 'url', 'https://www.bd-pratidin.com/city-news/2026/02/01/1211825', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-01 07:58:00'),
(85, 13, 'url', 'https://www.bd-pratidin.com/economy/2026/02/01/1211770', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-01 08:14:46'),
(89, 6, 'url', 'https://dailysangram.com/bangladesh/country-news/LcIvaAcAbls3/', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '163.47.38.66', NULL, '2026-02-02 11:36:53'),
(90, 13, 'url', 'https://www.songbadprokash.com/entertainment/122944', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-02 12:37:13'),
(91, 13, 'url', 'https://www.songbadprokash.com/international/123002', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-03 21:56:54'),
(92, 13, 'url', 'https://www.songbadprokash.com/national/123024', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-04 07:34:54'),
(93, 13, 'url', 'https://www.rupalibangladesh.com/entertainment-news/bollywood/114254', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-04 08:35:04'),
(94, 13, 'url', 'https://www.songbadprokash.com/national/123029', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-04 12:21:51'),
(95, 13, 'url', 'https://www.prothomalo.com/bangladesh/district/pu1sdhkt8t', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-04 12:29:19'),
(96, 6, 'url', 'https://sorejominbarta.com/dhormo/article/51867', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-05 00:02:14'),
(97, 6, 'url', 'https://sorejominbarta.com/dhormo/article/51867', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-05 00:02:27'),
(98, 6, 'url', 'https://sorejominbarta.com/political/article/51921', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-05 00:02:48'),
(99, 13, 'url', 'https://www.songbadprokash.com/national/123058', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 06:39:59'),
(100, 13, 'url', 'https://www.songbadprokash.com/sports/123068', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 06:43:11'),
(101, 13, 'url', 'https://www.songbadprokash.com/national/123060', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 06:48:57'),
(102, 13, 'url', 'https://www.songbadprokash.com/sports/123068', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 06:57:43'),
(103, 13, 'url', 'https://www.songbadprokash.com/sports/123056', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 06:58:03'),
(104, 13, 'url', 'https://www.songbadprokash.com/international/123066', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 06:59:57'),
(105, 13, 'url', 'https://www.songbadprokash.com/national/123067', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:03:02'),
(106, 13, 'url', 'https://www.songbadprokash.com/national/123057', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:14:11'),
(107, 13, 'url', 'https://www.songbadprokash.com/entertainment/123065', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:15:27'),
(108, 13, 'url', 'https://www.songbadprokash.com/entertainment/123051', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:17:11'),
(109, 13, 'url', 'https://www.songbadprokash.com/entertainment/123050', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:18:47'),
(110, 13, 'url', 'https://www.songbadprokash.com/education/123063', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:21:12'),
(111, 13, 'url', 'https://www.songbadprokash.com/entertainment/123064', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:23:50'),
(112, 13, 'url', 'https://www.jugantor.com/capital/1061605', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:29:02'),
(113, 13, 'url', 'https://www.songbadprokash.com/national/123059', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 07:31:55'),
(114, 13, 'url', 'https://www.songbadprokash.com/national/123071', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 08:22:35'),
(115, 13, 'url', 'https://www.songbadprokash.com/national/123070', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 08:26:13'),
(116, 13, 'url', 'https://www.songbadprokash.com/national/123072', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 08:32:49'),
(117, 13, 'url', 'https://www.songbadprokash.com/sports/123073', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 08:42:18'),
(118, 13, 'url', 'https://www.songbadprokash.com/jobs/123074', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '119.148.35.115', NULL, '2026-02-05 09:24:54'),
(119, 13, 'url', 'https://www.songbadprokash.com/national/123102', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-06 12:54:58'),
(120, 6, 'url', 'https://samakal.com/whole-country/article/336958/%E0%A6%A8%E0%A6%BF%E0%A6%B0%E0%A6%BE%E0%A6%AA%E0%A6%A4%E0%A7%8D%E0%A6%A4%E0%A6%BE-%E0%A6%B6%E0%A6%99%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A7%9F-%E0%A6%A8%E0%A6%BF%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%9A%E0%A6%A8-%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%9C%E0%A6%A8-%E0%A6%95%E0%A6%B0%E0%A6%B2%E0%A7%87%E0%A6%A8-%E0%A6%B8%E0%A6%BE%E0%A6%AC%E0%A7%87%E0%A6%95-%E0%A6%8F%E0%A6%AE%E0%A6%AA%E0%A6%BF-%E0%A6%9C%E0%A6%BF%E0%A6%A8%E0%A7%8D%E0%A6%A8%E0%A6%BE%E0%A6%B9%C2%A0', 0, 1, 'modern2', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 15:43:06'),
(121, 6, 'url', 'https://samakal.com/whole-country/article/336981/%E0%A6%95%E0%A7%87%E0%A6%89-%E0%A6%AD%E0%A7%8B%E0%A6%9F-%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%A4%E0%A7%87-%E0%A6%8F%E0%A6%B2%E0%A7%87-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%A4%E0%A6%BF%E0%A6%B9%E0%A6%A4-%E0%A6%95%E0%A6%B0%E0%A6%BE-%E0%A6%B9%E0%A6%AC%E0%A7%87:-%E0%A6%B0%E0%A7%87%E0%A6%9C%E0%A6%BE%E0%A6%89%E0%A6%B2-%E0%A6%95%E0%A6%B0%E0%A6%BF%E0%A6%AE%C2%A0', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 15:54:33'),
(122, 6, 'url', 'https://samakal.com/whole-country/article/336981/%E0%A6%95%E0%A7%87%E0%A6%89-%E0%A6%AD%E0%A7%8B%E0%A6%9F-%E0%A6%95%E0%A6%BE%E0%A6%9F%E0%A6%A4%E0%A7%87-%E0%A6%8F%E0%A6%B2%E0%A7%87-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%A4%E0%A6%BF%E0%A6%B9%E0%A6%A4-%E0%A6%95%E0%A6%B0%E0%A6%BE-%E0%A6%B9%E0%A6%AC%E0%A7%87:-%E0%A6%B0%E0%A7%87%E0%A6%9C%E0%A6%BE%E0%A6%89%E0%A6%B2-%E0%A6%95%E0%A6%B0%E0%A6%BF%E0%A6%AE%C2%A0', 0, 1, 'modern2', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 16:25:24'),
(123, 6, 'url', 'https://www.jugantor.com/national/1062216', 0, 1, 'modern2', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 16:26:53'),
(124, 6, 'url', 'https://www.jugantor.com/national/1062216', 0, 1, 'modern2', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 16:27:54'),
(125, 6, 'url', 'https://www.jugantor.com/politics-others/1062222', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 16:28:08'),
(126, 6, 'url', 'https://www.jugantor.com/politics-others/1062222', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 16:30:43'),
(127, 6, 'url', 'https://www.jugantor.com/politics-others/1062222', 0, 1, 'modern2', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 16:57:12'),
(128, 6, 'url', 'https://www.prothomalo.com/bangladesh/district/hgnt4frb4b', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-06 23:27:01'),
(129, 13, 'url', 'https://www.songbadprokash.com/national/123118', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 11:39:07'),
(130, 13, 'url', 'https://www.songbadprokash.com/national/123126', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 11:40:51'),
(131, 13, 'url', 'https://www.songbadprokash.com/national/123119', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 11:53:39'),
(132, 13, 'url', 'https://www.songbadprokash.com/national/123120', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 11:55:06'),
(133, 13, 'url', 'https://www.songbadprokash.com/sports/123121', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 11:56:04'),
(134, 13, 'url', 'https://www.songbadprokash.com/entertainment/123124', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 11:57:38'),
(135, 13, 'url', 'https://www.songbadprokash.com/science-technology/123129', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 12:13:17'),
(136, 13, 'url', 'https://www.prothomalo.com/fun/t684gtf8fz', 0, 1, 'modern2', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 12:37:10'),
(137, 13, 'url', 'https://www.songbadprokash.com/lifestyle/123130', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 14:18:39'),
(138, 13, 'url', 'https://www.songbadprokash.com/education/123131', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 14:25:27'),
(139, 13, 'url', 'https://www.songbadprokash.com/national/123148', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-07 18:54:22'),
(140, 13, 'url', 'https://www.songbadprokash.com/national/123148', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-08 11:03:12'),
(141, 13, 'url', 'https://www.songbadprokash.com/national/123154', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 07:41:01'),
(142, 13, 'url', 'https://www.songbadprokash.com/national/123155', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 07:42:42'),
(143, 13, 'url', 'https://www.songbadprokash.com/national/123156', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 07:52:21'),
(144, 13, 'url', 'https://www.songbadprokash.com/national/123175', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 08:11:55'),
(145, 13, 'url', 'https://www.songbadprokash.com/national/123176', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 10:03:09'),
(146, 13, 'url', 'https://www.songbadprokash.com/national/123177', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 13:08:29'),
(147, 13, 'url', 'https://www.songbadprokash.com/national/123177', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 14:58:01'),
(148, 13, 'url', 'https://www.songbadprokash.com/national/123175', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 15:04:30'),
(149, 13, 'url', 'https://www.songbadprokash.com/national/123179', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 16:28:41'),
(150, 13, 'url', 'https://www.songbadprokash.com/health/123197', 0, 1, 'modern2', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 17:48:23'),
(151, 13, 'url', 'https://www.songbadprokash.com/national/123180', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 17:57:06'),
(152, 13, 'url', 'https://www.songbadprokash.com/science-technology/123209', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 19:09:40'),
(153, 13, 'url', 'https://www.songbadprokash.com/science-technology/123208', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 19:11:14'),
(154, 13, 'url', 'https://www.songbadprokash.com/science-technology/123206', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 19:12:42'),
(155, 13, 'url', 'https://www.songbadprokash.com/sports/123210', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 19:24:04'),
(156, 13, 'url', 'https://www.songbadprokash.com/national/123211', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-09 20:09:31'),
(157, 13, 'url', 'https://www.songbadprokash.com/national/123224', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 08:55:07'),
(158, 13, 'url', 'https://www.songbadprokash.com/national', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 12:21:38'),
(159, 13, 'url', 'https://www.songbadprokash.com/national', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 12:21:44'),
(160, 13, 'url', 'https://www.songbadprokash.com/national/123246', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 12:22:00'),
(161, 13, 'url', 'https://www.songbadprokash.com/national/123247', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 12:34:03'),
(162, 13, 'url', 'https://www.songbadprokash.com/national/123248', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 12:38:18'),
(163, 13, 'url', 'https://www.songbadprokash.com/national/123249', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 12:46:35'),
(164, 13, 'url', 'https://www.songbadprokash.com/national/123250', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 13:01:30'),
(165, 13, 'url', 'https://www.songbadprokash.com/national/123251', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 13:45:42'),
(166, 13, 'url', 'https://www.songbadprokash.com/national/123252', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 13:54:33'),
(167, 13, 'url', 'https://www.songbadprokash.com/national/123230', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 14:04:18'),
(168, 13, 'url', 'https://www.songbadprokash.com/national/123256', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 14:49:26'),
(169, 13, 'url', 'https://www.songbadprokash.com/national/123257', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 15:30:11'),
(170, 13, 'url', 'https://www.songbadprokash.com/national/123261', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 16:08:57'),
(171, 13, 'url', 'https://www.songbadprokash.com/national/123259', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 16:12:13'),
(172, 13, 'url', 'https://www.songbadprokash.com/national/123264', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-10 16:26:01'),
(173, 13, 'url', 'https://www.songbadprokash.com/national/123350', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-11 13:07:27'),
(174, 13, 'url', 'https://www.songbadprokash.com/national/123371', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-11 14:44:21'),
(175, 13, 'url', 'https://www.songbadprokash.com/national/123386', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 06:48:43'),
(176, 13, 'url', 'https://www.songbadprokash.com/national/123388', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 07:01:34'),
(177, 13, 'url', 'https://www.songbadprokash.com/national/123389', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 07:05:16'),
(178, 13, 'url', 'https://www.songbadprokash.com/national/123391', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 07:16:57'),
(179, 13, 'url', 'https://www.songbadprokash.com/national/123396', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 08:03:08'),
(180, 13, 'url', 'https://www.songbadprokash.com/national/123398', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 08:13:31'),
(181, 13, 'url', 'https://www.prothomalo.com/entertainment/tv/tgqw9jnk4j', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 11:12:24'),
(182, 13, 'url', 'https://www.songbadprokash.com/national/123413', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 14:25:34'),
(183, 13, 'url', 'https://www.songbadprokash.com/national/123413', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 14:29:24'),
(184, 13, 'url', 'https://www.songbadprokash.com/national/123416', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 14:50:57'),
(185, 13, 'url', 'https://www.songbadprokash.com/national/123415', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 14:52:03'),
(186, 13, 'url', 'https://www.songbadprokash.com/national/123418', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 14:59:59'),
(187, 13, 'url', 'https://www.songbadprokash.com/national/123419', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 15:17:30'),
(188, 13, 'url', 'https://www.songbadprokash.com/national/123412', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 15:21:04'),
(189, 13, 'url', 'https://www.songbadprokash.com/national/123421', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.91', NULL, '2026-02-12 15:49:19'),
(190, 13, 'url', 'https://www.songbadprokash.com/national/123420', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 15:51:20'),
(191, 13, 'url', 'https://www.songbadprokash.com/national/123423', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 16:05:20'),
(192, 13, 'url', 'https://www.songbadprokash.com/national/123422', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 16:06:23'),
(193, 13, 'url', 'https://www.songbadprokash.com/national/123431', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 19:33:32'),
(194, 13, 'url', 'https://www.songbadprokash.com/national/123430', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 19:35:04'),
(195, 13, 'url', 'https://www.songbadprokash.com/national/123429', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 19:37:05'),
(196, 13, 'url', 'https://www.songbadprokash.com/national/123428', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-12 19:51:25'),
(197, 13, 'url', 'https://www.songbadprokash.com/national/123465', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:12:05'),
(198, 13, 'url', 'https://www.songbadprokash.com/national/123436', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:14:04'),
(199, 13, 'url', 'https://www.songbadprokash.com/national/123447', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:15:21'),
(200, 13, 'url', 'https://www.songbadprokash.com/international/123445', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:41:11'),
(201, 13, 'url', 'https://www.songbadprokash.com/national/123446', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:42:49'),
(202, 13, 'url', 'https://www.songbadprokash.com/national/123447', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:44:39'),
(203, 13, 'url', 'https://www.songbadprokash.com/national/123448', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:47:40'),
(204, 13, 'url', 'https://www.songbadprokash.com/country/123450', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:49:56'),
(205, 13, 'url', 'https://www.songbadprokash.com/national/123451', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:50:56'),
(206, 13, 'url', 'https://www.songbadprokash.com/national/123452', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:52:11'),
(207, 13, 'url', 'https://www.songbadprokash.com/national/123453', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:53:22'),
(208, 13, 'url', 'https://www.songbadprokash.com/education/123454', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 10:54:38'),
(209, 13, 'url', 'https://www.songbadprokash.com/national/123455', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:04:26'),
(210, 13, 'url', 'https://www.songbadprokash.com/national/123456', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:06:16'),
(211, 13, 'url', 'https://www.songbadprokash.com/social-media/123457', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:07:45'),
(212, 13, 'url', 'https://www.songbadprokash.com/jobs/123460', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:08:52'),
(213, 13, 'url', 'https://www.songbadprokash.com/entertainment/123461', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:10:13'),
(214, 13, 'url', 'https://www.songbadprokash.com/social-media/123462', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:21:57'),
(215, 13, 'url', 'https://www.songbadprokash.com/sports/123464', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:22:49'),
(216, 13, 'url', 'https://www.songbadprokash.com/national/123434', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:24:17'),
(217, 13, 'url', 'https://www.songbadprokash.com/social-media/123458', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 11:25:49'),
(218, 13, 'url', 'https://www.songbadprokash.com/national/123466', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 13:39:25'),
(219, 13, 'url', 'https://www.songbadprokash.com/national/123467', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 13:40:17'),
(220, 13, 'url', 'https://www.songbadprokash.com/national/123468', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 13:47:53'),
(221, 13, 'url', 'https://www.songbadprokash.com/national/123469', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 13:52:02'),
(222, 13, 'url', 'https://www.songbadprokash.com/national/123470', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 13:57:56'),
(223, 13, 'url', 'https://www.songbadprokash.com/national/123471', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-13 14:04:26'),
(224, 6, 'url', 'https://www.songbadprokash.com/national/123510', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-15 01:52:27'),
(225, 13, 'url', 'https://www.songbadprokash.com/national/123510', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 07:46:46'),
(226, 13, 'url', 'https://www.songbadprokash.com/sports/123509', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 07:49:31'),
(227, 13, 'url', 'https://www.songbadprokash.com/international/123507', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 07:51:17'),
(228, 13, 'url', 'https://www.songbadprokash.com/national/123492', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 07:52:34'),
(229, 13, 'url', 'https://www.songbadprokash.com/national/123503', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 07:53:41'),
(230, 13, 'url', 'https://www.songbadprokash.com/national/123497', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.91', NULL, '2026-02-15 07:57:58'),
(231, 13, 'url', 'https://www.songbadprokash.com/entertainment/123461', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 08:00:18'),
(232, 13, 'url', 'https://www.songbadprokash.com/entertainment/123505', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 08:34:04'),
(233, 13, 'url', 'https://www.songbadprokash.com/national/123512', 0, 1, 'vertical', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 08:43:35'),
(234, 13, 'url', 'https://www.songbadprokash.com/national/123513', 0, 1, 'minimal', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 08:51:01'),
(235, 13, 'url', 'https://www.songbadprokash.com/national/123514', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 09:05:25'),
(236, 13, 'url', 'https://www.songbadprokash.com/national/123516', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 10:51:21'),
(237, 13, 'url', 'https://www.songbadprokash.com/national/123522', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 12:43:49'),
(238, 6, 'url', 'https://www.songbadprokash.com/national/123510', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.209', NULL, '2026-02-15 12:57:12'),
(239, 13, 'url', 'https://www.songbadprokash.com/national/123524', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 15:02:29'),
(240, 13, 'url', 'https://www.songbadprokash.com/entertainment/123526', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-15 20:03:08'),
(241, 13, 'url', 'https://www.songbadprokash.com/national/123558', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-17 13:01:16'),
(242, 13, 'url', 'https://www.songbadprokash.com/national/123558', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-17 13:41:13'),
(243, 13, 'url', 'https://www.songbadprokash.com/national/123552', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-17 13:42:19'),
(244, 13, 'url', 'https://www.songbadprokash.com/entertainment/123549', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-17 13:43:27'),
(245, 13, 'url', 'https://www.songbadprokash.com/entertainment/123561', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-17 13:51:26'),
(246, 13, 'url', 'https://www.songbadprokash.com/entertainment/123562', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-17 14:12:59'),
(247, 13, 'url', 'https://www.jugantor.com/tp-anando-nagar/1025598', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-17 16:10:32'),
(248, 13, 'url', 'https://www.songbadprokash.com/national/123579', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-18 06:47:39'),
(249, 13, 'url', 'https://www.songbadprokash.com/national/123577', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-18 06:49:22'),
(250, 13, 'url', 'https://www.songbadprokash.com/sports/43542', 0, 1, 'modern', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-18 07:10:27'),
(251, 13, 'url', 'https://www.bd-pratidin.com/national/2026/02/18/1218300', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-18 08:54:52'),
(252, 13, 'url', 'https://www.songbadprokash.com/national/123583', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-18 10:15:29'),
(253, 13, 'url', 'https://thedailycampus.com/world-news/242231', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-18 10:17:16'),
(254, 13, 'url', 'https://www.prothomalo.com/bangladesh/76yp3ys87a', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-18 13:17:08'),
(255, 13, 'url', 'https://www.songbadprokash.com/entertainment/123600', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:39:02'),
(256, 13, 'url', 'https://www.songbadprokash.com/national/123633', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:40:33'),
(257, 13, 'url', 'https://www.songbadprokash.com/national/123634', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:41:30'),
(258, 13, 'url', 'https://www.songbadprokash.com/national/123631', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:42:49'),
(259, 13, 'url', 'https://www.songbadprokash.com/lifestyle/123635', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:44:34'),
(260, 13, 'url', 'https://www.songbadprokash.com/national/123632', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:46:01'),
(261, 13, 'url', 'https://www.songbadprokash.com/international/123629', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:46:54'),
(262, 13, 'url', 'https://www.songbadprokash.com/opinion/123630', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:48:25'),
(263, 13, 'url', 'https://www.songbadprokash.com/national/123627', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:49:21'),
(264, 13, 'url', 'https://www.songbadprokash.com/national/123625', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:50:10'),
(265, 13, 'url', 'https://www.songbadprokash.com/national/123624', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:51:06'),
(266, 13, 'url', 'https://www.songbadprokash.com/lifestyle/123621', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '160.187.190.213', NULL, '2026-02-20 07:55:38'),
(267, 13, 'url', 'https://www.songbadprokash.com/national/123633', 0, 1, 'magazine', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '103.55.146.90', NULL, '2026-02-20 14:18:27'),
(268, 6, 'url', 'https://dailysangram.com/bangladesh/politics/Ig6tHXVqwPfb/', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.201', NULL, '2026-02-20 15:49:35'),
(269, 6, 'url', 'https://www.bbc.com/news/articles/c875p9q59vjo', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.201', NULL, '2026-02-20 16:01:02'),
(270, 6, 'url', 'https://www.jagonews24.com/national/news/1095606', 0, 1, 'classic', NULL, NULL, 1, 0, NULL, NULL, NULL, NULL, '59.153.100.201', NULL, '2026-02-20 23:30:20');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `migration_name` varchar(255) NOT NULL,
  `executed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration_name`, `executed_at`) VALUES
(16, '001_create_users_table', '2026-01-29 14:12:54'),
(17, '002_create_user_credits_table', '2026-01-29 14:12:54'),
(18, '003_create_card_generations_table', '2026-01-29 14:12:54'),
(19, '004_create_refresh_tokens_table', '2026-01-29 14:12:54');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `is_revoked` tinyint(1) DEFAULT 0,
  `revoked_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `session_id` varchar(100) DEFAULT NULL,
  `plan` enum('Free','Basic','Premium') DEFAULT 'Free',
  `plan_status` enum('active','inactive','canceled','expired') DEFAULT 'active',
  `subscription_id` varchar(255) DEFAULT NULL COMMENT 'Stripe subscription ID',
  `subscription_start_date` datetime DEFAULT NULL,
  `subscription_end_date` datetime DEFAULT NULL,
  `next_billing_date` datetime DEFAULT NULL,
  `status` enum('active','inactive','suspended','deleted') DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `failed_login_attempts` int(11) DEFAULT 0,
  `account_locked_until` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `session_id`, `plan`, `plan_status`, `subscription_id`, `subscription_start_date`, `subscription_end_date`, `next_billing_date`, `status`, `email_verified`, `email_verification_token`, `password_reset_token`, `password_reset_expires`, `failed_login_attempts`, `account_locked_until`, `last_login`, `last_ip`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 'Admin', 'khksnkallol@gmail.com', '$2a$12$vNzOCe1zJ7PYarptmxkpJ.VAdEGsVDZR07K0Dtl/tYHu1pupkGRO6', 'admin', NULL, 'Premium', 'active', NULL, NULL, NULL, NULL, 'active', 0, NULL, NULL, NULL, 0, NULL, '2026-02-21 05:28:33', '59.153.100.201', '2026-01-28 15:02:22', '2026-02-20 23:28:33', NULL),
(13, 'Md.Jahid Hasan', 'zahidahmedjoy81@gmail.com', '$2a$12$QNGxJo.grXT2elwQRNtKcuvBVViWEx8OaZnfxk1RHxCVKZVMEg85u', 'user', NULL, 'Premium', 'active', NULL, NULL, NULL, NULL, 'active', 0, NULL, NULL, NULL, 0, NULL, '2026-02-18 12:47:14', '160.187.190.213', '2026-01-31 10:55:59', '2026-02-18 06:47:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_credits`
--

CREATE TABLE `user_credits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `daily_limit` int(11) NOT NULL DEFAULT 5 COMMENT 'Cards allowed per day based on plan',
  `cards_generated_today` int(11) DEFAULT 0 COMMENT 'Cards generated in current 24h period',
  `last_reset_date` date NOT NULL COMMENT 'Last time daily counter was reset',
  `total_cards_generated` int(11) DEFAULT 0 COMMENT 'Total cards generated all time',
  `batch_processing_enabled` tinyint(1) DEFAULT 0,
  `custom_cards_enabled` tinyint(1) DEFAULT 0,
  `api_access_enabled` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_credits`
--

INSERT INTO `user_credits` (`id`, `user_id`, `daily_limit`, `cards_generated_today`, `last_reset_date`, `total_cards_generated`, `batch_processing_enabled`, `custom_cards_enabled`, `api_access_enabled`, `created_at`, `updated_at`) VALUES
(5, 6, -1, 1, '2026-02-21', 37, 1, 1, 1, '2026-01-28 15:02:22', '2026-02-20 23:30:20'),
(12, 13, -1, 1, '2026-02-20', 177, 1, 1, 1, '2026-01-31 10:55:59', '2026-02-20 14:18:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_key` (`api_key`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_api_key` (`api_key`);

--
-- Indexes for table `card_generations`
--
ALTER TABLE `card_generations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_date` (`user_id`,`created_at`),
  ADD KEY `idx_access_token` (`access_token`),
  ADD KEY `idx_card_type` (`card_type`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `migration_name` (`migration_name`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token` (`token`(255)),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_plan` (`plan`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_subscription_id` (`subscription_id`);

--
-- Indexes for table `user_credits`
--
ALTER TABLE `user_credits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`),
  ADD KEY `idx_last_reset` (`last_reset_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `api_keys`
--
ALTER TABLE `api_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `card_generations`
--
ALTER TABLE `card_generations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_credits`
--
ALTER TABLE `user_credits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `card_generations`
--
ALTER TABLE `card_generations`
  ADD CONSTRAINT `card_generations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_credits`
--
ALTER TABLE `user_credits`
  ADD CONSTRAINT `user_credits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
