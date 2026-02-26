import https from 'https';

const queries = [
    'title:(Godfather+Theme) AND mediatype:(audio)',
    'title:(Batman+Theme) AND mediatype:(audio)',
    'creator:(Henry+Mancini) AND title:(Lujon)',
    'title:(Mission+Impossible+Theme) AND mediatype:(audio)',
    'title:(Misirlou) AND mediatype:(audio)'
];

queries.forEach(q => {
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier&rows=3&output=json`;
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', c => data += c);
        resp.on('end', () => {
            try {
                const j = JSON.parse(data);
                const docs = j.response.docs;
                if (docs.length === 0) { console.log('NO RESULTS FOR:', q); return; }
                docs.forEach(doc => {
                    const id = doc.identifier;
                    https.get(`https://archive.org/metadata/${id}`, (r2) => {
                        let d2 = '';
                        r2.on('data', c => d2 += c);
                        r2.on('end', () => {
                            const j2 = JSON.parse(d2);
                            if (j2.server && j2.dir && j2.files) {
                                const mp3 = j2.files.find(f => f.name.endsWith('.mp3'));
                                if (mp3) {
                                    console.log(`FOUND ${q} => https://${j2.server}${j2.dir}/${encodeURIComponent(mp3.name)}`);
                                }
                            }
                        });
                    });
                });
            } catch (e) { console.log('ERR', q); }
        });
    });
});
