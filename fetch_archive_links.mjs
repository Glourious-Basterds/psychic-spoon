import https from 'https';

const ids = [
    'TheGodfatherThemeSong',
    '007-james-bond-theme',
    'tvtunes_8052',
    'ManciniLujon',
    'tvtunes_24483',
    'pulp-fiction-theme'
];

ids.forEach(id => {
    https.get('https://archive.org/metadata/' + id, (resp) => {
        let data = '';
        resp.on('data', (c) => { data += c; });
        resp.on('end', () => {
            try {
                const d = JSON.parse(data);
                if (!d.server || !d.dir) { console.log(id + ': No server/dir'); return; }
                const mp3 = d.files ? d.files.find(f => f.name.endsWith('.mp3')) : null;
                if (mp3) {
                    console.log(id + ': https://' + d.server + d.dir + '/' + encodeURIComponent(mp3.name));
                } else {
                    console.log(id + ': No mp3 found');
                }
            } catch (e) { console.log(id + ': Parse error'); }
        });
    });
});
