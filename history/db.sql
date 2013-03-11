CREATE TABLE `bootstrap_compiled` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `first_name` varchar(255) DEFAULT NULL,
 `last_name` varchar(255) DEFAULT NULL,
 `email` varchar(255) DEFAULT NULL,
 `cms_type` varchar(255) DEFAULT NULL,
 `values` text,
 `created` datetime DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1