define(['underscore', 'settings'], function (_, settings) {

    var updater = {};

    var updates = [
        {
            version: '3.0',
            fx: function () {}
        }
    ];

    /* Shows a notification when the app is first installed. */
    updater.firstInstall = function () {
        chrome.notifications.create('TW', {
            type: 'basic',
            iconUrl: 'img/icon48.png',
            title: 'Tab Shepherd is installed',
            message: 'Tap Shepherd is now auto-closing tabs after ' + settings.get('minutesInactive') + ' minutes.',
            contextMessage: 'To change this setting, click on the new icon on your URL bar.'
        }, function() {});
    };

    updater.runUpdates = function (previous, current) {

        // Get the list of all updates to run
        var updatesToRun = _.filter(updates, function (update) {
            // This will work for now, but will begin to fall apart at some point.
            return update.version > previous && update.version <= current;
        });

        // Sort the updates by version so they are run in order
        var sortedUpdates = _.sortBy(updatesToRun, function (update) {
            return update.version;
        });

        // Run all updates
        _.map(sortedUpdates, function (update) {
            update.fx();
        });

        chrome.notifications.create('TW', {
            type: 'basic',
            iconUrl: 'img/icon48.png',
            title: 'Tab Shepherd is updated',
            message: 'Tab shepherd has been updated to version ' + current + '.',
            contextMessage: 'Click to view the change log.'
        }, function (notificationId) {
            chrome.notifications.onClicked.addListener(function (clickedId) {
                if (clickedId === notificationId) {
                    chrome.tabs.create({url: "https://github.com/sonntag/tabshepherd/blob/master/CHANGELOG.md"});
                }
            });
        });
    };

    return updater;
});