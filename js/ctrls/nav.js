angular
.module('webui.ctrls.nav', [
  'webui.services.constants', 'webui.services.modals',
  'webui.services.rpc', 'webui.services.rpc.helpers',
  'webui.services.settings'
])
.controller('NavCtrl', [
  '$scope', '$name', '$modals',
  '$rpc', '$rpchelpers', '$fileSettings',
  '$globalSettings', '$globalExclude',
  function(
    scope, name, modals,
    rpc, rhelpers, fsettings,
    gsettings, gexclude
  ) {

  scope.name = name;

  // initially collapsed in mobile resolution
  scope.collapsed = true;

  scope.addUris = function() {
    modals.invoke(
      'getUris', _.bind(rhelpers.addUris, rhelpers)
    );
  };

  scope.addTorrents = function() {
    modals.invoke(
      'getTorrents', _.bind(rhelpers.addTorrents, rhelpers)
    );
  };

  scope.addMetalinks = function() {
    modals.invoke(
      'getMetalinks', _.bind(rhelpers.addMetalinks, rhelpers)
    );
  };

  scope.addTorrent = function() {
    modals.invoke(
      'getTorrent', _.bind(rhelpers.addTorrents, rhelpers)
    );
  };

  scope.changeGSettings = function() {
    rpc.once('getGlobalOption', [], function(data) {
      var vals = data[0];
      var settings = {};

      // global settings divided into
      // file settings + some global specific
      // settings

      _.forEach([fsettings, gsettings], function(sets) {
        for (var i in sets) {
          if (i in gexclude) continue;

          settings[i] = sets[i];
        }
      });

      for (var i in vals) {
        if (i in gexclude) continue;

        if (!(i in settings)) {
          settings[i] = { name: i, val: vals[i], desc: '' };
        }

        else {
          settings[i].val = vals[i];
        }
      }

      modals.invoke('globalSettings', settings, 'Global Settings', function(settings) {
        var sets = {};
        for (var i in settings) { sets[i] = settings[i].val };

        rpc.once('changeGlobalOption', [sets]);
      });
    });
  };

}]);
