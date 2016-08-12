$(document).ready(function(){
  // Collapsible des contacts pour afficher des informations supplémentaires
  $('.collapsible').collapsible({
    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });

  $('.modal-trigger').leanModal();

});
