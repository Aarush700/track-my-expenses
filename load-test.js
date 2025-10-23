import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 200, // 10 virtual users
    duration: '120s', // 30 seconds
};

export default function () {
    http.get('https://track-my-expense-staging-ckauc9cxhufzbcc2.australiaeast-01.azurewebsites.net/'); // Your staging URL
    sleep(1); // Pause between requests
};