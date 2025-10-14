document.addEventListener('DOMContentLoaded', () => {

    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    // 회원가입 폼 처리
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault(); // 폼 기본 제출 동작 방지

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const birthdate = document.getElementById('birthdate').value; // 생년월일 값 가져오기
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // 유효성 검사
            if (!birthdate) {
                alert('생년월일을 입력해주세요.');
                return;
            }

            if (password.length < 8) {
                alert('비밀번호는 8자 이상으로 설정해주세요.');
                return;
            }

            if (password !== confirmPassword) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            
            // 실제로는 여기서 서버로 데이터를 전송합니다.
            console.log('Signup data:', { name, email, birthdate, password }); // birthdate 추가
            
            // 성공 시 알림 및 페이지 이동
            alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
            window.location.href = 'login.html';
        });
    }

    // 로그인 폼 처리
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 간단한 유효성 검사
            if (!email || !password) {
                alert('이메일과 비밀번호를 모두 입력해주세요.');
                return;
            }

            // 실제로는 여기서 서버에 로그인 요청을 보냅니다.
            console.log('Login data:', { email, password });
            
            // 성공 시 알림 및 메인 페이지(가상)로 이동
            alert('로그인에 성공했습니다! 메인 페이지로 이동합니다.');
            // window.location.href = '/dashboard.html'; // 실제 메인 페이지 경로
        });
    }
});