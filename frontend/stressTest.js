import axios from "axios";

const TOTAL_REQUESTS = 200; // 200 buyers for 100 items(testing)
const URL = "http://localhost:8080/flashsale/buy?userId=1&productId=1"; 

async function runStressTest() {
    console.log("Starting stress test: {TOTAL_REQUESTS} concurrent requests!");

    const requests = [];
    for(let i = 0; i < TOTAL_REQUESTS; i++) {
        // pust request without awaiting so they all fire at once
        requests.push(axios.post(URL));
    }

    console.log("Launching requests");

    const results = await Promise.allSettled(requests);

    let successCount = 0;
    let failCount = 0;

    results.forEach(result => {
        if(result.status == 'fulfilled') {
            if(result.value.data.includes("Success")) {
                successCount++;
            } else {
                failCount++;
            }
        } else {
            failCount++;
        }
    });

    console.log("Final Results: ");
    console.log("Successful Orders: ", successCount);
    console.log("Failed Orders: ", failCount);

    if(successCount > 100) {
        console.log("Critical Failure: You oversold, stock was 100 but you sold{successsCount}");
    } else if(successCount == 100) {
        console.log("Success: You have successfully sold 100 products to 100 customers in stress testing");
    } else {
        console.log("Error: You sold less than 100 products!");
    }
}

runStressTest();