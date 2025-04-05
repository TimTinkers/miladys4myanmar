// Set the countdown dates.
const countdownDate = new Date('April 6, 2025 12:00:00 EDT').getTime();
const auctionEndDate = new Date('April 13, 2025 12:00:00 EDT').getTime();

// Retrieve DOM elements.
const donationForm = document.getElementById('donations-section');
const donationBorder = document.getElementById('donations-border');
const donationRunning = document.getElementById('running-card');
const donationEnded = document.getElementById('ended-card');
const messagesForm = document.getElementById('messages-section');
const messagesBorder = document.getElementById('messages-border');
const countdownStatus = document.getElementById('countdown-status');
const auctionStatus = document.getElementById('auction-status');

// Add a character counter for the message field.
const messageField = document.getElementById('message');
const charCount = document.getElementById('char-count');
if (messageField && charCount) {
    messageField.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

// Initialize the page and update every second.
const paint = function () {
    // Get current date and time
    const now = new Date().getTime();
    
    // Find the time remaining
    let distance, phaseText;
   
    // Before auction.
    if (now < countdownDate) {
        distance = countdownDate - now;
        phaseText = 'Auction begins in:';
        auctionStatus.innerText = 'Auction opens Sunday, April 6th at 12:00pm Eastern Time (UTC -4).';
        donationForm.style.display = 'none';
        donationBorder.style.display = 'none';
        messagesForm.style.display = 'none';
        messagesBorder.style.display = 'none';

    // During auction.
    } else if (now < auctionEndDate) {
        distance = auctionEndDate - now;
        phaseText = 'Auction ends in:';
        auctionStatus.innerText = 'Auction closes Sunday, April 13th at 12:00pm Eastern Time (UTC - 4).';
        donationRunning.style.display = 'visible';
        donationEnded.style.display = 'none';
        donationForm.style.display = 'block';
        donationBorder.style.display = 'visible';
        messagesForm.style.display = 'block';
        messagesBorder.style.display = 'visible';

    // After auction.
    } else {
        // clearInterval(countdownTimer);
        countdownStatus.innerText = "Auction Ended";
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        auctionStatus.innerText = "The auction has ended. Thank you for your support!";
        donationRunning.style.display = 'none';
        donationEnded.style.display = 'visible';
        return;
    }
    
    // Update countdown title.
    countdownStatus.innerText = phaseText;
    
    // Calculate days, hours, minutes and seconds.
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the result.
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
};
paint();
const countdownTimer = setInterval(paint, 1000);
