var lastfmNickname;
const lastfmAPIKey = 'a088b0c423e72ee735fd4b1e592341b4';
var lastfm_artists_names = [];
var lastfm_artists_playcount = [];
var msgResult;

function clearTable(table) {
    while (table.children.length > 1) {
        table.removeChild(table.children[table.children.length - 1])
    }
}

function showTracksTable() {
    var i, tr, td, xhr = [];
    console.log('msgResult.tracksArr.length: ', msgResult.tracksArr.length);
    var tracksArr = msgResult.tracksArr;

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
        td.className = 'alb-td';
        td.innerText = '?';
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

        document.getElementById('tracks').appendChild(tr);

        getTrackScrobbles(tracksArr[i].artist, tracksArr[i].track, i);

        trackGetInfo(tracksArr[i].artist, tracksArr[i].track, i);
    }
}

function getTrackScrobbles(artist, track, idx) {
    var url =
        'https://ws.audioscrobbler.com/2.0/?method=user.getTrackScrobbles'
        + '&user=' + lastfmNickname
        + '&api_key=' + lastfmAPIKey
        + '&artist=' + encodeURIComponent(artist).replace(/%20/g, '+')
        + '&track=' + encodeURIComponent(track).replace(/%20/g, '+')
        + '&format=json'
    ;
    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        var scResStr, albResStr;
        scResStr = albResStr = '';
        var scrResTD = document.querySelector('tr#tr-' + idx + ' > td.scr-td');
        var albResTD = document.querySelector('tr#tr-' + idx + ' > td.alb-td');
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
                        albResStr += (albResStr == '' ? '' : "<br/>") + myObj.trackscrobbles['track'][t].album['#text'];
                    }
                } else {
                    scResStr = 'not scrobbled';
                }
            } else {
                scResStr = 'error ' + this.status + ' ' + this.statusText;
            }
            scrResTD.innerHTML = scResStr;
            albResTD.innerHTML = albResStr;
            //console.log('scResStr: ' + scResStr);
        }
    };
    xhr.send();
}

function trackGetInfo(artist, track, idx) {
    var url =
        'https://ws.audioscrobbler.com/2.0/?method=track.getInfo'
        + '&user=' + lastfmNickname
        + '&api_key=' + lastfmAPIKey
        + '&artist=' + encodeURIComponent(artist).replace(/%20/g, '+')
        + '&track=' + encodeURIComponent(track).replace(/%20/g, '+')
        + '&format=json'
    ;
    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        var lkResTD = document.querySelector('tr#tr-' + idx + ' > td.lk-td');
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
}

function showArtists() {
    var artist, url, xhr, cloneTr;
    for (i = 0; i < msgResult.artistsArr.length; i++) {
        artist = msgResult.artistsArr[i];
        (function (i, artist) {
            url =
                'https://ws.audioscrobbler.com/2.0/?method=artist.getInfo'
                + '&artist=' + encodeURIComponent(artist).replace(/%20/g, '+')
                + '&username=' + lastfmNickname
                + '&api_key=' + lastfmAPIKey
                + '&format=json'
            ;
            console.log(url);
            xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "json";
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200 && this.response.error === undefined) {
                    cloneTr = document.getElementById('artist-tr-tmpl').content.cloneNode(true);
                    cloneTr.querySelector('tr').id = 'tr-' + i;
                    cloneTr.querySelector('strong.artist-name').textContent = artist;
                    cloneTr.querySelector('a').href = this.response.artist.url;
                    cloneTr.querySelector('strong.scrobbles').innerText = this.response.artist.stats.userplaycount;
                    if (parseInt(this.response.artist.stats.userplaycount) > 0) {
                        cloneTr.querySelector('a.library-link').target = '_blank';
                        cloneTr.querySelector('a.library-link').href = 'https://www.last.fm/user/' + lastfmNickname + '/library/music/' + encodeURIComponent(artist).replace(/%20/g, '+');
                    }
                    var tagsSpan = cloneTr.querySelector('span.tags');
                    for (t in this.response.artist.tags.tag) {
                        tagsSpan.innerText += (tagsSpan.innerText == '' ? '' : ', ') + this.response.artist.tags.tag[t].name;
                    }
                    document.getElementById('artistsTBL').appendChild(cloneTr);
                    getArtistAvatar(artist, i);
                }
            }
            xhr.send();
        })(i, artist);
    }
}

function getArtistAvatar(artist, idx) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var artistTR = document.getElementById('artistsTBL').querySelector('#tr-' + idx);
            var imgSrc = this.responseXML.head.querySelector('meta[property$="image"]').content.replace(/\/ar0\//, '/avatar70s/')
            artistTR.querySelector('img').src = imgSrc;
        }
    }
    xhr.open("GET", "https://www.last.fm/music/" + encodeURIComponent(artist).replace(/%20/g, '+'), true);
    xhr.responseType = "document";
    xhr.send();
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

function showRecent() {
    var i, tr, td, xhr = [];

    const tracks_URL = 'https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&extended=1'
        + '&api_key=' + lastfmAPIKey
        + '&user=' + encodeURI(lastfmNickname)
        + '&limit=30'
        + '&format=json'
    ;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseJSON = JSON.parse(this.responseText);
            var trackObjects = responseJSON.recenttracks.track;

            //tracksTable = document.getElementById('tracks');

            for (i = 0; i < trackObjects.length; i++) {
                td = document.createElement('td');
                td.style.borderTop = 'solid 1px #0000008a';
                td.style.verticalAlign = 'top';
                td.innerText = trackObjects[i].artist.name;
                tr = document.createElement('tr');
                tr.appendChild(td);

                td = document.createElement('td');
                td.style.borderTop = 'solid 1px #0000008a';
                td.style.verticalAlign = 'top';
                td.style.maxWidth = '435px';
                td.style.overflowX = 'overlay';
                td.style.marginLeft = '2px';
                td.innerText = trackObjects[i].name;
                tr.appendChild(td);

                td = document.createElement('td');
                td.style.borderTop = 'solid 1px #0000008a';
                td.style.verticalAlign = 'top';
                td.style.textAlign = 'center';
                td.style.marginLeft = '2px';
                td.className = 'alb-td';
                td.innerText = trackObjects[i].album['#text'];
                tr.appendChild(td);

                td = document.createElement('td');
                td.style.borderTop = 'solid 1px #0000008a';
                td.style.verticalAlign = 'top';
                td.style.textAlign = 'center';
                td.style.marginLeft = '2px';
                td.className = 'lk-td';
                td.innerText = '';
                if (trackObjects[i].loved == 1) {
                    td.innerHTML = '<font color="red" title="Loved track">&hearts;</font>';
                }
                tr.appendChild(td);

                td = document.createElement('td');
                td.style.borderTop = 'solid 1px #0000008a';
                td.style.verticalAlign = 'top';
                td.style.textAlign = 'right';
                td.style.width = '110px';
                td.style.marginLeft = '2px';
                td.className = 'scr-td';
                if (trackObjects[i].date) {
                    date_uts = parseInt(trackObjects[i].date.uts) * 1000;
                    track_date = new Date(date_uts);
                    td.innerText = track_date.toLocaleString("sv-SE");
                } else {
                    td.innerText = 'scrobbling now';
                }
                tr.appendChild(td);

                document.getElementById('tracks').appendChild(tr);
            }
        } else {
            console.log('this.readyState: ' + this.readyState);
            console.log('this.status: ' + this.status);

            if (this.readyState == 4 && this.status == 500) {
                var errJSONObj = JSON.parse(this.responseText);
                console.log('errJSONObj.error: ' + errJSONObj.error);
                console.log('errJSONObj.message: ' + errJSONObj.message);
                document.getElementById('result').innerText = 'Error ' + errJSONObj.error + ' (' + errJSONObj.message + ')';
            }

            if (this.readyState == 4 && this.status == 0) {
                document.getElementById('result').innerText = 'Unknown Error. Server response not received.';
            }
        }
    }

    xhttp.open("GET", tracks_URL, true);
    xhttp.send();
}

function OutputLog(scrlogArr) {
    for(mn in scrlogArr) {
        console.log(scrlogArr[mn]);
    }
}

chrome.runtime.onMessage.addListener(function (result) {
    chrome.storage.sync.get({
        lastfmNickname: '[unknown]'
    }, function (items) {
        msgResult = result;
        console.log('msgResult.tracksArr.length: ', msgResult.tracksArr.length);
        lastfmNickname = items.lastfmNickname;
        console.log('lastfmNickname:', lastfmNickname);

        if (lastfmNickname == '[unknown]') {
            document.querySelector('div.nav').remove();
            document.getElementById('tracks').remove();
            var btn = document.createElement('button');
            btn.innerText = 'Options';
            btn.onclick = function() {
                if (chrome.runtime.openOptionsPage) {
                  chrome.runtime.openOptionsPage();
                } else {
                  window.open(chrome.runtime.getURL('options.html'));
                }
            };
            document.body.appendChild(btn);
        } else {
            console.log('msgResult.tracksArr.length: ', msgResult.tracksArr.length);
            //document.body.style.width = '600px';
            document.querySelector('#get-recent-tracks > div').innerText = lastfmNickname + "'s ";
    
            document.querySelector('#get-page-tracks > div').innerText = result.tracksArr.length + " ";
            OutputLog(result.scrlogArr);
            if (result.tracksArr.length == 0)  {
                document.querySelector('span.active').removeAttribute('class');
                document.getElementById('get-recent-tracks').className = "active";
                
                showRecent();
            } else {
                console.log('msgResult.tracksArr.length: ', msgResult.tracksArr.length);
                showTracksTable();
            }

            document.getElementById('get-page-tracks').onclick = function() {
                document.getElementById('artistsTBL').style.display = 'none';
                document.getElementById('tracks').style.display = 'block';
                document.querySelector('span.active').removeAttribute('class');
                this.className = "active";
                clearTable(document.getElementById('tracks'));
                showTracksTable();
            }

            /*document.getElementById('get-artists-scrobbles').onclick = function() {
                document.querySelector('span.active').removeAttribute('class');
                this.className = "active";
                getArtistsScrobbles(result.tracksArr);
            }*/

            document.getElementById('get-page-artists').onclick = function() {
                document.getElementById('artistsTBL').style.display = 'block';
                document.getElementById('tracks').style.display = 'none';
                document.querySelector('span.active').removeAttribute('class');
                this.className = "active";
                clearTable(document.getElementById('artistsTBL'));
                showArtists(result.tracksArr);
            }

            document.getElementById('get-recent-tracks').onclick = function() {
                document.getElementById('artistsTBL').style.display = 'none';
                document.getElementById('tracks').style.display = 'block';
                document.querySelector('span.active').removeAttribute('class');
                this.className = "active";
                clearTable(document.getElementById('tracks'));
                showRecent();
            }
        }
    });
});

window.onload = function () {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
            chrome.scripting.executeScript({
                    target: {tabId: activeTabs[0].id},
                    files: ['send_tracks.js']
            }/*,(result) => {console.log('executeScript callback result:', result);}*/);
        });
    });
};
