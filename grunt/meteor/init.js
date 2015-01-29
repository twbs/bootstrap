Meteor.startup(function () {
  Template.body.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
  };
});
