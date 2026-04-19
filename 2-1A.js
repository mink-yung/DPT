// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // URL에서 location ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const locationId = urlParams.get('id');
    
    if (locationId) {
        loadMission(locationId);
    }
    
    // 이벤트 리스너 설정
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    const backBtn = document.getElementById('backBtn');
    const okBtn = document.getElementById('okBtn');
    const answerInput = document.getElementById('answerInput');
    
    // 뒤로가기 버튼
    backBtn.addEventListener('click', goBack);
    
    // 오케이 버튼
    okBtn.addEventListener('click', submitAnswer);
    
    // 엔터키 제출
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
}

// 미션 정보 로드
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

// 미션 내용 표시
function displayMission(missionData) {
    const missionContent = document.getElementById('missionContent');
    missionContent.textContent = missionData.mission_content;
    
    // 미션 카드 배경 이미지 설정
    const missionCard = document.querySelector('.mission-card');
    if (missionCard) {
        // 장소별 배경 이미지 매핑
        const backgroundImageMap = {
            1: './img/mission-bg-1.png',   // 도서관
            2: './img/mission-bg-2.png',   // 학생회관
            3: './img/mission-bg-3.png',   // 본관
            4: './img/mission-bg-4.png',   // 아마란스관
            5: './img/mission-bg-5.png',   // 정문
            6: './img/mission-bg-6.png',   // 미래혁신관
            7: './img/mission-bg-7.png',   // 인문사회과학관
            8: './img/mission-bg-8.png',   // SW 융합대학
            9: './img/mission-bg-9.png',   // 야구장
            10: './img/mission-bg-10.png'  // 중앙운동장
        };
        
        const backgroundImage = backgroundImageMap[missionData.id] || './img/library.png';
        missionCard.style.backgroundImage = `url('${backgroundImage}')`;
    }
    
    // 미션 데이터 저장 (제출 시 사용)
    window.missionData = missionData;
}

// 답변 제출
function submitAnswer() {
    const answerInput = document.getElementById('answerInput');
    const answer = answerInput.value.trim();
    
    if (!answer) {
        showMessage('정답을 입력해주세요.');
        return;
    }
    
    // 사용자 정보 수집 (이전 페이지에서 저장된 정보 가정)
    let userInfo = getUserInfo();
    
    // 사용자 정보가 없는 경우 기본값 설정
    if (!userInfo.name || !userInfo.studentId || !userInfo.department) {
        userInfo = {
            name: 'User',
            studentId: '00000000',
            department: 'Department'
        };
    }
    
    // 제출 데이터 구성
    const submitData = {
        locationId: window.location.search.split('id=')[1],
        answer: answer,
        userInfo: userInfo
    };
    
    // 로컬 스토리지에 저장 (로딩 페이지에서 사용)
    localStorage.setItem('missionSubmitData', JSON.stringify(submitData));
    
    // 로딩 페이지로 이동
    window.location.href = 'loading.html';
}

// 사용자 정보 가져오기
function getUserInfo() {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    }
    
    // 만약 저장된 정보가 없다면 기본값 반환 (실제로는 이전 페이지에서 저장해야 함)
    return {
        name: '',
        studentId: '',
        department: ''
    };
}

// 뒤로가기
function goBack() {
    window.location.href = '2-1.html';
}

// 메시지 표시 함수
function showMessage(message) {
    // 기존 메시지가 있다면 제거
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
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
    
    // 3초 후 메시지 제거
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// TODO: 만약 photo 타입의 미션이라면 다른 처리를 할 수 있도록 주석으로 남겨둠
/*
function handlePhotoMission(missionData) {
    // 사진 미션 처리 로직
    // 예: 카메라 접근, 사진 촬영, 업로드 등
}
*/
