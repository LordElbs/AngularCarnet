// Tri par date de naissance
myCarnetApp.filter('triDateNaissance', function() {
  return function(tab, date){
    // Si la date est indefini ou null, on retourne le tableau entré
    if (date === undefined || date === null) {
      return tab;
    }
    // Sinon on retourne un tableau filtré ou la date du user est sup à la date choisi
    else {
      return _.filter(tab, function(num) {
        return moment(num.dob,'DD/MM/YYYY') > moment(date);
      });
    }
  };
});

// Tri par ville
myCarnetApp.filter('triVille', function() {

  return function(tab, ville){
    // Si la ville est indefini ou vide, on retourne le tableau entré
    if (ville === undefined || ville === "") {
      return tab;
    }
    // Sinon on retourne un tableau filtré ou la ville correspond à la ville choisi
    else {
      return _.filter(tab, function(num) {
        return num.ville == ville;
      });
    }
  };
});

// Tri par notes de bac
myCarnetApp.filter('triNoteBac',function(){

  return function(tab, note){
    // Si la note est indefini ou null, on retourne le tableau entré
    if(note === undefined || note === null){
      return tab;
    }
    // Sinon on retourne un tableau filtré ou la note est sup à la note choisi
    return  _.filter(tab, function(user){
      return user.noteBac >= note;
    });
  };
});

// Tri par tranche d'age
myCarnetApp.filter('triAge', function(){
  return function(tab, tranches){
    // Si toutes les tranhes sont false (=décoché) alors on retourne le tab
    if (_.every(tranches, function(num) { return num === false;})) {
      return tab;
    }

    var tabFilter =  [];
    // si la tranche 1 est vrai (coché), on retourne un tab filtré avec l'age entre 10-18
    if(tranches[0] === true){
      tabFilter.push(_.filter(tab, function(elt){
        return elt.age >= 10 && elt.age < 18;
      }));
    }
    // si la tranche 2 est vrai (coché), on retourne un tab filtré avec l'age entre 18-30
    if(tranches[1] === true){
      tabFilter.push(_.filter(tab, function(elt){
        return elt.age >= 18 && elt.age < 30;
      }));
    }
    // si la tranche 3 est vrai (coché), on retourne un tab filtré avec l'age entre 30-45
    if(tranches[2] === true){
      tabFilter.push(_.filter(tab, function(elt){
        return elt.age >= 30 && elt.age <= 45;
      }));
    }
    // si la tranche 4 est vrai (coché), on retourne un tab filtré avec l'age +45
    if(tranches[3] === true){
      tabFilter.push(_.filter(tab, function(elt){
        return elt.age > 45;
      }));
    }
    //tabFilter est un tableau de tableau d'objet. concat va permettre de retourné un tableau d'objet.
    tabFilter = [].concat.apply([], tabFilter);

    return tabFilter;
  };
});

// Tri les langues et affiche un drapeau à la place
myCarnetApp.filter('triLangue', function(){
  return function(langue) {
    switch (langue) {
      case "fr":
        return "http://www.icône.com/images/icones/3/8/flag-fr.png";
      case "en":
        return "http://www.icône.com/images/icones/5/4/flag-us.png";
      case "it":
        return "http://www.icône.com/images/icones/4/1/flag-it.png";
      case "es":
        return "http://www.icône.com/images/icones/3/7/flag-es.png";
    }
  };
});

// Tri majeur / mineur en fonction du switch
myCarnetApp.filter('triSwitch', function(){
  return function(tab, switchPosition) {
    // le switch est une checkbox. Au chargement de la page undefined (retourne tab) puis cliqué vrai (age>=18) ou faux (age<18)
    if (switchPosition === true) {
      return _.filter(tab, function(user){
        return user.age >= 18;
      });
    }
    else if (switchPosition === false){
      return _.filter(tab, function(user){
        return user.age < 18;
      });
    }
    else {
      return tab;
    }
  };
});

// Tri par bar de recherche utilisateur
myCarnetApp.filter('triSearchBar', function(){
  return function(tab, string) {
    //Si la barre de recherche est vide ou non definie, retourne tout le tab.
    if (string === '' || string === undefined) {
      return tab;
    }
    else {
      return _.filter(tab, function(user){
        var str = user.nom.toLowerCase() + ' ' + user.prenom.toLowerCase();
        var strInverse = user.prenom.toLowerCase() + ' ' + user.nom.toLowerCase();
        var recherche = string.toLowerCase();
        // Retourne l'utilisateur incluant ce qui est dans la barre de recherche par rapport à un "nom prénom" ou un "prénom nom",
        if (str.includes(recherche) || strInverse.includes(recherche)) {
          return user;
        }
      });
    }
  };
});

// Tri par département
myCarnetApp.filter('triDepartement',function(){

  return function(tab, elmt){
    if(elmt === undefined || elmt === ''){
      return tab;
    }
    return  _.filter(tab, function(user){
      return user.cp.substr(0,2) === elmt.substr(0,2);
    });
  };
});
