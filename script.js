const birthdayDate = new Date("March 3, 2026 00:00:00").getTime();

// Core Elements
const countdownSection = document.getElementById('countdown-section');
const unlockSection = document.getElementById('unlock-section');
const greetingSection = document.getElementById('greeting-section');
const bgMusic = document.getElementById('bg-music');

// Countdown digit elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// Sequence Elements
let currentStep = 0;
let poppedBalloonsCount = 0;
const totalBalloons = 4;
const promptText = document.getElementById('prompt-text');
const actionBtn = document.getElementById('action-btn');
const interactionLayer = document.getElementById('interaction-layer');
const canvasEl = document.getElementById('c');

// New Layers
const balloonLayer = document.getElementById('balloon-layer');
const cardsLayer = document.getElementById('cards-layer');
const replayBtn = document.getElementById('replay-btn');
const mainCard = document.querySelector('.card');

function pulseDigit(el) {
    if (!el) return;
    el.classList.remove('time-pulse');
    // Force reflow so animation can restart
    void el.offsetWidth;
    el.classList.add('time-pulse');
}

// --- Countdown Logic ---
const timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = birthdayDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days.toString().padStart(2, '0');
    hoursEl.innerText = hours.toString().padStart(2, '0');
    minutesEl.innerText = minutes.toString().padStart(2, '0');
    secondsEl.innerText = seconds.toString().padStart(2, '0');

    pulseDigit(daysEl);
    pulseDigit(hoursEl);
    pulseDigit(minutesEl);
    pulseDigit(secondsEl);

    if (distance < 0) {
        clearInterval(timerInterval);
        countdownSection.classList.remove('active-screen');
        countdownSection.classList.add('hidden-screen');
        unlockSection.classList.remove('hidden-screen');
        unlockSection.classList.add('active-screen');
        const unlockCard = unlockSection.querySelector('.glass-card');
        if (unlockCard) {
            unlockCard.classList.remove('card-pop-in');
            void unlockCard.offsetWidth;
            unlockCard.classList.add('card-pop-in');
        }
    }
}, 1000);

// --- Sequence Navigation ---
document.getElementById('unlock-btn').addEventListener('click', () => {
    unlockSection.classList.remove('active-screen');
    unlockSection.classList.add('hidden-screen');
    greetingSection.classList.remove('hidden-screen');
    greetingSection.classList.add('active-screen');
});

actionBtn.addEventListener('click', () => {
    currentStep++;
    promptText.classList.remove('text-fade');
    void promptText.offsetWidth; // reflow
    promptText.classList.add('text-fade');

    if (currentStep === 1) {
        // Change background color, start music and particle animation
        document.body.classList.add('body-celebrate'); // celebratory gradient
        bgMusic.currentTime = 0;
        bgMusic.play();
        startRisingAnimation();

        document.querySelector('.cake-container').classList.add('slide-up');
        setTimeout(() => document.getElementById('candle-flame').classList.remove('unlit'), 800);
        promptText.innerText = "Let's bring back some memories...";
        actionBtn.innerText = "Drop the Photos 📸";
    } 
    else if (currentStep === 2) {
        document.querySelector('.hanging-photos').classList.add('drop-down');
        promptText.innerText = "Now for the grand finale!";
        actionBtn.innerText = "Make a Wish! ✨";
    } 
    else if (currentStep === 3) {
        interactionLayer.style.opacity = "0";
        setTimeout(() => interactionLayer.style.display = "none", 1000);

        canvasEl.style.opacity = "1";
        startCanvasAnimation();
        startFallingTextAnimation();

        // 1. Wait longer enjoying the fireworks + falling text
        setTimeout(() => {
            // Fade out the physical items and canvas slightly
            document.querySelector('.cake-container').style.opacity = "0";
            document.querySelector('.hanging-photos').style.opacity = "0";
            canvasEl.style.opacity = "0";
            
            // 2. Bring in the Balloon Layer
            balloonLayer.classList.remove('hidden-layer');
            balloonLayer.classList.add('visible-layer');
            balloonLayer.classList.add('dark-overlay'); // Darkens the background
        }, 15000);
    }
});

// Helper function to pop balloons
function popBalloon(num) {
    document.getElementById(`balloon-${num}`).classList.add('popped');
    document.getElementById(`btext-${num}`).classList.add('revealed');
}

// --- Balloon Interaction ---
function setupBalloonInteraction() {
    for (let i = 1; i <= totalBalloons; i++) {
        const balloon = document.getElementById(`balloon-${i}`);
        balloon.addEventListener('click', () => {
            // Prevent re-popping
            if (balloon.classList.contains('popped')) return;

            popBalloon(i);
            poppedBalloonsCount++;

            // If all balloons are popped, move to the next stage
            if (poppedBalloonsCount === totalBalloons) {
                setTimeout(() => {
                    balloonLayer.classList.remove('visible-layer');
                    balloonLayer.classList.add('hidden-layer');
                    
                    setTimeout(() => {
                        cardsLayer.classList.remove('hidden-layer');
                        cardsLayer.classList.add('visible-layer');
                        cardsLayer.classList.add('dark-overlay');
                        cardsLayer.classList.add('cards-enter');
                        cardsLayer.scrollTop = 0;
                    }, 1000); // Wait for balloon layer to fade out

                }, 2500); // Wait for user to read the message
            }
        });
    }
}
setupBalloonInteraction();

// --- Card flip interaction (tap-friendly) ---
if (mainCard) {
    mainCard.addEventListener('click', () => {
        mainCard.classList.toggle('is-open');
    });
}

// Helper function for rising particles
function startRisingAnimation() {
    // Avoid creating multiple containers on replay without full page reload
    if (document.getElementById('rising-particles')) return;

    const container = document.createElement('div');
    container.id = 'rising-particles';
    document.body.prepend(container);

    const particleCount = 40; // A few less since they are bigger
    const colors = [
        'rgba(255, 154, 158, 0.7)', // pink
        'rgba(185, 131, 255, 0.7)', // purple
        'rgba(255, 77, 77, 0.7)',   // red
        'rgba(252, 227, 138, 0.7)'  // yellow
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${8 + Math.random() * 7}s`; // Slower, more floaty
        particle.style.animationDelay = `${Math.random() * 8}s`;
        const size = 15 + Math.random() * 30; // 15px to 45px
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 1.25}px`; // Slightly oblong
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.borderBottomColor = color; // For the knot pseudo-element
        container.appendChild(particle);
    }
}


// --- Replay Logic ---
replayBtn.addEventListener('click', () => {
    currentStep = 0;
    poppedBalloonsCount = 0;
    bgMusic.pause();
    bgMusic.currentTime = 0;

    // Reset background and particles
    document.body.classList.remove('body-celebrate');
    const particles = document.getElementById('rising-particles');
    if (particles) {
        particles.remove();
    }

    // Hide Cards & Balloons
    cardsLayer.classList.remove('visible-layer', 'dark-overlay', 'cards-enter');
    cardsLayer.classList.add('hidden-layer');
    balloonLayer.classList.remove('visible-layer', 'dark-overlay');
    balloonLayer.classList.add('hidden-layer');
    canvasEl.style.opacity = "0";

    // Reset card flip state
    if (mainCard) mainCard.classList.remove('is-open');
    
    // Reset Balloons
    for(let i=1; i<=totalBalloons; i++) {
        document.getElementById(`balloon-${i}`).classList.remove('popped');
        document.getElementById(`btext-${i}`).classList.remove('revealed');
    }

    // Reset Animations & Opacities (clear inline styles so CSS defaults take over)
    document.querySelector('.cake-container').classList.remove('slide-up');
    document.querySelector('.cake-container').style.opacity = "";
    document.querySelector('.hanging-photos').classList.remove('drop-down');
    document.querySelector('.hanging-photos').style.opacity = "";
    document.getElementById('candle-flame').classList.add('unlit');

    // Reset Interaction Prompt
    promptText.innerText = "It's a bit dark in here...";
    actionBtn.innerText = "Light the Candle 🕯️";
    interactionLayer.style.display = "block";
    setTimeout(() => interactionLayer.style.opacity = "1", 50);

    // Go back to Unlock Screen
    greetingSection.classList.remove('active-screen');
    greetingSection.classList.add('hidden-screen');
    unlockSection.classList.add('active-screen');
    unlockSection.classList.remove('hidden-screen');
});

// --- Canvas Animation Code ---
function startCanvasAnimation() {
    var c = document.getElementById('c'),
        w = c.width = window.innerWidth,
        h = c.height = window.innerHeight,
        ctx = c.getContext( '2d' ),
        hw = w / 2, hh = h / 2,
        
        opts = {
            strings: [ 'HAPPY', 'BIRTHDAY', 'Arnesha' ], 
            charSize: w < 600 ? 20 : 30, 
            charSpacing: w < 600 ? 25 : 35,
            lineHeight: w < 600 ? 30 : 40,
            cx: w / 2, cy: h / 2,
            fireworkPrevPoints: 10, fireworkBaseLineWidth: 5, fireworkAddedLineWidth: 8,
            fireworkSpawnTime: 200, fireworkBaseReachTime: 30, fireworkAddedReachTime: 30,
            fireworkCircleBaseSize: 20, fireworkCircleAddedSize: 10, fireworkCircleBaseTime: 30,
            fireworkCircleAddedTime: 30, fireworkCircleFadeBaseTime: 10, fireworkCircleFadeAddedTime: 5,
            fireworkBaseShards: 5, fireworkAddedShards: 5, fireworkShardPrevPoints: 3,
            fireworkShardBaseVel: 4, fireworkShardAddedVel: 2, fireworkShardBaseSize: 3,
            fireworkShardAddedSize: 3, gravity: .1, upFlow: -.1, letterContemplatingWaitTime: 360,
            balloonSpawnTime: 20, balloonBaseInflateTime: 10, balloonAddedInflateTime: 10,
            balloonBaseSize: 20, balloonAddedSize: 20, balloonBaseVel: .4, balloonAddedVel: .4,
            balloonBaseRadian: -( Math.PI / 2 - .5 ), balloonAddedRadian: -1,
        },
        calc = { totalWidth: opts.charSpacing * Math.max( opts.strings[0].length, opts.strings[1].length ) },
        Tau = Math.PI * 2, TauQuarter = Tau / 4, letters = [];

    ctx.font = opts.charSize + 'px Verdana';

    function Letter( char, x, y ){
        this.char = char; this.x = x; this.y = y;
        this.dx = -ctx.measureText( char ).width / 2; this.dy = +opts.charSize / 2;
        this.fireworkDy = this.y - hh;
        var hue = x / calc.totalWidth * 360;
        this.color = 'hsl(hue,80%,50%)'.replace( 'hue', hue );
        this.lightAlphaColor = 'hsla(hue,80%,light%,alp)'.replace( 'hue', hue );
        this.lightColor = 'hsl(hue,80%,light%)'.replace( 'hue', hue );
        this.alphaColor = 'hsla(hue,80%,50%,alp)'.replace( 'hue', hue );
        this.reset();
    }
    
    Letter.prototype.reset = function(){
        this.phase = 'firework'; this.tick = 0; this.spawned = false;
        this.spawningTime = opts.fireworkSpawnTime * Math.random() |0;
        this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() |0;
        this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
        this.prevPoints = [ [ 0, hh, 0 ] ];
    }
    
    Letter.prototype.step = function(){
        if( this.phase === 'firework' ){
            if( !this.spawned ){
                ++this.tick;
                if( this.tick >= this.spawningTime ){ this.tick = 0; this.spawned = true; }
            } else {
                ++this.tick;
                var linearProportion = this.tick / this.reachTime,
                    armonicProportion = Math.sin( linearProportion * TauQuarter ),
                    x = linearProportion * this.x, y = hh + armonicProportion * this.fireworkDy;
                
                if( this.prevPoints.length > opts.fireworkPrevPoints ) this.prevPoints.shift();
                this.prevPoints.push( [ x, y, linearProportion * this.lineWidth ] );
                
                var lineWidthProportion = 1 / ( this.prevPoints.length - 1 );
                
                for( var i = 1; i < this.prevPoints.length; ++i ){
                    var point = this.prevPoints[ i ], point2 = this.prevPoints[ i - 1 ];
                    ctx.strokeStyle = this.alphaColor.replace( 'alp', i / this.prevPoints.length );
                    ctx.lineWidth = point[ 2 ] * lineWidthProportion * i;
                    ctx.beginPath(); ctx.moveTo( point[ 0 ], point[ 1 ] ); ctx.lineTo( point2[ 0 ], point2[ 1 ] ); ctx.stroke();
                }
                
                if( this.tick >= this.reachTime ){
                    this.phase = 'contemplate';
                    this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                    this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() |0;
                    this.circleCreating = true; this.circleFading = false;
                    this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() |0;
                    this.tick = 0; this.tick2 = 0; this.shards = [];
                    
                    var shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() |0,
                        angle = Tau / shardCount, cos = Math.cos( angle ), sin = Math.sin( angle ), x = 1, y = 0;
                    
                    for( var i = 0; i < shardCount; ++i ){
                        var x1 = x; x = x * cos - y * sin; y = y * cos + x1 * sin;
                        this.shards.push( new Shard( this.x, this.y, x, y, this.alphaColor ) );
                    }
                }
            }
        } else if( this.phase === 'contemplate' ){
            ++this.tick;
            if( this.circleCreating ){
                ++this.tick2;
                var proportion = this.tick2 / this.circleCompleteTime,
                    armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;
                ctx.beginPath();
                ctx.fillStyle = this.lightAlphaColor.replace( 'light', 50 + 50 * proportion ).replace( 'alp', proportion );
                ctx.beginPath(); ctx.arc( this.x, this.y, armonic * this.circleFinalSize, 0, Tau ); ctx.fill();
                if( this.tick2 > this.circleCompleteTime ){
                    this.tick2 = 0; this.circleCreating = false; this.circleFading = true;
                }
            } else if( this.circleFading ){
                ctx.fillStyle = this.lightColor.replace( 'light', 70 );
                ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
                ++this.tick2;
                var proportion = this.tick2 / this.circleFadeTime,
                    armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;
                ctx.beginPath();
                ctx.fillStyle = this.lightAlphaColor.replace( 'light', 100 ).replace( 'alp', 1 - armonic );
                ctx.arc( this.x, this.y, this.circleFinalSize, 0, Tau ); ctx.fill();
                if( this.tick2 >= this.circleFadeTime ) this.circleFading = false;
            } else {
                ctx.fillStyle = this.lightColor.replace( 'light', 70 );
                ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
            }
            
            for( var i = 0; i < this.shards.length; ++i ){
                this.shards[ i ].step();
                if( !this.shards[ i ].alive ){ this.shards.splice( i, 1 ); --i; }
            }
            
            if( this.tick > opts.letterContemplatingWaitTime ){
                this.phase = 'balloon'; this.tick = 0; this.spawning = true;
                this.spawnTime = opts.balloonSpawnTime * Math.random() |0;
                this.inflating = false;
                this.inflateTime = opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random() |0;
                this.size = opts.balloonBaseSize + opts.balloonAddedSize * Math.random() |0;
                var rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
                    vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
                this.vx = Math.cos( rad ) * vel; this.vy = Math.sin( rad ) * vel;
            }
        } else if( this.phase === 'balloon' ){
            ctx.strokeStyle = this.lightColor.replace( 'light', 80 );
            if( this.spawning ){
                ++this.tick;
                ctx.fillStyle = this.lightColor.replace( 'light', 70 );
                ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
                if( this.tick >= this.spawnTime ){
                    this.tick = 0; this.spawning = false; this.inflating = true;  
                }
            } else if( this.inflating ){
                ++this.tick;
                var proportion = this.tick / this.inflateTime,
                    x = this.cx = this.x, y = this.cy = this.y - this.size * proportion;
                ctx.fillStyle = this.alphaColor.replace( 'alp', proportion );
                ctx.beginPath(); generateBalloonPath( x, y, this.size * proportion ); ctx.fill();
                ctx.beginPath(); ctx.moveTo( x, y ); ctx.lineTo( x, this.y ); ctx.stroke();
                ctx.fillStyle = this.lightColor.replace( 'light', 70 );
                ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
                if( this.tick >= this.inflateTime ){ this.tick = 0; this.inflating = false; }
            } else {
                this.cx += this.vx; this.cy += this.vy += opts.upFlow;
                ctx.fillStyle = this.color;
                ctx.beginPath(); generateBalloonPath( this.cx, this.cy, this.size ); ctx.fill();
                ctx.beginPath(); ctx.moveTo( this.cx, this.cy ); ctx.lineTo( this.cx, this.cy + this.size ); ctx.stroke();
                ctx.fillStyle = this.lightColor.replace( 'light', 70 );
                ctx.fillText( this.char, this.cx + this.dx, this.cy + this.dy + this.size );
                if( this.cy + this.size < -hh || this.cx < -hw || this.cy > hw  ) this.phase = 'done';
            }
        }
    }
    
    function Shard( x, y, vx, vy, color ){
        var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
        this.vx = vx * vel; this.vy = vy * vel; this.x = x; this.y = y;
        this.prevPoints = [ [ x, y ] ]; this.color = color; this.alive = true;
        this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
    }
    
    Shard.prototype.step = function(){
        this.x += this.vx; this.y += this.vy += opts.gravity;
        if( this.prevPoints.length > opts.fireworkShardPrevPoints ) this.prevPoints.shift();
        this.prevPoints.push( [ this.x, this.y ] );
        var lineWidthProportion = this.size / this.prevPoints.length;
        for( var k = 0; k < this.prevPoints.length - 1; ++k ){
            var point = this.prevPoints[ k ], point2 = this.prevPoints[ k + 1 ];
            ctx.strokeStyle = this.color.replace( 'alp', k / this.prevPoints.length );
            ctx.lineWidth = k * lineWidthProportion;
            ctx.beginPath(); ctx.moveTo( point[ 0 ], point[ 1 ] ); ctx.lineTo( point2[ 0 ], point2[ 1 ] ); ctx.stroke();
        }
        if( this.prevPoints[ 0 ][ 1 ] > hh ) this.alive = false;
    }
    
    function generateBalloonPath( x, y, size ){
        ctx.moveTo( x, y );
        ctx.bezierCurveTo( x - size / 2, y - size / 2, x - size / 4, y - size, x, y - size );
        ctx.bezierCurveTo( x + size / 4, y - size, x + size / 2, y - size / 2, x, y );
    }

    function anim(){
        window.requestAnimationFrame( anim );
        ctx.fillStyle = 'rgba(17, 17, 17, 0.2)'; 
        ctx.fillRect( 0, 0, w, h );
        ctx.translate( hw, hh );
        var done = true;
        for( var l = 0; l < letters.length; ++l ){
            letters[ l ].step();
            if( letters[ l ].phase !== 'done' ) done = false;
        }
        ctx.translate( -hw, -hh );
        if( done ) for( var l = 0; l < letters.length; ++l ) letters[ l ].reset();
    }

    for( var i = 0; i < opts.strings.length; ++i ){
        for( var j = 0; j < opts.strings[ i ].length; ++j ){
            letters.push( new Letter( opts.strings[ i ][ j ], 
                j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[ i ].length * opts.charSize / 2,
                i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2 ) );
        }
    }

    anim();

    window.addEventListener( 'resize', function(){
        w = c.width = window.innerWidth; h = c.height = window.innerHeight;
        hw = w / 2; hh = h / 2; opts.charSize = w < 600 ? 20 : 30;
        ctx.font = opts.charSize + 'px Verdana';
    });
}

// --- Falling Text Animation ("You are special to me") ---
let fallingTextLayer;

function startFallingTextAnimation() {
    if (!fallingTextLayer) {
        fallingTextLayer = document.createElement('div');
        fallingTextLayer.id = 'falling-text-layer';
        greetingSection.appendChild(fallingTextLayer);
    }

    // Clear any previous words
    fallingTextLayer.innerHTML = '';

    const words = ['You', 'are', 'special', 'to', 'me'];

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'falling-word';
        span.textContent = word;

        // Randomize horizontal position a bit
        const x = 10 + Math.random() * 80; // between 10% and 90%
        span.style.left = `${x}%`;

        // Stagger word timing
        span.style.animationDelay = `${index * 0.9}s`;

        fallingTextLayer.appendChild(span);
    });
}