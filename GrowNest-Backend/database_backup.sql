-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: parentpal_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `children` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `gender` varchar(20) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `blood_group` varchar(5) NOT NULL,
  `allergies` json DEFAULT NULL,
  `medical_history` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `children_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (1,7,'Sam T','2016-05-11','Male',100.00,18.00,'A+','[]','None provided','2026-07-19 14:26:53','2026-07-19 14:26:53');
/*!40000 ALTER TABLE `children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_posts`
--

DROP TABLE IF EXISTS `community_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL,
  `category` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `upvotes` int DEFAULT '0',
  `comments_count` int DEFAULT '0',
  `pinned` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `community_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_posts`
--

LOCK TABLES `community_posts` WRITE;
/*!40000 ALTER TABLE `community_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `community_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `growth_records`
--

DROP TABLE IF EXISTS `growth_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `growth_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `month` varchar(20) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `recorded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `growth_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `growth_records`
--

LOCK TABLES `growth_records` WRITE;
/*!40000 ALTER TABLE `growth_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `growth_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_records`
--

DROP TABLE IF EXISTS `medical_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `file_type` varchar(10) NOT NULL,
  `file_size` varchar(20) NOT NULL,
  `record_date` date NOT NULL,
  `category` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_records`
--

LOCK TABLES `medical_records` WRITE;
/*!40000 ALTER TABLE `medical_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `medical_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutrition_records`
--

DROP TABLE IF EXISTS `nutrition_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrition_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `day` varchar(15) NOT NULL,
  `calories` int NOT NULL,
  `protein` int NOT NULL,
  `carbs` int NOT NULL,
  `fat` int NOT NULL,
  `recorded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `nutrition_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrition_records`
--

LOCK TABLES `nutrition_records` WRITE;
/*!40000 ALTER TABLE `nutrition_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `nutrition_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` enum('active','suspended') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aayushkumar4808','aayushkumar4808@gmail.com','Adinath*24','Aayush Jain',NULL,'active','2026-07-19 11:29:37','2026-07-19 11:29:37'),(2,'aayushjain4807','aayushjain4807@gmail.com','mahavir*24','Aayush Jain',NULL,'active','2026-07-19 12:51:29','2026-07-19 12:51:29'),(3,'ajaykumar389','ajaykumar389@gmail.com','Ajay@234','Ajay Kumar',NULL,'active','2026-07-19 12:54:45','2026-07-19 12:54:45'),(4,'vijaykumar234','vijaykumar234@gmail.com','vijay&234','vijay Kumar',NULL,'active','2026-07-19 12:57:06','2026-07-19 12:57:06'),(5,'popkane678','popkane678@gmail.com','adinath*902','pop kane',NULL,'active','2026-07-19 12:59:54','2026-07-19 12:59:54'),(6,'vihank234','vihank234@gmail.com','adinath*0009','vihan K',NULL,'active','2026-07-19 13:02:15','2026-07-19 13:02:15'),(7,'sarat234','sarat234@gmail.com','manup@234','Sara T',NULL,'active','2026-07-19 13:12:36','2026-07-19 13:12:36');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccinations`
--

DROP TABLE IF EXISTS `vaccinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `due_age` varchar(50) NOT NULL,
  `status` enum('completed','upcoming','missed') NOT NULL DEFAULT 'upcoming',
  `date` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `vaccinations_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccinations`
--

LOCK TABLES `vaccinations` WRITE;
/*!40000 ALTER TABLE `vaccinations` DISABLE KEYS */;
INSERT INTO `vaccinations` VALUES (1,1,'BCG (Tuberculosis)','At Birth','completed','2016-05-10',NULL,'2026-07-19 17:04:12'),(2,1,'OPV 0 (Polio)','At Birth','completed','2016-05-10',NULL,'2026-07-19 17:04:12'),(3,1,'Hepatitis B - Birth dose','At Birth','completed','2016-05-10',NULL,'2026-07-19 17:04:12'),(4,1,'OPV 1','6 Weeks','completed','2016-06-21',NULL,'2026-07-19 17:04:12'),(5,1,'Pentavalent 1','6 Weeks','completed','2016-06-21',NULL,'2026-07-19 17:04:12'),(6,1,'Rotavirus (RVV) 1','6 Weeks','completed','2016-06-21',NULL,'2026-07-19 17:04:12'),(7,1,'fIPV 1 (Polio)','6 Weeks','completed','2016-06-21',NULL,'2026-07-19 17:04:12'),(8,1,'PCV 1 (Pneumococcal)','6 Weeks','completed','2016-06-21',NULL,'2026-07-19 17:04:12'),(9,1,'OPV 2','10 Weeks','missed','2016-07-19',NULL,'2026-07-19 17:04:12'),(10,1,'Pentavalent 2','10 Weeks','missed','2016-07-19',NULL,'2026-07-19 17:04:12'),(11,1,'Rotavirus (RVV) 2','10 Weeks','missed','2016-07-19',NULL,'2026-07-19 17:04:12'),(12,1,'OPV 3','14 Weeks','completed','2016-08-16',NULL,'2026-07-19 17:04:12'),(13,1,'Pentavalent 3','14 Weeks','missed','2016-08-16',NULL,'2026-07-19 17:04:12'),(14,1,'fIPV 2','14 Weeks','missed','2016-08-16',NULL,'2026-07-19 17:04:12'),(15,1,'Rotavirus (RVV) 3','14 Weeks','missed','2016-08-16',NULL,'2026-07-19 17:04:12'),(16,1,'PCV 2','14 Weeks','missed','2016-08-16',NULL,'2026-07-19 17:04:12'),(17,1,'Measles & Rubella (MR) 1','9 Months','completed','2017-02-04',NULL,'2026-07-19 17:04:12'),(18,1,'JE 1','9 Months','completed','2017-02-04',NULL,'2026-07-19 17:04:12'),(19,1,'PCV Booster','9 Months','completed','2017-02-04',NULL,'2026-07-19 17:04:12'),(20,1,'Vitamin A (1st dose)','9 Months','completed','2017-02-04',NULL,'2026-07-19 17:04:12'),(21,1,'Measles & Rubella (MR) 2','16 Months','missed','2017-09-02',NULL,'2026-07-19 17:04:12'),(22,1,'JE 2','16 Months','missed','2017-09-02',NULL,'2026-07-19 17:04:12'),(23,1,'DPT Booster 1','16 Months','missed','2017-09-02',NULL,'2026-07-19 17:04:12'),(24,1,'OPV Booster','16 Months','missed','2017-09-02',NULL,'2026-07-19 17:04:12'),(25,1,'Vitamin A (2nd dose)','16 Months','missed','2017-09-02',NULL,'2026-07-19 17:04:12'),(26,1,'DPT Booster 2','5 Years','missed','2021-05-09',NULL,'2026-07-19 17:04:12'),(27,1,'Tetanus & adult Diphtheria (Td)','10 Years','missed','2026-05-08',NULL,'2026-07-19 17:04:12'),(28,1,'Tetanus & adult Diphtheria (Td)','16 Years','upcoming','2032-05-06',NULL,'2026-07-19 17:04:12');
/*!40000 ALTER TABLE `vaccinations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-19 23:07:31
