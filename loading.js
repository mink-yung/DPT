// page load initialization
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    
    // get mission data from local storage
    const missionSubmitData = localStorage.getItem('missionSubmitData');
    if (missionSubmitData) {
        const data = JSON.parse(missionSubmitData);
        console.log('mission data received:', data);
        
        // send data to server and wait for admin approval
        sendToServerAndWait(data);
    } else {
        console.log('no mission data found');
        // if no data, return to previous page after delay
        setTimeout(() => {
            goBack();
        }, 3000);
    }
});

// event listener setup
function setupEventListeners() {
    const closeBtn = document.getElementById('closeBtn');
    
    // close button
    closeBtn.addEventListener('click', goBack);
}

// go back to previous page
function goBack() {
    // clear local storage data
    localStorage.removeItem('missionSubmitData');
    
    // return to previous page (2-1A.html)
    window.location.href = '2-1A.html';
}

// send data to server and wait for admin approval
function sendToServerAndWait(data) {
    // send data to server
    // server will store the submission and wait for admin approval
    // page will stay on loading screen until admin responds
    
    // TODO: implement actual server communication
    // fetch('/api/submit-answer', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // }).then(response => {
    //     // handle server response
    // });
    
    // for now, just stay on loading page
    // admin will need to manually approve/reject via admin panel
    console.log('waiting for admin approval...');
    
    // start polling for admin approval (optional)
    // pollForApproval();
}

// TODO: implement polling for admin approval
/*
function pollForApproval() {
    const pollInterval = setInterval(() => {
        fetch('/api/check-approval')
            .then(response => response.json())
            .then(data => {
                if (data.approved) {
                    clearInterval(pollInterval);
                    window.location.href = 'success.html';
                } else if (data.rejected) {
                    clearInterval(pollInterval);
                    window.location.href = 'failure.html';
                }
            })
            .catch(error => {
                console.error('polling error:', error);
            });
    }, 5000); // poll every 5 seconds
}
*/

// TODO: replace this with actual server validation
/*
async function validateAnswer(data) {
    try {
        const response = await fetch('/api/validate-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            window.location.href = 'success.html';
        } else {
            window.location.href = 'failure.html';
        }
    } catch (error) {
        console.error('validation error:', error);
        // on error, return to previous page
        goBack();
    }
}
*/
