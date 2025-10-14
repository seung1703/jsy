document.addEventListener('DOMContentLoaded', () => {

    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    // =======================================================
    // 1. 회원가입 폼 처리 (Flask /api/signup 호출)
    // =======================================================
    if (signupForm) {
        // 비동기 함수로 변경 (await 사용을 위해)
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            // 폼 데이터 수집
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const birthdate = document.getElementById('birthdate').value; // 현재는 Flask에서 처리하지 않음
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // 유효성 검사 (기존 로직 유지)
            if (password.length < 8) {
                alert('비밀번호는 8자 이상으로 설정해주세요.');
                return;
            }
            if (password !== confirmPassword) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            if (!birthdate) {
                alert('생년월일을 입력해주세요.');
                return;
            }
            
            // Flask로 전송할 FormData 객체 생성
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('username', name); // 'name' 필드를 DB의 'username'으로 사용
            // formData.append('birthdate', birthdate); // 필요시 추가 (Flask에서도 처리 필요)

            try {
                // Flask 백엔드의 회원가입 API 엔드포인트로 POST 요청
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    body: formData // FormData 객체를 본문으로 전송
                });

                const result = await response.json(); // Flask에서 보낸 JSON 응답을 받음

                if (response.ok) {
                    // Flask 서버에서 200 OK 응답을 받은 경우
                    alert(result.message || '회원가입 성공! 이메일을 확인해주세요.');
                    
                    // 성공 후 Flask 라우트를 경유하여 로그인 페이지로 이동
                    window.location.href = '/login'; 
                    
                } else {
                    // Flask 서버에서 오류 응답 (400, 500 등)을 받은 경우
                    alert(`회원가입 실패: ${result.error || '알 수 없는 오류가 발생했습니다.'}`);
                }

            } catch (error) {
                console.error('API 통신 오류:', error);
                alert('서버와의 통신에 실패했습니다. 네트워크 상태를 확인하세요.');
            }
        });
    }

    // =======================================================
    // 2. 로그인 폼 처리 (Flask /api/login 호출)
    // =======================================================
    if (loginForm) {
        // 비동기 함수로 변경
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 간단한 유효성 검사
            if (!email || !password) {
                alert('이메일과 비밀번호를 모두 입력해주세요.');
                return;
            }

            // Flask로 전송할 FormData 객체 생성
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            try {
                // Flask 백엔드의 로그인 API 엔드포인트로 POST 요청
                const response = await fetch('/api/login', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    // 로그인 성공
                    alert(result.message || '로그인에 성공했습니다!');
                    
                    // ⚠️ 중요: 실제 서비스에서는 result.access_token을 클라이언트에 안전하게 저장해야 합니다. (예: localStorage)
                    // 지금은 메인 페이지로 이동합니다. (Flask 라우트 '/'로 이동)
                    window.location.href = '/'; 

                } else {
                    // 로그인 실패
                    alert(`로그인 실패: ${result.error || '알 수 없는 오류'}`);
                }

            } catch (error) {
                console.error('API 통신 오류:', error);
                alert('서버와 통신하는 중 오류가 발생했습니다.');
            }
        });
    }
});