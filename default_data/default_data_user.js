const Utilisateur=require('../models/Utilisateur');


// ------------------------Utilisateur-------------
const generateDefaultUsers = async () => {
  const utilisateurs = [
    {
      nom: "Doe",
      prenom: "John",
      email: "john.doe@example.com",
      mot_de_passe: "motdepasse123", // Assurez-vous de crypter ce mot de passe dans un vrai projet
      adresse: "123 rue Exemple, Paris",
      contact: "+1234567890",
      role: "admin",
      poste: "Développeur",
      genre: "Homme",
      date_de_naissance: new Date("1990-01-01"),
      salaire: 50000
    },
    {
      nom: "Smith",
      prenom: "Alice",
      email: "alice.smith@example.com",
      mot_de_passe: "password456", // Assurez-vous de crypter ce mot de passe dans un vrai projet
      adresse: "456 avenue Sample, Lyon",
      contact: "+0987654321",
      role: "employé",
      poste: "Designer",
      genre: "Femme",
      date_de_naissance: new Date("1985-05-15"),
      salaire: 40000
    },
    {
      nom: "Lefevre",
      prenom: "Marc",
      email: "marc.lefevre@example.com",
      mot_de_passe: "securepass789", // Assurez-vous de crypter ce mot de passe dans un vrai projet
      adresse: "789 boulevard Exemple, Marseille",
      contact: "+1122334455",
      role: "manager",
      poste: "Chef de projet",
      genre: "Homme",
      date_de_naissance: new Date("1980-08-20"),
      salaire: 60000
    }
  ];

  try {
    // Vider la collection Utilisateur (facultatif, pour éviter les doublons si exécuté plusieurs fois)
    await Utilisateur.deleteMany();

    // Insérer les utilisateurs par défaut dans la base de données
    const utilisateursAjoutes = await Utilisateur.insertMany(utilisateurs);

    console.log("Utilisateurs ajoutés avec succès:", utilisateursAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des utilisateurs:", err);
  }
};

// Appeler la fonction pour insérer des utilisateurs par défaut
generateDefaultUsers();


// Voiture
