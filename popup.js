chrome.storage.sync.get({
    lastfmNickname: '[unknown]'
}, function (items) {
    console.log('items.lastfmNickname:', items.lastfmNickname) ;
});


const lastfmNickname = 'xander667';
const lastfmAPIKey = 'a088b0c423e72ee735fd4b1e592341b4';
var lastfm_artists_names = [];
var lastfm_artists_playcount = [];
var tracksArr = [];
var tracksTable = document.getElementById('tracks');

function clearTable() {
    while (tracksTable.children.length > 1) {
        tracksTable.removeChild(tracksTable.children[tracksTable.children.length - 1])
    }
}

function showTracksTable(tracksArr) {
    var i, tr, td, xhr = [];
    var xhttp = new XMLHttpRequest();

    tracksTable = document.getElementById('tracks');

    for (i = 0; i < tracksArr.length; i++) {
        //console.log('i: ' + i + ', tracksArr[i]: ' + tracksArr[i]);

        td = document.createElement('td');
        td.style.borderTop = 'solid 1px #0000008a';
        td.style.verticalAlign = 'top';
        td.innerText = tracksArr[i].artist;
        tr = document.createElement('tr');
        tr.id = 'tr-' + i;
        tr.appendChild(td);

        td = document.createElement('td');
        td.style.borderTop = 'solid 1px #0000008a';
        td.style.verticalAlign = 'top';
        td.style.maxWidth = '435px';
        td.style.overflowX = 'overlay';
        td.style.marginLeft = '2px';
        td.innerText = tracksArr[i].track;
        tr.appendChild(td);

        td = document.createElement('td');
        td.style.borderTop = 'solid 1px #0000008a';
        td.style.verticalAlign = 'top';
        td.style.textAlign = 'center';
        td.style.marginLeft = '2px';
        td.className = 'lk-td';
        td.innerText = '?';
        tr.appendChild(td);

        td = document.createElement('td');
        td.style.borderTop = 'solid 1px #0000008a';
        td.style.verticalAlign = 'top';
        td.style.textAlign = 'right';
        td.style.width = '110px';
        td.style.marginLeft = '2px';
        td.className = 'scr-td';
        td.innerText = '[request]';
        tr.appendChild(td);

        tracksTable.appendChild(tr);

        var url =
            'https://ws.audioscrobbler.com/2.0/?method=user.getTrackScrobbles'
            + '&user=' + lastfmNickname
            + '&api_key=' + lastfmAPIKey
            + '&artist=' + encodeURIComponent(tracksArr[i].artist).replace(/%20/g, '+')
            + '&track=' + encodeURIComponent(tracksArr[i].track).replace(/%20/g, '+')
            + '&format=json'
        ;
        console.log(url);

        (function(i){
            xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                var scResStr = '';
                var scrResTD = document.querySelector('tr#tr-' + i + ' > td.scr-td');
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var myObj = JSON.parse(this.responseText);
                        /*console.log('myObj.trackscrobbles[\'track\'][0]: ' + myObj.trackscrobbles['track'][0]);*/
                        if (myObj.trackscrobbles['track'][0] !== undefined) {
                            var t = 0;
                            for (t in myObj.trackscrobbles['track']) {
                                date_uts = parseInt(myObj.trackscrobbles['track'][t].date.uts) * 1000;
                                track_date = new Date(date_uts);
                                track_date_time = track_date.toLocaleString("sv-SE");
                                track_date_only = track_date_time.slice(0, 10);
                                track_time_only = track_date_time.slice(-9);
                                scResStr += (scResStr == '' ? '' : "\r\n") + '<a href="https://www.last.fm/user/' + lastfmNickname + '/library?&rangetype=1day&from=' + track_date_only + '" target="_blank"> ' + track_date_only + '</a>' + track_time_only;
                            }
                        } else {
                            scResStr = 'not scrobbled';
                        }
                    } else {
                        scResStr = 'error ' + this.status + ' ' + this.statusText;
                    }
                    scrResTD.innerHTML = scResStr;
                    //console.log('scResStr: ' + scResStr);
                }
            };
            xhr.send();
        })(i);

        url =
            'https://ws.audioscrobbler.com/2.0/?method=track.getInfo'
            + '&user=' + lastfmNickname
            + '&api_key=' + lastfmAPIKey
            + '&artist=' + encodeURIComponent(tracksArr[i].artist).replace(/%20/g, '+')
            + '&track=' + encodeURIComponent(tracksArr[i].track).replace(/%20/g, '+')
            + '&format=json'
        ;
        console.log(url);

        (function(i){
            xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                var lkResTD = document.querySelector('tr#tr-' + i + ' > td.lk-td');
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        lkResTD.innerHTML = '';
                        var myObj = JSON.parse(this.responseText);
                        //console.log('myObj.error: ', myObj.error, 'myObj.message', myObj.message);
                        if (myObj.error !== undefined) {
                            lkResTD.innerHTML = '<span title="' + myObj.message + '">-</span>';
                        }
                        if (myObj.track && myObj.track.userloved == 1) {
                            lkResTD.innerHTML = '<font color="red" title="Loved track">&hearts;</font>';
                        }
                    } else {
                        lkResTD.innerHTML = 'error ' + this.status + ' ' + this.statusText;
                    }
                }
            };
            xhr.send();
        })(i);
    }
}

function getArtistsScrobbles(tracksArr) {
    parseNum = 0;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            totalPagesToParse = myObj.topartists['@attr'].totalPages;
            /*totalPagesToParse = myObj.topartists.totalPages;*/
            getTopArtists();
        }
    };
    xhttp.open("GET", 'https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + lastfmNickname + '&api_key=' + lastfmAPIKey + '&format=json&limit=1000&page=10', true);
    xhttp.send();
}


function getTopArtists() {
    console.log('totalPagesToParse:' + totalPagesToParse);
    document.getElementById('get-artists-scrobbles').title = 'totalPagesToParse:' + totalPagesToParse + ' ';
    document.getElementById('get-artists-scrobbles').title += 'page: ';
    for (var i = 1; i <= totalPagesToParse; i++) {
        (function (i) {
            var url = 'https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + lastfmNickname + '&api_key=' + lastfmAPIKey + '&format=json&limit=1000&page=' + i;
            console.log(url);
            var xhttp = [];
            xhttp[i] = new XMLHttpRequest();
            xhttp[i].onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById('get-artists-scrobbles').title += i + ' ';
                    parseArtists(i, this.responseText);
                }
            };
            xhttp[i].open("GET", url, true);
            xhttp[i].send();
        })(i);
    }
}

function checkArtistName(lastfm_artists_name) {
    //console.log('this: ' + this);
    let r = lastfm_artists_name.toLowerCase() == this.toLowerCase();
    if (!r) {
        r = lastfm_artists_name.toLowerCase() == 'the ' + this.toLowerCase();
    }
    return r;
}

function parseArtists(i, responseText) {
    parseNum++;
    console.log('current page#'+i);
    var myObj = JSON.parse(responseText);
    var j;
    for (j in myObj.topartists.artist) {
        var n = (i - 1) * 1000 + parseFloat(j);
        lastfm_artists_names[n] = myObj.topartists.artist[j].name;
        lastfm_artists_playcount[n] = myObj.topartists.artist[j].playcount;
    }

    if (parseNum == totalPagesToParse) {
        document.getElementById('get-artists-scrobbles').title += 'parsed lastfm_artists_names.length: ' + lastfm_artists_names.length;
        console.log('lastfm_artists_names.length: ' + lastfm_artists_names.length);
        console.log('lastfm_artists_playcount.length: ' + lastfm_artists_playcount.length);

        var tbl = document.getElementById("tracks");
        console.log('tracksArr.length: ' + tracksArr.length);

        var foundName, foundIdx;
        for (var t = 0; t < tracksArr.length; t++) {
            foundName = lastfm_artists_names.find(checkArtistName, tracksArr[t].artist);
            if (foundName != undefined) {
                foundIdx = lastfm_artists_names.indexOf(foundName);
                tbl.querySelector('#tr-' + t).querySelector('td').innerText += ' (' + lastfm_artists_playcount[foundIdx] + ') '; 
            }
        }
    }
}

function OutputLog(scrlogArr) {
    for(mn in scrlogArr) {
        console.log(scrlogArr[mn]);
    }
}

chrome.extension.onRequest.addListener(function (result) {
    OutputLog(result.scrlogArr);
    showTracksTable(result.tracksArr);
    //tracksArr = result.tracksArr;
    document.getElementById('get-page-tracks').onclick = function() {
        document.querySelector('span.active').removeAttribute('class');
        this.className = "active";
        clearTable();
        showTracksTable(result.tracksArr);
    }
    document.getElementById('get-artists-scrobbles').onclick = function() {
        document.querySelector('span.active').removeAttribute('class');
        this.className = "active";
        getArtistsScrobbles(result.tracksArr);
    }
    document.getElementById('get-recent-tracks').onclick = function() {
        document.querySelector('span.active').removeAttribute('class');
        this.className = "active";
        clearTable();
    }
});

window.onload = function () {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
            chrome.tabs.executeScript(
                activeTabs[0].id, { file: 'send_tracks.js', allFrames: true }
            );
        });
    });
};
