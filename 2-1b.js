//  ¹ö±â±â
function goBack() {
    window.location.href = '2-1.html';
}

// 2-1A.js ³ë¸® ³»¿ë
document.addEventListener('DOMContentLoaded', function() {
    // URL¿¡¼ location ID °¡¿À±â
    const urlParams = new URLSearchParams(window.location.search);
    const locationId = urlParams.get('id');
    
    if (locationId) {
        loadMission(locationId);
    }
    
    // ÀÌºüÆ® ¸®½Ì³Ê ¼³Á¤
    setupEventListeners();
});

// ÀÌºüÆ® ¸®½Ì³Ê ¼³Á¤
function setupEventListeners() {
    const backBtn = document.getElementById('backBtn');
    const okBtn = document.getElementById('okBtn');
    const answerInput = document.getElementById('answerInput');
    
    // ¹ö±â±â ¹öÆ°
    backBtn.addEventListener('click', goBack);
    
    // ¿©ÄªÀÌ ¹öÆ°
    okBtn.addEventListener('click', submitAnswer);
    
    // Å°¸®ÁöÁý
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
}

// ¹Ì¼Ç Á¤º¸ ·Îµå
function loadMission(locationId) {
    // skip API call (CORS error) and use default mission data
    const defaultMissionData = {
        id: locationId,
        mission_type: 'quiz',
        mission_content: '',
        treasure_count: 0
    };
    displayMission(defaultMissionData);
}

// ¹Ì¼Ç ³»¿ë Ç¥½Ã
function displayMission(missionData) {
    const missionContent = document.getElementById('missionContent');
    missionContent.textContent = missionData.mission_content;
    
    // ¹Ì¼Ç ÄÆ½Ä ¹è°æ ÀÌ¹ÌÁö ¼³Á¤
    const missionCard = document.querySelector('.mission-card');
    if (missionCard) {
        // Àåº°º° ¹è°æ ÀÌ¹ÌÁö ¸ÊÆù
        const backgroundImageMap = {
            1: './img/mission-bg-1.png',   // µµ¼­°ü
            2: './img/mission-bg-2.png',   // ÇÐ»ýÈ°ü
            3: './img/mission-bg-3.png',   // º¹°ü
            4: './img/mission-bg-4.png',   // ¾Æ¸¶¶ó½º°ü
            5: './img/mission-bg-5.png',   // Á¤¹Ø
            6: './img/mission-bg-6.png',   // ¹Ì·çÈ²¸°ü
            7: './img/mission-bg-7.png',   // ÀÎ¹®»çÈ°ü°ü
            8: './img/mission-bg-8.png',   // SW ¿¬ÇÕ´ëÇÐ
            9: './img/mission-bg-9.png',   // ¾ç±¸Àå
            10: './img/mission-bg-10.png'  // Áß¾Óµ¿µÀå
        };
        
        const backgroundImage = backgroundImageMap[missionData.id] || './img/library.png';
        missionCard.style.backgroundImage = `url('${backgroundImage}')`;
    }
    
    // ¹Ì¼Ç µ¥ÀÌÅÍ ÀúÀå (Á¦Ãâ ½Ã »ç¿ë)
    window.missionData = missionData;
}

// ´äºñ Á¦Ãâ
function submitAnswer() {
    const answerInput = document.getElementById('answerInput');
    const answer = answerInput.value.trim();
    
    if (!answer) {
        showMessage('Á¤´äÀ» ÀÔ·ÂÇØÁÖ¼¼¿ä.');
        return;
    }
    
    // »ç¿ëÀÚ Á¤º¸ ¼öÁ· (ÀÌÀü ÆäÀÌÁö¿¡¼ ÀúÀåµÈ Á¤º¸ °¡Á¤)
    let userInfo = getUserInfo();
    
    // »ç¿ëÀÚ Á¤º¸°¡ ¾ø´Â °æ¿ì ±âº°°ª ¼³Á¤
    if (!userInfo.name || !userInfo.studentId || !userInfo.department) {
        userInfo = {
            name: 'User',
            studentId: '00000000',
            department: 'Department'
        };
    }
    
    // Á¦Ãâ µ¥ÀÌÅÍ ±¸¼º
    const submitData = {
        locationId: window.location.search.split('id=')[1],
        answer: answer,
        userInfo: userInfo
    };
    
    // ·ÎÄÃ ½ºÅ¸¸®¿¡ ÀúÀå (·Îµù ÆäÀÌÁö¿¡¼ »ç¿ë)
    localStorage.setItem('missionSubmitData', JSON.stringify(submitData));
    
    // ·Îµù ÆäÀÌÁö·Î ÀÌµ¿
    window.location.href = 'loading.html';
}

// »ç¿ëÀÚ Á¤º¸ °¡¿À±â
function getUserInfo() {
    // ·ÎÄÃ ½ºÅ¸¸®¿¡¼ »ç¿ëÀÚ Á¤º¸ °¡¿À±â
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    }
    
    // ¸¸¾à ÀúÀåµÈ Á¤º¸°¡ ¾ø´Ù¸é ±âº»°ª ¹ÝÈ¯ (½ÇÁ¦·Î´Â ÀÌÀü ÆäÀÌÁö¿¡¼ ÀúÀåÇØ¾ß ÇÔ)
    return {
        name: '',
        studentId: '',
        department: ''
    };
}

// ¸Þ½ÃÁö Ç¥½Ã ÇÔ¼ö
function showMessage(message) {
    // ±âÁ¸ ¸Þ½ÃÁö°¡ ÀÖ´Ù¸é Á¦°Å
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // »õ ¸Þ½ÃÁö »ý¼º
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-popup';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #333;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 2000;
        font-size: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(messageDiv);
    
    // 3ÃÊ ÈÄ ¸Þ½ÃÁö Á¦°Å
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}
