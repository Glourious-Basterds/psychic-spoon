import https from 'https';
const q = 'creator:(Henry+Mancini) AND mediatype:(audio)';
const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=title,identifier&rows=50&output=json`;
https.get(url, (resp) => {
  let data = '';
  resp.on('data', c => data += c);
  resp.on('end', () => {
    const docs = JSON.parse(data).response.docs;
    const item = docs.find(d => typeof d.title === 'string' && d.title.toLowerCase().includes('lujon'));
    if(item) {
        https.get(`https://archive.org/metadata/${item.identifier}`, r2 => {
           let d2 = ''; r2.on('data', c=>d2+=c); r2.on('end', () => {
              const j2 = JSON.parse(d2);
              const mp3 = j2.files.find(f => f.name.endsWith('.mp3'));
              console.log(`LUJON FOUND: https://${j2.server}${j2.dir}/${encodeURIComponent(mp3.name)}`);
           });
        });
    } else { console.log('Lujon non trovato tra i primi 50 brani di Mancini.'); }
  });
});
