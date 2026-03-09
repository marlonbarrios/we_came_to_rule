let video;
let playing = false;
let videoStarted = false;
let scrollX;
let textHeight;
let videoDuration;

// Ticker text
let poem = "Voice of Sydney Sweeney from the American Eagle ad campaign. — Image of Sir Francis Galton (1822–1911), the originator of eugenics during the Victorian era.";

// Invisible hotspot in center of video (opens link on click)
const HOTSPOT_RADIUS = 80;
const GALTON_URL = "https://en.wikipedia.org/wiki/Francis_Galton";

function preload() {
    video = createVideo('all.mp4', videoLoaded);
}

function videoLoaded() {
    video.pause();
    videoDuration = video.duration();
    scrollX = width;
    videoStarted = true;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    video.hide();
    video.pause();
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

    // Draw ticker text
    push();
    
    // Black background strip for text
    noStroke();
    fill(0, 0, 0, 200);
    rect(0, textHeight - 25, width, 50);
    
    // Add subtle gradient edges
    for (let i = 0; i < 10; i++) {
        let alpha = map(i, 0, 10, 100, 0);
        fill(0, 0, 0, alpha);
        rect(0, textHeight - 25 - i, width, 1);
        rect(0, textHeight + 24 + i, width, 1);
    }
    
    // Draw text only if video has started
    if (videoStarted && videoDuration) {
        fill(255);
        let textW = textWidth(poem);
        let totalScrollWidth = width + textW;
        
        // Calculate position based on video time (20% faster than previous)
        let progress = (video.time() / videoDuration) * 3.6 / 5;
        scrollX = width - (totalScrollWidth * progress);
        
        // Draw text
        text(poem, scrollX, textHeight);
        
        // Draw second copy for smooth loop
        if (scrollX < width/2) {
            text(poem, scrollX + totalScrollWidth, textHeight);
        }
    }
    
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    textHeight = height * 0.93;
}

function keyPressed() {
    if (keyCode === 32) { // spacebar — play/pause
        if (playing) {
            video.pause();
            playing = false;
        } else {
            video.play();
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
        window.open(GALTON_URL, "_blank");
    }
}
