-- db/init.sql

CREATE TABLE IF NOT EXISTS CentreMedical (
  idCentreMed SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  numero_rue VARCHAR(10) NOT NULL,
  rue VARCHAR(255) NOT NULL,
  codePostal INT NOT NULL, 
  ville VARCHAR(255) NOT NULL
);

CREATE TYPE user_role AS ENUM ('Patient', 'Proche', 'PersonnelMed');

CREATE TABLE IF NOT EXISTS Utilisateur (
  idUser SERIAL PRIMARY KEY, 
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  numero_tel VARCHAR(10),
  Role user_role NOT NULL  
);

CREATE TABLE IF NOT EXISTS UserRainbow (
  idRainBow VARCHAR(255), --adresse mail ?
  idUser INT,
  PRIMARY KEY (idRainBow, idUser),
  FOREIGN KEY (idUser) REFERENCES Utilisateur(idUser) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Patient (
  idUser SERIAL PRIMARY KEY,
  numero_rue_principal VARCHAR(10) NOT NULL,
  rue_principale VARCHAR(255) NOT NULL,
  codePostal_principal INT NOT NULL, 
  ville_principale VARCHAR(255) NOT NULL,
  numero_rue_temporaire INT,-- a n'utiliser si jamais on ne part pas du lieu habituel
  rue_temporaire VARCHAR(255), 
  codePostal_temporaire INT ,
  ville_temporaire VARCHAR(255) ,
  FOREIGN KEY (idUser) REFERENCES Utilisateur(idUser) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Proche (
  idUser SERIAL PRIMARY KEY,
  numero_rue VARCHAR(10),
  rue VARCHAR(255),
  codePostal INT, 
  ville VARCHAR(255),
  FOREIGN KEY (idUser) REFERENCES Utilisateur(idUser) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PersonnelMed (
  idUser SERIAL PRIMARY KEY,
  idCentreMed INT,
  FOREIGN KEY (idUser) REFERENCES Utilisateur(idUser) ON DELETE CASCADE,
  FOREIGN KEY (idCentreMed) REFERENCES CentreMedical(idCentreMed) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS RDV (
  idRDV SERIAL PRIMARY KEY,
  intitule VARCHAR(255),
  horaire TIME NOT NULL,
  dateRDV DATE NOT NULL,
  idUser INT,
  idCentreMed INT,
  isADRPrincipale BOOLEAN,
  FOREIGN KEY (idUser) REFERENCES Utilisateur(idUser) ON DELETE CASCADE,
  FOREIGN KEY (idCentreMed) REFERENCES CentreMedical(idCentreMed) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Proche_Patient (
  idPatient INT,
  idProche INT,
  PRIMARY KEY (idPatient, idProche),
  FOREIGN KEY (idPatient) REFERENCES Patient(idUser) ON DELETE CASCADE,
  FOREIGN KEY (idProche) REFERENCES Proche(idUser) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StatusTrajet (
  idStatus INT,
  idRdv INT,
  EstParti BOOLEAN,
  PartiA TIMESTAMP,
  RetardPossible BOOLEAN,
  Raison VARCHAR(250),
  EstimationRetard TIME,
  AnnulationRDV BOOLEAN,
  PRIMARY KEY (idStatus),
  FOREIGN KEY (idRDV) REFERENCES RDV(idRDV) ON DELETE CASCADE
);



-- Insertion des centres médicaux
INSERT INTO CentreMedical (nom, numero_rue, rue, codePostal, ville) VALUES
  ('Clinique Sainte-Anne', '182', 'Rue Philippe Thys', 67000, 'Strasbourg'),
  ('Centre Dentaire', '4', 'Rue Alphonse Matter', 88100, 'Saint-Die-des-Vosges'),
  ('Cabinet d ostéopathie ', '1', 'Rue du Pont Neuf', 67230, 'Benfeld'),
  ('Ophtalmo Jung Michel', '1', 'Place de Bergopre', 67130, 'Schirmeck'),
  ('Hôpital de Hautepierre', '1', 'Av. Molière', 67200, 'Strasbourg'),
  ('Dr Guillaume Récher', '9', 'Rte Marcel Proust', 67200, 'Strasbourg'),
  ('Radiologie Clemenceau Sélestat', '4A', 'Rue Georges Clemenceau', 67600, 'Sélestat');

-- Insertion des utilisateurs (patients et proches)
INSERT INTO Utilisateur (Prenom, nom, role) VALUES
  ('Alice', 'Dupont', 'Patient'),     -- Utilisateur 1 (Patient)
  ('Bob', 'Martin', 'Patient'),       -- Utilisateur 2 (Patient)
  ('Claire', 'Lemoine', 'Patient'),   -- Utilisateur 3 (Patient)
  ('David', 'Durand', 'Patient'),     -- Utilisateur 4 (Patient)
  ('Eve', 'Moreau', 'Patient'),       -- Utilisateur 5 (Patient)
  ('Frank', 'Petit', 'Patient'),      -- Utilisateur 6 (Patient)
  ('Grace', 'Kemberg', 'Patient'),    -- Utilisateur 7 (Patient)
  ('Hugo', 'Blanc', 'Patient'),       -- Utilisateur 8 (Patient)
  ('Isabelle', 'Verde', 'Patient'),   -- Utilisateur 9 (Patient)
  ('Jack', 'Rouge', 'Patient'),       -- Utilisateur 10 (Patient)

  -- Insertion des proches
  ('Louis', 'Lemoine', 'Proche'),     -- Utilisateur 11 (Proche, lié à Claire)
  ('Marie', 'Durand', 'Proche'),      -- Utilisateur 12 (Proche, lié à David)
  ('Nina', 'Moreau', 'Proche'),       -- Utilisateur 13 (Proche, lié à Eve)

 ('Jean', 'Michel', 'PersonnelMed'),  -- Utilisateur 14 (Personnel Médical, Centre 1 - Strasbourg)
  ('Sophie', 'Legrand', 'PersonnelMed'),  -- Utilisateur 15 (Personnel Médical, Centre 2 - Saint-Die-des-Vosges)
  ('Paul', 'Durand', 'PersonnelMed'),  -- Utilisateur 16 (Personnel Médical, Centre 5 - Hôpital de Hautepierre)
  ('Julie', 'Martin', 'PersonnelMed'),  -- Utilisateur 17 (Personnel Médical, Centre 6 - Strasbourg)
  ('Luc', 'Dubois', 'PersonnelMed');  -- Utilisateur 18 (Personnel Médical, Centre 7 - Sélestat)


-- Insertion des patients
-- Pour Alice (idUser 1) : Rendez-vous à Sélestat (Centre 7) et Benfeld (Centre 3)
INSERT INTO Patient (idUser, numero_rue_principal,rue_principale, codePostal_principal, ville_principale) 
VALUES (1, '5' ,'Rue des Tulipes', 67600, 'Sélestat');

-- Pour Bob (idUser 2) : Rendez-vous à Saint-Dié-des-Vosges (Centre 2)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (2, '7', 'Rue Gambetta', 88100, 'Saint-Dié-des-Vosges');

-- Pour Claire (idUser 3) : Rendez-vous à Schirmeck (Centre 4) et Strasbourg (Centre 6)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (3, '3' ,'Place du Marché', 67130, 'Schirmeck');

-- Pour David (idUser 4) : Rendez-vous à Saint-Dié-des-Vosges (Centre 2) et Schirmeck (Centre 4)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (4, '8', 'Rue des Jardins', 88480, 'Étival-Clairefontaine');

-- Pour Eve (idUser 5) : Rendez-vous à Strasbourg (Centre 5)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (5, '12' ,'Rue de la Poste', 67120, 'Molsheim');

-- Pour Frank (idUser 6) : Rendez-vous à Strasbourg (Centre 6)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (6, '9', 'Rue de la Gare', 67240, 'Bischwiller');

-- Pour Grace (idUser 7) : Rendez-vous à Sélestat (Centre 7)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (7, '14', 'Rue des Tilleuls', 67390, 'Marckolsheim');

-- Pour Hugo (idUser 8) : Rendez-vous à Strasbourg (Centre 1)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (8, '17', 'Rue de la Liberté', 67240, 'Oberhoffen-sur-Moder');

-- Pour Isabelle (idUser 9) : Rendez-vous à Strasbourg (Centre 5)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (9, '22', 'Rue des Vosges', 67100, 'Strasbourg');

-- Pour Jack (idUser 10) : Rendez-vous à Sélestat (Centre 7)
INSERT INTO Patient (idUser, numero_rue_principal, rue_principale, codePostal_principal, ville_principale) 
VALUES (10, '20', 'Rue de la Forêt', 67600, 'Sélestat');


-- Insertion des proches dans la table Proche (en utilisant les idUser des proches)
INSERT INTO Proche (idUser) VALUES
  (11),  -- Proche Louis
  (12),  -- Proche Marie
  (13);  -- Proche Nina

 -- Insertion des relations entre proches et patients
INSERT INTO Proche_Patient (idPatient, idProche) VALUES
  (3, 11),  -- Louis est proche de Claire
  (4, 12),  -- Marie est proche de David
  (5, 13),  -- Nina est proche d'Eve
  (1, 12),  -- Marie est aussi proche d'Alice
  (2, 11);  -- Louis est aussi proche de Bob

-- Insertion du personnel médical
INSERT INTO PersonnelMed (idUser, idCentreMed) VALUES
  (14, 1),  -- Personnel Médical 1, Centre 1 (Strasbourg)
  (15, 2),  -- Personnel Médical 2, Centre 2 (Saint-Die-des-Vosges)
  (16, 5),  -- Personnel Médical 3, Centre 5 (Hôpital de Hautepierre)
  (17, 6),  -- Personnel Médical 4, Centre 6 (Paris)
  (18, 7);  -- Personnel Médical 5, Centre 7 (Lyon)

-- Insertion des rendez-vous
INSERT INTO RDV (intitule, horaire, dateRDV, idUser, idCentreMed, isADRPrincipale) VALUES
  -- Rendez-vous pour Alice
  ('Radio Hanche Droite','10:00:00', '2024-09-20', 1, 7, TRUE),
  ('Osthéopathie','11:30:00', '2024-09-25', 1, 3, TRUE),
  
  -- Rendez-vous pour Bob
  ('Dévitalisation Dent','14:30:00', '2024-09-21', 2, 2, TRUE),
  ('Controle Dent dévitalisé','09:00:00', '2024-09-26', 2, 2, TRUE),
  
  -- Rendez-vous pour Claire
  ('Ophtalmo','09:00:00', '2024-09-22', 3, 4, TRUE),
  ('Médecin généraliste','10:30:00', '2024-09-27', 3, 6, TRUE),
  
  -- Rendez-vous pour David
  ('Dentiste','11:00:00', '2024-09-23', 4, 2, TRUE),
  ('Ophtalmo','08:30:00', '2024-09-28', 4, 4, TRUE),
  
  -- Rendez-vous pour Eve
  ('RDV Anestésiste','08:30:00', '2024-09-24', 5, 5, TRUE),
  ('Opération','09:45:00', '2024-09-29', 5, 5, TRUE),
  
  -- Rendez-vous pour Frank
  ('Médecin Généraliste','10:00:00', '2024-09-30', 6, 6, TRUE),
  
  -- Rendez-vous pour Grace
  ('Radio épaule gauche','14:00:00', '2024-10-01', 7, 7, TRUE),
  
  -- Rendez-vous pour Hugo
  ('Controle après opération','09:30:00', '2024-10-02', 8, 1, TRUE),
  
  -- Rendez-vous pour Isabelle
  ('RDV Sage femme','11:00:00', '2024-10-03', 9, 5, TRUE),
  
  -- Rendez-vous pour Jack
  ('Radio mâchoire','15:30:00', '2024-10-04', 10, 7, TRUE);
