DROP TABLE IF EXISTS `#__msg_chat`;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `#__msg_chat` (
`id` int(11) NOT NULL,
  `id_from` int(11) NOT NULL,
  `id_to` int(11) NOT NULL,
  `msg` varchar(300) NOT NULL,
  `date` int(11) NOT NULL,
  `read` tinyint(4) NOT NULL DEFAULT '0',
  `hide` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=1071 DEFAULT CHARSET=utf8;
--
-- Индексы таблицы `bet_msg_chat`
--
ALTER TABLE `#__msg_chat`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `bet_msg_chat`
--
ALTER TABLE `#__msg_chat`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1071;