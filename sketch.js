let video;
let playing = false;
let videoStarted = false;
let scrollX;
let textHeight;
let videoDuration;

// Ticker text — lyrics (Treaty of Valladolid / imperial voice)
let poem = [
    '"We came not to ask, but to rule."',
    "We are the crown, the sword, the flame,",
    "We name the stars, we write the frame.",
    "The world is ours to seize, define—",
    "By birth, by blood, by right divine.",
    "",
    "Gold and souls, we take them both,",
    "In Christ's own name, we swore an oath.",
    "To civilize, to purify,",
    "To raise the cross and watch them die.",
    "",
    "This world is ours, by will, by fate,",
    "We draw the lines, we dominate.",
    "No need for shame, no need for doubt—",
    "Our rule is just, our time is now.",
    "",
    "They are but children, beasts at best,",
    "Born to labor, serve, and rest.",
    "No art, no king, no sacred laws—",
    "Their nature bent to brutish cause.",
    "",
    "We judge, we weigh, we cast the role—",
    "To guide the body, rule the soul.",
    "Let Las Casas weep and plead—",
    "The empire moves, it does not heed.",
    "",
    '"Imperium sine fine…"',
    '("Empire without end…")',
    '"Dominium naturale…"',
    '("Natural dominion…")',
    '"Ex cathedra…"',
    '("From the throne itself…")',
    "Let them kneel before the truth.",
    "",
    "This world is ours, by steel, by word,",
    "By cannon's roar and preacher's herd.",
    "We shape the map, we break the clay—",
    "All bends to Europe's golden day.",
    "",
    "Bow to the center of the world.",
    "Rome. Castile. The holy fire.",
    "We wrote the book.",
    "We own the future."
].join("  ·  ");

// Invisible hotspot in center of video (opens link on click)
const HOTSPOT_RADIUS = 80;
const VALLADOLID_DEBATE_URL = "https://en.wikipedia.org/wiki/Valladolid_debate";

function preload() {
    video = createVideo('all.mov', videoLoaded);
}

function videoLoaded() {
    video.elt.pause();
    videoDuration = video.duration();
    scrollX = width;
    videoStarted = true;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    video.hide();
    video.elt.pause();
    playing = false;
    
    // Initialize text scroll
    textHeight = height * 0.93;
    
    // Set text properties
    textSize(20);
    textFont('Courier');
    textAlign(LEFT, CENTER);
}

function draw() {
    background(0);
    
    // Scale video by window height to keep proportions in relationship to height
    let scale = height / video.height;
    let newWidth = video.width * scale;
    let newHeight = height;
    
    // Center the video horizontally (and vertically; at this scale it fills height)
    let x = (width - newWidth) / 2;
    let y = 0;
    
    // Display video scaled and centered
    image(video, x, y, newWidth, newHeight);
    
    // Update cursor for center hotspot (invisible clickable circle)
    let centerX = width / 2;
    let centerY = height / 2;
    if (dist(mouseX, mouseY, centerX, centerY) <= HOTSPOT_RADIUS) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }

    // Draw ticker text only once; when text has fully scrolled off, show only video
    if (videoStarted && videoDuration) {
        let textW = textWidth(poem);
        let totalScrollWidth = width + textW;
        let progress = (video.time() / videoDuration) * 5.76 / 5;
        scrollX = width - (totalScrollWidth * progress);
        let textStillVisible = scrollX + textW > 0;

        if (textStillVisible) {
            push();
            // Black background strip for text (50% transparent)
            noStroke();
            fill(0, 0, 0, 128);
            rect(0, textHeight - 25, width, 50);
            // Add subtle gradient edges
            for (let i = 0; i < 10; i++) {
                let alpha = map(i, 0, 10, 50, 0);
                fill(0, 0, 0, alpha);
                rect(0, textHeight - 25 - i, width, 1);
                rect(0, textHeight + 24 + i, width, 1);
            }
            fill(255);
            text(poem, scrollX, textHeight);
            pop();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    textHeight = height * 0.93;
}

function keyPressed() {
    if (keyCode === 32) { // spacebar — play/pause
        if (playing) {
            video.elt.pause();
            playing = false;
        } else {
            const p = video.elt.play();
            if (p && typeof p.catch === 'function') p.catch(function() {});
            playing = true;
        }
    }
    if (key === "f" || key === "F") { // F — toggle fullscreen
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

function mousePressed() {
    // Invisible circular hotspot in center of video
    let centerX = width / 2;
    let centerY = height / 2;
    if (dist(mouseX, mouseY, centerX, centerY) <= HOTSPOT_RADIUS) {
        window.open(VALLADOLID_DEBATE_URL, "_blank");
    }
}
