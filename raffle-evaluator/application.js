const { ethers } = require('ethers');

function randomBigNumber (min, max) {
  const range = ethers.BigNumber.from(max).sub(min).add(1);
  const randBytes = ethers.BigNumber.from(ethers.utils.randomBytes(32));
  return randBytes.mod(range).add(min);
}

function basisPointsStringToPercent (bpsString) {
  const bps = parseInt(bpsString, 10);
  if (isNaN(bps)) {
    throw new Error(`Invalid basis points string: "${bpsString}"`);
  }
  return (bps / 100).toFixed(2) + '%';
}

async function main () {
  const TRIALS = 1000000; 
  const n = 30;
  const min = ethers.BigNumber.from(1);
  const max = ethers.BigNumber.from("5000000000000000000");

  const numbers = [];
  for (let i = 0; i < n; i++) {
    const rand = randomBigNumber(min, max);
    numbers.push(rand);
  }

  let sum = ethers.BigNumber.from(0);
  numbers.forEach((num, index) => {
    sum = sum.add(num);
  });
  console.log('Sum:', ethers.utils.formatEther(sum.toString()))
  numbers.forEach((num, index) => {
    odds = num.mul(10000).div(sum);
    console.log(`  #${index} : ${basisPointsStringToPercent(odds.toString())} : ${ethers.utils.formatEther(num.toString())} Ether`);
  });

  const results = { };
  for (let trial = 0; trial < TRIALS; ++trial) {
    const randUint256 = ethers.BigNumber.from(ethers.utils.randomBytes(32));
    let randomAccumulator = randUint256.mod(sum);
    for (let i = 0; i < numbers.length; ++i) {
      if (randomAccumulator.lt(numbers[i])) {
        if (results.hasOwnProperty(i)) {
          results[i] += 1;
        } else {
          results[i] = 1;
        }
        break;
      }
      randomAccumulator = randomAccumulator.sub(numbers[i]);
    }
  }

  console.log('Trials:');
  for (let i = 0; i < numbers.length; ++i) {
    let result = results[i];
    console.log(`  #${i} : ${result / TRIALS}`);
  }
}

main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});
