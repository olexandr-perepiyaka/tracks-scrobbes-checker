function save_options() {
    var lastfmNickname = document.getElementById('lastfmNickname').value;
    chrome.storage.sync.set({
        lastfmNickname: lastfmNickname
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    // Use default value.
    chrome.storage.sync.get({
        lastfmNickname: '[unknown]'
    }, function (items) {
        document.getElementById('lastfmNickname').value = items.lastfmNickname;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);