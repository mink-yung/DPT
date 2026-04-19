// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 카카오 지도 초기화
    initializeKakaoMap();
    
    // 장소 데이터 로드
    loadLocations();
});

// Kakao map initialization
function initializeKakaoMap() {
    try {
        // Create Kakao map
        const container = document.getElementById('kakao-map');
        const options = {
            center: new kakao.maps.LatLng(37.210141, 126.975231), // Suwon University campus center
            level: 3
        };
        
        const map = new kakao.maps.Map(container, options);
        
        // Remove placeholder after map loading
        const placeholder = container.querySelector('.map-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // Add location markers
        addLocationMarkers(map);
        
        console.log('Kakao map initialization complete');
        
    } catch (error) {
        console.error('Kakao map initialization error:', error);
        showMapError();
    }
}

// Add location markers to map
function addLocationMarkers(map) {
    // 수원대학교 실제 건물 위치 좌표 데이터
    const locations = [
        { id: 1, name: '중앙도서관', lat: 37.213233, lng: 126.974955 },
        { id: 2, name: '학생회관', lat: 37.214152, lng: 126.975451 },
        { id: 3, name: '종합관(본관)', lat: 37.211562, lng: 126.976928 },
        { id: 4, name: '아마랜스홀', lat: 37.212354, lng: 126.978931 },
        { id: 5, name: '정문', lat: 37.209841, lng: 126.975131 },
        { id: 6, name: '미래혁신관', lat: 37.210452, lng: 126.977451 },
        { id: 7, name: '인문사회융합대학', lat: 37.212563, lng: 126.975821 },
        { id: 8, name: 'SW융합대학(IT대학)', lat: 37.213652, lng: 126.976851 },
        { id: 9, name: '야구장', lat: 37.215231, lng: 126.972541 },
        { id: 10, name: '대운동장', lat: 37.214852, lng: 126.973851 }
    ];
   // 이후 마커 생성 로직...
    locations.forEach(location => {
        // Create marker position
        const markerPosition = new kakao.maps.LatLng(location.lat, location.lng);
        
        // Create red dot marker image
        const markerImage = new kakao.maps.MarkerImage(
            'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Red dot icon
            new kakao.maps.Size(32, 32), // Icon size
            new kakao.maps.Point(16, 16) // Anchor point (center)
        );
        
        // Create marker with red dot image
        const marker = new kakao.maps.Marker({
            position: markerPosition,
            map: map,
            image: markerImage
        });
        
        // Create info window
        const infoWindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${location.name}</div>`,
            removable: true
        });
        
        // Add click event to marker
        kakao.maps.event.addListener(marker, 'click', function() {
            // Show info window
            infoWindow.open(map, marker);
            
            // Scroll to card section
            scrollToCardSection(location.id);
            
            // Navigate to detail page after a short delay
            setTimeout(() => {
                selectMission(location.id);
            }, 1000);
        });
        
        // Store marker reference for later use
        location.marker = marker;
        location.infoWindow = infoWindow;
    });
    
    console.log('Added red dot markers to Suwon University campus map');
}

// Scroll to card section and highlight specific card
function scrollToCardSection(locationId) {
    // Find the target card
    const targetCard = document.querySelector(`[data-id="${locationId}"]`);
    
    if (targetCard) {
        // Scroll to the treasure status section
        const treasureSection = document.querySelector('.treasure-status-section');
        if (treasureSection) {
            treasureSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Highlight the target card
        targetCard.style.border = '3px solid #00ff00';
        targetCard.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
            targetCard.style.border = '';
            targetCard.style.boxShadow = '';
        }, 2000);
        
        console.log(`Scrolled to card for location ${locationId}`);
    }
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
    
    // 미션 페이지로 이동 (URL 파라미터로 id 전달)
    window.location.href = `2-1A.html?id=${locationId}`;
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
