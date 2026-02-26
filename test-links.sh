#!/bin/bash
ids=("TheGodfatherThemeSong" "007-james-bond-theme" "tvtunes_8052" "ManciniLujon" "tvtunes_24483" "pulp-fiction-theme" "batman-theme_202008")
for id in "${ids[@]}"; do
    node -e "
    fetch('https://archive.org/metadata/' + '$id')
      .then(r => r.json())
      .then(d => {
        if(!d.server || !d.dir) { console.log('$id: No server found'); return; }
        const mp3 = d.files.find(f => f.name.endsWith('.mp3'));
        if(mp3) {
           console.log('$id:', 'https://' + d.server + d.dir + '/' + encodeURIComponent(mp3.name));
        } else {
           console.log('$id: No mp3 found');
        }
      }).catch(e => console.log('$id: Error', e.message));
    "
done
