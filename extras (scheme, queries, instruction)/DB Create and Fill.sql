CREATE TABLE Users (
  id SERIAL PRIMARY KEY NOT NULL,
  login VARCHAR(30) NOT NULL,
  password VARCHAR(30) NOT NULL,
  name VARCHAR(30) NOT NULL,
  surname VARCHAR(30) NOT NULL
);

CREATE TABLE Friend (
  user1_id INTEGER REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
  user2_id INTEGER REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
  status integer,
  PRIMARY KEY (user1_id, user2_id)
);


INSERT INTO Users (login, password, name, surname) VALUES ( 'me', '1998', 'Edik', 'Baraniuk' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me2', '1998', 'Edi', 'Baran' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me3', '1998', 'Ed', 'Bar' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me4', '1998', 'E.', 'Bauk' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me5', '1998', 'Lena', 'Baraniuk' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me6', '1998', 'Een', 'Baran' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me7', '1998', 'le', 'Bar' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me8', '1998', 'L.', 'Bauk' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me9', '1998', 'Sasha', 'Baraniuk' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me10', '1998', 'Sanek', 'Baran' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me11', '1998', 'Sanya', 'Bar' );
INSERT INTO Users (login, password, name, surname) VALUES ( 'me12', '1998', 'S.', 'Bauk' );

INSERT INTO Friend VALUES (1,3,1);
INSERT INTO Friend VALUES (2,3,1);
INSERT INTO Friend VALUES (1,4,0);
INSERT INTO Friend VALUES (2,1,0);
INSERT INTO Friend VALUES (5,1,1);
INSERT INTO Friend VALUES (8,2,1);
INSERT INTO Friend VALUES (9,1,1);
INSERT INTO Friend VALUES (4,2,1);