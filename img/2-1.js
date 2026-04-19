// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 카카오 지도 초기화
    initializeKakaoMap();
    
    // 장소 데이터 로드
    loadLocations();
});

// 카카오 지도 초기화
function initializeKakaoMap() {
    try {
        // 카카오 지도 생성
        const container = document.getElementById('kakao-map');
        const options = {
            center: new kakao.maps.LatLng(37.2635727, 127.0286009), // 수원대학교 좌표
            level: 3
        };
        
        const map = new kakao.maps.Map(container, options);
        
        // 지도 로딩 완료 후 placeholder 제거
        const placeholder = container.querySelector('.map-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        console.log('카카오 지도 초기화 완료');
        
    } catch (error) {
        console.error('카카오 지도 초기화 오류:', error);
        showMapError();
    }
}

// 지도 오류 표시
function showMapError() {
    const mapContainer = document.getElementById('kakao-map');
    mapContainer.innerHTML = `
        <div class="error">
            지도를 불러오는 중 오류가 발생했습니다.<br>
            잠시 후 다시 시도해주세요.
        </div>
    `;
}

// GET /locations API 호출
async function loadLocations() {
    try {
        // API 엔드포인트
        const apiUrl = 'https://api.example.com/v1/locations';
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('장소 데이터 로드 실패');
        }
        
        const locations = await response.json();
        console.log('로드된 장소 데이터:', locations);
        
        // Update static cards with API data
        updateStaticCards(locations);
        
    } catch (error) {
        console.error('장소 로드 오류:', error);
        // Keep static cards even if API fails
        console.log('API failed, keeping static cards');
    }
}

// Update static cards with API data
function updateStaticCards(locations) {
    if (!locations || locations.length === 0) {
        console.log('No location data received');
        return;
    }
    
    // Update each static card with matching API data
    locations.forEach(location => {
        const card = document.querySelector(`[data-id="${location.id}"]`);
        if (card) {
            const treasureCountElement = card.querySelector('.treasure-count');
            if (treasureCountElement) {
                // Update treasure count
                treasureCountElement.textContent = `${location.treasure_count || 0}/10`;
                
                // Add red color class if 3 or less
                if (location.treasure_count <= 3) {
                    treasureCountElement.classList.add('low-stock');
                } else {
                    treasureCountElement.classList.remove('low-stock');
                }
            }
        }
    });
}

// 로드 오류 표시
function showLoadError() {
    const locationsGrid = document.getElementById('locationsGrid');
    locationsGrid.innerHTML = `
        <div class="error">
            장소 정보를 불러오는 중 오류가 발생했습니다.<br>
            잠시 후 다시 시도해주세요.
        </div>
    `;
}

// 미션선택 버튼 클릭 처리
function selectMission(locationId) {
    console.log('선택된 장소 ID:', locationId);
    
    // 상세 페이지로 이동 (URL 파라미터로 id 전달)
    window.location.href = `detail.html?id=${locationId}`;
}

// 뒤로가기 버튼 기능
function goBack() {
    // 이전 페이지로 이동
    window.history.back();
    
    // 또는 특정 페이지로 이동하려면:
    // window.location.href = 'landing.html';
}

// 페이지 새로고침 기능
function refreshPage() {
    // 장소 데이터 다시 로드
    loadLocations();
}

// 주기적 데이터 업데이트 (30초마다)
setInterval(refreshPage, 30000);

// 페이지 가시성 변경 감지 (탭 전환 시)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 페이지가 다시 보일 때 데이터 새로고침
        refreshPage();
    }
});

// 네트워크 상태 감지
window.addEventListener('online', function() {
    console.log('네트워크 연결 복구');
    refreshPage();
});

window.addEventListener('offline', function() {
    console.log('네트워크 연결 끊김');
    showNetworkError();
});

// 네트워크 오류 표시
function showNetworkError() {
    const locationsGrid = document.getElementById('locationsGrid');
    locationsGrid.innerHTML = `
        <div class="error">
            네트워크 연결이 끊겼습니다.<br>
            인터넷 연결을 확인해주세요.
        </div>
    `;
}
