import { useState, useEffect, useRef } from "react";

// ── BADGES ──
const BADGES = [
  { id: "first_story",   emoji: "🌱", title: "First Step",        desc: "Read your very first story",              check: (d) => Object.keys(d.read).length >= 1 },
  { id: "goal_day1",     emoji: "🎯", title: "On Target",         desc: "Hit your daily reading goal",             check: (d, todayCount) => todayCount >= d.goal },
  { id: "streak3",       emoji: "🔥", title: "On Fire",           desc: "Read 3 days in a row",                    check: (d) => d.streak >= 3 },
  { id: "streak7",       emoji: "⚡", title: "Week Warrior",      desc: "Read 7 days in a row",                    check: (d) => d.streak >= 7 },
  { id: "streak30",      emoji: "👑", title: "Devoted",           desc: "Read 30 days in a row",                   check: (d) => d.streak >= 30 },
  { id: "stories10",     emoji: "📖", title: "Getting Started",   desc: "Read 10 stories",                         check: (d) => Object.keys(d.read).length >= 10 },
  { id: "stories25",     emoji: "📚", title: "Story Seeker",      desc: "Read 25 stories",                         check: (d) => Object.keys(d.read).length >= 25 },
  { id: "stories50",     emoji: "🏅", title: "Bible Explorer",    desc: "Read 50 stories",                         check: (d) => Object.keys(d.read).length >= 50 },
  { id: "stories100",    emoji: "🏆", title: "Century Scholar",   desc: "Read 100 stories",                        check: (d) => Object.keys(d.read).length >= 100 },
  { id: "ot_genesis",    emoji: "🌍", title: "In the Beginning",  desc: "Complete all of Genesis",                 check: (d) => ["gen-creation","gen-adam","gen-cain","gen-noah","gen-babel","gen-abraham","gen-sodom","gen-isaac","gen-jacob","gen-ladder","gen-joseph"].every(id => d.read[id]) },
  { id: "nt_gospels",    emoji: "✝️", title: "Gospel Reader",     desc: "Read a story from all four Gospels",      check: (d) => ["mat-birth","mrk-demon","luk-prodigal","jhn-wine"].every(id => d.read[id]) },
  { id: "half_bible",    emoji: "🌟", title: "Halfway There",     desc: "50% of all Bible stories read",           check: (d, _, pct) => pct >= 50 },
  { id: "full_bible",    emoji: "✨", title: "Bible Champion",    desc: "Read every single story",                 check: (d, _, pct) => pct >= 100 },
];

// ── CONFETTI ──
function Confetti({ onDone }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -200,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: ["#f6d365","#fda085","#ff6b9d","#c44dff","#4dffb4","#4db8ff"][Math.floor(Math.random()*6)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      vr: (Math.random() - 0.5) * 0.2,
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, 1 - frame / 120);
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 150) requestAnimationFrame(draw);
      else { if (onDone) onDone(); }
    }
    draw();
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:9999 }} />;
}

// ── BADGE MODAL ──
function BadgeModal({ badge, onClose }) {
  if (!badge) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:9998, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"linear-gradient(135deg,#1a1040,#302b63)", border:"2px solid #f6d365", borderRadius:24, padding:"40px 36px", textAlign:"center", maxWidth:320, boxShadow:"0 0 60px rgba(246,211,101,0.4)" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:64, marginBottom:12, animation:"badgePop 0.5s ease" }}>{badge.emoji}</div>
        <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#f6d365", marginBottom:6 }}>Badge Unlocked!</div>
        <div style={{ fontSize:22, fontWeight:"bold", marginBottom:8 }}>{badge.title}</div>
        <div style={{ fontSize:14, color:"#b8a9c9", marginBottom:24 }}>{badge.desc}</div>
        <button onClick={onClose} style={{ background:"linear-gradient(135deg,#f6d365,#fda085)", border:"none", borderRadius:99, padding:"10px 32px", color:"#1a1040", fontWeight:"bold", cursor:"pointer", fontSize:14, fontFamily:"Georgia,serif" }}>Awesome! 🎉</button>
      </div>
    </div>
  );
}

const BIBLE_DATA = [
  { testament: "Old Testament", books: [
    { id: "genesis", name: "Genesis", emoji: "🌍", stories: [
      { id: "gen-creation", title: "The Creation", ref: "Genesis 1-2", desc: "God creates the heavens, earth, and humanity" },
      { id: "gen-adam", title: "Adam & Eve", ref: "Genesis 2-3", desc: "The garden, the serpent, and the fall" },
      { id: "gen-cain", title: "Cain & Abel", ref: "Genesis 4", desc: "The first brothers and a tragic jealousy" },
      { id: "gen-noah", title: "Noah's Ark", ref: "Genesis 6-9", desc: "One man, one boat, every animal alive" },
      { id: "gen-babel", title: "Tower of Babel", ref: "Genesis 11", desc: "A tower to heaven and scattered tongues" },
      { id: "gen-abraham", title: "The Call of Abraham", ref: "Genesis 12", desc: "A man leaves everything on God's promise" },
      { id: "gen-sodom", title: "Sodom & Gomorrah", ref: "Genesis 18-19", desc: "Two cities, one escape, one looking back" },
      { id: "gen-isaac", title: "The Sacrifice of Isaac", ref: "Genesis 22", desc: "A father's impossible test of faith" },
      { id: "gen-jacob", title: "Jacob & Esau", ref: "Genesis 25-27", desc: "Twin brothers and a stolen blessing" },
      { id: "gen-ladder", title: "Jacob's Ladder", ref: "Genesis 28", desc: "A dream of angels ascending to heaven" },
      { id: "gen-joseph", title: "Joseph & His Brothers", ref: "Genesis 37-50", desc: "Betrayal, slavery, and a stunning rise to power" },
    ]},
    { id: "exodus", name: "Exodus", emoji: "🔥", stories: [
      { id: "exo-baby", title: "Baby Moses in the Nile", ref: "Exodus 1-2", desc: "A mother hides her son in a basket of reeds" },
      { id: "exo-bush", title: "The Burning Bush", ref: "Exodus 3", desc: "God speaks from a fire that never dies" },
      { id: "exo-plagues", title: "The Ten Plagues", ref: "Exodus 7-11", desc: "Egypt brought to its knees, plague by plague" },
      { id: "exo-passover", title: "The First Passover", ref: "Exodus 12", desc: "A night of blood on doorposts and a nation set free" },
      { id: "exo-sea", title: "Parting the Red Sea", ref: "Exodus 14", desc: "Walls of water and an army swallowed whole" },
      { id: "exo-manna", title: "Manna in the Desert", ref: "Exodus 16", desc: "Bread from heaven for a hungry people" },
      { id: "exo-ten", title: "The Ten Commandments", ref: "Exodus 19-20", desc: "God descends on the mountain in fire and thunder" },
      { id: "exo-calf", title: "The Golden Calf", ref: "Exodus 32", desc: "A people grow impatient and build a false god" },
    ]},
    { id: "leviticus", name: "Leviticus", emoji: "📜", stories: [
      { id: "lev-fire", title: "Nadab & Abihu's Strange Fire", ref: "Leviticus 10", desc: "Two priests offer unauthorized fire before God" },
      { id: "lev-atonement", title: "Day of Atonement", ref: "Leviticus 16", desc: "The scapegoat and the annual cleansing of Israel" },
      { id: "lev-holiness", title: "The Holiness Code", ref: "Leviticus 19", desc: "Love your neighbor — the law of holiness" },
    ]},
    { id: "numbers", name: "Numbers", emoji: "🏕️", stories: [
      { id: "num-spies", title: "The Twelve Spies", ref: "Numbers 13-14", desc: "Ten spies bring fear; two bring faith" },
      { id: "num-serpent", title: "The Bronze Serpent", ref: "Numbers 21", desc: "Snakes in the camp and a strange cure" },
      { id: "num-balaam", title: "Balaam's Donkey", ref: "Numbers 22", desc: "A talking donkey saves its master's life" },
      { id: "num-zelophehad", title: "Zelophehad's Daughters", ref: "Numbers 27", desc: "Five sisters stand up and change the law" },
    ]},
    { id: "deuteronomy", name: "Deuteronomy", emoji: "📖", stories: [
      { id: "deu-shema", title: "The Shema", ref: "Deuteronomy 6", desc: "Hear O Israel — the heartbeat of faith" },
      { id: "deu-choice", title: "The Choice of Life or Death", ref: "Deuteronomy 30", desc: "I have set before you life and death — choose life" },
      { id: "deu-farewell", title: "Moses' Farewell", ref: "Deuteronomy 31-34", desc: "A leader's last words and a view of the promised land" },
    ]},
    { id: "joshua", name: "Joshua", emoji: "⚔️", stories: [
      { id: "jos-rahab", title: "Rahab & the Spies", ref: "Joshua 2", desc: "A scarlet cord and a hidden act of courage" },
      { id: "jos-jordan", title: "Crossing the Jordan", ref: "Joshua 3-4", desc: "A river parts and a new era begins" },
      { id: "jos-jericho", title: "The Fall of Jericho", ref: "Joshua 6", desc: "Seven days, seven trumpets, walls come crashing down" },
      { id: "jos-achan", title: "Achan's Sin", ref: "Joshua 7", desc: "One man's greed brings defeat to a nation" },
      { id: "jos-sun", title: "The Sun Stands Still", ref: "Joshua 10", desc: "A day that lasted longer than any other" },
    ]},
    { id: "judges", name: "Judges", emoji: "🦁", stories: [
      { id: "jdg-deborah", title: "Deborah the Judge", ref: "Judges 4-5", desc: "A prophetess leads Israel to victory" },
      { id: "jdg-gideon", title: "Gideon's 300", ref: "Judges 6-7", desc: "Three hundred men, torches, and a shattered army" },
      { id: "jdg-jephthah", title: "Jephthah's Vow", ref: "Judges 11", desc: "A rash promise and a heartbreaking cost" },
      { id: "jdg-samson", title: "Samson & Delilah", ref: "Judges 13-16", desc: "Supernatural strength, a betrayal, and a final stand" },
    ]},
    { id: "ruth", name: "Ruth", emoji: "🌾", stories: [
      { id: "rut-loyalty", title: "Ruth's Loyalty to Naomi", ref: "Ruth 1", desc: "Where you go I will go — a vow that changed everything" },
      { id: "rut-boaz", title: "Ruth & Boaz", ref: "Ruth 2-4", desc: "A field, a kinsman-redeemer, and a love story" },
    ]},
    { id: "1samuel", name: "1 Samuel", emoji: "👑", stories: [
      { id: "1sa-hannah", title: "Hannah's Prayer", ref: "1 Samuel 1", desc: "A desperate woman prays and a prophet is born" },
      { id: "1sa-samuel", title: "God Calls Samuel", ref: "1 Samuel 3", desc: "A boy hears his name called in the night" },
      { id: "1sa-ark", title: "The Ark is Captured", ref: "1 Samuel 4-6", desc: "Israel's greatest treasure falls to the enemy" },
      { id: "1sa-saul", title: "Saul Becomes King", ref: "1 Samuel 9-10", desc: "A tall man looking for donkeys becomes a king" },
      { id: "1sa-david", title: "David vs Goliath", ref: "1 Samuel 17", desc: "The shepherd boy no one believed in" },
      { id: "1sa-jonathan", title: "David & Jonathan", ref: "1 Samuel 18-20", desc: "A friendship deeper than a brotherhood" },
      { id: "1sa-spare", title: "David Spares Saul", ref: "1 Samuel 24", desc: "A chance at revenge — and a choice not to take it" },
    ]},
    { id: "2samuel", name: "2 Samuel", emoji: "🎵", stories: [
      { id: "2sa-king", title: "David Becomes King", ref: "2 Samuel 5", desc: "Years of waiting end in a crown" },
      { id: "2sa-ark", title: "David Dances Before the Ark", ref: "2 Samuel 6", desc: "A king dances with abandon before the Lord" },
      { id: "2sa-bathsheba", title: "David & Bathsheba", ref: "2 Samuel 11-12", desc: "Power, lust, and the moment a king falls" },
      { id: "2sa-absalom", title: "Absalom's Rebellion", ref: "2 Samuel 15-18", desc: "A son who tried to take his father's throne" },
    ]},
    { id: "1kings", name: "1 Kings", emoji: "🏛️", stories: [
      { id: "1ki-solomon", title: "Solomon's Wisdom", ref: "1 Kings 3", desc: "A new king asks for wisdom — and gets everything else too" },
      { id: "1ki-temple", title: "Building the Temple", ref: "1 Kings 6-8", desc: "Seven years and a house worthy of God" },
      { id: "1ki-queen", title: "The Queen of Sheba", ref: "1 Kings 10", desc: "A queen travels far to test a wise king" },
      { id: "1ki-elijah", title: "Elijah vs the Prophets of Baal", ref: "1 Kings 18", desc: "One prophet, 450 enemies, and fire from heaven" },
      { id: "1ki-voice", title: "The Still Small Voice", ref: "1 Kings 19", desc: "A burned-out prophet hears God in a whisper" },
    ]},
    { id: "2kings", name: "2 Kings", emoji: "🌪️", stories: [
      { id: "2ki-chariot", title: "Elijah's Chariot of Fire", ref: "2 Kings 2", desc: "A prophet is taken to heaven in a whirlwind" },
      { id: "2ki-oil", title: "Elisha & the Widow's Oil", ref: "2 Kings 4", desc: "A jar that never ran empty" },
      { id: "2ki-naaman", title: "Naaman's Healing", ref: "2 Kings 5", desc: "A great general and a humbling dip in the river" },
      { id: "2ki-hezekiah", title: "Hezekiah's Prayer", ref: "2 Kings 19-20", desc: "A dying king prays — and gets fifteen more years" },
    ]},
    { id: "1chronicles", name: "1 Chronicles", emoji: "📋", stories: [
      { id: "1ch-ark", title: "Bringing the Ark to Jerusalem", ref: "1 Chronicles 15-16", desc: "A celebration of worship and the ark's new home" },
      { id: "1ch-david-plans", title: "David Plans the Temple", ref: "1 Chronicles 28-29", desc: "A king prepares what his son will build" },
    ]},
    { id: "2chronicles", name: "2 Chronicles", emoji: "🏰", stories: [
      { id: "2ch-dedication", title: "Dedication of the Temple", ref: "2 Chronicles 5-7", desc: "The glory of God fills the house" },
      { id: "2ch-jehoshaphat", title: "Jehoshaphat's Battle", ref: "2 Chronicles 20", desc: "Singers lead an army — and win without fighting" },
      { id: "2ch-josiah", title: "Josiah Finds the Law", ref: "2 Chronicles 34", desc: "A lost book is found and a nation turns back to God" },
    ]},
    { id: "ezra", name: "Ezra", emoji: "🔨", stories: [
      { id: "ezr-return", title: "The Return from Exile", ref: "Ezra 1-2", desc: "A people come home after 70 years away" },
      { id: "ezr-temple", title: "Rebuilding the Temple", ref: "Ezra 3-6", desc: "Tears of joy and opposition — the temple rises again" },
    ]},
    { id: "nehemiah", name: "Nehemiah", emoji: "🧱", stories: [
      { id: "neh-wall", title: "Rebuilding the Wall", ref: "Nehemiah 1-6", desc: "A cupbearer becomes a builder — in 52 days" },
      { id: "neh-reading", title: "Ezra Reads the Law", ref: "Nehemiah 8", desc: "A nation hears the Word and weeps with joy" },
    ]},
    { id: "esther", name: "Esther", emoji: "💎", stories: [
      { id: "est-queen", title: "Esther Becomes Queen", ref: "Esther 1-2", desc: "A Jewish orphan rises to the palace" },
      { id: "est-haman", title: "Haman's Plot", ref: "Esther 3", desc: "An advisor's pride threatens an entire people" },
      { id: "est-courage", title: "Esther's Courage", ref: "Esther 4-7", desc: "For such a time as this — a queen saves her people" },
    ]},
    { id: "job", name: "Job", emoji: "🌩️", stories: [
      { id: "job-suffering", title: "Job's Suffering", ref: "Job 1-2", desc: "Everything stripped away — and a man who holds on" },
      { id: "job-friends", title: "Job's Three Friends", ref: "Job 3-31", desc: "Well-meaning words that only made things worse" },
      { id: "job-whirlwind", title: "God Speaks from the Whirlwind", ref: "Job 38-42", desc: "God speaks from the storm and changes everything" },
    ]},
    { id: "psalms", name: "Psalms", emoji: "🎶", stories: [
      { id: "psa-23", title: "Psalm 23 — The Shepherd", ref: "Psalm 23", desc: "The Lord is my shepherd — the most beloved poem ever written" },
      { id: "psa-22", title: "Psalm 22 — Forsaken & Saved", ref: "Psalm 22", desc: "My God, why have you forsaken me?" },
      { id: "psa-91", title: "Psalm 91 — Refuge", ref: "Psalm 91", desc: "Refuge under the shadow of the Almighty" },
      { id: "psa-139", title: "Psalm 139 — Known by God", ref: "Psalm 139", desc: "You knit me together in my mother's womb" },
    ]},
    { id: "proverbs", name: "Proverbs", emoji: "💡", stories: [
      { id: "pro-wisdom", title: "Wisdom's Call", ref: "Proverbs 1-9", desc: "Wisdom calls out in the streets — will you listen?" },
      { id: "pro-woman", title: "The Virtuous Woman", ref: "Proverbs 31", desc: "A portrait of strength, wisdom, and grace" },
    ]},
    { id: "ecclesiastes", name: "Ecclesiastes", emoji: "🌬️", stories: [
      { id: "ecc-vanity", title: "Vanity of Vanities", ref: "Ecclesiastes 1-2", desc: "A king searches for meaning — and finds it elusive" },
      { id: "ecc-time", title: "A Time for Everything", ref: "Ecclesiastes 3", desc: "To every season, a purpose under heaven" },
    ]},
    { id: "songofsolomon", name: "Song of Solomon", emoji: "🌹", stories: [
      { id: "sos-love", title: "The Song of Songs", ref: "Song of Solomon 1-8", desc: "The most beautiful love poem ever written" },
    ]},
    { id: "isaiah", name: "Isaiah", emoji: "🕊️", stories: [
      { id: "isa-vision", title: "Isaiah's Vision", ref: "Isaiah 6", desc: "Seraphim, burning coal, and a prophet sent" },
      { id: "isa-immanuel", title: "The Immanuel Prophecy", ref: "Isaiah 7", desc: "A virgin shall conceive — a sign given centuries early" },
      { id: "isa-servant", title: "The Suffering Servant", ref: "Isaiah 53", desc: "A prophecy of pain written 700 years before the cross" },
      { id: "isa-comfort", title: "Comfort My People", ref: "Isaiah 40", desc: "Those who wait on the Lord shall renew their strength" },
    ]},
    { id: "jeremiah", name: "Jeremiah", emoji: "😢", stories: [
      { id: "jer-call", title: "Jeremiah's Call", ref: "Jeremiah 1", desc: "Before you were born I set you apart" },
      { id: "jer-potter", title: "The Potter's Clay", ref: "Jeremiah 18", desc: "God reshapes what is broken on the wheel" },
      { id: "jer-scroll", title: "The Burnt Scroll", ref: "Jeremiah 36", desc: "A king burns God's word — and it is rewritten" },
      { id: "jer-new-covenant", title: "The New Covenant", ref: "Jeremiah 31", desc: "I will write my law on their hearts" },
    ]},
    { id: "lamentations", name: "Lamentations", emoji: "💔", stories: [
      { id: "lam-ruins", title: "Weeping Over Jerusalem", ref: "Lamentations 1-3", desc: "A city in ruins — and mercy that is new every morning" },
    ]},
    { id: "ezekiel", name: "Ezekiel", emoji: "🌀", stories: [
      { id: "eze-wheels", title: "The Vision of the Wheels", ref: "Ezekiel 1", desc: "A prophet sees something impossible in the sky" },
      { id: "eze-valley", title: "The Valley of Dry Bones", ref: "Ezekiel 37", desc: "Can these bones live? Breath enters and an army rises" },
    ]},
    { id: "daniel", name: "Daniel", emoji: "🦁", stories: [
      { id: "dan-food", title: "Daniel Refuses the King's Food", ref: "Daniel 1", desc: "Four young men who wouldn't compromise" },
      { id: "dan-statue", title: "Nebuchadnezzar's Dream", ref: "Daniel 2", desc: "A statue, a stone, and the end of all empires" },
      { id: "dan-furnace", title: "The Fiery Furnace", ref: "Daniel 3", desc: "Three men thrown into fire — and a fourth walks with them" },
      { id: "dan-writing", title: "The Writing on the Wall", ref: "Daniel 5", desc: "A hand writes in the night — and a kingdom falls" },
      { id: "dan-lions", title: "Daniel in the Lions' Den", ref: "Daniel 6", desc: "A man of prayer faces the lions — and survives" },
    ]},
    { id: "hosea", name: "Hosea", emoji: "💞", stories: [
      { id: "hos-marriage", title: "Hosea's Unfaithful Wife", ref: "Hosea 1-3", desc: "A marriage becomes a picture of God's love for Israel" },
    ]},
    { id: "joel", name: "Joel", emoji: "🌾", stories: [
      { id: "joe-locusts", title: "The Plague of Locusts", ref: "Joel 1-2", desc: "Devastation — and a call to return" },
      { id: "joe-spirit", title: "Pour Out My Spirit", ref: "Joel 2", desc: "Your sons and daughters shall prophesy" },
    ]},
    { id: "amos", name: "Amos", emoji: "⚖️", stories: [
      { id: "amo-justice", title: "Let Justice Roll Down", ref: "Amos 5", desc: "A shepherd-prophet confronts a comfortable nation" },
    ]},
    { id: "obadiah", name: "Obadiah", emoji: "🏔️", stories: [
      { id: "oba-edom", title: "The Fall of Edom", ref: "Obadiah 1", desc: "Pride goes before destruction — a nation learns too late" },
    ]},
    { id: "jonah", name: "Jonah", emoji: "🐋", stories: [
      { id: "jon-flee", title: "Jonah Flees from God", ref: "Jonah 1", desc: "You can run, but you can't hide" },
      { id: "jon-whale", title: "Three Days in the Whale", ref: "Jonah 1-2", desc: "A prayer from the belly of a great fish" },
      { id: "jon-nineveh", title: "Nineveh Repents", ref: "Jonah 3-4", desc: "The greatest revival in history — and one sulking prophet" },
    ]},
    { id: "micah", name: "Micah", emoji: "🌟", stories: [
      { id: "mic-bethlehem", title: "The Bethlehem Prophecy", ref: "Micah 5", desc: "From Bethlehem shall come one who is ruler of Israel" },
      { id: "mic-justice", title: "What Does God Require?", ref: "Micah 6", desc: "Do justice, love mercy, walk humbly" },
    ]},
    { id: "nahum", name: "Nahum", emoji: "🌊", stories: [
      { id: "nah-nineveh", title: "The Fall of Nineveh", ref: "Nahum 1-3", desc: "The great city that once repented — falls at last" },
    ]},
    { id: "habakkuk", name: "Habakkuk", emoji: "🤔", stories: [
      { id: "hab-why", title: "Why, God?", ref: "Habakkuk 1-2", desc: "A prophet dares to question God — and gets an answer" },
      { id: "hab-faith", title: "The Just Shall Live by Faith", ref: "Habakkuk 2-3", desc: "Even if the fig tree does not blossom — I will rejoice" },
    ]},
    { id: "zephaniah", name: "Zephaniah", emoji: "🔔", stories: [
      { id: "zep-singing", title: "God Sings Over You", ref: "Zephaniah 3", desc: "He will rejoice over you with singing" },
    ]},
    { id: "haggai", name: "Haggai", emoji: "🏗️", stories: [
      { id: "hag-temple", title: "Build the House", ref: "Haggai 1-2", desc: "Is it time for you to live in paneled houses while God's house lies in ruins?" },
    ]},
    { id: "zechariah", name: "Zechariah", emoji: "🐎", stories: [
      { id: "zec-visions", title: "The Night Visions", ref: "Zechariah 1-6", desc: "Eight strange and beautiful visions of restoration" },
      { id: "zec-king", title: "Your King Comes on a Donkey", ref: "Zechariah 9", desc: "A prophecy of a humble king entering Jerusalem" },
    ]},
    { id: "malachi", name: "Malachi", emoji: "✉️", stories: [
      { id: "mal-tithe", title: "Bring the Full Tithe", ref: "Malachi 3", desc: "Test me in this — says the Lord" },
      { id: "mal-elijah", title: "The Coming of Elijah", ref: "Malachi 4", desc: "The last words of the Old Testament — and a promise" },
    ]},
  ]},
  { testament: "New Testament", books: [
    { id: "matthew", name: "Matthew", emoji: "⭐", stories: [
      { id: "mat-birth", title: "The Birth of Jesus", ref: "Matthew 1-2", desc: "A manger, wise men, and a star in the east" },
      { id: "mat-baptism", title: "The Baptism of Jesus", ref: "Matthew 3", desc: "The heavens open and a voice speaks" },
      { id: "mat-temptation", title: "The Temptation of Jesus", ref: "Matthew 4", desc: "Forty days alone in the desert with the devil" },
      { id: "mat-sermon", title: "The Sermon on the Mount", ref: "Matthew 5-7", desc: "The most revolutionary speech ever given" },
      { id: "mat-feeding", title: "Feeding the 5,000", ref: "Matthew 14", desc: "Five loaves, two fish, twelve baskets left over" },
      { id: "mat-water", title: "Walking on Water", ref: "Matthew 14", desc: "A storm, a dare, and sinking faith" },
      { id: "mat-transfig", title: "The Transfiguration", ref: "Matthew 17", desc: "Jesus shines like the sun on a mountaintop" },
      { id: "mat-entry", title: "The Triumphal Entry", ref: "Matthew 21", desc: "A king on a donkey and a crowd waving palms" },
    ]},
    { id: "mark", name: "Mark", emoji: "⚡", stories: [
      { id: "mrk-demon", title: "The Man with an Unclean Spirit", ref: "Mark 1", desc: "Jesus' first recorded miracle — an immediate authority" },
      { id: "mrk-paralyzed", title: "The Man Through the Roof", ref: "Mark 2", desc: "Four friends who wouldn't take no for an answer" },
      { id: "mrk-storm", title: "Calming the Storm", ref: "Mark 4", desc: "Who is this that even the wind and waves obey?" },
      { id: "mrk-legion", title: "Legion & the Pigs", ref: "Mark 5", desc: "A man living in tombs — and the mercy that found him" },
      { id: "mrk-bleeding", title: "The Woman Who Touched His Cloak", ref: "Mark 5", desc: "Twelve years of suffering ended with one touch" },
    ]},
    { id: "luke", name: "Luke", emoji: "🏥", stories: [
      { id: "luk-annunciation", title: "The Annunciation", ref: "Luke 1", desc: "An angel visits a girl from Nazareth" },
      { id: "luk-shepherds", title: "Shepherds & Angels", ref: "Luke 2", desc: "Glory to God in the highest — news for ordinary people first" },
      { id: "luk-prodigal", title: "The Prodigal Son", ref: "Luke 15", desc: "A son hits rock bottom and finds his way home" },
      { id: "luk-samaritan", title: "The Good Samaritan", ref: "Luke 10", desc: "A story that redefined who your neighbor is" },
      { id: "luk-zacchaeus", title: "Zacchaeus in the Tree", ref: "Luke 19", desc: "A despised tax collector gets an unexpected invitation" },
      { id: "luk-lost-sheep", title: "The Lost Sheep", ref: "Luke 15", desc: "Leaving the ninety-nine to find the one" },
      { id: "luk-pharisee", title: "The Pharisee & the Tax Collector", ref: "Luke 18", desc: "Two prayers — and only one heard" },
    ]},
    { id: "john", name: "John", emoji: "💧", stories: [
      { id: "jhn-word", title: "In the Beginning Was the Word", ref: "John 1", desc: "The most stunning opening of any book ever written" },
      { id: "jhn-wine", title: "Water into Wine", ref: "John 2", desc: "Jesus' first miracle — saving a wedding party" },
      { id: "jhn-nicodemus", title: "Nicodemus at Night", ref: "John 3", desc: "A secret visit and the most famous verse in the Bible" },
      { id: "jhn-well", title: "Woman at the Well", ref: "John 4", desc: "A conversation that changed a whole town" },
      { id: "jhn-lazarus", title: "Raising Lazarus", ref: "John 11", desc: "Four days dead — and called back to life" },
      { id: "jhn-supper", title: "The Last Supper", ref: "John 13", desc: "Bread, wine, and a final night with friends" },
      { id: "jhn-vine", title: "I Am the Vine", ref: "John 15", desc: "Remain in me — the secret to a fruitful life" },
    ]},
    { id: "passion", name: "The Passion", emoji: "✝️", stories: [
      { id: "pas-gethsemane", title: "Gethsemane", ref: "Matthew 26", desc: "A garden, a prayer, and a betrayal with a kiss" },
      { id: "pas-trial", title: "The Trial of Jesus", ref: "Matthew 26-27", desc: "Pilate, the crowd, and a choice that echoes forever" },
      { id: "pas-cross", title: "The Crucifixion", ref: "Luke 23", desc: "The darkest day — and the words spoken from the cross" },
      { id: "pas-resurrection", title: "The Resurrection", ref: "Matthew 28 / John 20", desc: "An empty tomb and the news that changed history" },
      { id: "pas-emmaus", title: "Road to Emmaus", ref: "Luke 24", desc: "Two disciples walk with a stranger they don't recognize" },
      { id: "pas-thomas", title: "Doubting Thomas", ref: "John 20", desc: "I will not believe unless I see — and then he saw" },
    ]},
    { id: "acts", name: "Acts", emoji: "🌍", stories: [
      { id: "act-pentecost", title: "Pentecost", ref: "Acts 2", desc: "Wind, fire, and a church born in a single morning" },
      { id: "act-stephen", title: "Stephen the Martyr", ref: "Acts 6-7", desc: "The first Christian to die for his faith" },
      { id: "act-philip", title: "Philip & the Ethiopian", ref: "Acts 8", desc: "A chariot ride and a life transformed" },
      { id: "act-saul", title: "Saul's Conversion", ref: "Acts 9", desc: "A persecutor is blinded by light — and sees for the first time" },
      { id: "act-peter", title: "Peter & Cornelius", ref: "Acts 10", desc: "A vision and a meal that broke every barrier" },
      { id: "act-prison", title: "Paul & Silas in Prison", ref: "Acts 16", desc: "Singing at midnight — and an earthquake that opened doors" },
      { id: "act-shipwreck", title: "Paul's Shipwreck", ref: "Acts 27", desc: "A storm, a snake, and a survivor" },
    ]},
    { id: "romans", name: "Romans", emoji: "📝", stories: [
      { id: "rom-love", title: "Nothing Can Separate Us", ref: "Romans 8", desc: "Neither death nor life — the great declaration" },
      { id: "rom-mercy", title: "Mercy for All", ref: "Romans 11", desc: "The depths of the riches of God's wisdom" },
    ]},
    { id: "1corinthians", name: "1 Corinthians", emoji: "❤️", stories: [
      { id: "1co-love", title: "The Love Chapter", ref: "1 Corinthians 13", desc: "Love is patient, love is kind — the greatest chapter on love" },
      { id: "1co-resurrection", title: "The Resurrection Chapter", ref: "1 Corinthians 15", desc: "Death is swallowed up in victory" },
    ]},
    { id: "2corinthians", name: "2 Corinthians", emoji: "💪", stories: [
      { id: "2co-thorn", title: "Paul's Thorn in the Flesh", ref: "2 Corinthians 12", desc: "My grace is sufficient — strength in weakness" },
    ]},
    { id: "galatians", name: "Galatians", emoji: "🔓", stories: [
      { id: "gal-freedom", title: "Freedom in Christ", ref: "Galatians 5", desc: "It is for freedom that Christ has set us free" },
      { id: "gal-fruit", title: "The Fruit of the Spirit", ref: "Galatians 5", desc: "Love, joy, peace — nine gifts of a Spirit-led life" },
    ]},
    { id: "ephesians", name: "Ephesians", emoji: "🛡️", stories: [
      { id: "eph-armor", title: "The Armor of God", ref: "Ephesians 6", desc: "Put on the full armor — and stand your ground" },
      { id: "eph-grace", title: "Saved by Grace", ref: "Ephesians 2", desc: "By grace you have been saved through faith — not by works" },
    ]},
    { id: "philippians", name: "Philippians", emoji: "😊", stories: [
      { id: "phi-joy", title: "The Secret of Contentment", ref: "Philippians 4", desc: "I have learned to be content in all circumstances" },
    ]},
    { id: "colossians", name: "Colossians", emoji: "🌌", stories: [
      { id: "col-supremacy", title: "The Supremacy of Christ", ref: "Colossians 1", desc: "He is before all things, and in him all things hold together" },
    ]},
    { id: "1thessalonians", name: "1 Thessalonians", emoji: "☁️", stories: [
      { id: "1th-return", title: "The Return of Christ", ref: "1 Thessalonians 4-5", desc: "We shall be caught up together in the clouds" },
    ]},
    { id: "2thessalonians", name: "2 Thessalonians", emoji: "⏳", stories: [
      { id: "2th-day", title: "The Day of the Lord", ref: "2 Thessalonians 2", desc: "Hold firm to what you have been taught" },
    ]},
    { id: "1timothy", name: "1 Timothy", emoji: "🎓", stories: [
      { id: "1ti-faith", title: "Instructions for the Church", ref: "1 Timothy 2-3", desc: "Paul's letter to a young pastor learning to lead" },
      { id: "1ti-godliness", title: "Godliness with Contentment", ref: "1 Timothy 6", desc: "The love of money — and a better way to be rich" },
    ]},
    { id: "2timothy", name: "2 Timothy", emoji: "✍️", stories: [
      { id: "2ti-scripture", title: "All Scripture is God-Breathed", ref: "2 Timothy 3", desc: "The Bible's own claim about itself" },
      { id: "2ti-farewell", title: "Paul's Final Farewell", ref: "2 Timothy 4", desc: "I have fought the good fight — I have finished the race" },
    ]},
    { id: "titus", name: "Titus", emoji: "🏝️", stories: [
      { id: "tit-grace", title: "Grace That Trains Us", ref: "Titus 2", desc: "Grace teaches us to say no to ungodliness" },
    ]},
    { id: "philemon", name: "Philemon", emoji: "🤝", stories: [
      { id: "phi-onesimus", title: "A Letter About a Slave", ref: "Philemon 1", desc: "Paul pleads for a runaway slave — as a brother" },
    ]},
    { id: "hebrews", name: "Hebrews", emoji: "🌉", stories: [
      { id: "heb-faith", title: "The Hall of Faith", ref: "Hebrews 11", desc: "Abel, Enoch, Noah, Abraham — the great cloud of witnesses" },
      { id: "heb-better", title: "Jesus the Better Priest", ref: "Hebrews 4-5", desc: "A high priest who understands our weakness" },
    ]},
    { id: "james", name: "James", emoji: "🌊", stories: [
      { id: "jam-faith-works", title: "Faith Without Works is Dead", ref: "James 2", desc: "Show me your faith without works — I'll show you faith by what I do" },
      { id: "jam-tongue", title: "Taming the Tongue", ref: "James 3", desc: "A tiny spark — and the whole forest is set ablaze" },
    ]},
    { id: "1peter", name: "1 Peter", emoji: "🪨", stories: [
      { id: "1pe-suffering", title: "Hope in Suffering", ref: "1 Peter 1-2", desc: "Though you have not seen him, you love him" },
      { id: "1pe-stone", title: "Living Stones", ref: "1 Peter 2", desc: "You are a chosen people, a royal priesthood" },
    ]},
    { id: "2peter", name: "2 Peter", emoji: "⚠️", stories: [
      { id: "2pe-transfig", title: "Peter Remembers the Transfiguration", ref: "2 Peter 1", desc: "We did not follow cleverly invented stories" },
    ]},
    { id: "1john", name: "1 John", emoji: "💕", stories: [
      { id: "1jn-light", title: "God is Light", ref: "1 John 1", desc: "Walk in the light as he is in the light" },
      { id: "1jn-love", title: "God is Love", ref: "1 John 4", desc: "We love because he first loved us" },
    ]},
    { id: "2john", name: "2 John", emoji: "📬", stories: [
      { id: "2jn-truth", title: "Walk in the Truth", ref: "2 John 1", desc: "A short letter — and a timeless call to truth and love" },
    ]},
    { id: "3john", name: "3 John", emoji: "📮", stories: [
      { id: "3jn-hospitality", title: "Welcome the Strangers", ref: "3 John 1", desc: "Gaius and a lesson in faithful hospitality" },
    ]},
    { id: "jude", name: "Jude", emoji: "🛡️", stories: [
      { id: "jud-contend", title: "Contend for the Faith", ref: "Jude 1", desc: "Contend earnestly for the faith once delivered to the saints" },
    ]},
    { id: "revelation", name: "Revelation", emoji: "🌈", stories: [
      { id: "rev-churches", title: "Letters to the Seven Churches", ref: "Revelation 2-3", desc: "Messages to seven real churches — and every church since" },
      { id: "rev-throne", title: "The Throne Room of Heaven", ref: "Revelation 4-5", desc: "A door opens and eternity is revealed" },
      { id: "rev-seals", title: "The Seven Seals", ref: "Revelation 6-8", desc: "One by one, the seals are broken open" },
      { id: "rev-woman", title: "The Woman & the Dragon", ref: "Revelation 12", desc: "A cosmic battle between heaven and the ancient serpent" },
      { id: "rev-beast", title: "The Mark of the Beast", ref: "Revelation 13", desc: "A number, a mark, and a world that bows" },
      { id: "rev-babylon", title: "The Fall of Babylon", ref: "Revelation 17-18", desc: "The great city falls — and heaven rejoices" },
      { id: "rev-jerusalem", title: "The New Jerusalem", ref: "Revelation 21-22", desc: "No more tears — the final chapter of everything" },
    ]},
  ]},
];

const ALL_STORIES = BIBLE_DATA.flatMap(t =>
  t.books.flatMap(b =>
    b.stories.map(s => ({ ...s, bookId: b.id, bookName: b.name, bookEmoji: b.emoji, testament: t.testament }))
  )
);

const TONES = [
  { id: "fanfic", label: "✨ Fanfic", desc: "Emotional & character-driven" },
  { id: "fantasy", label: "⚔️ Fantasy", desc: "Lord of the Rings vibes" },
  { id: "modern", label: "🏙️ Modern", desc: "Set in today's world" },
  { id: "anime", label: "🌟 Anime", desc: "Dramatic & action-packed" },
];

const DAILY_GOAL_OPTIONS = [1, 3, 5, 10];

function getToday() { return new Date().toISOString().slice(0, 10); }

function loadData() {
  try {
    const raw = localStorage.getItem("bibleProgress");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { read: {}, dailyLog: {}, streak: 0, lastDate: null, goal: 3, totalRead: 0 };
}

function saveData(d) {
  try { localStorage.setItem("bibleProgress", JSON.stringify(d)); } catch (_) {}
}

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [mode, setMode] = useState("browse");
  const [tab, setTab] = useState("home");
  const [selTestament, setSelTestament] = useState(null);
  const [selBook, setSelBook] = useState(null);
  const [selStory, setSelStory] = useState(null);
  const [seqIdx, setSeqIdx] = useState(0);
  const [tone, setTone] = useState("fanfic");
  const [storyText, setStoryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const prevGoalMet = useRef(false);
  const prevTotalRead = useRef(Object.keys(loadData().read).length);

  useEffect(() => { saveData(data); }, [data]);

  // Check badges whenever data changes
  useEffect(() => {
    const todayCount = (data.dailyLog[getToday()] || []).length;
    const pct = Math.round((Object.keys(data.read).length / ALL_STORIES.length) * 100);
    const unlocked = data.unlockedBadges || [];
    for (const badge of BADGES) {
      if (!unlocked.includes(badge.id) && badge.check(data, todayCount, pct)) {
        const newUnlocked = [...unlocked, badge.id];
        setData(prev => ({ ...prev, unlockedBadges: newUnlocked }));
        setShowConfetti(true);
        setNewBadge(badge);
        break;
      }
    }
  }, [data.read, data.streak, data.dailyLog]);

  // Goal confetti
  useEffect(() => {
    const todayCount = (data.dailyLog[getToday()] || []).length;
    const goalMet = todayCount >= data.goal;
    if (goalMet && !prevGoalMet.current) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    prevGoalMet.current = goalMet;
  }, [data.dailyLog, data.goal]);

  function markRead(storyId) {
    const today = getToday();
    setData(prev => {
      const dailyLog = { ...prev.dailyLog };
      const todayList = dailyLog[today] ? [...dailyLog[today]] : [];
      if (!todayList.includes(storyId)) todayList.push(storyId);
      dailyLog[today] = todayList;
      const read = { ...prev.read, [storyId]: true };
      const totalRead = Object.keys(read).length;
      // Streak calc
      let streak = prev.streak || 0;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      if (prev.lastDate === today) { /* same day, no change */ }
      else if (prev.lastDate === yStr) { streak += 1; }
      else { streak = 1; }
      return { ...prev, read, dailyLog, streak, lastDate: today, totalRead };
    });
  }

  async function generateStory(story) {
    setLoading(true); setStoryText(""); setError("");
    const toneDesc = {
      fanfic: "a heartfelt character-driven fanfic — focusing on emotions, inner thoughts, and relationships, written warmly and accessibly",
      fantasy: "epic high fantasy in the style of Lord of the Rings — grand narration, mythic characters, and poetic descriptions",
      modern: "a modern-day retelling set in contemporary times — same plot but with smartphones, cities, and modern language",
      anime: "a dramatic anime-style story — intense internal monologues, vivid action, and emotionally charged moments",
    };
    const prompt = `Retell the Bible story of "${story.title}" (from ${story.ref}) as ${toneDesc[tone]}.\n\nRules:\n- Write about 1,500 words — this should be a rich, immersive read with multiple scenes\n- Stay faithful to the key events\n- Make it engaging and accessible for someone new to the Bible\n- Add vivid descriptions, inner thoughts, and dialogue\n- End with a brief 1-sentence reflection on the story's meaning\n- Do NOT add a title at the start, just begin immediately\n\nBegin the story now:`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 2048, messages: [{ role: "user", content: prompt }] }),
      });
      const d = await res.json();
      if (!res.ok) { setError("Error " + res.status + ": " + (d?.error?.message || JSON.stringify(d))); setLoading(false); return; }
      const text = (d.content || []).map(b => b.text || "").join("");
      if (!text) { setError("No story returned. Please try again."); setLoading(false); return; }
      setStoryText(text);
      markRead(story.id);
    } catch (e) { setError("Network error: " + e.message); }
    setLoading(false);
  }

  const today = getToday();
  const todayCount = (data.dailyLog[today] || []).length;
  const goalMet = todayCount >= data.goal;
  const totalStories = ALL_STORIES.length;
  const totalRead = Object.keys(data.read).length;
  const pct = Math.round((totalRead / totalStories) * 100);

  // week data
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().slice(0, 10);
    return { label: d.toLocaleDateString("en", { weekday: "short" }), count: (data.dailyLog[k] || []).length, key: k };
  });

  const C = { gold: "#f6d365", peach: "#fda085", muted: "#b8a9c9", bg: "#0f0c29", card: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" };

  return (
    <>
    {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    {newBadge && <BadgeModal badge={newBadge} onClose={() => setNewBadge(null)} />}
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", fontFamily: "Georgia,serif", color: "#f0e6d3", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "28px 20px 16px", borderBottom: "1px solid " + C.border, background: "rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 36 }}>📖</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,34px)", fontWeight: "bold", margin: "4px 0 2px", background: "linear-gradient(90deg," + C.gold + "," + C.peach + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sacred Stories</h1>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>The entire Bible retold in styles you'll love</p>
      </div>

      {/* Nav tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid " + C.border, background: "rgba(0,0,0,0.15)" }}>
        {[["home", "🏠 Home"], ["read", "📚 Read"], ["progress", "📊 Progress"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "12px 4px", background: "transparent", border: "none",
            borderBottom: tab === t ? "2px solid " + C.gold : "2px solid transparent",
            color: tab === t ? C.gold : C.muted, cursor: "pointer", fontSize: 13, fontFamily: "Georgia,serif",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 14px" }}>

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div>
            {/* Daily goal card */}
            <div style={{ background: goalMet ? "linear-gradient(135deg,rgba(100,200,100,0.15),rgba(50,150,50,0.1))" : C.card, border: "1.5px solid " + (goalMet ? "rgba(100,200,100,0.4)" : C.border), borderRadius: 16, padding: "20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: goalMet ? "#90ee90" : C.gold, marginBottom: 4 }}>Today's Goal</div>
                  <div style={{ fontSize: 28, fontWeight: "bold" }}>{todayCount} <span style={{ fontSize: 16, color: C.muted }}>/ {data.goal} stories</span></div>
                  <div style={{ fontSize: 13, color: goalMet ? "#90ee90" : C.muted, marginTop: 2 }}>{goalMet ? "🎉 Goal complete!" : `${data.goal - todayCount} more to go`}</div>
                </div>
                <button onClick={() => setShowGoalPicker(p => !p)} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 8, padding: "6px 12px", color: C.muted, cursor: "pointer", fontSize: 12, fontFamily: "Georgia,serif" }}>Change Goal</button>
              </div>
              {showGoalPicker && (
                <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DAILY_GOAL_OPTIONS.map(g => (
                    <button key={g} onClick={() => { setData(p => ({ ...p, goal: g })); setShowGoalPicker(false); }} style={{
                      background: data.goal === g ? "linear-gradient(135deg," + C.gold + "," + C.peach + ")" : C.card,
                      color: data.goal === g ? "#1a1040" : "#f0e6d3",
                      border: "1px solid " + C.border, borderRadius: 99, padding: "6px 16px", cursor: "pointer", fontSize: 13, fontFamily: "Georgia,serif",
                    }}>{g} {g === 1 ? "story" : "stories"}/day</button>
                  ))}
                </div>
              )}
              {/* Progress bar */}
              <div style={{ marginTop: 14, background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6 }}>
                <div style={{ height: "100%", width: Math.min(100, (todayCount / data.goal) * 100) + "%", background: goalMet ? "linear-gradient(90deg,#90ee90,#50c850)" : "linear-gradient(90deg," + C.gold + "," + C.peach + ")", borderRadius: 99, transition: "width 0.4s" }} />
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { label: "🔥 Streak", value: data.streak + " days" },
                { label: "📖 Total Read", value: totalRead + " stories" },
                { label: "📈 Progress", value: pct + "%" },
              ].map(s => (
                <div key={s.label} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: "bold", color: C.gold }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* This week */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>This Week</div>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
                {weekDays.map(d => {
                  const maxCount = Math.max(...weekDays.map(x => x.count), 1);
                  const h = d.count > 0 ? Math.max(8, (d.count / maxCount) * 48) : 4;
                  const isToday = d.key === today;
                  return (
                    <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 10, color: d.count > 0 ? C.gold : C.muted }}>{d.count > 0 ? d.count : ""}</div>
                      <div style={{ width: "100%", height: h, background: isToday ? "linear-gradient(180deg," + C.gold + "," + C.peach + ")" : d.count > 0 ? "rgba(246,211,101,0.4)" : "rgba(255,255,255,0.1)", borderRadius: 4, transition: "height 0.3s" }} />
                      <div style={{ fontSize: 10, color: isToday ? C.gold : C.muted }}>{d.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overall progress */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>Bible Progress</div>
                <div style={{ fontSize: 12, color: C.muted }}>{totalRead} / {totalStories} stories</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + C.gold + "," + C.peach + ")", borderRadius: 99, transition: "width 0.5s" }} />
              </div>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {BIBLE_DATA.map(t => {
                  const tStories = t.books.flatMap(b => b.stories);
                  const tRead = tStories.filter(s => data.read[s.id]).length;
                  const tPct = Math.round((tRead / tStories.length) * 100);
                  return (
                    <div key={t.testament} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px" }}>
                      <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4 }}>{t.testament === "Old Testament" ? "📜" : "✝️"} {t.testament}</div>
                      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 5 }}>
                        <div style={{ height: "100%", width: tPct + "%", background: "linear-gradient(90deg," + C.gold + "," + C.peach + ")", borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{tRead}/{tStories.length} · {tPct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── READ TAB ── */}
        {tab === "read" && (
          <div>
            {/* Mode switcher */}
            <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", borderRadius: 99, padding: 3, marginBottom: 20 }}>
              {[["browse", "📚 Browse"], ["sequential", "▶️ In Order"]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setStoryText(""); setError(""); setSelStory(null); setSelBook(null); setSelTestament(null); }} style={{
                  background: mode === m ? "linear-gradient(135deg," + C.gold + "," + C.peach + ")" : "transparent",
                  color: mode === m ? "#1a1040" : C.muted, border: "none", borderRadius: 99, padding: "8px 20px",
                  cursor: "pointer", fontSize: 13, fontWeight: mode === m ? "bold" : "normal", fontFamily: "Georgia,serif",
                }}>{label}</button>
              ))}
            </div>

            {/* Sequential mode */}
            {mode === "sequential" && (() => {
              const s = ALL_STORIES[seqIdx];
              return (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <button onClick={() => { setSeqIdx(i => Math.max(0, i - 1)); setStoryText(""); setError(""); }} disabled={seqIdx === 0} style={navBtn(seqIdx === 0)}>← Prev</button>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: C.muted }}>{s.testament} · {s.bookEmoji} {s.bookName}</div>
                      <div style={{ fontWeight: "bold", fontSize: 16 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{s.ref} · {seqIdx + 1}/{ALL_STORIES.length} {data.read[s.id] ? "✅" : ""}</div>
                    </div>
                    <button onClick={() => { setSeqIdx(i => Math.min(ALL_STORIES.length - 1, i + 1)); setStoryText(""); setError(""); }} disabled={seqIdx === ALL_STORIES.length - 1} style={navBtn(seqIdx === ALL_STORIES.length - 1)}>Next →</button>
                  </div>
                  <TonePicker tone={tone} setTone={setTone} C={C} />
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <button onClick={() => generateStory(s)} disabled={loading} style={genBtn(!loading, C)}>{loading ? "✨ Writing..." : "✨ Tell Me This Story"}</button>
                  </div>
                  <StoryOutput storyText={storyText} error={error} loading={loading} onRetry={() => generateStory(s)} C={C} />
                </div>
              );
            })()}

            {/* Browse mode */}
            {mode === "browse" && (
              <div>
                {!selTestament && (
                  <div>
                    <div style={sLabel(C)}>Choose a Testament</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {BIBLE_DATA.map(t => {
                        const tStories = t.books.flatMap(b => b.stories);
                        const tRead = tStories.filter(s => data.read[s.id]).length;
                        return (
                          <button key={t.testament} onClick={() => setSelTestament(t.testament)} style={{ background: C.card, border: "1.5px solid " + C.border, borderRadius: 14, padding: "24px 16px", cursor: "pointer", color: "#f0e6d3", textAlign: "center" }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{t.testament === "Old Testament" ? "📜" : "✝️"}</div>
                            <div style={{ fontSize: 17, fontWeight: "bold" }}>{t.testament}</div>
                            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{t.books.length} books · {tRead}/{tStories.length} read</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selTestament && !selBook && (
                  <div>
                    <button onClick={() => setSelTestament(null)} style={backBtnStyle(C)}>← Testaments</button>
                    <div style={sLabel(C)}>{selTestament}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8 }}>
                      {BIBLE_DATA.find(t => t.testament === selTestament).books.map(b => {
                        const bRead = b.stories.filter(s => data.read[s.id]).length;
                        const bPct = Math.round((bRead / b.stories.length) * 100);
                        return (
                          <button key={b.id} onClick={() => setSelBook(b)} style={{ background: C.card, border: "1.5px solid " + C.border, borderRadius: 12, padding: "12px 10px", cursor: "pointer", color: "#f0e6d3", textAlign: "left" }}>
                            <div style={{ fontSize: 22, marginBottom: 3 }}>{b.emoji}</div>
                            <div style={{ fontWeight: "bold", fontSize: 13 }}>{b.name}</div>
                            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 3, margin: "5px 0 3px" }}>
                              <div style={{ height: "100%", width: bPct + "%", background: "linear-gradient(90deg," + C.gold + "," + C.peach + ")", borderRadius: 99 }} />
                            </div>
                            <div style={{ fontSize: 10, color: C.muted }}>{bRead}/{b.stories.length}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selBook && !selStory && (
                  <div>
                    <button onClick={() => setSelBook(null)} style={backBtnStyle(C)}>← {selTestament}</button>
                    <div style={sLabel(C)}>{selBook.emoji} {selBook.name}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {selBook.stories.map(s => (
                        <button key={s.id} onClick={() => { setSelStory({ ...s, bookName: selBook.name, bookEmoji: selBook.emoji }); setStoryText(""); setError(""); }} style={{ background: C.card, border: "1.5px solid " + C.border, borderRadius: 12, padding: "13px 14px", cursor: "pointer", color: "#f0e6d3", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18, minWidth: 22 }}>{data.read[s.id] ? "✅" : "📖"}</span>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: 14 }}>{s.title}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.ref} — {s.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selStory && (
                  <div>
                    <button onClick={() => { setSelStory(null); setStoryText(""); setError(""); }} style={backBtnStyle(C)}>← {selBook?.name}</button>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: C.muted }}>{selStory.bookEmoji} {selStory.bookName} · {selStory.ref}</div>
                      <h2 style={{ fontSize: 20, fontWeight: "bold", margin: "4px 0", color: C.gold }}>{selStory.title}</h2>
                      <div style={{ fontSize: 13, color: C.muted }}>{selStory.desc}</div>
                    </div>
                    <TonePicker tone={tone} setTone={setTone} C={C} />
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      <button onClick={() => generateStory(selStory)} disabled={loading} style={genBtn(!loading, C)}>{loading ? "✨ Writing..." : "✨ Tell Me This Story"}</button>
                    </div>
                    <StoryOutput storyText={storyText} error={error} loading={loading} onRetry={() => generateStory(selStory)} C={C} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && (
          <div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={sLabel(C)}>Overall Journey</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 12 }}>
                {[
                  { label: "🔥 Current Streak", value: data.streak + " days" },
                  { label: "📖 Stories Read", value: totalRead + " / " + totalStories },
                  { label: "📅 Today", value: todayCount + " stories" },
                  { label: "🎯 Daily Goal", value: data.goal + " stories/day" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 10px" }}>
                    <div style={{ fontSize: 11, color: C.muted }}>{s.label}</div>
                    <div style={{ fontSize: 17, fontWeight: "bold", color: C.gold, marginTop: 2 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + C.gold + "," + C.peach + ")", borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6, textAlign: "center" }}>{pct}% of the Bible complete</div>
            </div>

            {/* Badges */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={sLabel(C)}>Badges Earned</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
                {BADGES.map(badge => {
                  const earned = (data.unlockedBadges || []).includes(badge.id);
                  return (
                    <div key={badge.id} style={{ background: earned ? "linear-gradient(135deg,rgba(246,211,101,0.15),rgba(253,160,133,0.1))" : "rgba(255,255,255,0.03)", border: "1px solid " + (earned ? "rgba(246,211,101,0.4)" : C.border), borderRadius: 12, padding: "12px 10px", textAlign: "center", opacity: earned ? 1 : 0.4 }}>
                      <div style={{ fontSize: 28, marginBottom: 4, filter: earned ? "none" : "grayscale(1)" }}>{badge.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: "bold", color: earned ? C.gold : C.muted }}>{badge.title}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 1.3 }}>{badge.desc}</div>
                      {earned && <div style={{ fontSize: 10, color: "#90ee90", marginTop: 4 }}>✅ Earned</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Per-book progress */}
            <div style={sLabel(C)}>Progress by Book</div>
            {BIBLE_DATA.map(t => (
              <div key={t.testament} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: "bold", color: C.gold, marginBottom: 8 }}>{t.testament === "Old Testament" ? "📜" : "✝️"} {t.testament}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {t.books.map(b => {
                    const bRead = b.stories.filter(s => data.read[s.id]).length;
                    const bPct = Math.round((bRead / b.stories.length) * 100);
                    return (
                      <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, minWidth: 20 }}>{b.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                            <span style={{ fontSize: 12 }}>{b.name}</span>
                            <span style={{ fontSize: 11, color: C.muted }}>{bRead}/{b.stories.length}</span>
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 4 }}>
                            <div style={{ height: "100%", width: bPct + "%", background: bPct === 100 ? "#90ee90" : "linear-gradient(90deg," + C.gold + "," + C.peach + ")", borderRadius: 99 }} />
                          </div>
                        </div>
                        {bPct === 100 && <span style={{ fontSize: 12 }}>✅</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes badgePop{0%{transform:scale(0) rotate(-20deg)}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0)}}`}</style>
    </div>
    </>
  );
}

function TonePicker({ tone, setTone, C }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>Writing Style</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
        {TONES.map(t => (
          <button key={t.id} onClick={() => setTone(t.id)} style={{ background: tone === t.id ? "linear-gradient(135deg,rgba(246,211,101,0.2),rgba(253,160,133,0.2))" : "rgba(255,255,255,0.04)", border: "1.5px solid " + (tone === t.id ? C.peach : C.border), borderRadius: 8, padding: "8px 4px", cursor: "pointer", color: "#f0e6d3", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: "bold" }}>{t.label}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StoryOutput({ storyText, error, loading, onRetry, C }) {
  if (!loading && !storyText && !error) return null;
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "24px 20px", lineHeight: 1.85, fontSize: 15 }}>
      {loading && !storyText && !error && (
        <div style={{ textAlign: "center", color: C.muted, padding: "28px 0" }}>
          <div style={{ fontSize: 26, marginBottom: 8, animation: "pulse 1.5s infinite" }}>✨</div>
          <p>Crafting your story...</p>
        </div>
      )}
      {error && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#ff8a80", fontSize: 13, wordBreak: "break-word" }}>{error}</p>
          <button onClick={onRetry} style={{ marginTop: 8, background: "transparent", border: "1px solid #ff8a80", borderRadius: 99, padding: "6px 18px", color: "#ff8a80", cursor: "pointer", fontSize: 12, fontFamily: "Georgia,serif" }}>Try Again</button>
        </div>
      )}
      {storyText && storyText.split("\n").filter(p => p.trim()).map((para, i, arr) => (
        <p key={i} style={{ margin: "0 0 14px", color: i === arr.length - 1 ? C.peach : "#f0e6d3" }}>{para}</p>
      ))}
    </div>
  );
}

const sLabel = C => ({ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.gold, marginBottom: 12, marginTop: 0 });
const backBtnStyle = C => ({ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, padding: "0 0 14px", fontFamily: "Georgia,serif" });
const navBtn = disabled => ({ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "8px 14px", color: disabled ? "#555" : "#f0e6d3", cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, fontFamily: "Georgia,serif" });
const genBtn = (active, C) => ({ background: active ? "linear-gradient(135deg," + C.gold + "," + C.peach + ")" : "rgba(255,255,255,0.1)", color: active ? "#1a1040" : "#666", border: "none", borderRadius: 99, padding: "13px 40px", fontSize: 14, fontWeight: "bold", cursor: active ? "pointer" : "not-allowed", fontFamily: "Georgia,serif", boxShadow: active ? "0 5px 20px rgba(246,211,101,0.3)" : "none" });
