var tracksArr = [], scrlogArr = [], artistStr, trackStr, trackObj, splittedArtistStr;

var spotifyTracksDivs = document.querySelectorAll('div[data-testid="tracklist-row"]');
scrlogArr.push('[SPOTIFY] spotifyTracksDivs.length: ' + spotifyTracksDivs.length);
if (spotifyTracksDivs.length > 0) {
    spotifyTracksDivs.forEach(function (trackDiv/*, trackDivIdx*/) {
        trackStr = trackDiv.querySelector('div[dir=auto]').innerText;
        artistStr = trackDiv.querySelector('a[dir]').innerText;
        trackObj = { artist: artistStr, track: trackStr };
        tracksArr.push(trackObj);console.log(trackObj);
        scrlogArr.push('[SPOTIFY] ' + artistStr + ' - ' + trackStr);
    });
    scrlogArr.push('[SPOTIFY] tracksArr.length: ' + tracksArr.length);
}

if (tracksArr.length == 0) {
    var divNameSection = document.querySelector('div#name-section');
    scrlogArr.push('[BANDCAMP ALBUM] divNameSection: ' + divNameSection);
    if (divNameSection) {
        artistStr = divNameSection.querySelector('span').innerText;
        document.querySelectorAll('tr.track_row_view').forEach(function(track_tr) {
            trackStr = track_tr.querySelector('span').innerText;
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
            scrlogArr.push('[BANDCAMP ALBUM] ' + artistStr + ' - ' + trackStr);
        });
        scrlogArr.push('[BANDCAMP ALBUM] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0) {
    var isBandcampTrack = (document.querySelector('span.buyItemPackageTitle') !== null && document.querySelector('span.buyItemPackageTitle').innerText == "Digital Track");

    if (!isBandcampTrack) {
        isBandcampTrack = (document.querySelector('span.unowned-album') !== null && document.querySelector('span.unowned-album').innerText == "Buy the Full Digital Album");
    }
    
    scrlogArr.push('[BANDCAMP TRACK] isBandcampTrack: ' + isBandcampTrack);
    if (isBandcampTrack) {
        artistStr = document.querySelector('h3.albumTitle').querySelectorAll('a')[document.querySelector('h3.albumTitle').querySelectorAll('a').length -1].innerText;
        trackStr = document.querySelector('h2.trackTitle').innerText;
        scrlogArr.push('[BANDCAMP TRACK] ' + artistStr + ' - ' + trackStr);
        trackObj = { artist: artistStr, track: trackStr };
        tracksArr.push(trackObj);console.log(trackObj);
        scrlogArr.push('[BANDCAMP TRACK] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0) {
    var discogArtistH1 = document.getElementById('profile_title');
    scrlogArr.push('[DISCOGS] discogArtistH1: ' + discogArtistH1);
    if (discogArtistH1) {
        artistStr = discogArtistH1.querySelector('span > span > a').innerText;
        document.querySelectorAll('span.tracklist_track_title').forEach(function(track_tr) {
            trackStr = track_tr.innerText;
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
            scrlogArr.push('[DISCOGS] ' + artistStr + ' - ' + trackStr);
        });
        scrlogArr.push('[DISCOGS] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0) {
    var narDivEntry = document.querySelector('div.entry');
    scrlogArr.push('[NEWALBUMRELEASES] narDivEntry: ' + narDivEntry);
    if (narDivEntry) {
        artistStr = narDivEntry.querySelectorAll('p')[1].innerText.match(/Artist: (.*)\n\nAlbum/s)[1];
        narDivEntry.querySelectorAll('p')[2].innerText.match(/Tracklist:\n(.*)\n\nDOWNLOAD/s)[1].split("\n").forEach(function(track_tr) {
            trackStr = track_tr.substr(5);
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
            scrlogArr.push('[NEWALBUMRELEASES] ' + artistStr + ' - ' + trackStr);
        });
        scrlogArr.push('[NEWALBUMRELEASES] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0) {
    var deezerTracksDivs = document.querySelectorAll('div.datagrid-row.song');
    scrlogArr.push('[DEEZER] deezerTracksDivs.length: ' + deezerTracksDivs.length);
    if (deezerTracksDivs.length > 0) {
        //artistStr = document.querySelector('a.heading-link').innerText;/*OLD*/
        artistStr = document.querySelector('a.tnmRk').innerText;
        deezerTracksDivs.forEach(function (trackDiv) {
            //trackStr = trackDiv.querySelector('a.datagrid-label.datagrid-label-main.title').innerText;/*OLD*/
            trackStr = trackDiv.querySelector('div.datagrid-cell.cell-title').innerText;
            deezerPlayListTrackArtistDiv = trackDiv.querySelector('div.datagrid-cell.cell-artist');
            if (deezerPlayListTrackArtistDiv !== null) {
                artistStr = deezerPlayListTrackArtistDiv.innerText;
            }
            scrlogArr.push('[DEEZER] ' + artistStr + ' - ' + trackStr);
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
        });
        scrlogArr.push('[DEEZER] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0) {
    var ytmusicPlaylistTracks = document.querySelectorAll('ytmusic-responsive-list-item-renderer.style-scope.ytmusic-playlist-shelf-renderer');
    
    scrlogArr.push('[YOUTUBE MUSIC PLAYLIST] ytmusicPlaylistTracks.length: ' + ytmusicPlaylistTracks.length);
    if (ytmusicPlaylistTracks.length > 0) {
        ytmusicPlaylistTracks.forEach(function (trackDiv) {
            trackStr = trackDiv.querySelectorAll('yt-formatted-string')[0].innerText.replace(/[\r\n\t]/g, '').replace(/(?=\s)[^\r\n\t]/g, ' ');
            artistStr = trackDiv.querySelectorAll('yt-formatted-string')[1].innerText.replace(/[\r\n\t]/g, '').replace(/(?=\s)[^\r\n\t]/g, ' ');
            var splittedArtists = trackDiv.querySelectorAll('yt-formatted-string')[1].querySelectorAll('a.yt-formatted-string');
            scrlogArr.push('[YOUTUBE MUSIC PLAYLIST] splittedArtists.length:' + splittedArtists.length);
            if (splittedArtists.length > 1) {
                splittedArtists.forEach(function (splittedArtist) {
                    splittedArtistStr = splittedArtist.innerText.replace(/[\r\n\t]/g, '').replace(/(?=\s)[^\r\n\t]/g, ' ');
                    /*tracksArr.push({ artist: splittedArtistStr, track: trackStr });*/
                    scrlogArr.push('[YOUTUBE MUSIC PLAYLIST] ' + splittedArtistStr + ' - ' + trackStr + ' [after split]');
                });
            }
            scrlogArr.push('[YOUTUBE MUSIC PLAYLIST] ' + artistStr + ' - ' + trackStr);
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
        });
        scrlogArr.push('[YOUTUBE MUSIC PLAYLIST] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0 && document.getElementById('browse-page')) {
    var ytmusicAlbumTracks = document.getElementById('browse-page').querySelectorAll('ytmusic-responsive-list-item-renderer.style-scope.ytmusic-shelf-renderer');
    
    scrlogArr.push('[YOUTUBE MUSIC ALBUM] ytmusicAlbumTracks.length: ' + ytmusicAlbumTracks.length);
    if (ytmusicAlbumTracks.length > 0) {
        artistStr = document.querySelectorAll('yt-formatted-string.style-scope.ytmusic-detail-header-renderer')[1].textContent.split(" • ")[1];

        ytmusicAlbumTracks.forEach(function (trackDiv) {
            trackStr = trackDiv.querySelector('div.title-column.style-scope.ytmusic-responsive-list-item-renderer').innerText.replace(/\s+/g, ' ').trim(); 
            if (trackDiv.querySelector('yt-formatted-string.flex-column.style-scope.ytmusic-responsive-list-item-renderer') 
                && trackDiv.querySelector('yt-formatted-string.flex-column.style-scope.ytmusic-responsive-list-item-renderer').title !== ''
            ) {
                artistStr = trackDiv.querySelector('yt-formatted-string.flex-column.style-scope.ytmusic-responsive-list-item-renderer').title.trim();
            }

            scrlogArr.push('[YOUTUBE MUSIC ALBUM] ' + artistStr + ' - ' + trackStr);
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
        });
        scrlogArr.push('[YOUTUBE MUSIC ALBUM] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0) {
    var everynoiseAlbums = document.querySelectorAll('div.albumrow');
    scrlogArr.push('[EVERYNOISE ALBUMS] everynoiseAlbums.length: ' + everynoiseAlbums.length);
    if (everynoiseAlbums.length > 0) {
        everynoiseAlbums.forEach(function (albumDiv) {
            artistStr = albumDiv.querySelectorAll('a')[0].innerText; 
            trackStr = albumDiv.querySelectorAll('a')[1].innerText; 
            scrlogArr.push('[EVERYNOISE ALBUMS] ' + artistStr + ' - ' + trackStr);
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
        });
        scrlogArr.push('[EVERYNOISE ALBUMS] tracksArr.length: ' + tracksArr.length);
    }
}

if (tracksArr.length == 0) {
    var appleMusicTracksDivs = document.querySelectorAll('div.songs-list-row--web-preview');
    scrlogArr.push('[APPLE MUSIC] appleMusicTracksDivs.length: ' + appleMusicTracksDivs.length);
    if (appleMusicTracksDivs.length > 0) {
        artistStr = document.querySelector('div.product-creator').innerText;
        appleMusicTracksDivs.forEach(function (trackDiv) {
            trackStr = trackDiv.querySelector('div.songs-list-row__song-name-wrapper').innerText;
            appleMusicTrackTrackArtistDiv = trackDiv.querySelector('div.songs-list-row__by-line');
            if (appleMusicTrackTrackArtistDiv !== null) {
                artistStr = appleMusicTrackTrackArtistDiv.innerText;
            }
            scrlogArr.push('[APPLE MUSIC] ' + artistStr + ' - ' + trackStr);
            trackObj = { artist: artistStr, track: trackStr };
            tracksArr.push(trackObj);console.log(trackObj);
        });
        scrlogArr.push('[APPLE MUSIC] tracksArr.length: ' + tracksArr.length);
    }
}

chrome.extension.sendRequest({tracksArr: tracksArr, scrlogArr: scrlogArr});