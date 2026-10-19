const projectCatalog = {
  lullaby: 'Lullaby Lab',
  nightlight: 'Nightlight Collection',
  delivery: 'Dream Delivery Routes',
  blocks: 'Rattle & Block Toys',
  storybook: 'Bedtime Storybook',
  growth: "Pip's Growth Chart",
};

const DEFAULT_PROGRESS = {
  projects: [],
  dreamsDelivered: 0,
  blocksStacked: 0,
  storiesCompleted: 0,
  starsEarned: 0,
};

const STORY_STORAGE_KEY = 'pip-story-bookmark';
const GUESTBOOK_STORAGE_KEY = 'pip-guestbook';
const GUESTBOOK_LIMIT = 50;
const STORY_CHAPTERS = [
  {
    title: 'The First Spark',
    kicker: 'Chapter 1 • The Nursery Clock',
    scene: 'clock',
    illustration: '🕰️',
    alt: 'An old nursery clock with a tiny golden star glowing inside',
    paragraphs: [
      'At the quietest hour in the Midnight Nursery, Pip heard a very small ting! from inside the old clock.',
      'A golden star was tucked between the clock gears, glowing like a night-light and looking a little lost. Pip held out a gentle mitten. “Hello, little sparkle. Would you like some help?”',
    ],
    pip: 'Pip says: “Every big adventure starts with one tiny twinkle.”',
    choices: [
      { id: 'star-path', label: 'Follow the tiny star through the nursery window', value: 'window', response: 'Pip follows a trail of warm gold sparkles into the night.' },
      { id: 'moon-clue', label: 'Ask the sleepy moon for a clue', value: 'moon', response: 'Pip gives the moon a gentle tap-tap and asks for a little help.' },
    ],
  },
  {
    title: "The Moon's Secret",
    kicker: 'Chapter 2 • A Moonbeam Clue',
    scene: 'moon',
    illustration: '🌙',
    alt: 'A friendly crescent moon resting among lavender clouds',
    paragraphs: [
      'The sleepy moon opened one eye and yawned a silver moonbeam across the nursery roof. It knew the star was meant to live in the Cloud Kingdom, but a soft wind had nudged it off course.',
      'Pip checked the clues carefully. The star-path led toward a silver cloud bridge; the moon’s advice pointed to the same place, with an extra hint to listen for a lullaby.',
    ],
    branch: {
      window: 'Because Pip followed the star, its tiny golden footprints still shimmer on the roof tiles.',
      moon: 'Because Pip asked the moon, a silver beam now points toward the cloud bridge.',
    },
    pip: 'Pip says: “A good question is a very useful dream tool.”',
    choices: [
      { id: 'listen-song', label: 'Follow the lullaby floating on the breeze', value: 'song', response: 'Pip hums along and the breeze becomes a friendly guide.' },
      { id: 'follow-footprints', label: 'Follow the bright little footprints', value: 'footprints', response: 'Pip spots the footprints and follows them one careful step at a time.' },
    ],
  },
  {
    title: 'The Cloud Kingdom',
    kicker: 'Chapter 3 • Up in the Clouds',
    scene: 'clouds',
    illustration: '☁️',
    alt: 'Pastel cloud islands connected by a soft bridge above the nursery',
    paragraphs: [
      'Pip crossed a bridge made of cloud fluff and arrived at a kingdom of floating islands. A shy cloudlet, a sleepy moth, and three giggling stars were looking for their missing friend.',
      'The clue Pip chose helped the little group find the star’s trail. Together, they made a gentle dream kite sturdy enough to carry a sparkle all the way home.',
    ],
    branch: {
      song: 'The cloud creatures recognize Pip’s tune and join in with a soft, hopeful chorus.',
      footprints: 'The cloud creatures follow the bright prints and discover the star’s trail together.',
    },
    pip: 'Pip says: “Teamwork makes the fluffiest cloud bridges!”',
    choices: [
      { id: 'help-cloudlet', label: 'Help the shy cloudlet steer the dream kite', value: 'cloudlet', response: 'Pip and the cloudlet take turns guiding the kite.' },
      { id: 'invite-moth', label: 'Invite the sleepy moth to light the way', value: 'moth', response: 'The moth gives a tiny lantern-glow and joins the adventure.' },
    ],
  },
  {
    title: 'The Dream Delivery',
    kicker: 'Chapter 4 • Homeward, Starward',
    scene: 'delivery',
    illustration: '✨',
    alt: 'A glowing dream trail winding between friendly stars in the night sky',
    paragraphs: [
      'With the star tucked safely into the dream kite, Pip began the journey home. The wind wobbled, as winds sometimes do, but Pip remembered that kindness can be a compass.',
      'The cloudlet’s steady hands—or the moth’s warm lantern—helped the little star find its place in the night sky. Across the rooftops, other dreamers saw the glow and felt a little less alone.',
    ],
    branch: {
      cloudlet: 'The cloudlet gives Pip a brave little wave as the kite glides home.',
      moth: 'The moth’s lantern flickers a cheerful goodbye as the kite glides home.',
    },
    pip: 'Pip says: “Dream delivered! One happy star, coming right up.”',
    choices: [
      { id: 'share-starlight', label: 'Share the star’s light with every nearby dreamer', value: 'share', response: 'The star sends gentle sparkles to every cozy window.' },
      { id: 'save-moonbeam', label: 'Save one moonbeam for tomorrow night', value: 'save', response: 'Pip saves a little moonbeam so the kindness can travel again.' },
    ],
  },
  {
    title: 'A Little Light for Everyone',
    kicker: 'Chapter 5 • The Night Sky',
    scene: 'nursery',
    illustration: '🌟',
    alt: 'A cozy nursery beneath a calm sky filled with bright stars',
    paragraphs: [
      'The star settled into its place and the whole sky gave a soft, happy shimmer. The nursery lights glowed warm and gentle, while every little creature found a peaceful dream waiting nearby.',
      'Pip learned that the brightest dreams are not kept in one pocket—they are shared. Then the Junior Dream Engineer yawned, wrote the adventure in a tiny notebook, and prepared for another magical night.',
    ],
    branch: {
      share: 'The star’s light reaches every window, and the little dreamers wave goodnight together.',
      save: 'The saved moonbeam rests in Pip’s pocket, ready to brighten another night.',
    },
    pip: 'Pip says: “The best dreams are the ones we share. Now... tiny nap?”',
    choices: [],
  },
];

const state = {
  sleepiness: 87,
  awake: false,
  profileMood: 'Sleepy',
  scannerTimer: null,
  storyIndex: 0,
  storyChoices: {},
  storyHighestChapter: 0,
  storyDiscoveredStars: [],
  storyComplete: false,
  storyBookmarkAvailable: false,
  generatedDreams: [],
  guestbookEntries: [],
  guestbookSubmitting: false,
  easterEggClicks: 0,
  progress: { ...DEFAULT_PROGRESS },
  lullaby: {
    playing: false,
    mood: 'Sleepy Moon',
    context: null,
    gain: null,
    timer: null,
  },
  nightlight: {
    on: true,
    brightness: 72,
    color: '#79E6FF',
    scene: 'night',
    design: 'moon',
  },
  delivery: {
    current: 0,
    route: ['Moonberry Rooftop', 'Pillow Hill', 'Cotton Cloud Market'],
  },
  blocks: {
    stack: [],
    dragColor: 'pink',
    completed: false,
  },
  storybook: {
    current: 0,
    ending: null,
  },
  starGame: {
    score: 0,
    timeLeft: 15,
    timerId: null,
    active: false,
    starInterval: null,
    spawnCount: 0,
  },
};

const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.getElementById('navLinks');
const pipStatusText = document.getElementById('pipStatusText');
const pipFigure = document.getElementById('pipFigure');
const wakeButton = document.getElementById('wakeBtnHeader');
const meetBtn = document.getElementById('meetBtn');
const enterBtn = document.getElementById('enterBtn');
const scannerOutput = document.getElementById('scannerOutput');
const scanPersonalityBtn = document.getElementById('scanPersonalityBtn');
const dreamMood = document.getElementById('dreamMood');
const dreamSetting = document.getElementById('dreamSetting');
const dreamResult = document.getElementById('dreamResult');
const generateDreamBtn = document.getElementById('generateDreamBtn');
const storyProgressBar = document.getElementById('storyProgressBar');
const storyCounter = document.getElementById('storyCounter');
const nextStoryBtn = document.getElementById('nextStoryBtn');
const prevStoryBtn = document.getElementById('prevStoryBtn');
const guestbookForm = document.getElementById('guestbookForm');
const guestbookEntries = document.getElementById('guestbookEntries');
const guestbookFeedback = document.getElementById('guestbookFeedback');
const clearGuestbookBtn = document.getElementById('clearGuestbookBtn');
const randomMessage = document.getElementById('randomMessage');
const secretBtn = document.getElementById('secretBtn');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const visitCount = document.getElementById('visitCount');
const visitorCounterBtn = document.getElementById('visitorCounterBtn');
const pipDialogue = document.getElementById('pipDialogue');
const pipSpeechBubble = document.getElementById('pipSpeechBubble');
const dreamCounter = document.getElementById('dreamCounter');
const moonSecretBtn = document.getElementById('moonSecretBtn');
const moonSecretBadge = document.getElementById('moonSecretBadge');
const profileDialogue = document.getElementById('pipProfileDialogue');
const personalityDescription = document.getElementById('personalityDescription');
const statusGrid = document.getElementById('statusGrid');
const portraitFactBtn = document.getElementById('portraitFactBtn');
const portraitFact = document.getElementById('portraitFact');

const moodProfiles = {
  Sleepy: {
    description: 'A cozy cloud-pillow thinker who is curious, sleepy, and easily delighted.',
    dialogue: [
      '“My nightcap has a secret pocket for extra stardust.”',
      '“I am not napping. I am testing the pillow clouds.”',
      '“One tiny yawn can power a whole bedtime story.”',
    ],
    stats: { energy: 42, imagination: 88, dreamPower: 76 },
  },
  Curious: {
    description: 'A bright little question-collector who investigates every moonbeam.',
    dialogue: [
      '“What happens if I put a star in my pocket?”',
      '“I have three questions and a very small notebook.”',
      '“Is the moon made of cheese, or just excellent cake?”',
    ],
    stats: { energy: 78, imagination: 91, dreamPower: 82 },
  },
  Magical: {
    description: 'A gentle moonlight inventor who turns ordinary thoughts into wonder.',
    dialogue: [
      '“Abraca-nap! That blanket is now a flying carpet.”',
      '“I sprinkled one sparkle. Oops, now everything sparkles.”',
      '“The moon gave me a tiny wizard hat. It is mostly snacks.”',
    ],
    stats: { energy: 67, imagination: 100, dreamPower: 97 },
  },
  Chaotic: {
    description: 'A giggle-powered dream tinkerer with a plan, a spoon, and no instructions.',
    dialogue: [
      '“The dream machine made toast. I think it is learning.”',
      '“I put my socks on the moon. The moon says thanks.”',
      '“Everything is under control! Except the tiny cloud parade.”',
    ],
    stats: { energy: 94, imagination: 93, dreamPower: 86 },
  },
};

const personalityTraits = [
  {
    title: 'Sleepy Genius',
    description: 'Pip solves tricky dream puzzles while looking for the comfiest pillow.',
  },
  {
    title: 'Cloud Architect',
    description: 'Pip designs fluffy cloud castles with excellent nap-friendly hallways.',
  },
  {
    title: 'Moonlight Inventor',
    description: 'Pip turns moonbeams, buttons, and tiny ideas into brand-new dreams.',
  },
  {
    title: 'Professional Giggle Machine',
    description: 'Pip adds a surprise giggle to every dream delivery. It is very official.',
  },
];

const pipFacts = [
  'Pip keeps a tiny notebook of cloud shapes that look like snacks.',
  'Pip’s nightcap bow is tied with a moonbeam.',
  'Pip once tested a pillow so fluffy it floated into the attic.',
  'Pip names every star delivered from the Midnight Nursery.',
  'Pip’s favorite invention is a lullaby that hums itself.',
];

const randomMessages = [
  'Achievement unlocked: Professional Cloud Inspector.',
  'Oopsie! The dream machine sneezed.',
  'Warning: Too many sparkles detected.',
  'Your dream has been approved by one very sleepy baby.',
  '404: Boring website not found.',
  'Moon milk successfully delivered.',
  'Pip has entered a very serious nap posture.',
];

function updateNavState() {
  const scrollPosition = window.scrollY + 160;
  let current = sections[0]?.id || 'home';

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    const matches = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', matches);
  });
}

function setupNav() {
  navToggle?.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Open menu');
    });
  });

  window.addEventListener('scroll', updateNavState);
  updateNavState();
}

function setSleepiness(nextValue, label) {
  state.sleepiness = Math.max(0, Math.min(100, nextValue));
  pipStatusText.textContent = `PIP STATUS: ${state.sleepiness}% ${label}`;
  const energyValue = document.getElementById('workshopEnergyValue');
  const energyMeter = document.querySelector('.workshop-energy-meter');
  const energyBar = document.getElementById('workshopEnergyBar');
  if (energyValue) energyValue.textContent = `${state.sleepiness}%`;
  if (energyMeter) energyMeter.setAttribute('aria-valuenow', String(state.sleepiness));
  if (energyBar) energyBar.style.width = `${state.sleepiness}%`;
}

function updatePipDialogue(message) {
  pipDialogue.textContent = message;
  pipSpeechBubble.textContent = message;
}

function preferredScrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function recordDreamDelivered() {
  const count = Number(dreamCounter.textContent) + 1;
  dreamCounter.textContent = String(count);
  state.progress.dreamsDelivered = (Number(state.progress.dreamsDelivered) || 0) + 1;
  updateGrowthChart();
  saveProgress();
}

function togglePipState() {
  state.awake = !state.awake;
  pipFigure.classList.toggle('awake', state.awake);
  wakeButton.textContent = state.awake ? 'LET PIP SLEEP' : 'WAKE UP!';
  wakeButton.setAttribute('aria-pressed', String(state.awake));

  if (state.awake) {
    setSleepiness(state.sleepiness - (22 + Math.floor(Math.random() * 17)), 'AWAKE');
    updatePipDialogue('Pip says: “I am awake! Please direct me to the snack moon.”');
    document.body.classList.add('pip-dancing');
  } else {
    setSleepiness(78 + Math.floor(Math.random() * 19), 'SLEEPY');
    updatePipDialogue('Pip says: “I was absolutely not napping on the job.”');
    document.body.classList.remove('pip-dancing');
  }
}

function setupWakeButtons() {
  wakeButton?.addEventListener('click', togglePipState);

  meetBtn?.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
  });

  enterBtn?.addEventListener('click', () => {
    const hero = document.getElementById('home');
    const fragment = document.createDocumentFragment();
    Array.from({ length: 12 }, () => {
      const star = document.createElement('span');
      star.textContent = '✦';
      star.className = 'dream-trail-star';
      star.setAttribute('aria-hidden', 'true');
      star.style.setProperty('--start-x', `${8 + Math.random() * 84}%`);
      star.style.setProperty('--start-y', `${12 + Math.random() * 76}%`);
      star.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 150}px`);
      star.style.setProperty('--drift-y', `${-35 - Math.random() * 110}px`);
      fragment.appendChild(star);
    });
    hero.appendChild(fragment);
    hero.querySelectorAll('.dream-trail-star').forEach((star) => {
      star.addEventListener('animationend', () => star.remove(), { once: true });
    });
    recordDreamDelivered();
    updatePipDialogue('Pip says: “Dream delivery! Mind the glitter on your shoes.”');

    window.setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
      updateWorkshopMood('Pip says: “Dreamland approved. I just sneezed glitter!”', 1);
      setSleepiness(Math.max(10, state.sleepiness - 3), state.awake ? 'AWAKE' : 'DREAMY');
    }, 100);
  });

  moonSecretBtn?.addEventListener('click', () => {
    moonSecretBadge.hidden = false;
    moonSecretBtn.setAttribute('aria-expanded', 'true');
    document.getElementById('moonSecretHint').textContent = 'The moon says: “Welcome to my tiny fan club.”';
    updatePipDialogue('Pip says: “You found the moon’s secret! That is extremely moon-believable.”');
  });
}

function setupRotatingDialogue() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lines = [
    'You look like you need a nap. Respectfully.',
    'Pip says: “My pillow is on a very important mission.”',
    'Pip says: “I can fit three dreams and one cracker in this hat.”',
    'Pip says: “The moon owes me a bedtime story.”',
  ];
  let lineIndex = 0;
  let dialogueTimer;

  const startRotation = () => {
    if (prefersReducedMotion.matches || dialogueTimer) return;
    dialogueTimer = window.setInterval(() => {
      lineIndex = (lineIndex + 1) % lines.length;
      pipSpeechBubble.textContent = lines[lineIndex];
    }, 6500);
  };

  const stopRotation = () => {
    window.clearInterval(dialogueTimer);
    dialogueTimer = undefined;
  };

  startRotation();
  prefersReducedMotion.addEventListener?.('change', () => {
    if (prefersReducedMotion.matches) {
      stopRotation();
    } else {
      startRotation();
    }
  });
}

function setProfileStats(stats) {
  Object.entries(stats).forEach(([key, rawValue]) => {
    const value = Math.max(0, Math.min(100, Math.round(rawValue)));
    const statValue = document.querySelector(`[data-stat="${key}"]`);
    const meter = statValue?.nextElementSibling;
    const bar = meter?.querySelector('span');

    if (!statValue || !meter || !bar) return;
    statValue.textContent = `${value}%`;
    meter.setAttribute('aria-valuenow', String(value));
    bar.style.width = `${value}%`;
    bar.classList.add('stats-updated');
  });
}

function setProfileMood(mood) {
  const profile = moodProfiles[mood];
  if (!profile) return;

  state.profileMood = mood;
  personalityDescription.textContent = profile.description;
  profileDialogue.textContent = profile.dialogue[0];
  setProfileStats(profile.stats);

  document.querySelectorAll('.mood-option').forEach((button) => {
    const selected = button.dataset.mood === mood;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function createScannerReadout(trait, description) {
  const readout = document.createElement('div');
  readout.className = 'scanner-readout';

  const icon = document.createElement('span');
  icon.className = 'scanner-indicator';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '✦';

  const text = document.createElement('div');
  const title = document.createElement('p');
  title.className = 'scanner-trait';
  title.textContent = trait;

  const detail = document.createElement('p');
  detail.className = 'scanner-description';
  detail.textContent = description;

  text.append(title, detail);
  readout.append(icon, text);
  return readout;
}

function scanPersonality() {
  window.clearTimeout(state.scannerTimer);
  scannerOutput.replaceChildren();
  scannerOutput.classList.add('scanning');
  scannerOutput.setAttribute('aria-busy', 'true');

  const readout = document.createElement('div');
  readout.className = 'scanner-readout';
  const indicator = document.createElement('span');
  indicator.className = 'scanner-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  indicator.textContent = '✦';
  const message = document.createElement('p');
  message.textContent = 'Dream signals incoming... scanning Pip-shaped fluff.';
  readout.append(indicator, message);
  scannerOutput.appendChild(readout);

  scanPersonalityBtn.disabled = true;
  scanPersonalityBtn.textContent = 'SCANNING...';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  state.scannerTimer = window.setTimeout(() => {
    const trait = personalityTraits[Math.floor(Math.random() * personalityTraits.length)];
    scannerOutput.replaceChildren(createScannerReadout(trait.title, trait.description));
    scannerOutput.classList.remove('scanning');
    scannerOutput.removeAttribute('aria-busy');
    scanPersonalityBtn.disabled = false;
    scanPersonalityBtn.textContent = 'SCAN AGAIN';
  }, prefersReducedMotion ? 80 : 950);
}

function setupPersonalityScanner() {
  scanPersonalityBtn?.addEventListener('click', scanPersonality);

  document.querySelectorAll('.mood-option').forEach((button) => {
    button.addEventListener('click', () => setProfileMood(button.dataset.mood));
  });

  portraitFactBtn?.addEventListener('click', () => {
    const fact = pipFacts[Math.floor(Math.random() * pipFacts.length)];
    portraitFact.textContent = `Pip fact: ${fact}`;
    portraitFact.hidden = false;
    portraitFact.classList.remove('fact-pop');
    void portraitFact.offsetWidth;
    portraitFact.classList.add('fact-pop');
  });

  const portrait = portraitFactBtn?.querySelector('img');
  portrait?.addEventListener('error', () => {
    portraitFact.textContent = 'Pip is hiding behind a cloud. The profile and scanner still work!';
    portraitFact.hidden = false;
  }, { once: true });

  setProfileMood(state.profileMood);
}

function setupProfileDialogue() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dialogueIndex = 0;
  let dialogueTimer;

  const start = () => {
    if (prefersReducedMotion.matches || dialogueTimer) return;
    dialogueTimer = window.setInterval(() => {
      const lines = moodProfiles[state.profileMood].dialogue;
      dialogueIndex = (dialogueIndex + 1) % lines.length;
      profileDialogue.textContent = lines[dialogueIndex];
    }, 6200);
  };

  const stop = () => {
    window.clearInterval(dialogueTimer);
    dialogueTimer = undefined;
  };

  prefersReducedMotion.addEventListener?.('change', () => {
    if (prefersReducedMotion.matches) stop();
    else start();
  });
  start();
}

function setupStatsAnimation() {
  if (!statusGrid) return;

  const reveal = () => statusGrid.classList.add('stats-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      reveal();
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  observer.observe(statusGrid);
}

function updateWorkshopMood(message, energyChange = 0) {
  const greeting = document.getElementById('workshopGreeting');
  const value = document.getElementById('workshopEnergyValue');
  const meter = document.querySelector('.workshop-energy-meter');
  const bar = document.getElementById('workshopEnergyBar');

  state.sleepiness = Math.max(0, Math.min(100, state.sleepiness + energyChange));
  if (greeting && message) greeting.textContent = message;
  if (value) value.textContent = `${state.sleepiness}%`;
  if (meter) meter.setAttribute('aria-valuenow', String(state.sleepiness));
  if (bar) bar.style.width = `${state.sleepiness}%`;
}

function generateDream() {
  const mood = dreamMood.value;
  const setting = dreamSetting.value;
  const spark = document.querySelector('.dream-sprinkle.selected')?.dataset.dreamSpark || 'a shy comet';
  const arrival = [
    `Pip and ${spark} tiptoed into the ${setting}`,
    `A tiny dream-boat carried Pip and ${spark} to the ${setting}`,
    `Under a blanket of stars, Pip found ${spark} waiting in the ${setting}`,
    `One soft moonbeam later, Pip and ${spark} were drifting through the ${setting}`,
  ];
  const middle = [
    `There, a ${mood.toLowerCase()} little cloud was collecting lost wishes in a teacup.`,
    `A sleepy moon played hide-and-seek with the brightest star, and everyone giggled.`,
    `They planted a handful of stardust and watched a garden of glowing pillows grow.`,
    `The night breeze hummed a tune that made even the quiet planets sway.`,
  ];
  const ending = [
    `Before long, the whole sky was tucked in, dreaming of warm cocoa and kind friends.`,
    `Pip left one last twinkle at the window, then floated home for a well-earned nap.`,
    `The new friends shared the softest yawn, and the stars blinked goodnight.`,
    `And that is how the Midnight Nursery got one more happy dream to deliver.`,
  ];

  const pick = (lines) => lines[Math.floor(Math.random() * lines.length)];
  const dream = `${pick(arrival)}. This ${mood.toLowerCase()} dream brought a little magic to the moment: ${pick(middle)} ${pick(ending)}`;
  dreamResult.textContent = dream;
  state.generatedDreams.push(dream);
  const copyButton = document.getElementById('copyDreamBtn');
  if (copyButton) {
    copyButton.disabled = false;
    copyButton.textContent = 'Copy dream';
  }
  recordDreamDelivered();
  updateWorkshopMood('Pip says: “A brand-new dream! I tucked in an extra twinkle just for you.”', 3);
}

async function copyDream() {
  const copyButton = document.getElementById('copyDreamBtn');
  if (!copyButton || copyButton.disabled) return;

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error('Clipboard access is not available in this browser context.');
    }
    await navigator.clipboard.writeText(dreamResult.textContent);
    copyButton.textContent = 'Copied!';
  } catch (error) {
    copyButton.textContent = 'Copy unavailable';
    updateWorkshopMood('Pip says: “The copy magic is snoozing here. You can still select the dream text!”');
  }
}

function setupDreamGenerator() {
  generateDreamBtn?.addEventListener('click', generateDream);
  document.getElementById('copyDreamBtn')?.addEventListener('click', copyDream);

  document.querySelectorAll('.dream-sprinkle').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.dream-sprinkle').forEach((sprinkle) => {
        const isSelected = sprinkle === button;
        sprinkle.classList.toggle('selected', isSelected);
        sprinkle.setAttribute('aria-pressed', String(isSelected));
      });
      updateWorkshopMood(`Pip says: “Ooh, ${button.dataset.dreamSpark}! That's a very good dream ingredient.”`);
    });
    button.setAttribute('aria-pressed', String(button.classList.contains('selected')));
  });
}

function updateStoryDisplay() {
  const chapter = STORY_CHAPTERS[state.storyIndex];
  const scene = document.getElementById('storyScene');
  const progress = ((state.storyIndex + 1) / STORY_CHAPTERS.length) * 100;
  const progressTrack = storyProgressBar.parentElement;
  const previousButton = document.getElementById('prevStoryBtn');
  const nextButton = document.getElementById('nextStoryBtn');
  const bookmarkIndicator = document.getElementById('bookmarkIndicator');
  const completion = document.getElementById('storyComplete');
  const chapterList = document.getElementById('chapterList');

  storyProgressBar.style.width = `${progress}%`;
  progressTrack.setAttribute('aria-valuenow', String(state.storyIndex + 1));
  storyCounter.textContent = `Chapter ${state.storyIndex + 1} of ${STORY_CHAPTERS.length}`;
  bookmarkIndicator.textContent = `BOOKMARK • PAGE ${state.storyIndex + 1}`;
  previousButton.disabled = state.storyIndex === 0;
  nextButton.disabled = state.storyIndex === STORY_CHAPTERS.length - 1;
  completion.hidden = !state.storyComplete;

  const article = document.createElement('article');
  article.className = `story-card active story-scene-${chapter.scene}`;
  article.setAttribute('aria-labelledby', 'currentStoryTitle');

  const illustration = document.createElement('div');
  illustration.className = 'story-scene-art';
  illustration.setAttribute('role', 'img');
  illustration.setAttribute('aria-label', chapter.alt);
  illustration.setAttribute('aria-hidden', 'false');
  illustration.textContent = chapter.illustration;

  const sceneDecor = document.createElement('span');
  sceneDecor.className = 'story-scene-decor';
  sceneDecor.setAttribute('aria-hidden', 'true');
  sceneDecor.textContent = '✦';
  illustration.appendChild(sceneDecor);

  const text = document.createElement('div');
  text.className = 'story-copy';
  const kicker = document.createElement('p');
  kicker.className = 'story-kicker';
  kicker.textContent = chapter.kicker;
  const title = document.createElement('h4');
  title.id = 'currentStoryTitle';
  title.textContent = chapter.title;
  text.append(kicker, title);

  chapter.paragraphs.forEach((paragraphText) => {
    const paragraph = document.createElement('p');
    paragraph.className = 'story-paragraph';
    paragraph.textContent = paragraphText;
    text.appendChild(paragraph);
  });

  const priorChoiceIndex = state.storyIndex > 0 && state.storyIndex < STORY_CHAPTERS.length - 1
    ? state.storyIndex - 1
    : -1;
  const branch = priorChoiceIndex >= 0 && chapter.branch
    ? chapter.branch[state.storyChoices[priorChoiceIndex]]
    : null;
  if (branch) {
    const branchText = document.createElement('p');
    branchText.className = 'story-branch-note';
    branchText.textContent = branch;
    text.appendChild(branchText);
  }

  const dialogue = document.createElement('p');
  dialogue.className = 'story-pip-dialogue';
  dialogue.textContent = chapter.pip;
  text.appendChild(dialogue);

  if (chapter.choices.length) {
    const choiceGroup = document.createElement('fieldset');
    choiceGroup.className = 'story-choices';
    const legend = document.createElement('legend');
    legend.textContent = state.storyChoices[state.storyIndex]
      ? 'Your story choice (choose again to change it)'
      : 'What should Pip do next?';
    choiceGroup.appendChild(legend);

    chapter.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'story-choice';
      button.textContent = choice.label;
      button.setAttribute('aria-pressed', String(state.storyChoices[state.storyIndex] === choice.value));
      button.addEventListener('click', () => {
        const changedChoice = state.storyChoices[state.storyIndex] !== choice.value;
        if (changedChoice) {
          Object.keys(state.storyChoices).forEach((chapterIndex) => {
            if (Number(chapterIndex) > state.storyIndex) delete state.storyChoices[chapterIndex];
          });
        }
        state.storyChoices[state.storyIndex] = choice.value;
        if (changedChoice) state.storyComplete = false;
        document.getElementById('storyComplete').hidden = !state.storyComplete;
        state.storyBookmarkAvailable = true;
        saveStoryBookmark();
        choiceGroup.querySelectorAll('.story-choice').forEach((choiceButton) => {
          choiceButton.setAttribute('aria-pressed', String(choiceButton === button));
        });
        choiceGroup.querySelector('legend').textContent = 'Your story choice (choose again to change it)';
        let choiceFeedback = choiceGroup.querySelector('.story-choice-feedback');
        if (!choiceFeedback) {
          choiceFeedback = document.createElement('p');
          choiceFeedback.className = 'story-choice-feedback';
          choiceGroup.appendChild(choiceFeedback);
        }
        choiceFeedback.textContent = choice.response;
        document.getElementById('storyLiveStatus').textContent = `Choice saved. ${choice.response}`;
        updateWorkshopMood(`Pip says: “${choice.response}”`);
      });
      choiceGroup.appendChild(button);
    });
    const selectedChoice = chapter.choices.find((choice) => choice.value === state.storyChoices[state.storyIndex]);
    if (selectedChoice) {
      const choiceFeedback = document.createElement('p');
      choiceFeedback.className = 'story-choice-feedback';
      choiceFeedback.textContent = selectedChoice.response;
      choiceGroup.appendChild(choiceFeedback);
    }
    text.appendChild(choiceGroup);
  } else {
    const endingChoice = state.storyChoices[3];
    const endingBranch = STORY_CHAPTERS[3].choices.find((choice) => choice.value === endingChoice)?.response;
    if (endingBranch) {
      const branchText = document.createElement('p');
      branchText.className = 'story-branch-note';
      branchText.textContent = endingBranch;
      text.appendChild(branchText);
    }
  }

  const collectible = document.createElement('button');
  collectible.type = 'button';
  collectible.className = 'chapter-collectible';
  collectible.textContent = state.storyDiscoveredStars.includes(state.storyIndex) ? '✦ Star found!' : '✧ Find this page’s star';
  collectible.setAttribute('aria-pressed', String(state.storyDiscoveredStars.includes(state.storyIndex)));
  collectible.addEventListener('click', () => discoverStoryStar(state.storyIndex));
  text.appendChild(collectible);

  article.append(illustration, text);
  scene.replaceChildren(article);

  chapterList.replaceChildren();
  STORY_CHAPTERS.forEach((item, index) => {
    const chapterButton = document.createElement('button');
    chapterButton.type = 'button';
    chapterButton.className = 'chapter-tab';
    chapterButton.textContent = `${index + 1}. ${item.title}`;
    if (index === state.storyIndex) {
      chapterButton.setAttribute('aria-current', 'step');
    }
    chapterButton.addEventListener('click', () => navigateStory(index, true));
    chapterList.appendChild(chapterButton);
  });

  if (state.storyComplete) {
    const ending = document.getElementById('storyEndingText');
    const endingChoice = state.storyChoices[3];
    const extra = endingChoice === 'share'
      ? ' The star’s light reaches every window, and the little dreamers wave goodnight together.'
      : endingChoice === 'save'
        ? ' Pip saves one moonbeam to brighten another night.'
        : '';
    ending.textContent = `The star is home, the nursery is glowing, and Pip has one more dream to share.${extra}`;
  }

  const bookmarkMessage = document.getElementById('bookmarkMessage');
  bookmarkMessage.textContent = state.storyBookmarkAvailable
    ? `Your bookmark is on page ${state.storyIndex + 1} of ${STORY_CHAPTERS.length}.`
    : 'Your story is ready whenever you are.';
}

function getSafeStoryBookmark(value) {
  if (!value || typeof value !== 'object' || value.version !== 1) return null;
  const choices = {};
  const validChoiceValues = STORY_CHAPTERS.flatMap((chapter) => chapter.choices.map((choice) => choice.value));
  if (value.choices && typeof value.choices === 'object') {
    Object.entries(value.choices).forEach(([key, choice]) => {
      const chapterIndex = Number(key);
      if (Number.isInteger(chapterIndex) && chapterIndex >= 0 && chapterIndex < STORY_CHAPTERS.length
        && validChoiceValues.includes(choice)
        && STORY_CHAPTERS[chapterIndex].choices.some((option) => option.value === choice)) {
        choices[chapterIndex] = choice;
      }
    });
  }
  const currentChapter = Number.isInteger(value.currentChapter)
    ? Math.max(0, Math.min(STORY_CHAPTERS.length - 1, value.currentChapter))
    : 0;
  const highestChapter = Number.isInteger(value.highestChapter)
    ? Math.max(currentChapter, Math.min(STORY_CHAPTERS.length - 1, value.highestChapter))
    : currentChapter;
  const discoveredStars = Array.isArray(value.discoveredStars)
    ? [...new Set(value.discoveredStars.filter((index) => Number.isInteger(index) && index >= 0 && index < STORY_CHAPTERS.length))]
    : [];
  return {
    currentChapter,
    highestChapter,
    choices,
    discoveredStars,
    complete: value.complete === true && currentChapter === STORY_CHAPTERS.length - 1,
  };
}

function storyBookmarkPayload() {
  return {
    version: 1,
    currentChapter: state.storyIndex,
    highestChapter: state.storyHighestChapter,
    choices: state.storyChoices,
    discoveredStars: state.storyDiscoveredStars,
    complete: state.storyComplete,
  };
}

function saveStoryBookmark() {
  try {
    localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(storyBookmarkPayload()));
    state.storyBookmarkAvailable = true;
    document.getElementById('continueStoryBtn').hidden = false;
    const status = document.getElementById('storyBookmarkStatus');
    status.textContent = 'Bookmark saved in this browser.';
    return true;
  } catch (error) {
    document.getElementById('storyBookmarkStatus').textContent = 'Your browser could not save the bookmark. You can keep reading this visit.';
    return false;
  }
}

function loadStoryBookmark() {
  try {
    const stored = localStorage.getItem(STORY_STORAGE_KEY);
    if (!stored) return;
    const safeBookmark = getSafeStoryBookmark(JSON.parse(stored));
    if (!safeBookmark) {
      document.getElementById('storyBookmarkStatus').textContent = 'A sleepy bookmark could not be read. Start a new adventure to make a fresh one.';
      return;
    }
    state.storyIndex = safeBookmark.currentChapter;
    state.storyHighestChapter = safeBookmark.highestChapter;
    state.storyChoices = safeBookmark.choices;
    state.storyDiscoveredStars = safeBookmark.discoveredStars;
    state.storyComplete = safeBookmark.complete;
    state.storyBookmarkAvailable = true;
    document.getElementById('continueStoryBtn').hidden = false;
    document.getElementById('bookmarkMessage').textContent = `Your bookmark is on page ${state.storyIndex + 1} of ${STORY_CHAPTERS.length}.`;
  } catch (error) {
    document.getElementById('storyBookmarkStatus').textContent = 'Bookmarks are unavailable right now. You can still read the whole story this visit.';
  }
}

function navigateStory(index, focusChapterTab = false) {
  const nextIndex = Math.max(0, Math.min(STORY_CHAPTERS.length - 1, index));
  if (nextIndex === state.storyIndex) return;

  state.storyIndex = nextIndex;
  state.storyHighestChapter = Math.max(state.storyHighestChapter, nextIndex);
  updateStoryDisplay();
  const chapter = STORY_CHAPTERS[nextIndex];
  document.getElementById('storyLiveStatus').textContent = `Chapter ${nextIndex + 1}: ${chapter.title}.`;
  state.storyBookmarkAvailable = true;
  saveStoryBookmark();
  updateWorkshopMood(chapter.pip);

  if (nextIndex === STORY_CHAPTERS.length - 1) completeStory();
  if (focusChapterTab) {
    document.querySelectorAll('.chapter-tab')[nextIndex]?.focus();
  }
}

function completeStory() {
  if (state.storyComplete) return;
  state.storyComplete = true;
  state.progress.storiesCompleted = Math.max(1, Number(state.progress.storiesCompleted) || 0);
  markProjectExplored('storybook');
  saveProgress();
  saveStoryBookmark();
  updateStoryDisplay();
  document.getElementById('storyLiveStatus').textContent = 'Story complete. Pip earned the Dream Keeper badge.';
}

function discoverStoryStar(chapterIndex) {
  if (state.storyDiscoveredStars.includes(chapterIndex)) return;
  state.storyDiscoveredStars.push(chapterIndex);
  document.getElementById('storyLiveStatus').textContent = `You found a tiny star on page ${chapterIndex + 1}.`;
  saveStoryBookmark();
  const collectible = document.querySelector('.chapter-collectible');
  collectible.textContent = '✦ Star found!';
  collectible.setAttribute('aria-pressed', 'true');
  updateWorkshopMood('Pip says: “A page star! I’ll tuck that sparkle in my notebook.”', 1);
}

function setupStory() {
  loadStoryBookmark();
  updateStoryDisplay();

  document.getElementById('continueStoryBtn')?.addEventListener('click', () => {
    document.getElementById('story')?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
    document.getElementById('storyLiveStatus').textContent = `Welcome back to chapter ${state.storyIndex + 1}.`;
  });

  document.getElementById('newStoryBtn')?.addEventListener('click', () => {
    if (state.storyBookmarkAvailable && !window.confirm('Start a new adventure? Your current bookmark and choices will be cleared.')) return;
    resetStory();
  });

  document.getElementById('restartStoryBtn')?.addEventListener('click', () => {
    if ((state.storyHighestChapter > 0 || Object.keys(state.storyChoices).length || state.storyComplete)
      && !window.confirm('Restart this story? Your current choices and bookmark will be cleared.')) return;
    resetStory();
  });

  document.getElementById('readAgainBtn')?.addEventListener('click', resetStory);
  nextStoryBtn?.addEventListener('click', () => {
    if (state.storyIndex < STORY_CHAPTERS.length - 1) navigateStory(state.storyIndex + 1);
  });
  prevStoryBtn?.addEventListener('click', () => {
    if (state.storyIndex > 0) navigateStory(state.storyIndex - 1);
  });
}

function resetStory() {
  state.storyIndex = 0;
  state.storyChoices = {};
  state.storyHighestChapter = 0;
  state.storyDiscoveredStars = [];
  state.storyComplete = false;
  try {
    localStorage.removeItem(STORY_STORAGE_KEY);
    state.storyBookmarkAvailable = false;
    document.getElementById('continueStoryBtn').hidden = true;
    document.getElementById('storyBookmarkStatus').textContent = 'A fresh page! Your new adventure starts here.';
  } catch (error) {
    state.storyBookmarkAvailable = true;
    document.getElementById('storyBookmarkStatus').textContent = 'Could not clear the saved bookmark. Your story restarted for this visit.';
  }
  updateStoryDisplay();
  document.getElementById('storyLiveStatus').textContent = 'A new adventure begins at chapter 1.';
}

function ensureProgressPanel() {
  const section = document.getElementById('projects');
  if (!section || section.querySelector('#dreamProgressPanel')) return;

  const container = section.querySelector('.container');
  const panel = document.createElement('aside');
  panel.id = 'dreamProgressPanel';
  panel.className = 'project-progress-panel card-sheen';
  panel.innerHTML = `
    <div class="project-progress-header">
      <div>
        <p class="eyebrow purple">DREAM EXPLORER</p>
        <h4>Growth Chart</h4>
      </div>
      <button class="secondary-btn small reset-progress-btn" type="button" id="resetProgressBtn">
        Reset progress
      </button>
    </div>
    <div class="progress-summary">
      <div class="summary-pill">
        <span>Dreams explored</span>
        <strong id="exploredCountText">0/6</strong>
      </div>
      <div class="summary-pill">
        <span>Stars earned</span>
        <strong id="starsEarnedText">0</strong>
      </div>
    </div>
    <div class="growth-meter" aria-label="Project completion progress">
      <span id="exploreProgressBar"></span>
    </div>
    <div class="project-progress-grid">
      <div class="progress-stat">
        <span>Dreams delivered</span>
        <strong id="dreamsDeliveredValue">0</strong>
      </div>
      <div class="progress-stat">
        <span>Blocks stacked</span>
        <strong id="blocksStackedValue">0</strong>
      </div>
      <div class="progress-stat">
        <span>Stories completed</span>
        <strong id="storiesCompletedValue">0</strong>
      </div>
      <div class="progress-stat">
        <span>Projects explored</span>
        <strong id="projectsExploredValue">0</strong>
      </div>
    </div>
    <div class="achievement-badges" id="achievementBadges"></div>
    <div class="cert-badge" id="dreamEngineerBadge" hidden>CERTIFIED DREAM ENGINEER</div>
  `;

  container.appendChild(panel);
  document.getElementById('resetProgressBtn')?.addEventListener('click', resetProgress);
}

function getSafeProgressState(rawProgress) {
  const safeProgress = { ...DEFAULT_PROGRESS };
  if (!rawProgress || typeof rawProgress !== 'object') return safeProgress;

  const projectIds = Object.keys(projectCatalog);
  const projects = Array.isArray(rawProgress.projects) ? rawProgress.projects : [];
  safeProgress.projects = [...new Set(projects.filter((project) => projectIds.includes(project)))].slice(0, 6);
  safeProgress.dreamsDelivered = Math.max(0, Number(rawProgress.dreamsDelivered) || 0);
  safeProgress.blocksStacked = Math.max(0, Number(rawProgress.blocksStacked) || 0);
  safeProgress.storiesCompleted = Math.max(0, Number(rawProgress.storiesCompleted) || 0);
  safeProgress.starsEarned = Math.max(0, Number(rawProgress.starsEarned) || 0);
  return safeProgress;
}

function saveProgress() {
  try {
    localStorage.setItem('pip-dream-progress', JSON.stringify(state.progress));
  } catch (error) {
    // Fail safely when storage is unavailable.
  }
}

function loadProgress() {
  try {
    const stored = localStorage.getItem('pip-dream-progress');
    state.progress = getSafeProgressState(stored ? JSON.parse(stored) : DEFAULT_PROGRESS);
  } catch (error) {
    state.progress = { ...DEFAULT_PROGRESS };
  }
}

function markProjectExplored(projectId) {
  if (!projectCatalog[projectId]) return;

  if (!state.progress.projects.includes(projectId)) {
    state.progress.projects.push(projectId);
  }

  saveProgress();
  applyProgressState();
}

function updateProjectCardStates() {
  document.querySelectorAll('.project-card[data-project]').forEach((card) => {
    const projectKey = card.dataset.project;
    const explored = state.progress.projects.includes(projectKey);
    const status = card.querySelector('.project-status') || document.createElement('span');

    card.classList.toggle('explored', explored);
    status.className = 'project-status';
    status.textContent = explored ? 'Explored' : 'Ready to explore';

    const body = card.querySelector('.project-body');
    if (body && !card.querySelector('.project-status')) {
      body.appendChild(status);
    }
  });
}

function updateGrowthChart() {
  ensureProgressPanel();

  const exploredCount = state.progress.projects.length;
  const progressPercent = (exploredCount / Object.keys(projectCatalog).length) * 100;
  const exploredText = document.getElementById('exploredCountText');
  const starsText = document.getElementById('starsEarnedText');
  const dreamsText = document.getElementById('dreamsDeliveredValue');
  const blocksText = document.getElementById('blocksStackedValue');
  const storiesText = document.getElementById('storiesCompletedValue');
  const projectsText = document.getElementById('projectsExploredValue');
  const progressFill = document.getElementById('exploreProgressBar');
  const achievementBadges = document.getElementById('achievementBadges');
  const engineerBadge = document.getElementById('dreamEngineerBadge');

  if (exploredText) exploredText.textContent = `${exploredCount}/6`;
  if (starsText) starsText.textContent = String(state.progress.starsEarned);
  if (dreamsText) dreamsText.textContent = String(state.progress.dreamsDelivered);
  if (blocksText) blocksText.textContent = String(state.progress.blocksStacked);
  if (storiesText) storiesText.textContent = String(state.progress.storiesCompleted);
  if (projectsText) projectsText.textContent = String(exploredCount);
  if (progressFill) progressFill.style.width = `${Math.min(progressPercent, 100)}%`;

  if (achievementBadges) {
    achievementBadges.innerHTML = '';
    Object.entries(projectCatalog).forEach(([projectKey, label]) => {
      const badge = document.createElement('span');
      badge.className = 'achievement-badge';
      badge.textContent = state.progress.projects.includes(projectKey) ? label : 'Locked';
      badge.classList.toggle('unlocked', state.progress.projects.includes(projectKey));
      achievementBadges.appendChild(badge);
    });
  }

  if (engineerBadge) {
    engineerBadge.hidden = exploredCount !== Object.keys(projectCatalog).length;
  }
}

function applyProgressState() {
  updateProjectCardStates();
  updateGrowthChart();
}

function resetProgress() {
  const confirmed = window.confirm('Reset your dream explorer progress?');
  if (!confirmed) return;

  state.progress = { ...DEFAULT_PROGRESS };
  state.easterEggClicks = 0;
  saveProgress();
  applyProgressState();
  updatePipDialogue('Pip says: “Fresh start! My dream notebook is ready for another sleepy adventure.”');
}

function setupEasterEgg() {
  const stars = document.querySelectorAll('.star');

  stars.forEach((star) => {
    star.setAttribute('role', 'button');
    star.setAttribute('tabindex', '0');
    star.setAttribute('aria-label', 'Secret star');
    star.addEventListener('click', () => {
      state.easterEggClicks += 1;
      const remaining = 5 - state.easterEggClicks;

      if (remaining > 0) {
        updatePipDialogue(`Pip says: “A tiny star wink! ${remaining} more and the secret is mine.”`);
        return;
      }

      state.easterEggClicks = 0;
      state.progress.starsEarned = (Number(state.progress.starsEarned) || 0) + 1;
      document.body.classList.add('secret-star-unlocked');
      setTimeout(() => document.body.classList.remove('secret-star-unlocked'), 1200);
      updatePipDialogue('Pip says: “You found my secret star! Shhh... it’s bedtime magic.”');
      saveProgress();
      updateGrowthChart();
    });

    star.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        star.click();
      }
    });
  });
}

function setGuestbookFeedback(message, isError = false) {
  guestbookFeedback.textContent = message;
  guestbookFeedback.classList.toggle('error', isError);
}

function setGuestbookFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}Error`);
  field.setAttribute('aria-invalid', String(Boolean(message)));
  error.textContent = message;
}

function validateGuestbookForm() {
  const nameField = document.getElementById('guestName');
  const dreamField = document.getElementById('guestDream');
  const messageField = document.getElementById('guestMessage');
  const name = nameField.value.trim();
  const dream = dreamField.value.trim();
  const message = messageField.value.trim();
  const errors = {
    name: !name ? 'Please add a nickname for your note.' : name.length > 40 ? 'Nicknames can be up to 40 characters.' : '',
    dream: dream.length > 80 ? 'Favorite dreams can be up to 80 characters.' : '',
    message: !message ? 'Please write a little friendly message.' : message.length > 300 ? 'Messages can be up to 300 characters.' : '',
  };

  setGuestbookFieldError('guestName', errors.name);
  setGuestbookFieldError('guestDream', errors.dream);
  setGuestbookFieldError('guestMessage', errors.message);
  return { valid: !errors.name && !errors.dream && !errors.message, name, dream, message };
}

function getSafeGuestbookEntries(value) {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set();
  return value.filter((entry) => entry && typeof entry === 'object'
      && typeof entry.id === 'string' && entry.id.length <= 100
      && typeof entry.name === 'string' && entry.name.trim().length > 0 && entry.name.length <= 40
      && typeof entry.dream === 'string' && entry.dream.length <= 80
      && typeof entry.message === 'string' && entry.message.trim().length > 0 && entry.message.length <= 300
      && typeof entry.createdAt === 'string' && Number.isFinite(Date.parse(entry.createdAt))
      && !seenIds.has(entry.id) && seenIds.add(entry.id))
    .map((entry) => ({
      id: entry.id,
      name: entry.name.trim(),
      dream: entry.dream.trim(),
      message: entry.message.trim(),
      createdAt: entry.createdAt,
    }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, GUESTBOOK_LIMIT);
}

function loadGuestbook() {
  try {
    const stored = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
    if (!stored) {
      state.guestbookEntries = [];
    } else {
      const parsedEntries = JSON.parse(stored);
      if (!Array.isArray(parsedEntries)) {
        state.guestbookEntries = [];
        setGuestbookFeedback('The keepsake drawer had a mixed-up note list. It has been opened as a fresh page.', true);
      } else {
        state.guestbookEntries = getSafeGuestbookEntries(parsedEntries);
        if (state.guestbookEntries.length !== parsedEntries.length) {
          setGuestbookFeedback('A few mixed-up keepsake notes were skipped so the rest of the wall could open safely.', true);
        }
      }
    }
  } catch (error) {
    state.guestbookEntries = [];
    setGuestbookFeedback('The keepsake drawer could not open. Notes will not be saved until browser storage is available.', true);
  }
  renderGuestbook();
}

function saveGuestbook(entries) {
  try {
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    setGuestbookFeedback('Browser storage could not save that note. Nothing was added; please try again.', true);
    return false;
  }
}

function createGuestbookText(tagName, className, value) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = value;
  return element;
}

function renderGuestbook() {
  guestbookEntries.replaceChildren();
  const emptyState = document.getElementById('guestbookEmpty');
  const count = document.getElementById('guestbookCount');
  const numberOfEntries = state.guestbookEntries.length;

  emptyState.hidden = numberOfEntries > 0;
  count.textContent = `${numberOfEntries} ${numberOfEntries === 1 ? 'note' : 'notes'}`;

  state.guestbookEntries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'keepsake-card';
    item.dataset.entryId = entry.id;

    const top = document.createElement('div');
    top.className = 'keepsake-card-top';
    const identity = document.createElement('div');
    identity.appendChild(createGuestbookText('strong', 'keepsake-name', entry.name));
    identity.appendChild(createGuestbookText('em', 'keepsake-dream', entry.dream || 'A cozy dream'));
    const date = document.createElement('time');
    date.dateTime = entry.createdAt;
    date.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(entry.createdAt));
    top.append(identity, date);

    const message = createGuestbookText('p', 'keepsake-message', entry.message);
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-keepsake';
    deleteButton.dataset.deleteEntry = entry.id;
    deleteButton.textContent = 'Remove note';
    deleteButton.setAttribute('aria-label', `Remove note from ${entry.name}`);

    item.append(top, message, deleteButton);
    guestbookEntries.appendChild(item);
  });

  document.getElementById('clearGuestbookBtn').disabled = numberOfEntries === 0;
  document.getElementById('signGuestbookBtn').disabled = numberOfEntries >= GUESTBOOK_LIMIT;
  document.querySelector('.guestbook-limit-note').textContent = numberOfEntries >= GUESTBOOK_LIMIT
    ? 'The keepsake wall is full. Remove a note before adding another.'
    : `Up to ${GUESTBOOK_LIMIT} keepsakes, stored only in this browser.`;
}

function makeGuestbookId() {
  let id;
  do {
    id = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  } while (state.guestbookEntries.some((entry) => entry.id === id));
  return id;
}

function handleGuestbookSubmit(event) {
  event.preventDefault();
  if (state.guestbookSubmitting) return;
  state.guestbookSubmitting = true;
  const submitButton = document.getElementById('signGuestbookBtn');
  submitButton.disabled = true;

  try {
    const formData = validateGuestbookForm();
    if (!formData.valid) {
      setGuestbookFeedback('A little note needs a nickname and a friendly message.', true);
      return;
    }
    if (state.guestbookEntries.length >= GUESTBOOK_LIMIT) {
      setGuestbookFeedback('The keepsake wall is full (50 notes). Remove one before adding another.', true);
      return;
    }

    const newEntry = {
      id: makeGuestbookId(),
      name: formData.name,
      dream: formData.dream,
      message: formData.message,
      createdAt: new Date().toISOString(),
    };
    const nextEntries = [newEntry, ...state.guestbookEntries].slice(0, GUESTBOOK_LIMIT);
    if (!saveGuestbook(nextEntries)) return;

    state.guestbookEntries = nextEntries;
    renderGuestbook();
    guestbookForm.reset();
    setGuestbookFieldError('guestName', '');
    setGuestbookFieldError('guestDream', '');
    setGuestbookFieldError('guestMessage', '');
    setGuestbookFeedback('Your note is pinned in the keepsake wall on this browser.');
  } finally {
    state.guestbookSubmitting = false;
    if (state.guestbookEntries.length < GUESTBOOK_LIMIT) submitButton.disabled = false;
  }
}

function removeGuestbookEntry(entryId) {
  const nextEntries = state.guestbookEntries.filter((entry) => entry.id !== entryId);
  if (nextEntries.length === state.guestbookEntries.length) return;
  if (!saveGuestbook(nextEntries)) return;
  state.guestbookEntries = nextEntries;
  renderGuestbook();
  setGuestbookFeedback('That note was removed from this browser.');
}

function clearGuestbookEntries() {
  if (!state.guestbookEntries.length) return;
  const confirmed = window.confirm('Clear all 50-or-fewer keepsake notes stored in this browser?');
  if (!confirmed) return;

  try {
    localStorage.removeItem(GUESTBOOK_STORAGE_KEY);
    state.guestbookEntries = [];
    renderGuestbook();
    setGuestbookFeedback('Your keepsake wall has a fresh blank page.');
  } catch (error) {
    setGuestbookFeedback('The browser could not clear the keepsake notes. Please try again.', true);
  }
}

function setupGuestbook() {
  guestbookForm?.addEventListener('submit', handleGuestbookSubmit);
  clearGuestbookBtn?.addEventListener('click', clearGuestbookEntries);
  guestbookEntries?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-entry]');
    if (button) removeGuestbookEntry(button.dataset.deleteEntry);
  });
  ['guestName', 'guestDream', 'guestMessage'].forEach((fieldId) => {
    document.getElementById(fieldId)?.addEventListener('input', () => setGuestbookFieldError(fieldId, ''));
  });
  loadGuestbook();
}

function randomizeMessage() {
  const random = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  randomMessage.textContent = random;
}

function revealSecret() {
  const secret = document.createElement('div');
  secret.textContent = 'SECRET: Pip hides all the best dreams in the clouds.';
  secret.style.position = 'fixed';
  secret.style.left = '50%';
  secret.style.top = '50%';
  secret.style.transform = 'translate(-50%, -50%)';
  secret.style.background = 'linear-gradient(135deg, var(--yellow), var(--pink))';
  secret.style.border = '3px solid var(--plum)';
  secret.style.borderRadius = '18px';
  secret.style.padding = '1rem 1.25rem';
  secret.style.zIndex = '300';
  secret.style.fontWeight = '900';
  secret.style.color = '#2b1d2f';
  secret.style.boxShadow = '0 16px 0 rgba(87,39,71,0.12)';
  document.body.appendChild(secret);

  setTimeout(() => secret.remove(), 2200);
}

function setupFooter() {
  secretBtn?.addEventListener('click', revealSecret);
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() }));
  visitorCounterBtn?.addEventListener('click', () => {
    const nextCount = Number(visitCount.textContent) + 1;
    visitCount.textContent = String(nextCount);
    localStorage.setItem('pip-visits', String(nextCount));
    randomizeMessage();
  });

  const storedVisits = Number(localStorage.getItem('pip-visits') || 0);
  visitCount.textContent = String(storedVisits);
  visitorCounterBtn.setAttribute('aria-label', `Visitor interaction count: ${storedVisits}`);
  randomizeMessage();
  setInterval(randomizeMessage, 12000);
}

function createBubbleBursts() {
  const area = document.querySelector('.hero-art');
  if (!area) return;

  for (let i = 0; i < 8; i += 1) {
    const bubble = document.createElement('span');
    bubble.className = 'bubble-pop';
    bubble.style.left = `${Math.random() * 80 + 10}%`;
    bubble.style.top = `${Math.random() * 70 + 18}%`;
    bubble.style.animationDelay = `${Math.random() * 0.4}s`;
    area.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1600);
  }
}

function releaseBubbles() {
  createBubbleBursts();
}

function showSillyMessage() {
  const sillyMessages = [
    'Pip has declared the moon to be absolutely tiny and unfairly dramatic.',
    'The dream machine sneezed in a very stylish way.',
    'Jellybeans are now part of the emergency plan.',
    'Everything is 31% more sparkly than before.'
  ];
  const message = sillyMessages[Math.floor(Math.random() * sillyMessages.length)];
  const output = document.getElementById('magicFactoryOutput');
  if (output) output.textContent = message;
}

function applyMagicButtonActions() {
  document.querySelectorAll('.magic-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('star-burst')) {
        document.body.classList.add('magic-burst');
        setTimeout(() => document.body.classList.remove('magic-burst'), 500);
        createBubbleBursts();
      }

      if (button.classList.contains('theme-shift')) {
        document.body.classList.toggle('theme-shifted');
      }

      if (button.classList.contains('dance-pip')) {
        document.body.classList.add('pip-dancing');
        setTimeout(() => document.body.classList.remove('pip-dancing'), 1500);
      }

      if (button.classList.contains('silly-message')) {
        showSillyMessage();
      }

      if (button.classList.contains('bubble-burst')) {
        releaseBubbles();
      }

      if (button.classList.contains('surprise')) {
        document.body.classList.add('surprise-mode');
        setTimeout(() => document.body.classList.remove('surprise-mode'), 1200);
      }

      const factoryOutput = document.getElementById('magicFactoryOutput');
      if (factoryOutput && !button.classList.contains('silly-message')) {
        factoryOutput.textContent = `${button.textContent.trim()} magic activated. Try another tiny switch!`;
      }
      updateWorkshopMood(`Pip says: “${button.textContent.trim()} magic! That was delightfully wobbly.”`, 1);
    });
  });

  document.getElementById('resetMagicBtn')?.addEventListener('click', () => {
    document.body.classList.remove('theme-shifted', 'pip-dancing', 'surprise-mode');
    document.getElementById('magicFactoryOutput').textContent = 'The factory has been reset. No one is dizzy anymore.';
    updateWorkshopMood('Pip says: “Factory reset! My eyebrows are back where they belong.”');
  });
}

function startStarGame() {
  if (state.starGame.active) return;

  state.starGame.active = true;
  state.starGame.score = 0;
  state.starGame.timeLeft = 15;
  document.getElementById('starScore').textContent = '0';
  document.getElementById('starTimer').textContent = '15';

  const area = document.getElementById('starGameArea');
  const status = document.getElementById('starGameStatus');
  const startButton = document.getElementById('replayStarGameBtn');
  area.innerHTML = '';
  status.textContent = 'Go go go! Catch those twinkles!';
  startButton.textContent = 'GAME IN PROGRESS';
  startButton.disabled = true;

  function spawnStar() {
    if (!state.starGame.active) return;
    if (area.querySelectorAll('.star-item').length >= 3) return;
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star-item';
    star.textContent = '✦';
    star.setAttribute('aria-label', 'Catch the star');
    const x = Math.random() * Math.max(0, area.clientWidth - 48);
    const y = Math.random() * Math.max(0, area.clientHeight - 48);
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.addEventListener('click', () => {
      state.starGame.score += 1;
      document.getElementById('starScore').textContent = String(state.starGame.score);
      state.progress.starsEarned = (Number(state.progress.starsEarned) || 0) + 1;
      saveProgress();
      updateGrowthChart();
      if (state.starGame.score === 1) {
        updateWorkshopMood('Pip says: “You caught one! That star was trying to nap.”', 2);
      }
      star.remove();
      spawnStar();
    });
    area.appendChild(star);
  }

  spawnStar();
  state.starGame.starInterval = setInterval(spawnStar, 820);

  state.starGame.timerId = setInterval(() => {
    state.starGame.timeLeft -= 1;
    document.getElementById('starTimer').textContent = String(state.starGame.timeLeft);

    if (state.starGame.timeLeft <= 0) {
      clearInterval(state.starGame.timerId);
      clearInterval(state.starGame.starInterval);
      state.starGame.active = false;
      state.starGame.timerId = null;
      state.starGame.starInterval = null;
      const final = document.createElement('div');
      final.textContent = `Time's up! Final score: ${state.starGame.score}`;
      final.style.position = 'absolute';
      final.style.inset = '0';
      final.style.display = 'grid';
      final.style.placeItems = 'center';
      final.style.fontWeight = '900';
      final.style.color = '#2b1d2f';
      final.style.background = 'rgba(255,255,255,0.6)';
      area.appendChild(final);
      status.textContent = `Time's up! You caught ${state.starGame.score} ${state.starGame.score === 1 ? 'star' : 'stars'}.`;
      startButton.textContent = 'PLAY AGAIN';
      startButton.disabled = false;
      updateWorkshopMood(state.starGame.score ? 'Pip says: “Star catcher extraordinaire! Those twinkles are safe now.”' : 'Pip says: “No stars this round, but even the moon misses sometimes.”');
    }
  }, 1000);
}

function setupStarGame() {
  document.getElementById('replayStarGameBtn')?.addEventListener('click', startStarGame);
}

function buildDream() {
  const imagination = Number(document.getElementById('imaginationRange').value);
  const sleepiness = Number(document.getElementById('sleepinessRange').value);
  const sparkle = Number(document.getElementById('sparkleRange').value);

  let type;
  if (imagination > 66 && sparkle > 66) {
    type = 'A dazzling comet-nap with confetti clouds';
  } else if (sleepiness > 66 && imagination < 34) {
    type = 'A sleepy marshmallow moon drift';
  } else if (sparkle < 34 && sleepiness < 34) {
    type = 'A tidy little pocket of dreaming stillness';
  } else if (imagination > 50 && sleepiness > 50) {
    type = 'A rainbow-whisper dream factory';
  } else {
    type = 'A cozy cloud pillow with tiny giggle rockets';
  }

  document.getElementById('dreamMachineOutput').textContent = type;
  updateWorkshopMood('Pip says: “The dream machine is purring. That one looks extra cozy!”', 2);
}

function setupDreamMachine() {
  document.getElementById('buildDreamBtn')?.addEventListener('click', buildDream);
  [
    document.getElementById('imaginationRange'),
    document.getElementById('sleepinessRange'),
    document.getElementById('sparkleRange')
  ].forEach((input) => {
    input?.addEventListener('input', () => {
      const output = document.getElementById('dreamMachineOutput');
      output.textContent = `Dials set: ${document.getElementById('imaginationRange').value}% imagination, ${document.getElementById('sleepinessRange').value}% sleepiness, ${document.getElementById('sparkleRange').value}% sparkle. Press “Build my dream” when ready.`;
    });
  });
}

function buildLullabyPanel() {
  const panel = document.createElement('div');
  panel.className = 'mini-project-panel';
  panel.innerHTML = `
    <div class="lullaby-box" aria-live="polite">
      <div class="lullaby-visualizer" aria-hidden="true">
        <span style="--h: 30%"></span>
        <span style="--h: 60%"></span>
        <span style="--h: 80%"></span>
        <span style="--h: 55%"></span>
        <span style="--h: 40%"></span>
      </div>
      <div class="lullaby-controls">
        <button class="mini-control play-toggle" type="button">Play</button>
        <button class="mini-control stop-toggle" type="button">Stop</button>
      </div>
      <div class="mood-pills" role="group" aria-label="Lullaby moods">
        <button class="mood-chip selected" type="button" data-lullaby-mood="Sleepy Moon">Sleepy Moon</button>
        <button class="mood-chip" type="button" data-lullaby-mood="Cloud Waltz">Cloud Waltz</button>
        <button class="mood-chip" type="button" data-lullaby-mood="Starry Night">Starry Night</button>
      </div>
      <p class="panel-status">Now playing: Sleepy Moon</p>
    </div>
  `;

  const playToggle = panel.querySelector('.play-toggle');
  const stopToggle = panel.querySelector('.stop-toggle');
  const moodButtons = panel.querySelectorAll('.mood-chip');
  const visualizer = panel.querySelector('.lullaby-visualizer');
  const statusText = panel.querySelector('.panel-status');

  const noteSets = {
    'Sleepy Moon': [261.63, 329.63, 392.0, 329.63],
    'Cloud Waltz': [293.66, 349.23, 440.0, 349.23],
    'Starry Night': [392.0, 493.88, 523.25, 493.88],
  };

  const ensureAudio = () => {
    if (!state.lullaby.context) {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return null;
      state.lullaby.context = new AudioContextCtor();
      state.lullaby.gain = state.lullaby.context.createGain();
      state.lullaby.gain.gain.value = 0.07;
      state.lullaby.gain.connect(state.lullaby.context.destination);
    }
    return state.lullaby.context;
  };

  const playTone = (frequency, duration = 0.25) => {
    const context = ensureAudio();
    if (!context) {
      statusText.textContent = 'Audio is unavailable in this browser, but the lullaby mood still changes.';
      return;
    }
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    osc.connect(gain);
    gain.connect(state.lullaby.gain);
    osc.start();
    osc.stop(context.currentTime + duration);
  };

  const playSequence = () => {
    const context = ensureAudio();
    if (!context) return;

    if (context.state === 'suspended') {
      context.resume();
    }

    if (state.lullaby.timer) clearInterval(state.lullaby.timer);

    let step = 0;
    const notes = noteSets[state.lullaby.mood] || noteSets['Sleepy Moon'];
    state.lullaby.timer = setInterval(() => {
      playTone(notes[step % notes.length], 0.28);
      step += 1;
      visualizer.style.setProperty('--pulse', `${((step % 3) + 1) * 16}%`);
      visualizer.classList.add('playing');
      setTimeout(() => visualizer.classList.remove('playing'), 220);
    }, 420);
    state.lullaby.playing = true;
    playToggle.textContent = 'Pause';
    statusText.textContent = `Now playing: ${state.lullaby.mood}`;
  };

  const stopSequence = () => {
    if (state.lullaby.timer) clearInterval(state.lullaby.timer);
    state.lullaby.timer = null;
    state.lullaby.playing = false;
    visualizer.classList.remove('playing');
    playToggle.textContent = 'Play';
    statusText.textContent = `Stopped: ${state.lullaby.mood}`;
  };

  playToggle.addEventListener('click', () => {
    if (state.lullaby.playing) {
      stopSequence();
      return;
    }
    playSequence();
  });

  stopToggle.addEventListener('click', () => {
    stopSequence();
  });

  moodButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.lullaby.mood = button.dataset.lullabyMood;
      statusText.textContent = `Mood selected: ${state.lullaby.mood}`;
      moodButtons.forEach((chip) => chip.classList.toggle('selected', chip === button));
      if (state.lullaby.playing) {
        playSequence();
      }
    });
  });

  return panel;
}

function buildNightlightPanel() {
  const panel = document.createElement('div');
  panel.className = 'mini-project-panel';
  panel.innerHTML = `
    <div class="nightlight-scene" aria-live="polite">
      <div class="nightlight-room room-night">
        <div class="lamp-body lamp-moon">
          <div class="lamp-core"></div>
        </div>
      </div>
      <div class="light-controls">
        <div class="toggle-row">
          <button class="mini-control light-toggle" type="button">On</button>
          <button class="mini-control scene-toggle" type="button">Cycle room</button>
        </div>
        <label class="range-row">
          <span>Brightness</span>
          <input class="brightness-control" type="range" min="15" max="100" value="72" aria-label="Nightlight brightness" />
        </label>
        <div class="swatches" role="group" aria-label="Nightlight colors">
          <button type="button" class="swatch active" data-color="#79E6FF" style="--swatch:#79E6FF"></button>
          <button type="button" class="swatch" data-color="#FFB6D5" style="--swatch:#FFB6D5"></button>
          <button type="button" class="swatch" data-color="#8AFFC1" style="--swatch:#8AFFC1"></button>
          <button type="button" class="swatch" data-color="#FFE66D" style="--swatch:#FFE66D"></button>
        </div>
      </div>
    </div>
  `;

  const room = panel.querySelector('.nightlight-room');
  const body = panel.querySelector('.lamp-body');
  const toggleButton = panel.querySelector('.light-toggle');
  const sceneButton = panel.querySelector('.scene-toggle');
  const brightness = panel.querySelector('.brightness-control');
  const swatches = panel.querySelectorAll('.swatch');

  const sceneModes = ['day', 'dusk', 'night'];
  const updateNightlight = () => {
    const isOn = state.nightlight.on;
    const lightValue = Math.max(15, Number(state.nightlight.brightness) || 72);
    const glow = state.nightlight.on ? `${state.nightlight.color}cc` : 'rgba(255,255,255,0.2)';
    room.style.setProperty('--room-color', state.nightlight.scene === 'day' ? '#dff9ff' : state.nightlight.scene === 'dusk' ? '#f8d4ac' : '#1b2041');
    room.style.setProperty('--room-glow', state.nightlight.scene === 'day' ? '#fff2be' : state.nightlight.scene === 'dusk' ? '#f7b36d' : '#102056');
    body.style.setProperty('--lamp-color', state.nightlight.color);
    body.style.setProperty('--lamp-glow', glow);
    body.style.setProperty('--lamp-brightness', `${lightValue}%`);
    body.style.setProperty('--lamp-opacity', isOn ? '1' : '0.3');
    body.classList.toggle('off', !isOn);
    room.classList.remove('room-day', 'room-dusk', 'room-night');
    room.classList.add(`room-${state.nightlight.scene}`);
    toggleButton.textContent = isOn ? 'On' : 'Off';
  };

  toggleButton.addEventListener('click', () => {
    state.nightlight.on = !state.nightlight.on;
    updateNightlight();
  });

  sceneButton.addEventListener('click', () => {
    const currentIndex = sceneModes.indexOf(state.nightlight.scene);
    state.nightlight.scene = sceneModes[(currentIndex + 1) % sceneModes.length];
    updateNightlight();
  });

  brightness.addEventListener('input', (event) => {
    state.nightlight.brightness = Number(event.target.value);
    updateNightlight();
  });

  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      state.nightlight.color = swatch.dataset.color;
      swatches.forEach((chip) => chip.classList.toggle('active', chip === swatch));
      updateNightlight();
    });
  });

  updateNightlight();
  return panel;
}

function buildDeliveryPanel() {
  const panel = document.createElement('div');
  panel.className = 'mini-project-panel';
  panel.innerHTML = `
    <div class="delivery-map" aria-live="polite">
      <div class="delivery-route"></div>
      <button type="button" class="delivery-stop active" data-destination="0" aria-label="Moonberry Rooftop">A</button>
      <button type="button" class="delivery-stop" data-destination="1" aria-label="Pillow Hill">B</button>
      <button type="button" class="delivery-stop" data-destination="2" aria-label="Cotton Cloud Market">C</button>
      <div class="delivery-pip" aria-hidden="true">P</div>
      <div class="delivery-message">Dream delivery to Moonberry Rooftop: "The rooftop is glowing with sleepy lanterns."</div>
    </div>
  `;

  const stops = panel.querySelectorAll('.delivery-stop');
  const pip = panel.querySelector('.delivery-pip');
  const message = panel.querySelector('.delivery-message');
  const destinations = state.delivery.route;

  const updateRoute = (index) => {
    state.delivery.current = index;
    const positionMap = [
      { left: '18%', top: '25%' },
      { left: '50%', top: '60%' },
      { left: '76%', top: '32%' },
    ];
    const destination = destinations[index];
    stops.forEach((stop, stopIndex) => {
      stop.classList.toggle('active', stopIndex === index);
    });
    pip.style.left = positionMap[index].left;
    pip.style.top = positionMap[index].top;
    message.textContent = `Dream delivery to ${destination}: "${[
      'The rooftop is glowing with sleepy lanterns.',
      'Pillow Hill is humming a cozy lullaby.',
      'Cotton Cloud Market is sparkling with tiny wishes.',
    ][index]}"`;
  };

  stops.forEach((stop) => {
    stop.addEventListener('click', () => updateRoute(Number(stop.dataset.destination)));
  });

  updateRoute(state.delivery.current);
  return panel;
}

function buildBlocksPanel() {
  const panel = document.createElement('div');
  panel.className = 'mini-project-panel';
  panel.innerHTML = `
    <div class="block-playground" aria-live="polite">
      <div class="block-stack" aria-label="Tower build area"></div>
      <div class="block-controls">
        <button type="button" class="mini-control add-block" data-color="pink">Add block</button>
        <button type="button" class="mini-control reset-blocks">Reset</button>
      </div>
      <p class="block-counter">Blocks: <span>0</span></p>
    </div>
  `;

  const stack = panel.querySelector('.block-stack');
  const counter = panel.querySelector('.block-counter span');
  const addButton = panel.querySelector('.add-block');
  const resetButton = panel.querySelector('.reset-blocks');

  const colors = ['pink', 'yellow', 'blue', 'mint'];
  const addBlock = () => {
    const color = colors[state.blocks.stack.length % colors.length];
    const block = document.createElement('div');
    block.className = `stack-block ${color}`;
    block.setAttribute('role', 'button');
    block.setAttribute('tabindex', '0');
    block.textContent = '◼';
    stack.appendChild(block);
    state.blocks.stack.push(color);
    counter.textContent = String(state.blocks.stack.length);
    state.progress.blocksStacked = (Number(state.progress.blocksStacked) || 0) + 1;
    saveProgress();
    updateGrowthChart();

    if (state.blocks.stack.length >= 6) {
      state.blocks.completed = true;
      stack.classList.add('celebrate');
      setTimeout(() => stack.classList.remove('celebrate'), 900);
      updatePipDialogue('Pip says: “Look at your wobbly tower! It is perfect!”');
      markProjectExplored('blocks');
    }
  };

  addButton.addEventListener('click', addBlock);
  resetButton.addEventListener('click', () => {
    state.blocks.stack = [];
    stack.innerHTML = '';
    counter.textContent = '0';
  });

  return panel;
}

function buildStorybookPanel() {
  const panel = document.createElement('div');
  panel.className = 'mini-project-panel';
  panel.innerHTML = `
    <div class="storybook-scene" aria-live="polite">
      <div class="story-scene-emoji" aria-hidden="true">☁️</div>
      <h5 class="story-scene-title">The Lonely Cloud</h5>
      <p class="story-scene-copy">Pip floats by a small cloud that has no bedtime story of its own.</p>
      <div class="story-choices">
        <button type="button" class="story-choice" data-choice="blanket">Offer a warm moon blanket</button>
        <button type="button" class="story-choice" data-choice="star">Send a twinkly star friend</button>
      </div>
      <div class="story-results"></div>
    </div>
  `;

  const sceneTitle = panel.querySelector('.story-scene-title');
  const sceneCopy = panel.querySelector('.story-scene-copy');
  const results = panel.querySelector('.story-results');
  const choiceButtons = panel.querySelectorAll('.story-choice');

  const scenes = {
    blanket: {
      title: 'The Moon Blanket',
      text: 'The cloud curls under a warm moon blanket and drifts into the gentlest sleep with a tiny giggle.',
      outcome: 'Ending: The cloud wakes up smiling, carrying a dream of lullabies and warm cuddles.',
    },
    star: {
      title: 'The Starlit Friend',
      text: 'A tiny star lands beside the cloud and whispers a secret about the night sky.',
      outcome: 'Ending: The cloud learns it is not lonely at all; it is part of a bright, glittery family.',
    },
  };

  choiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const result = scenes[button.dataset.choice];
      sceneTitle.textContent = result.title;
      sceneCopy.textContent = result.text;
      results.textContent = result.outcome;
      state.progress.storiesCompleted = (Number(state.progress.storiesCompleted) || 0) + 1;
      markProjectExplored('storybook');
      saveProgress();
      updateGrowthChart();
    });
  });

  return panel;
}

function openProjectExperience(projectKey) {
  const card = document.querySelector(`.project-card[data-project="${projectKey}"]`);
  if (!card) return;

  const existingPanel = card.querySelector('.mini-project-panel');
  if (existingPanel) {
    card.classList.toggle('panel-open');
    existingPanel.remove();
    return;
  }

  let panel;
  switch (projectKey) {
    case 'lullaby':
      panel = buildLullabyPanel();
      break;
    case 'nightlight':
      panel = buildNightlightPanel();
      break;
    case 'delivery':
      panel = buildDeliveryPanel();
      break;
    case 'blocks':
      panel = buildBlocksPanel();
      break;
    case 'storybook':
      panel = buildStorybookPanel();
      break;
    case 'growth':
      panel = document.createElement('div');
      panel.className = 'mini-project-panel';
      panel.innerHTML = `
        <div class="growth-mini-panel">
          <p>Dreams delivered: <strong>${state.progress.dreamsDelivered}</strong></p>
          <p>Blocks stacked: <strong>${state.progress.blocksStacked}</strong></p>
          <p>Stories completed: <strong>${state.progress.storiesCompleted}</strong></p>
          <p>Projects explored: <strong>${state.progress.projects.length}/6</strong></p>
        </div>
      `;
      break;
    default:
      return;
  }

  const projectBody = card.querySelector('.project-body');
  projectBody.appendChild(panel);
  card.classList.add('panel-open');
}

function setupProjectInteractions() {
  const demoMapping = {
    lullaby: () => {
      randomMessage.textContent = 'Lullaby mood: Sleepy Moon, gently dramatic and very cozy.';
      updateWorkshopMood('Pip says: “The lullaby box is humming a moonbeam melody.”', 1);
    },
    nightlight: () => {
      const colors = ['#79E6FF', '#FFB6D5', '#8AFFC1', '#FFE66D'];
      document.body.style.setProperty('--sky', colors[Math.floor(Math.random() * colors.length)]);
      updateWorkshopMood('Pip says: “A tiny nightlight glow! The monsters are politely leaving.”', 1);
    },
    delivery: () => {
      const target = state.delivery.route[state.delivery.current] || 'Moonberry Rooftop';
      updateWorkshopMood(`Pip says: “Dream delivery routed to ${target}. Tiny stars are already there!”`, 1);
    },
    blocks: () => {
      updateWorkshopMood('Pip says: “The blocks are practicing their wobbly castle shapes.”', 1);
    },
    storybook: () => {
      updateWorkshopMood('Pip says: “Story time! A lonely little cloud is waiting for a dream.”', 1);
    },
    growth: () => {
      randomMessage.textContent = `Achievement unlocked: ${state.progress.projects.length > 0 ? 'Dream Explorer' : 'Tiny Dreamer'}.`;
      updateWorkshopMood('Pip says: “Your dream engineering stats are looking extra adorable.”');
    },
  };

  document.querySelectorAll('.demo-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.demo;
      demoMapping[key]?.();
      openProjectExperience(key);
      markProjectExplored(key);
    });
  });
}

function init() {
  loadProgress();
  setupNav();
  setupWakeButtons();
  setupRotatingDialogue();
  setupPersonalityScanner();
  setupProfileDialogue();
  setupStatsAnimation();
  setupDreamGenerator();
  setupStory();
  setupGuestbook();
  setupFooter();
  applyMagicButtonActions();
  setupStarGame();
  setupDreamMachine();
  setupProjectInteractions();
  setupEasterEgg();
  applyProgressState();
  updateNavState();
  setSleepiness(87, 'SLEEPY');
  wakeButton.setAttribute('aria-pressed', 'false');

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.body.classList.remove('surprise-mode', 'theme-shifted', 'pip-dancing');
      navLinksContainer.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Open menu');
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
