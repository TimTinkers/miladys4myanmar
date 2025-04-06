import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/+esm';

// Connect to our RPC and query the donation contract for details.
const deployedBlock = 22212308;
const provider = new ethers.providers.JsonRpcProvider(
  'https://purple-winter-sky.quiknode.pro/'
);
const charityAddress = '0x00000000006b5895b591bd867a7b3d44e101c17a';

const charityABI = [{"type":"constructor","inputs":[{"name":"_owner","type":"address","internalType":"address"},{"name":"_recipient","type":"address","internalType":"address"},{"name":"_prize","type":"address","internalType":"address"},{"name":"_donorPrize","type":"uint256","internalType":"uint256"},{"name":"_rafflePrize","type":"uint256","internalType":"uint256"},{"name":"_start","type":"uint256","internalType":"uint256"},{"name":"_end","type":"uint256","internalType":"uint256"},{"name":"_increment","type":"uint256","internalType":"uint256"},{"name":"_threshold","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"DONOR_PRIZE","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"INCREMENT","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"PRIZE","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"RAFFLE_PRIZE","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"RECIPIENT","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"START","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"THRESHOLD","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"cancelOwnershipHandover","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"commit","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"committedBlock","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"completeOwnershipHandover","inputs":[{"name":"pendingOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"donate","inputs":[{"name":"_message","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"donations","inputs":[{"name":"donor","type":"address","internalType":"address"}],"outputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"donors","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"end","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"forceEther","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"highestDonation","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"highestDonor","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"result","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"ownershipHandoverExpiresAt","inputs":[{"name":"pendingOwner","type":"address","internalType":"address"}],"outputs":[{"name":"result","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"requestOwnershipHandover","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"settle","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"totalDonations","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"transferToken","inputs":[{"name":"_token","type":"address","internalType":"address"},{"name":"_to","type":"address","internalType":"address"},{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"event","name":"Donation","inputs":[{"name":"donor","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"message","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"OwnershipHandoverCanceled","inputs":[{"name":"pendingOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"OwnershipHandoverRequested","inputs":[{"name":"pendingOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"oldOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"Settled","inputs":[{"name":"highestDonor","type":"address","indexed":true,"internalType":"address"},{"name":"raffleWinner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"error","name":"AlreadyInitialized","inputs":[]},{"type":"error","name":"NewOwnerIsZeroAddress","inputs":[]},{"type":"error","name":"NoHandoverRequest","inputs":[]},{"type":"error","name":"Reentrancy","inputs":[]},{"type":"error","name":"TooEarly","inputs":[]},{"type":"error","name":"TooLate","inputs":[]},{"type":"error","name":"TooSmall","inputs":[]},{"type":"error","name":"Unauthorized","inputs":[]}];
const charity = new ethers.Contract(charityAddress, charityABI, provider);

// Get the drive starting and ending times.
let startTime = await charity.START();
let endTime = await charity.end();

// Set the countdown dates.
const countdownDate = new Date(startTime.toNumber() * 1000).getTime();
let auctionEndDate = new Date(endTime.toNumber() * 1000).getTime();

// Retrieve DOM elements.
const donationForm = document.getElementById('donations-section');
const donationBorder = document.getElementById('donations-border');
const donationRunning = document.getElementById('running-card');
const donationEnded = document.getElementById('ended-card');
const messagesForm = document.getElementById('messages-section');
const messagesBorder = document.getElementById('messages-border');
const countdownStatus = document.getElementById('countdown-status');
const auctionStatus = document.getElementById('auction-status');
const donateButton = document.getElementById('donate-button');
const amount = document.getElementById('amount');
const message = document.getElementById('message');
const messagesContainer = document.getElementById('messages-container');
const leaderboardBody = document.getElementById('leaderboard-body');

// Add a character counter for the message field.
const messageField = document.getElementById('message');
const charCount = document.getElementById('char-count');
if (messageField && charCount) {
    messageField.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

// Add functionality to the donation button.
donateButton.addEventListener('click', async function () {
  let donateAmount = amount.value;
  let donateMessage = message.value;
  console.log(donateAmount, donateMessage);
  let donation = ethers.utils.parseEther(donateAmount);
  
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const writeCharity = new ethers.Contract(charityAddress, charityABI, signer);
  await writeCharity.donate(donateMessage, { value: donation });
});

// Retrieve donor information for messages and leaderboard.
const updateDonors = async function () {
  const events = await charity.queryFilter('Donation', deployedBlock, 'latest');
  events.reverse();
  let messagesContent = '';
  let donorTotals = { };
  for (let i = 0; i < events.length; ++i) {
    let donationEvent = events[i];
    const { donor, amount, message } = donationEvent.args;
    let donorDisplay = donor;
    try {
      const name = await provider.lookupAddress(donor);
      if (name) {
        donorDisplay = name;
      }
    } catch (_) {};

    // Track donor totals.
    if (donorTotals.hasOwnProperty(donorDisplay)) {
      donorTotals[donorDisplay] = donorTotals[donorDisplay].add(amount);
    } else {
      donorTotals[donorDisplay] = amount;
    }

    // Append messages.
    messagesContent += `
    <div class="message-item">
      <div class="message-header">
        <div class="message-address">${donorDisplay}</div>
        <div class="message-amount">${ethers.utils.formatEther(amount)} ETH</div>
      </div>
      <p>${message}</p>
    </div>`;
  }
  messagesContainer.innerHTML = messagesContent;

  // Update donor leaderboard.
  let leaderboardContent = '';
  const entries = Object.entries(donorTotals);
  entries.sort((a, b) => {
    if (b[1].gt(a[1])) return 1;
    if (b[1].lt(a[1])) return -1;
    return 0;
  });

  // Force highest donor to top.
  let rank = 1;
  let highestDonor = await charity.highestDonor();
  try {
    const name = await provider.lookupAddress(highestDonor);
    if (name) {
      highestDonor = name;
    }
  } catch (_) {};
  leaderboardContent += `
  <tr>
    <td class="leaderboard-cell">${rank}</td>
    <td class="leaderboard-cell">${highestDonor}</td>
    <td class="leaderboard-cell-right">${ethers.utils.formatEther(donorTotals[highestDonor])} ETH</td>
  </tr>
  `;
  rank += 1;

  for (const [key, value] of entries) {
    if (key != highestDonor) {
      leaderboardContent += `
      <tr>
        <td class="leaderboard-cell">${rank}</td>
        <td class="leaderboard-cell">${key}</td>
        <td class="leaderboard-cell-right">${ethers.utils.formatEther(value)} ETH</td>
      </tr>
      `;
      rank += 1;
    }
  }
  leaderboardBody.innerHTML = leaderboardContent;
};
updateDonors();

// Update some important donation details that might change with each block.
const update = async function () {
  endTime = await charity.end();
  auctionEndDate = new Date(endTime.toNumber() * 1000).getTime();
  await updateDonors();
};
setInterval(update, 12000);

// Initialize the page and update every second.
const paint = function () {
    // Get current date and time
    const now = new Date().getTime();
    
    // Find the time remaining
    let distance, phaseText;
   
    // Before auction.
    if (now < countdownDate) {
        distance = countdownDate - now;
        phaseText = 'Donation drive begins in:';
        auctionStatus.innerText = 'Drive opens Sunday, April 6th at 5:00pm Eastern Time (UTC -4).';
        donationForm.style.display = 'none';
        donationBorder.style.display = 'none';
        messagesForm.style.display = 'none';
        messagesBorder.style.display = 'none';

    // During auction.
    } else if (now < auctionEndDate) {
        distance = auctionEndDate - now;
        phaseText = 'Donation drive ends in:';
        auctionStatus.innerText = 'Drive closes Sunday, April 13th at 5:00pm Eastern Time (UTC - 4).';
        donationRunning.style.display = 'visible';
        donationEnded.style.display = 'none';
        donationForm.style.display = 'block';
        donationBorder.style.display = 'visible';
        messagesForm.style.display = 'block';
        messagesBorder.style.display = 'visible';

    // After auction.
    } else {
        // clearInterval(countdownTimer);
        countdownStatus.innerText = "Donation drive ended";
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        auctionStatus.innerText = "The donation drive has ended. Thank you for your support!";
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
