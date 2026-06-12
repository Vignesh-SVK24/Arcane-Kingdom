// main.js - Core Web Experience Logic for Arcane Kingdom Academy
// Implements unified RPG game state, destiny selection, quests, spell crafting, AI chat, Scribe CMS, and map discovery.

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Selectors ---
  const gateOverlay = document.getElementById('gate-overlay');
  const enterBtn = document.getElementById('enter-btn');
  const gateHud = document.getElementById('gate-hud');
  
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksUl = document.getElementById('nav-links');
  
  const audioToggle = document.getElementById('audio-toggle');
  const audioVisualizer = document.getElementById('audio-visualizer');
  const speakerIcon = document.getElementById('speaker-icon');
  
  const particleCanvas = document.getElementById('particle-canvas');
  const btnEnterAcademy = document.getElementById('btn-enter-academy');
  const btnExploreMap = document.getElementById('btn-explore-map');
  const scrollArrow = document.getElementById('scroll-arrow');
  const heroSection = document.getElementById('hero');
  const heroBgWrapper = document.querySelector('.hero-bg-wrapper');

  // --- Map HUD Selectors ---
  const mapHud = document.getElementById('map-hud');
  const hudTitle = document.getElementById('hud-title');
  const hudDesc = document.getElementById('hud-desc');
  const hudCoords = document.getElementById('hud-coords');
  const hudClose = document.getElementById('hud-close');
  const mapMarkers = document.querySelectorAll('.map-marker');

  // --- Marketplace Selectors ---
  const walletBalanceSpan = document.getElementById('wallet-balance');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const marketGrid = document.getElementById('market-grid');
  const marketCards = document.querySelectorAll('.market-item-card');
  const brandHome = document.getElementById('brand-home');

  // --- Library Modal Selectors ---
  const libraryReaderModal = document.getElementById('library-reader-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBookTitle = document.getElementById('book-modal-title');
  const modalBookText1 = document.getElementById('book-modal-text-1');
  const modalBookText2 = document.getElementById('book-modal-text-2');
  const pageNumLeft = document.getElementById('page-num-left');
  const pageNumRight = document.getElementById('page-num-right');
  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');

  // --- Destiny Choice Selectors ---
  const destinyOverlay = document.getElementById('destiny-overlay');
  const destinyNameInput = document.getElementById('destiny-name');
  const houseOptions = document.querySelectorAll('.house-option');
  const classOptions = document.querySelectorAll('.class-option');
  const confirmDestinyBtn = document.getElementById('confirm-destiny-btn');

  // --- Profile HUD Selectors ---
  const profileHud = document.getElementById('profile-hud');
  const hudUsername = document.getElementById('hud-username');
  const hudHouseBadge = document.getElementById('hud-house-badge');
  const hudLevel = document.getElementById('hud-level');
  const hudXpFill = document.getElementById('hud-xp-fill');
  const hudRank = document.getElementById('hud-rank');
  const inventoryToggle = document.getElementById('inventory-toggle');

  // --- Spell Forge Selectors ---
  const spellNameInput = document.getElementById('spell-name-input');
  const spellElementSelect = document.getElementById('spell-element-select');
  const spellPowerInput = document.getElementById('spell-power-input');
  const spellPowerVal = document.getElementById('spell-power-val');
  const spellDescInput = document.getElementById('spell-desc-input');
  const forgeSpellBtn = document.getElementById('forge-spell-btn');
  const spellsShelfGrid = document.getElementById('spells-shelf-grid');
  const emptyCodexText = document.getElementById('empty-codex-text');

  // --- Aetherion AI Chat Selectors ---
  const chatMessages = document.getElementById('chat-messages');
  const chatUserInput = document.getElementById('chat-user-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const apiKeyConfigBtn = document.getElementById('api-key-config-btn');
  const chatChips = document.querySelectorAll('.chat-chip-btn');
  const apiConfigModal = document.getElementById('api-config-modal');
  const apiModalClose = document.getElementById('api-modal-close');
  const geminiKeyInput = document.getElementById('gemini-key-input');
  const saveApiKeyBtn = document.getElementById('save-api-key-btn');

  // --- Scribe CMS Selectors ---
  const bookTitleInput = document.getElementById('book-title-input');
  const bookCategorySelect = document.getElementById('book-category-select');
  const bookAuthorInput = document.getElementById('book-author-input');
  const bookSummaryInput = document.getElementById('book-summary-input');
  const bookPage1Input = document.getElementById('book-page1-input');
  const bookPage2Input = document.getElementById('book-page2-input');
  const scribeSubmitBtn = document.getElementById('scribe-submit-btn');
  const bookmarksShelfList = document.getElementById('bookmarks-shelf-list');

  // --- Inventory Drawer Selectors ---
  const inventoryModal = document.getElementById('inventory-modal');
  const inventoryModalClose = document.getElementById('inventory-modal-close');
  const invClass = document.getElementById('inv-class');
  const invHouse = document.getElementById('inv-house');
  const invGold = document.getElementById('inv-gold');

  // --- State Variables ---
  const defaultState = {
    profile: {
      name: "Mage Apprentice",
      house: "Ignis",
      class: "Mage",
      level: 1,
      xp: 0,
      rank: "Novice Mage",
      gold: 250
    },
    inventory: [],
    unlockedCharacters: ["Archmage Ignis", "Commander Aurelia", "Sage Sylvan", "Valerius & Ignis"],
    createdSpells: [],
    completedQuests: [],
    discoveredLocations: [],
    bookmarkedBooks: [],
    readBooks: [],
    scribedBooks: [],
    geminiApiKey: ""
  };

  let gameState = null;
  let currentOpenBook = null;
  let currentBookPage = 0;
  let spellAnimators = [];

  // Library lore databases
  const bookDatabase = {
    'book-1': {
      title: "The Chronomancy Codex",
      pages: [
        [
          "Temporal anomalies represent fractures in the standard dimensional coordinates of the Arcane Kingdom. To weave a localized stasis loop, a spellcaster must align their focus to the atomic vibration of ether. Drawing a double-ring boundary with standard gold powder forms the basis of duration preservation.",
          "Once set, the target area experiences slow decelleration. Warning: Decelerating local frames by a factor greater than 0.05 units risks splitting the thread. If split, the caster may become anchored in a repeat-state forever. Always carry a resonance crystal to fracture the loop."
        ],
        [
          "Chronomancy remains the most guarded art of the Royal Citadel. Archmage Ignis himself established the chronological seals around the castle library to prevent unauthorized temporal editing. Some claim the castle itself resides five seconds in the future, rendering it immune to surprise cannon fire.",
          "For advanced casting, the Aetherius Archstaff is highly recommended. By channeling aetheric energy through its stellar core, a mage can double the radius of their temporal barrier without consuming double the mana. Keep the staff well-polished."
        ]
      ]
    },
    'book-2': {
      title: "Chronicles of Elder Wars",
      pages: [
        [
          "In the year of the Fallen Moon (342 E.C.), the skies of the kingdom burned black. The Shadow Void Lords, creeping through fractures in the Dragon Mountains, laid siege to the royal stone walls. Paladins under Commander Aurelia's ancestors fought heroically in the dark forests.",
          "It was the invention of the star-infused blades that turned the tide. By binding shooting star particles to alchemical iron, the blacksmiths forged weapons of radiant light. Each swing broke the void shield of the darkness beasts, causing them to dissolve into ash."
        ],
        [
          "The final battle took place near the Mystic Lake. Grand Wizard Ignis, then a young apprentice, combined his power with the Forest Mage sages. Together, they summoned an ocean whirlpool that sucked the Shadow Rift beneath the lakebed, sealing it with cyan runes.",
          "Today, the lake pulses with glowing light during the solstice. Visitors are advised not to swim after midnight, as the rift rifts still whisper forgotten incantations to those who listen too closely. Aurelia's Star Sabre remains in the Citadel vaults as a relic."
        ]
      ]
    },
    'book-3': {
      title: "Granger's Elixirs Guide",
      pages: [
        [
          "Alchemical brewing is the science of stabilizing natural mana. Basic reagents like Fluorescent Moss can be harvested easily from caves. When crushed and boiled in spring water, the moss yields a dim light, serving as the core base for standard night-sight potions.",
          "To brew a high-grade Mana Buffer, one must introduce crushed cyan crystals during the exothermic stage. The liquid will boil rapidly, emitting a sweet lavender fragrance. Ensure the heat is kept steady using copper flasks to prevent volatile expansion."
        ],
        [
          "For stamina speed tonics, Dryad roots and phoenix embers are ground into a fine paste. The mixture is highly volatile; one drop of sweat could trigger a combustion reaction. Keep the workspace cool. The resulting potion should be glowing green, thick, and highly carbonated.",
          "Drinkers will experience a sudden surge of physical agility lasting three hours. Side effects include temporary green hair tinting and minor visual sparkles. Sage Sylvan advises taking no more than one flask per day to avoid overloading the biological mana veins."
        ]
      ]
    }
  };

  // Region databases for Map
  const regionDatabase = {
    'marker-castle': {
      title: "Royal Castle",
      coords: "LAT 45.3 / LON 12.8",
      desc: "The seat of the Arcane Crown, constructed from obsidian granite and enchanted white marble. Its towers are protected by floating bridges and rotating gold magic barriers. Currently guarded by Commander Aurelia."
    },
    'marker-forest': {
      title: "Enchanted Forest",
      coords: "LAT 12.1 / LON 85.4",
      desc: "A massive, glowing woodland that pulses with nature energies. Ancient dryad trees grow here, their roots speaking in forgotten tongues. Home to Sage Sylvan and mythical forest sprites."
    },
    'marker-mountains': {
      title: "Dragon Mountains",
      coords: "LAT 89.4 / LON 145.2",
      desc: "A sky-scraping mountain range of volcanic rock and purple crystals. Terrifying fire-drake nests line the deep cliffs. Only experienced Dragon Rider Valerius can navigate these peaks safely."
    },
    'marker-caves': {
      title: "Hidden Caves",
      coords: "LAT 10.5 / LON 30.1",
      desc: "Dark underground tunnels containing rich veins of glowing crystals and alchemical moss. Whispered to house a slumbering elder golem that guards ancient royal treasure chests."
    },
    'marker-wizard-academy': {
      title: "Wizard Academy",
      coords: "LAT 32.7 / LON 68.9",
      desc: "A collection of floating towers drifting over the valley. Here, apprentices study codexes in the library, brew volatile elixirs, and master elemental sweeps under the eyes of the Grand Archmage."
    },
    'marker-lake': {
      title: "Mystic Lake",
      coords: "LAT 75.1 / LON 112.5",
      desc: "A bottomless cyan lake holding the sealed remnants of the Elder Void War. Its glowing waters provide pure mana energy to the academy, but dark whispers float from its depths during lunar eclipses."
    }
  };

  // --- Game State Management ---
  function loadState() {
    const data = localStorage.getItem('arcane_kingdom_state');
    if (data) {
      try {
        gameState = JSON.parse(data);
        // Ensure properties exist
        if (!gameState.inventory) gameState.inventory = [];
        if (!gameState.unlockedCharacters) gameState.unlockedCharacters = ["Archmage Ignis", "Commander Aurelia", "Sage Sylvan", "Valerius & Ignis"];
        if (!gameState.createdSpells) gameState.createdSpells = [];
        if (!gameState.completedQuests) gameState.completedQuests = [];
        if (!gameState.discoveredLocations) gameState.discoveredLocations = [];
        if (!gameState.bookmarkedBooks) gameState.bookmarkedBooks = [];
        if (!gameState.readBooks) gameState.readBooks = [];
        if (!gameState.scribedBooks) gameState.scribedBooks = [];
      } catch (e) {
        console.error("State parsing failed, resetting to default.", e);
        gameState = JSON.parse(JSON.stringify(defaultState));
      }
    } else {
      gameState = JSON.parse(JSON.stringify(defaultState));
    }
  }

  function saveState() {
    localStorage.setItem('arcane_kingdom_state', JSON.stringify(gameState));
  }

  function updateHUD() {
    if (!gameState) return;
    if (hudUsername) hudUsername.textContent = gameState.profile.name;
    if (hudHouseBadge) {
      hudHouseBadge.textContent = gameState.profile.house;
      hudHouseBadge.className = `hud-house-badge house-${gameState.profile.house.toLowerCase()}`;
    }
    if (hudLevel) hudLevel.textContent = `Lvl ${gameState.profile.level}`;
    if (hudRank) hudRank.textContent = gameState.profile.rank;
    if (walletBalanceSpan) walletBalanceSpan.textContent = gameState.profile.gold;
    
    // XP Bar Percentage
    if (hudXpFill) {
      const xpNeeded = gameState.profile.level * 100;
      const pct = (gameState.profile.xp / xpNeeded) * 100;
      hudXpFill.style.width = `${pct}%`;
    }
  }

  function addXP(amount) {
    if (!gameState) return;
    gameState.profile.xp += amount;
    let xpNeeded = gameState.profile.level * 100;
    let leveledUp = false;

    while (gameState.profile.xp >= xpNeeded) {
      gameState.profile.xp -= xpNeeded;
      gameState.profile.level++;
      xpNeeded = gameState.profile.level * 100;
      leveledUp = true;
    }

    if (leveledUp) {
      gameState.profile.rank = getRankTitle(gameState.profile.level, gameState.profile.class);
      showToast(`✦ LEVEL UP! ✦ You reached Level ${gameState.profile.level} (${gameState.profile.rank})`);
      window.magicalAudio.playSwordSFX();
      setTimeout(() => {
        window.magicalAudio.playSpellSFX();
      }, 200);
    } else {
      createFloatingText(document.getElementById('profile-hud') || document.body, `+${amount} XP`);
    }
    
    saveState();
    updateHUD();
    updateQuestProgress();
  }

  function addGold(amount) {
    if (!gameState) return;
    gameState.profile.gold += amount;
    saveState();
    updateHUD();
    window.magicalAudio.playCoinSFX();
  }

  function getRankTitle(level, className) {
    if (level <= 2) return `Novice ${className}`;
    if (level <= 5) return `Adept ${className}`;
    if (level <= 9) return `Scholar of Arcana`;
    if (level <= 14) return `${className} Warden`;
    if (level <= 19) return `High ${className}`;
    return `Legendary Sovereign`;
  }

  function applyHouseTheme(house) {
    const root = document.documentElement;
    if (house === 'Ignis') {
      root.style.setProperty('--color-gold', '#d4af37');
      root.style.setProperty('--color-gold-glow', 'rgba(212, 175, 55, 0.45)');
      root.style.setProperty('--glass-border', 'rgba(212, 175, 55, 0.18)');
    } else if (house === 'Aethelgard') {
      root.style.setProperty('--color-gold', '#00f0ff');
      root.style.setProperty('--color-gold-glow', 'rgba(0, 240, 255, 0.45)');
      root.style.setProperty('--glass-border', 'rgba(0, 240, 255, 0.25)');
    } else if (house === 'Shadowfen') {
      root.style.setProperty('--color-gold', '#a855f7');
      root.style.setProperty('--color-gold-glow', 'rgba(168, 85, 247, 0.45)');
      root.style.setProperty('--glass-border', 'rgba(168, 85, 247, 0.25)');
    } else if (house === 'Sylvanwood') {
      root.style.setProperty('--color-gold', '#10b981');
      root.style.setProperty('--color-gold-glow', 'rgba(16, 185, 129, 0.4)');
      root.style.setProperty('--glass-border', 'rgba(16, 185, 129, 0.25)');
    }
  }

  function initKingdom() {
    applyHouseTheme(gameState.profile.house);
    updateHUD();
    renderSpellsShelf();
    
    // Register custom scribed books in DB and display them
    if (gameState.scribedBooks) {
      gameState.scribedBooks.forEach(book => {
        bookDatabase[book.id] = {
          title: book.title,
          pages: book.pages
        };
        appendBookToLibraryUI(book);
      });
    }

    syncBookmarkButtons();
    renderBookmarksShelf();
    syncMarketplaceOwnership();
    updateInventoryUI();
    updateQuestProgress();
    adaptQuestsForClass(gameState.profile.class);
  }

  // --- Cinematic Gate Intro Logic ---
  enterBtn.addEventListener('click', () => {
    // 1. Play Sound
    window.magicalAudio.init();
    window.magicalAudio.setMute(false);
    window.magicalAudio.playSwordSFX(); // plays sword clang/gate ring
    
    // Fade out HUD first
    gateHud.style.opacity = '0';
    
    // 2. Open gates
    document.body.classList.add('gates-open');
    
    // 3. Start ambient background music
    setTimeout(() => {
      window.magicalAudio.playAmbient();
      updateAudioUI(false);
    }, 1200);

    // 4. Remove gate element after slide transitions
    setTimeout(() => {
      gateOverlay.style.display = 'none';
      
      // Check if Destiny overlay should appear
      const stateExists = localStorage.getItem('arcane_kingdom_state');
      if (!stateExists) {
        destinyOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      } else {
        profileHud.style.display = 'flex';
        document.body.style.overflow = '';
      }

      // Trigger Hero Entrance Animation
      document.getElementById('hero-content').classList.add('fade-in-up');
    }, 2500);
  });

  // --- Audio Control UI Sync ---
  audioToggle.addEventListener('click', () => {
    const isMuted = window.magicalAudio.toggleMute();
    updateAudioUI(isMuted);
    
    // Play spell sound to provide feedback on unmute
    if (!isMuted) {
      window.magicalAudio.playSpellSFX();
    }
  });

  function updateAudioUI(isMuted) {
    if (isMuted) {
      audioVisualizer.classList.remove('visualizer-active');
      speakerIcon.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      `;
      audioToggle.title = "Unmute Ambient Music";
    } else {
      audioVisualizer.classList.add('visualizer-active');
      speakerIcon.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      `;
      audioToggle.title = "Mute Ambient Music";
    }
  }

  // --- Navbar Scroll Styling ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let currentSection = 'hero';
    const scrollPosition = window.scrollY + 200;
    
    const sections = document.querySelectorAll('section, footer');
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = sec.getAttribute('id') || 'hero';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile navigation drawer toggle
  mobileToggle.addEventListener('click', () => {
    navLinksUl.classList.toggle('active');
    mobileToggle.textContent = navLinksUl.classList.contains('active') ? '✕' : '☰';
    window.magicalAudio.playPageTurnSFX();
  });

  // Close mobile nav drawer when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksUl.classList.remove('active');
      mobileToggle.textContent = '☰';
    });
  });

  // --- Hero Background Mouse Parallax Animation ---
  if (heroSection && heroBgWrapper) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = ((x - centerX) / centerX) * -15; // Move background slightly opposite to cursor
      const moveY = ((y - centerY) / centerY) * -15;
      
      heroBgWrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroBgWrapper.style.transform = 'translate(0, 0)';
    });
  }

  // --- Canvas Particle and Light Ray System ---
  const ctx = particleCanvas.getContext('2d');
  let particles = [];
  let lightRays = [];

  function resizeCanvas() {
    particleCanvas.width = particleCanvas.parentElement.clientWidth;
    particleCanvas.height = particleCanvas.parentElement.clientHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Create particles
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * particleCanvas.width;
      this.y = particleCanvas.height + Math.random() * 50;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 1.2 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(0, 240, 255, ';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      // Fade out as it goes up
      if (this.y < 100) {
        this.alpha -= 0.005;
      }
      if (this.y < 0 || this.alpha <= 0) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = this.color.includes('212') ? '#d4af37' : '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Create diagonal light rays
  class LightRay {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * particleCanvas.width;
      this.width = Math.random() * 120 + 40;
      this.height = particleCanvas.height * 1.5;
      this.angle = -25 * (Math.PI / 180); // -25 degrees
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.07 + 0.01;
      this.fadeSpeed = Math.random() * 0.001 + 0.0003;
      this.direction = 1; // 1 = fading in, -1 = fading out
    }
    update() {
      this.alpha += this.fadeSpeed * this.direction;
      if (this.alpha >= this.maxAlpha) {
        this.direction = -1;
      }
      if (this.alpha <= 0 && this.direction === -1) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, -100);
      ctx.rotate(this.angle);
      
      const grad = ctx.createLinearGradient(0, 0, this.width, 0);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(0.5, 'rgba(212, 175, 55, ' + this.alpha + ')');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }
  }

  // Populate particles
  for (let i = 0; i < 90; i++) {
    particles.push(new Particle());
  }
  for (let i = 0; i < 5; i++) {
    lightRays.push(new LightRay());
  }

  // Particle Loop
  function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    // Draw and update rays
    lightRays.forEach(ray => {
      ray.update();
      ray.draw();
    });

    // Draw and update particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- Interactive Academy Cards tilt effect & dynamic Canvas hovers ---
  const cards = document.querySelectorAll('.academy-card');
  cards.forEach(card => {
    // 3D Tilt Effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12; // tilt degrees
      const rotateY = ((x - centerX) / centerX) * 12;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
    });

    // Hover sound triggers
    card.addEventListener('mouseenter', () => {
      window.magicalAudio.playSpellSFX();
    });
  });

  // Card sub-canvases for custom animations (Spell, Potion, Knowledge)
  initCardCanvases();

  function initCardCanvases() {
    const spellCanvas = document.getElementById('spell-canvas');
    const potionCanvas = document.getElementById('potion-canvas');
    const knowledgeCanvas = document.getElementById('knowledge-canvas');

    const canvasList = [
      { canvas: spellCanvas, color: '#d4af37', type: 'sparkle' },
      { canvas: potionCanvas, color: '#10b981', type: 'bubble' },
      { canvas: knowledgeCanvas, color: '#00f0ff', type: 'rune' }
    ];

    canvasList.forEach(item => {
      const c = item.canvas;
      const rect = c.parentElement.getBoundingClientRect();
      c.width = rect.width;
      c.height = rect.height;
      const cCtx = c.getContext('2d');
      
      let elements = [];
      let active = false;

      // Handle card mouse interactions to activate sub-canvas
      c.parentElement.addEventListener('mouseenter', () => { active = true; });
      c.parentElement.addEventListener('mouseleave', () => { active = false; });

      // Build initial items
      if (item.type === 'bubble') {
        for(let i=0; i<15; i++) elements.push({
          x: Math.random() * c.width,
          y: c.height + Math.random()*40,
          r: Math.random() * 5 + 2,
          speed: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.6 + 0.2
        });
      } else if (item.type === 'sparkle') {
        for(let i=0; i<25; i++) elements.push({
          x: c.width/2 + (Math.random() - 0.5) * 50,
          y: c.height/2 + (Math.random() - 0.5) * 50,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 3,
          speedY: (Math.random() - 0.5) * 3,
          alpha: Math.random() * 0.8 + 0.2
        });
      } else {
        // Runes/Text lines falling
        for(let i=0; i<10; i++) elements.push({
          x: Math.random() * c.width,
          y: Math.random() * c.height - c.height,
          speed: Math.random() * 2 + 1,
          char: String.fromCharCode(0x16A0 + Math.floor(Math.random() * 80)), // Runic characters
          alpha: Math.random() * 0.7 + 0.1
        });
      }

      function drawCardAnimation() {
        cCtx.clearRect(0, 0, c.width, c.height);
        
        if (active) {
          if (item.type === 'bubble') {
            elements.forEach(b => {
              b.y -= b.speed;
              if (b.y < -10) {
                b.y = c.height + 10;
                b.x = Math.random() * c.width;
              }
              cCtx.beginPath();
              cCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
              cCtx.fillStyle = `rgba(16, 185, 129, ${b.alpha})`;
              cCtx.strokeStyle = 'rgba(255,255,255,0.2)';
              cCtx.stroke();
              cCtx.fill();
            });
          } else if (item.type === 'sparkle') {
            elements.forEach(s => {
              s.x += s.speedX;
              s.y += s.speedY;
              s.alpha -= 0.015;
              if (s.alpha <= 0) {
                s.x = c.width/2 + (Math.random() - 0.5) * 60;
                s.y = c.height/2 + (Math.random() - 0.5) * 60;
                s.alpha = Math.random() * 0.8 + 0.2;
                s.speedX = (Math.random() - 0.5) * 3.5;
                s.speedY = (Math.random() - 0.5) * 3.5;
              }
              cCtx.beginPath();
              cCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
              cCtx.fillStyle = `rgba(212, 175, 55, ${s.alpha})`;
              cCtx.fill();
            });
          } else {
            // Runes falling
            cCtx.font = "14px monospace";
            elements.forEach(r => {
              r.y += r.speed;
              if (r.y > c.height) {
                r.y = -20;
                r.x = Math.random() * c.width;
              }
              cCtx.fillStyle = `rgba(0, 240, 255, ${r.alpha})`;
              cCtx.fillText(r.char, r.x, r.y);
            });
          }
        }
        
        requestAnimationFrame(drawCardAnimation);
      }
      drawCardAnimation();
    });
  }

  // --- Destiny Choice Wizard Flow ---
  houseOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      houseOptions.forEach(h => h.classList.remove('active'));
      opt.classList.add('active');
      window.magicalAudio.playSpellSFX();
    });
  });

  classOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      classOptions.forEach(c => c.classList.remove('active'));
      opt.classList.add('active');
      window.magicalAudio.playSwordSFX();
    });
  });

  confirmDestinyBtn.addEventListener('click', () => {
    const rawName = destinyNameInput.value.trim();
    const finalName = rawName || "Mage Apprentice";
    const activeHouseEl = document.querySelector('.house-option.active');
    const activeClassEl = document.querySelector('.class-option.active');
    
    if (!activeHouseEl || !activeClassEl) return;
    
    const house = activeHouseEl.dataset.house;
    const cl = activeClassEl.dataset.class;

    // Build fresh state
    gameState.profile.name = finalName;
    gameState.profile.house = house;
    gameState.profile.class = cl;
    gameState.profile.level = 1;
    gameState.profile.xp = 0;
    gameState.profile.gold = 250;
    gameState.profile.rank = getRankTitle(1, cl);
    
    saveState();
    
    // Animate out overlay
    destinyOverlay.style.animation = 'scaleDown 0.4s forwards';
    setTimeout(() => {
      destinyOverlay.style.display = 'none';
      destinyOverlay.style.animation = '';
      profileHud.style.display = 'flex';
      document.body.style.overflow = '';
      
      // Initialize systems
      initKingdom();

      showToast(`✦ Destiny Bound: House ${house} ${cl} ${finalName}!`);
      window.magicalAudio.playSwordSFX();
    }, 400);
  });

  // --- Workspace Navigation Tabs ---
  const tabButtons = document.querySelectorAll('.w-tab-btn');
  const tabContents = document.querySelectorAll('.w-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      const content = document.getElementById(tabId);
      if (content) content.classList.add('active');

      window.magicalAudio.playPageTurnSFX();
    });
  });

  // --- Dynamic Quests Checklist System ---
  const claimMapBtn = document.getElementById('claim-q-map');
  const claimReadBtn = document.getElementById('claim-q-read');
  const claimSpellBtn = document.getElementById('claim-q-spell');

  function updateQuestProgress() {
    if (!gameState) return;

    // 1. Kingdom Cartography Progress (Map coordinates discovery)
    const discoveredCount = gameState.discoveredLocations ? gameState.discoveredLocations.length : 0;
    const mapFill = document.getElementById('q-map-fill');
    const mapText = document.getElementById('q-map-text');
    if (mapFill) mapFill.style.width = `${Math.min(discoveredCount, 3) * 33.33}%`;
    if (mapText) mapText.textContent = `${Math.min(discoveredCount, 3)}/3 Discovered`;

    if (discoveredCount >= 3) {
      if (gameState.completedQuests.includes('discover-map')) {
        claimMapBtn.textContent = 'Claimed';
        claimMapBtn.disabled = true;
      } else {
        claimMapBtn.textContent = 'Claim Reward';
        claimMapBtn.disabled = false;
        claimMapBtn.style.boxShadow = '0 0 10px var(--color-gold)';
      }
    } else {
      claimMapBtn.textContent = 'Claim';
      claimMapBtn.disabled = true;
      claimMapBtn.style.boxShadow = 'none';
    }

    // 2. Library Codex Progress (Books read)
    const readCount = gameState.readBooks ? gameState.readBooks.length : 0;
    const readFill = document.getElementById('q-read-fill');
    const readText = document.getElementById('q-read-text');
    if (readFill) readFill.style.width = `${Math.min(readCount, 1) * 100}%`;
    if (readText) readText.textContent = `${Math.min(readCount, 1)}/1 Read`;

    if (readCount >= 1) {
      if (gameState.completedQuests.includes('read-library')) {
        claimReadBtn.textContent = 'Claimed';
        claimReadBtn.disabled = true;
      } else {
        claimReadBtn.textContent = 'Claim Reward';
        claimReadBtn.disabled = false;
        claimReadBtn.style.boxShadow = '0 0 10px var(--color-gold)';
      }
    } else {
      claimReadBtn.textContent = 'Claim';
      claimReadBtn.disabled = true;
      claimReadBtn.style.boxShadow = 'none';
    }

    // 3. Spell Forge Progress (Spells created)
    const forgedCount = gameState.createdSpells ? gameState.createdSpells.length : 0;
    const spellFill = document.getElementById('q-spell-fill');
    const spellText = document.getElementById('q-spell-text');
    if (spellFill) spellFill.style.width = `${Math.min(forgedCount, 1) * 100}%`;
    if (spellText) spellText.textContent = `${Math.min(forgedCount, 1)}/1 Forged`;

    if (forgedCount >= 1) {
      if (gameState.completedQuests.includes('forge-spell')) {
        claimSpellBtn.textContent = 'Claimed';
        claimSpellBtn.disabled = true;
      } else {
        claimSpellBtn.textContent = 'Claim Reward';
        claimSpellBtn.disabled = false;
        claimSpellBtn.style.boxShadow = '0 0 10px var(--color-gold)';
      }
    } else {
      claimSpellBtn.textContent = 'Claim';
      claimSpellBtn.disabled = true;
      claimSpellBtn.style.boxShadow = 'none';
    }
  }

  if (claimMapBtn) {
    claimMapBtn.addEventListener('click', () => {
      if (!gameState.completedQuests.includes('discover-map')) {
        gameState.completedQuests.push('discover-map');
        addGold(40);
        addXP(100);
        showToast("✦ Claimed Cartography: +40 Gold, +100 XP!");
        updateQuestProgress();
      }
    });
  }

  if (claimReadBtn) {
    claimReadBtn.addEventListener('click', () => {
      if (!gameState.completedQuests.includes('read-library')) {
        gameState.completedQuests.push('read-library');
        addGold(30);
        addXP(80);
        showToast("✦ Claimed Codex Reading: +30 Gold, +80 XP!");
        updateQuestProgress();
      }
    });
  }

  if (claimSpellBtn) {
    claimSpellBtn.addEventListener('click', () => {
      if (!gameState.completedQuests.includes('forge-spell')) {
        gameState.completedQuests.push('forge-spell');
        addGold(50);
        addXP(120);
        showToast("✦ Claimed Spell Forge: +50 Gold, +120 XP!");
        updateQuestProgress();
      }
    });
  }

  function adaptQuestsForClass(className) {
    const qMapTitle = document.querySelector('#q-discover-map h4');
    const qMapDesc = document.querySelector('#q-discover-map p');
    const qReadTitle = document.querySelector('#q-read-library h4');
    const qReadDesc = document.querySelector('#q-read-library p');
    const qSpellTitle = document.querySelector('#q-forge-spell h4');
    const qSpellDesc = document.querySelector('#q-forge-spell p');

    if (className === 'Mage') {
      if(qMapTitle) qMapTitle.textContent = "Aetherial Mapping";
      if(qMapDesc) qMapDesc.textContent = "Discover 3 coordinates on the magical map.";
      if(qReadTitle) qReadTitle.textContent = "Chronomancy Secrets";
      if(qReadDesc) qReadDesc.textContent = "Read a forbidden tome from the library archives.";
      if(qSpellTitle) qSpellTitle.textContent = "Mana Fusion";
      if(qSpellDesc) qSpellDesc.textContent = "Forge a custom spell in the Spell Forge.";
    } else if (className === 'Warrior') {
      if(qMapTitle) qMapTitle.textContent = "Citadel Boundary Patrol";
      if(qMapDesc) qMapDesc.textContent = "Survey 3 coordinates on the kingdom map.";
      if(qReadTitle) qReadTitle.textContent = "Tactician's Log";
      if(qReadDesc) qReadDesc.textContent = "Read an ancient war chronicle from the library.";
      if(qSpellTitle) qSpellTitle.textContent = "Blade Infusion";
      if(qSpellDesc) qSpellDesc.textContent = "Weave a custom elemental spell card for your sword.";
    } else if (className === 'Ranger') {
      if(qMapTitle) qMapTitle.textContent = "Wilderness Scouting";
      if(qMapDesc) qMapDesc.textContent = "Locate 3 regions across wild coordinates.";
      if(qReadTitle) qReadTitle.textContent = "Herbology Lore";
      if(qReadDesc) qReadDesc.textContent = "Read Granger's Elixirs Guide or other books.";
      if(qSpellTitle) qSpellTitle.textContent = "Nature Call Spell";
      if(qSpellDesc) qSpellDesc.textContent = "Forge a nature or beast spell to aid your summonings.";
    } else if (className === 'Oracle') {
      if(qMapTitle) qMapTitle.textContent = "Leyline Scanning";
      if(qMapDesc) qMapDesc.textContent = "Track 3 coordinates of interest on the map.";
      if(qReadTitle) qReadTitle.textContent = "Celestial Prophecies";
      if(qReadDesc) qReadDesc.textContent = "Read a library tome to find lunar prophecy records.";
      if(qSpellTitle) qSpellTitle.textContent = "Cosmic Manifestation";
      if(qSpellDesc) qSpellDesc.textContent = "Forge a star or aether spell card in the forge.";
    } else if (className === 'Alchemist') {
      if(qMapTitle) qMapTitle.textContent = "Ingredient Foraging";
      if(qMapDesc) qMapDesc.textContent = "Visit 3 locations to harvest active magic components.";
      if(qReadTitle) qReadTitle.textContent = "Reagent Manuals";
      if(qReadDesc) qReadDesc.textContent = "Study an alchemical recipe guide in the library.";
      if(qSpellTitle) qSpellTitle.textContent = "Volatile Synthesis";
      if(qSpellDesc) qSpellDesc.textContent = "Forge a customized potion or spell formula.";
    } else if (className === 'Dragon Rider') {
      if(qMapTitle) qMapTitle.textContent = "Aerial Surveying";
      if(qMapDesc) qMapDesc.textContent = "Scan 3 regions from high dragon heights.";
      if(qReadTitle) qReadTitle.textContent = "Elder Dragon Logs";
      if(qReadDesc) qReadDesc.textContent = "Read a historical war book in the library archives.";
      if(qSpellTitle) qSpellTitle.textContent = "Flame Burst Control";
      if(qSpellDesc) qSpellDesc.textContent = "Forge a custom fire or elemental dragon spell card.";
    }
  }

  // --- Spell Forge Workshop ---
  if (spellPowerInput && spellPowerVal) {
    spellPowerInput.addEventListener('input', () => {
      spellPowerVal.textContent = spellPowerInput.value;
    });
  }

  if (forgeSpellBtn) {
    forgeSpellBtn.addEventListener('click', () => {
      const name = spellNameInput.value.trim();
      const element = spellElementSelect.value;
      const power = parseInt(spellPowerInput.value);
      const desc = spellDescInput.value.trim();

      if (!name) {
        showToast("Spell Name cannot be blank!");
        return;
      }
      if (!desc) {
        showToast("Please describe your spell manifestation.");
        return;
      }

      // Create Spell Object
      const newSpell = {
        id: 'spell-' + Date.now(),
        name: name,
        element: element,
        power: power,
        desc: desc,
        date: new Date().toLocaleDateString()
      };

      if (!gameState.createdSpells) gameState.createdSpells = [];
      gameState.createdSpells.push(newSpell);
      
      // Award XP
      addXP(20);
      saveState();

      showToast(`✦ Forged Spell: ${name}!`);
      window.magicalAudio.playSpellSFX();

      // Reset form
      spellNameInput.value = '';
      spellDescInput.value = '';
      spellPowerInput.value = 50;
      spellPowerVal.textContent = 50;

      renderSpellsShelf();
      updateQuestProgress();
    });
  }

  function getElementIcon(el) {
    const icons = {
      'Fire': '🔥',
      'Ice': '❄️',
      'Storm': '⚡',
      'Shadow': '💀',
      'Nature': '🍃',
      'Aether': '✨'
    };
    return icons[el] || '✦';
  }

  function renderSpellsShelf() {
    spellAnimators.forEach(cancelAnimationFrame);
    spellAnimators = [];

    const shelf = document.getElementById('spells-shelf-grid');
    const emptyMsg = document.getElementById('empty-codex-text');
    if (!shelf) return;

    // Clear existing dynamic spell cards
    const cards = shelf.querySelectorAll('.spell-custom-card');
    cards.forEach(c => c.remove());

    if (!gameState.createdSpells || gameState.createdSpells.length === 0) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';

    gameState.createdSpells.forEach(spell => {
      const card = document.createElement('div');
      card.className = `spell-custom-card spell-element-${spell.element.toLowerCase()} glass-panel`;
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.style.padding = '20px';
      card.style.minHeight = '180px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';

      card.innerHTML = `
        <canvas class="spell-card-interactive-canvas" id="canvas-${spell.id}" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1; opacity:0.6;"></canvas>
        <div style="position: relative; z-index: 2;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span class="spell-element-badge badge-${spell.element.toLowerCase()}" style="font-size:0.75rem; font-family:var(--font-display); text-transform:uppercase;">${getElementIcon(spell.element)} ${spell.element}</span>
            <span style="font-size:0.8rem; color:var(--color-gold);">Power: ${spell.power}</span>
          </div>
          <h4 class="font-fantasy" style="color:#fff; margin-bottom:8px; font-size:1.1rem; text-shadow:0 0 5px rgba(255,255,255,0.2);">${spell.name}</h4>
          <p style="font-size:0.85rem; color:#cbd5e1; line-height:1.4;">${spell.desc}</p>
        </div>
        <div style="position:relative; z-index:2; text-align:right; font-size:0.7rem; color:#64748b; margin-top:10px;">
          Forged ${spell.date}
        </div>
      `;

      shelf.appendChild(card);

      // Start particle canvas animation inside card
      setTimeout(() => {
        initSpellCardCanvas(spell.id, spell.element);
      }, 50);
    });
  }

  function initSpellCardCanvas(spellId, element) {
    const canvas = document.getElementById(`canvas-${spellId}`);
    if (!canvas) return;
    const cCtx = canvas.getContext('2d');
    
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let particles = [];
    const maxParticles = 15;

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createSpellParticle(canvas.width, canvas.height, element));
    }

    function animate() {
      if (!document.getElementById(`canvas-${spellId}`)) return;
      
      cCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(cCtx);
      });

      if (element === 'Storm' && Math.random() < 0.02) {
        cCtx.fillStyle = 'rgba(255, 240, 150, 0.15)';
        cCtx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const animId = requestAnimationFrame(animate);
      spellAnimators.push(animId);
    }
    animate();
  }

  function createSpellParticle(w, h, element) {
    let p = {
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 3 + 1,
      speedX: 0,
      speedY: 0,
      alpha: Math.random() * 0.5 + 0.1,
      decay: Math.random() * 0.005 + 0.002,
      color: '#ffffff'
    };

    if (element === 'Fire') {
      p.y = h + Math.random() * 10;
      p.speedY = -(Math.random() * 0.8 + 0.3);
      p.speedX = (Math.random() - 0.5) * 0.4;
      p.color = `rgba(${200 + Math.floor(Math.random()*55)}, ${80 + Math.floor(Math.random()*60)}, 20, `;
    } else if (element === 'Ice') {
      p.y = -Math.random() * 10;
      p.speedY = Math.random() * 0.6 + 0.2;
      p.speedX = (Math.random() - 0.5) * 0.3;
      p.color = `rgba(100, ${200 + Math.floor(Math.random()*55)}, 255, `;
    } else if (element === 'Storm') {
      p.speedX = (Math.random() - 0.5) * 1.5;
      p.speedY = (Math.random() - 0.5) * 1.5;
      p.color = `rgba(255, 230, ${100 + Math.floor(Math.random()*155)}, `;
    } else if (element === 'Shadow') {
      p.speedX = (Math.random() - 0.5) * 0.3;
      p.speedY = (Math.random() - 0.5) * 0.3;
      p.color = `rgba(${120 + Math.floor(Math.random()*60)}, 30, 200, `;
    } else if (element === 'Nature') {
      p.speedX = Math.random() * 0.4 + 0.1;
      p.speedY = (Math.random() - 0.5) * 0.2;
      p.color = `rgba(16, ${170 + Math.floor(Math.random()*85)}, 129, `;
    } else { // Aether
      p.speedX = (Math.random() - 0.5) * 0.2;
      p.speedY = -(Math.random() * 0.4 + 0.1);
      p.color = `rgba(212, 175, 55, `;
    }

    p.update = function(width, height) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= this.decay;

      if (this.alpha <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.x = Math.random() * width;
        this.alpha = Math.random() * 0.5 + 0.2;
        if (element === 'Fire') {
          this.y = height + 5;
        } else if (element === 'Ice') {
          this.y = -5;
        } else {
          this.y = Math.random() * height;
        }
      }
    };

    p.draw = function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    };

    return p;
  }

  // --- Interactive Map HUD & Node Discovery ---
  mapMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      const regionId = marker.id;
      const data = regionDatabase[regionId];
      if (data) {
        hudTitle.textContent = data.title;
        hudDesc.textContent = data.desc;
        hudCoords.textContent = `COORDS: ${data.coords}`;
        mapHud.classList.add('active');

        // Play SFX
        window.magicalAudio.playSpellSFX();

        // Record location discovery in game state
        if (gameState && !gameState.discoveredLocations.includes(regionId)) {
          gameState.discoveredLocations.push(regionId);
          addGold(30);
          addXP(50);
          showToast(`✦ Region Discovered: ${data.title}! +30 Gold, +50 XP`);
          saveState();
          updateQuestProgress();
          updateInventoryUI();
        }
      }
    });

    marker.addEventListener('mouseenter', () => {
      window.magicalAudio.playCoinSFX();
    });
  });

  hudClose.addEventListener('click', () => {
    mapHud.classList.remove('active');
    window.magicalAudio.playPageTurnSFX();
  });

  // --- Character Card Mouse tilt angles ---
  const charCards = document.querySelectorAll('.character-card');
  charCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.querySelector('.character-card-inner').style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.querySelector('.character-card-inner').style.transform = 'rotateX(0) rotateY(0)';
    });

    card.addEventListener('mouseenter', () => {
      window.magicalAudio.playSwordSFX();
    });
  });

  // --- Magical Library Tome Reader Modal ---
  const bookReadButtons = document.querySelectorAll('.book-read-btn');
  bookReadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cardId = btn.closest('.book-card').id;
      openLibraryBook(cardId);
      
      // Mark as read book for quests
      if (gameState && !gameState.readBooks.includes(cardId)) {
        gameState.readBooks.push(cardId);
        saveState();
        updateQuestProgress();
      }
    });
  });

  modalClose.addEventListener('click', () => {
    libraryReaderModal.classList.remove('active');
    currentOpenBook = null;
    window.magicalAudio.playPageTurnSFX();
  });

  function openLibraryBook(bookId) {
    const data = bookDatabase[bookId];
    if (!data) return;

    currentOpenBook = bookId;
    currentBookPage = 0;

    modalBookTitle.textContent = data.title;
    updateBookModalPages();
    
    libraryReaderModal.classList.add('active');
    window.magicalAudio.playPageTurnSFX();
  }

  function updateBookModalPages() {
    const book = bookDatabase[currentOpenBook];
    if (!book) return;

    const pagePair = book.pages[currentBookPage];
    modalBookText1.textContent = pagePair[0] || "";
    modalBookText2.textContent = pagePair[1] || "";

    pageNumLeft.textContent = `Page ${currentBookPage * 2 + 1}`;
    pageNumRight.textContent = `Page ${currentBookPage * 2 + 2}`;

    btnPrevPage.disabled = currentBookPage === 0;
    btnNextPage.disabled = currentBookPage === book.pages.length - 1;
  }

  btnPrevPage.addEventListener('click', () => {
    if (currentBookPage > 0) {
      currentBookPage--;
      updateBookModalPages();
      window.magicalAudio.playPageTurnSFX();
    }
  });

  btnNextPage.addEventListener('click', () => {
    const book = bookDatabase[currentOpenBook];
    if (book && currentBookPage < book.pages.length - 1) {
      currentBookPage++;
      updateBookModalPages();
      window.magicalAudio.playPageTurnSFX();
    }
  });

  // --- Scribe CMS (Lore dynamics & Bookmarks) ---
  const bookmarkButtons = document.querySelectorAll('.book-bookmark-btn');
  bookmarkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const bookId = btn.dataset.bookId;
      toggleBookmark(bookId, btn);
    });
  });

  if (scribeSubmitBtn) {
    scribeSubmitBtn.addEventListener('click', () => {
      const title = bookTitleInput.value.trim();
      const category = bookCategorySelect.value;
      const author = bookAuthorInput.value.trim();
      const summary = bookSummaryInput.value.trim();
      const page1 = bookPage1Input.value.trim();
      const page2 = bookPage2Input.value.trim();

      if (!title || !author || !summary || !page1 || !page2) {
        showToast("Please fill in all chronicle details.");
        return;
      }

      const bookId = 'book-custom-' + Date.now();

      const newBook = {
        id: bookId,
        title: title,
        category: category,
        author: author,
        summary: summary,
        pages: [[page1, page2]]
      };

      // Add to database in memory
      bookDatabase[bookId] = {
        title: title,
        pages: [[page1, page2]]
      };

      // Add to state
      if (!gameState.scribedBooks) gameState.scribedBooks = [];
      gameState.scribedBooks.push(newBook);
      
      // Award XP for writing
      addXP(30);
      saveState();

      // Clear Form
      bookTitleInput.value = '';
      bookAuthorInput.value = '';
      bookSummaryInput.value = '';
      bookPage1Input.value = '';
      bookPage2Input.value = '';

      showToast(`✦ Scribed "${title}" into Archives!`);
      window.magicalAudio.playPageTurnSFX();

      appendBookToLibraryUI(newBook);
    });
  }

  function appendBookToLibraryUI(book) {
    const shelf = document.getElementById('library-books-shelf');
    if (!shelf) return;

    // Check if card is already appended
    if (document.getElementById(book.id)) return;

    const card = document.createElement('div');
    card.className = 'book-card';
    card.id = book.id;

    let glow = 'radial-gradient(circle, var(--color-gold-glow) 0%, transparent 70%)';
    let catColor = 'var(--color-gold)';
    let coverStyle = '';

    if (book.category === 'Alchemy') {
      glow = 'radial-gradient(circle, var(--color-emerald-glow) 0%, transparent 70%)';
      catColor = 'var(--color-emerald)';
      coverStyle = 'background: linear-gradient(135deg, #064e3b, #022c22); border-color: var(--color-emerald);';
    } else if (book.category === 'Lore logs') {
      glow = 'radial-gradient(circle, var(--color-cyan-glow) 0%, transparent 70%)';
      catColor = 'var(--color-cyan)';
      coverStyle = 'background: linear-gradient(135deg, #1e3a8a, #0f172a); border-color: var(--color-cyan);';
    } else if (book.category === 'Dark Arts') {
      glow = 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)';
      catColor = 'var(--color-rarity-epic)';
      coverStyle = 'background: linear-gradient(135deg, #3b0764, #120024); border-color: var(--color-rarity-epic);';
    }

    card.innerHTML = `
      <div class="book-card-inner glass-panel">
        <div class="book-glow-aura" style="background: ${glow};"></div>
        <div class="book-card-header">
          <span class="book-category" style="color: ${catColor}; border-color: ${catColor};">${book.category}</span>
          <span class="book-pages-count">2 pages</span>
        </div>
        <div class="book-visual-animation">
          <div class="css-book">
            <div class="book-cover" style="${coverStyle}"></div>
            <div class="book-page-turning"></div>
            <div class="book-pages"></div>
          </div>
        </div>
        <div class="book-card-body">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">By ${book.author}</p>
          <p class="book-summary">${book.summary}</p>
          <div style="display: flex; gap: 10px; z-index: 5; position: relative;">
            <button class="book-read-btn" style="color: ${catColor}; border-color: ${catColor}; flex: 1;">✦ Read ✦</button>
            <button class="book-bookmark-btn" data-book-id="${book.id}" title="Bookmark Tome" style="background: none; border: 1px solid ${catColor}; color: ${catColor}; padding: 0 12px; border-radius: 4px; cursor: pointer; transition: all 0.3s;">⭐</button>
          </div>
        </div>
      </div>
    `;

    shelf.appendChild(card);

    // Bind events
    card.querySelector('.book-read-btn').addEventListener('click', () => {
      openLibraryBook(book.id);
      if (gameState && !gameState.readBooks.includes(book.id)) {
        gameState.readBooks.push(book.id);
        saveState();
        updateQuestProgress();
      }
    });

    card.querySelector('.book-bookmark-btn').addEventListener('click', () => {
      toggleBookmark(book.id, card.querySelector('.book-bookmark-btn'));
    });
  }

  function toggleBookmark(bookId, btn) {
    if (!gameState) return;
    const index = gameState.bookmarkedBooks.indexOf(bookId);
    const book = bookDatabase[bookId];
    if (!book) return;

    if (index === -1) {
      // Add bookmark
      gameState.bookmarkedBooks.push(bookId);
      if (btn) {
        btn.style.background = 'var(--color-gold)';
        btn.style.color = '#000';
      }
      showToast(`Bookmarked "${book.title}"!`);
      window.magicalAudio.playCoinSFX();
    } else {
      // Remove bookmark
      gameState.bookmarkedBooks.splice(index, 1);
      if (btn) {
        btn.style.background = 'none';
        let themeColor = 'var(--color-gold)';
        if (bookId === 'book-2' || (bookDatabase[bookId] && bookDatabase[bookId].category === 'Lore logs')) themeColor = 'var(--color-cyan)';
        if (bookId === 'book-3' || (bookDatabase[bookId] && bookDatabase[bookId].category === 'Alchemy')) themeColor = 'var(--color-emerald)';
        btn.style.color = themeColor;
        btn.style.borderColor = themeColor;
      }
      showToast(`Removed bookmark for "${book.title}".`);
      window.magicalAudio.playPageTurnSFX();
    }

    saveState();
    renderBookmarksShelf();
  }

  function syncBookmarkButtons() {
    document.querySelectorAll('.book-bookmark-btn').forEach(btn => {
      const bookId = btn.dataset.bookId;
      if (gameState.bookmarkedBooks.includes(bookId)) {
        btn.style.background = 'var(--color-gold)';
        btn.style.color = '#000';
      } else {
        btn.style.background = 'none';
        let themeColor = 'var(--color-gold)';
        if (bookId === 'book-2') themeColor = 'var(--color-cyan)';
        if (bookId === 'book-3') themeColor = 'var(--color-emerald)';
        btn.style.color = themeColor;
        btn.style.borderColor = themeColor;
      }
    });
  }

  function renderBookmarksShelf() {
    if (!bookmarksShelfList) return;
    bookmarksShelfList.innerHTML = '';

    if (!gameState.bookmarkedBooks || gameState.bookmarkedBooks.length === 0) {
      bookmarksShelfList.innerHTML = '<p class="empty-codex-text">No library books favorited yet. Star books in the Library section to pin them here.</p>';
      return;
    }

    gameState.bookmarkedBooks.forEach(bookId => {
      const book = bookDatabase[bookId];
      if (!book) return;

      const div = document.createElement('div');
      div.className = 'bookmark-item';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.padding = '10px 15px';
      div.style.background = 'rgba(255, 255, 255, 0.04)';
      div.style.border = '1px solid rgba(255, 255, 255, 0.08)';
      div.style.borderRadius = '6px';
      div.style.marginBottom = '10px';

      div.innerHTML = `
        <div style="cursor:pointer;" class="bookmark-click-title">
          <span style="color:var(--color-gold); margin-right:8px;">✦</span>
          <span style="font-family:var(--font-display); font-size:0.9rem;">${book.title}</span>
        </div>
        <button class="remove-bookmark-btn" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.9rem;" title="Remove Bookmark">✕</button>
      `;

      bookmarksShelfList.appendChild(div);

      div.querySelector('.bookmark-click-title').addEventListener('click', () => {
        openLibraryBook(bookId);
      });

      div.querySelector('.remove-bookmark-btn').addEventListener('click', () => {
        const origBtn = document.querySelector(`.book-bookmark-btn[data-book-id="${bookId}"]`);
        toggleBookmark(bookId, origBtn);
      });
    });
  }

  // --- Aetherion AI Wizard Chat Companion ---
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  function sendUserMessage() {
    const text = chatUserInput.value.trim();
    if (!text) return;

    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'message user';
    userMsgDiv.innerHTML = `
      <span class="msg-sender">You:</span>
      <p>${escapeHTML(text)}</p>
    `;
    chatMessages.appendChild(userMsgDiv);
    
    chatUserInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    window.magicalAudio.playPageTurnSFX();

    triggerAetherionResponse(text);
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendUserMessage);
  }

  if (chatUserInput) {
    chatUserInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendUserMessage();
      }
    });
  }

  chatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chatUserInput.value = chip.textContent;
      sendUserMessage();
    });
  });

  function triggerAetherionResponse(text) {
    const orb = document.querySelector('.aetherion-pulsing-orb');
    if (orb) {
      orb.style.animationDuration = '0.4s';
      orb.style.boxShadow = '0 0 40px var(--color-cyan), inset 0 0 20px var(--color-cyan)';
    }

    const wizardMsgDiv = document.createElement('div');
    wizardMsgDiv.className = 'message wizard';
    wizardMsgDiv.innerHTML = `
      <span class="msg-sender">Aetherion:</span>
      <p class="typing-indicator">✦ Conjuring aether waves...</p>
    `;
    chatMessages.appendChild(wizardMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const apiKey = gameState.geminiApiKey || localStorage.getItem('geminiApiKey') || '';

    if (apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const systemInstructionText = `You are Aetherion, the ancient projection wizard of the Arcane Kingdom Academy. Answer questions as an immersive fantasy wizard. Refer to the user as apprentice or student. Incorporate references to the Arcane Kingdom's locations (Royal Castle, Enchanted Forest, Dragon Mountains, Hidden Caves, Wizard Academy, Mystic Lake) and characters (Archmage Ignis, Commander Aurelia, Sage Sylvan, Dragon Rider Valerius, Malakor the Silent). Keep your answers engaging, mysterious, and strictly limited to 2-3 sentences. Do not mention API keys, JSON, or any technical terms.`;
      
      const payload = {
        contents: [{
          role: "user",
          parts: [{ text: text }]
        }],
        systemInstruction: {
          parts: [{
            text: systemInstructionText
          }]
        }
      };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) throw new Error("API call failed");
        return res.json();
      })
      .then(data => {
        let reply = "";
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
          reply = data.candidates[0].content.parts[0].text;
        } else {
          reply = "The temporal stream is blurred. Speak, scrolls: " + getOfflineResponse(text);
        }
        updateWizardMessage(wizardMsgDiv, reply);
      })
      .catch(err => {
        console.error(err);
        updateWizardMessage(wizardMsgDiv, "The cosmic leyline has broken. Local feedback: " + getOfflineResponse(text));
      })
      .finally(() => {
        resetOrbAnimation(orb);
      });
    } else {
      setTimeout(() => {
        const reply = getOfflineResponse(text);
        updateWizardMessage(wizardMsgDiv, reply);
        resetOrbAnimation(orb);
      }, 1000);
    }
  }

  function updateWizardMessage(msgDiv, text) {
    const p = msgDiv.querySelector('p');
    if (p) {
      p.className = '';
      p.textContent = text;
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
    window.magicalAudio.playSpellSFX();
  }

  function resetOrbAnimation(orb) {
    if (orb) {
      orb.style.animationDuration = '3s';
      orb.style.boxShadow = '';
    }
  }

  function getOfflineResponse(text) {
    const query = text.toLowerCase();
    
    if (query.includes('spell') || query.includes('magic') || query.includes('forge') || query.includes('cast')) {
      return "Spell weaving is the core of our academy. Select the element essence, choose your power tier, and bind the spell in the Spell Forge. I recommend a Storm spell of 80 power for swift encounters!";
    }
    if (query.includes('level') || query.includes('xp') || query.includes('rank') || query.includes('progress') || query.includes('grow')) {
      return "To advance your level and elevate your rank, you must fulfill tasks on the Quests Board. Discover hidden map regions, study library books, or forge custom spells to absorb XP.";
    }
    if (query.includes('gold') || query.includes('coin') || query.includes('money') || query.includes('buy') || query.includes('market') || query.includes('shop')) {
      return "Gold coins are rewarded for completing daily academy quests. You can also click on the rotating academy runes or our seal brand to forge gold coins out of ambient energy. Use your wealth to acquire legendary relics at the bazaar!";
    }
    if (query.includes('castle') || query.includes('paladin') || query.includes('citadel') || query.includes('aurelia') || query.includes('sword') || query.includes('sabre')) {
      return "The Royal Castle stands strong, protected by floating bridges and guarded by Commander Aurelia. She wields a starlight broadsword that was once used to repel the Shadow Void Lords during the Elder Siege.";
    }
    if (query.includes('forest') || query.includes('sylvan') || query.includes('tree') || query.includes('nature') || query.includes('beast')) {
      return "The Enchanted Forest is a glowing sanctuary of nature energy guarded by Sage Sylvan. The roots whisper of ancient days, and apprentices can harvest Fluorescent Moss from the nearby caves for potion brewing.";
    }
    if (query.includes('mountain') || query.includes('dragon') || query.includes('valerius') || query.includes('peak')) {
      return "The Dragon Mountains house volcanic spires where fire-drakes nest. Valerius is the only Dragon Rider capable of flying there safely. Make sure you acquire a Dragon Fire Amulet before attempting to explore those peaks.";
    }
    if (query.includes('lake') || query.includes('water') || query.includes('void') || query.includes('rift') || query.includes('abyss')) {
      return "The Mystic Lake holds the sealed void seals from the Elder Wars. Its cyan waters glow during solstices, supplying pure mana to the floating academy tower, but dark forces still call to the unwary from its depths.";
    }
    if (query.includes('relic') || query.includes('artifact') || query.includes('crystal') || query.includes('feather') || query.includes('scale') || query.includes('rune')) {
      return "Our academy catalog lists four legendary relics: the Crystal of Wisdom, the Phoenix Feather, the Dragon Scale, and the Rune Stone. Purchase them in the Marketplace, and they will display in your Student Treasury Chest!";
    }
    
    const genericWizardQuotes = [
      "The timelines drift, yet your potential remains clear. Scribe your queries carefully, apprentice.",
      "Aether energies are whispering of a great shift. Study your codexes and prepare your mana buffers.",
      "The stars indicate that a journey to the Dragon Mountains will yield gold, but only if you possess the proper relics.",
      "I have seen the void siege of 342 E.C. and I tell you, knowledge was the ultimate shield that saved the royal crown.",
      "Every spell forged in our workshop leaves a trace in the astral archive. What element is your soul aligned with?"
    ];
    return genericWizardQuotes[Math.floor(Math.random() * genericWizardQuotes.length)];
  }

  // --- API Key Modal Binding ---
  if (apiConfigBtn) {
    apiConfigBtn.addEventListener('click', () => {
      geminiKeyInput.value = gameState.geminiApiKey || localStorage.getItem('geminiApiKey') || '';
      apiConfigModal.style.display = 'flex';
      window.magicalAudio.playPageTurnSFX();
    });
  }

  if (apiModalClose) {
    apiModalClose.addEventListener('click', () => {
      apiConfigModal.style.display = 'none';
      window.magicalAudio.playPageTurnSFX();
    });
  }

  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener('click', () => {
      const key = geminiKeyInput.value.trim();
      gameState.geminiApiKey = key;
      localStorage.setItem('geminiApiKey', key);
      saveState();
      
      showToast(key ? "API key registered successfully!" : "API credentials cleared. Switched to offline response scroll.");
      window.magicalAudio.playCoinSFX();
      apiConfigModal.style.display = 'none';
    });
  }

  // --- Royal Marketplace Purchasing & Sync ---
  
  // Easter Egg: Earn gold by clicking logo or runes!
  brandHome.addEventListener('click', () => {
    addGold(15);
    createFloatingText(brandHome, "+15 Gold");
  });

  document.querySelectorAll('.rotating-rune-svg').forEach(rune => {
    rune.parentElement.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card triggers
      addGold(10);
      createFloatingText(rune, "+10 Gold");
    });
  });

  // Filtering shop items
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      window.magicalAudio.playPageTurnSFX();

      marketCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.animation = 'scaleUp 0.4s forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Buying items logic
  const buyButtons = document.querySelectorAll('.item-buy-btn');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.market-item-card');
      const price = parseInt(card.dataset.price);
      const itemName = card.querySelector('.item-name').textContent;

      if (gameState.profile.gold >= price) {
        gameState.profile.gold -= price;
        if (!gameState.inventory) gameState.inventory = [];
        gameState.inventory.push(itemName);
        
        saveState();
        updateHUD();
        updateInventoryUI();
        
        // Play coin sounds + item unlock sparkles
        window.magicalAudio.playCoinSFX();
        setTimeout(() => {
          window.magicalAudio.playSpellSFX();
        }, 150);

        // Toast feedback
        showToast(`✦ Acquired: ${itemName}! Stored in Treasury Chest.`);

        // Disable button
        btn.textContent = "Owned";
        btn.disabled = true;
        
        // Mark card visual as owned
        card.querySelector('.market-card-inner').style.background = 'rgba(212,175,55,0.06)';

        updateBuyButtons();
      } else {
        showToast("Insufficient gold! Click runes or academy logo brand to harvest coins.");
        window.magicalAudio.playPageTurnSFX();
      }
    });
  });

  function updateBuyButtons() {
    buyButtons.forEach(btn => {
      const card = btn.closest('.market-item-card');
      if (btn.textContent === "Owned") return;

      const price = parseInt(card.dataset.price);
      if (gameState.profile.gold < price) {
        btn.style.opacity = '0.5';
      } else {
        btn.style.opacity = '1';
      }
    });
  }

  function syncMarketplaceOwnership() {
    buyButtons.forEach(btn => {
      const card = btn.closest('.market-item-card');
      const itemName = card.querySelector('.item-name').textContent;
      if (gameState.inventory && gameState.inventory.includes(itemName)) {
        btn.textContent = "Owned";
        btn.disabled = true;
        card.querySelector('.market-card-inner').style.background = 'rgba(212,175,55,0.06)';
      } else {
        btn.textContent = "Acquire";
        btn.disabled = false;
        card.querySelector('.market-card-inner').style.background = '';
      }
    });
    updateBuyButtons();
  }

  // --- Student Treasury Chest Inventory Drawer ---
  if (inventoryToggle) {
    inventoryToggle.addEventListener('click', () => {
      updateInventoryUI();
      inventoryModal.style.display = 'flex';
      window.magicalAudio.playPageTurnSFX();
    });
  }

  if (inventoryModalClose) {
    inventoryModalClose.addEventListener('click', () => {
      inventoryModal.style.display = 'none';
      window.magicalAudio.playPageTurnSFX();
    });
  }

  function updateInventoryUI() {
    if (!gameState) return;
    if (invClass) invClass.textContent = gameState.profile.class;
    if (invHouse) invHouse.textContent = gameState.profile.house;
    if (invGold) invGold.textContent = `${gameState.profile.gold} Gold`;

    const inventory = gameState.inventory || [];
    
    // Map items to relic slots in HTML
    const relicMapping = {
      'Mana Star Crystal': 'relic-crystal',
      'Aetherius Archstaff': 'relic-feather', // Phoenix Feather core staff
      'Dragon Fire Amulet': 'relic-scale',
      'Incinerate Spell Grimoire': 'relic-rune'
    };

    for (const [itemName, relicId] of Object.entries(relicMapping)) {
      const relicEl = document.getElementById(relicId);
      if (relicEl) {
        if (inventory.includes(itemName)) {
          relicEl.classList.remove('locked');
          relicEl.style.opacity = '1';
          relicEl.style.border = '1px solid var(--color-gold)';
          relicEl.style.boxShadow = '0 0 10px var(--color-gold-glow)';
          const statusSpan = relicEl.querySelector('.relic-status');
          if (statusSpan) {
            statusSpan.textContent = 'Unlocked';
            statusSpan.style.color = '#10b981';
          }
        } else {
          relicEl.classList.add('locked');
          relicEl.style.opacity = '0.5';
          relicEl.style.border = '1px dashed rgba(255,255,255,0.1)';
          relicEl.style.boxShadow = 'none';
          const statusSpan = relicEl.querySelector('.relic-status');
          if (statusSpan) {
            statusSpan.textContent = 'Locked';
            statusSpan.style.color = '#ef4444';
          }
        }
      }
    }
  }

  // --- Notification Toast Manager ---
  const toastContainer = document.getElementById('toast-container');
  
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="font-size: 1.2rem; color: var(--color-gold);">✦</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    // animate in
    setTimeout(() => {
      toast.classList.add('active');
    }, 50);

    // clear toast after 4s
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  // --- Easter egg helper: floating popup text ---
  function createFloatingText(anchor, text) {
    const rect = anchor.getBoundingClientRect();
    const floatingDiv = document.createElement('div');
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = `${rect.top - 10}px`;
    floatingDiv.style.left = `${rect.left + rect.width/2}px`;
    floatingDiv.style.color = '#d4af37';
    floatingDiv.style.fontFamily = "'Cinzel', serif";
    floatingDiv.style.fontSize = '1.1rem';
    floatingDiv.style.fontWeight = 'bold';
    floatingDiv.style.pointerEvents = 'none';
    floatingDiv.style.zIndex = '99999';
    floatingDiv.style.textShadow = '0 0 10px #d4af37';
    floatingDiv.style.transition = 'all 1s ease-out';
    floatingDiv.textContent = text;
    
    document.body.appendChild(floatingDiv);

    // anim up and fade
    setTimeout(() => {
      floatingDiv.style.transform = 'translateY(-40px)';
      floatingDiv.style.opacity = '0';
      setTimeout(() => {
        floatingDiv.remove();
      }, 1000);
    }, 50);
  }

  // --- Startup Initialization ---
  loadState();
  const stateExists = localStorage.getItem('arcane_kingdom_state');
  if (stateExists) {
    initKingdom();
  }
});
