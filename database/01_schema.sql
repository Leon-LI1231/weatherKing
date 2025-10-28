-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: weatherkings_db
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `weatherkings_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `weatherkings_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `weatherkings_db`;

--
-- Table structure for table `DummyTable`
--

DROP TABLE IF EXISTS `DummyTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DummyTable` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(35) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=10003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bets`
--

DROP TABLE IF EXISTS `bets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bets` (
  `bet_id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(50) NOT NULL, -- e.g., 'Madison, WI'
  `bet_date` date NOT NULL,          -- Date the weather event applies to
  `bet_description` varchar(255) NOT NULL, -- e.g., 'Over 45°F Max Temperature'
  `bet_type` varchar(50) NOT NULL,    -- e.g., 'MAX_TEMP_OVER_UNDER', 'RAIN_YES_NO'
  `set_line` decimal(12,1) DEFAULT NULL, -- The target value (e.g., 45.0 for temperature)
  `moneyline_odds` decimal(12,2) DEFAULT NULL, -- NEW: American Odds for the bet line (+100, -110, etc)
  `outcome_value` decimal(12,2) DEFAULT NULL, -- The actual result (e.g., 47.0 when resolved)
  `total_amount_bet` decimal(12,2) NOT NULL DEFAULT '0.00',
  `bet_hit` tinyint(1) DEFAULT NULL COMMENT '1=Hit (Resolved Win), 0=Miss (Resolved Loss), NULL=Pending',
  `bet_start` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bet_close` datetime DEFAULT NULL,
  PRIMARY KEY (`bet_id`),
  UNIQUE KEY `unique_bet_per_day` (`city_name`, `bet_date`, `bet_type`) -- Prevents duplicate bet lines
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `player_bets`
--

DROP TABLE IF EXISTS `player_bets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_bets` (
  `player_bet_id` int NOT NULL AUTO_INCREMENT,
  `bet_id` int NOT NULL,
  `uid` int NOT NULL,
  `bet_amount` decimal(10,2) NOT NULL COMMENT 'Bet amount in USD (two decimal places for cents)',
  `bet_to_pay` decimal(10,2) DEFAULT NULL,
  `bet_success` tinyint(1) DEFAULT NULL COMMENT 'True if the bet won, False if lost, NULL if not yet resolved',
  `time_placed` datetime DEFAULT NULL COMMENT 'When the bet was actually submitted and confirmed',
  `time_made` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'When the user started creating the bet (added to slip)',
  PRIMARY KEY (`player_bet_id`),
  KEY `uid` (`uid`),
  KEY `bet_id` (`bet_id`),
  CONSTRAINT `player_bets_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  CONSTRAINT `player_bets_ibfk_2` FOREIGN KEY (`bet_id`) REFERENCES `bets` (`bet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(35) NOT NULL,
  `email` varchar(35) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `balance_usd` decimal(12,2) NOT NULL DEFAULT '0.00',
  `is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` datetime DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `unique_users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'weatherkings_db'
--

--
-- Dumping routines for database 'weatherkings_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-19 23:37:51
