# app.py

from flask import Flask, render_template, request, jsonify
from supabase import create_client, Client
import os
import requests # Supabase SDK 사용 시 'requests' 라이브러리가 필요합니다.

# =================================================================
# 🔑 Supabase 클라이언트 초기화 설정
# ⚠️ 주의: [YOUR_SUPABASE_URL]과 [YOUR_SERVICE_ROLE_KEY]를 실제 값으로 교체하세요!
#          Service Role Key는 절대 외부에 노출되어서는 안 됩니다.
# =================================================================
SUPABASE_URL = "YOUR_SUPABASE_URL"      # 실제 Project URL로 교체
SUPABASE_KEY = "YOUR_SERVICE_ROLE_KEY"  # 실제 Service Role Key로 교체

try:
    # Supabase 클라이언트 생성
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Supabase 클라이언트 초기화 오류: {e}")
    supabase = None # 초기화 실패 시 None으로 설정

# Flask 애플리케이션 객체를 생성합니다.
app = Flask(__name__)


# =================================================================
# 🌐 웹 페이지 라우팅 (HTML 파일 렌더링)
# =================================================================

@app.route('/')
def index():
    # 'templates/index.html'을 렌더링합니다.
    return render_template('main.html')

@app.route('/login')
def login_page():
    # 'templates/login.html'을 렌더링합니다.
    return render_template('login.html')

@app.route('/signup')
def signup_page():
    # 'templates/signup.html'을 렌더링합니다.
    return render_template('signup.html')


# =================================================================
# ⚙️ API 엔드포인트: 회원가입 처리 로직
# =================================================================

@app.route('/api/signup', methods=['POST'])
def handle_signup():
    if supabase is None:
        return jsonify({"error": "Supabase 서버 연결 실패"}), 500
        
    # 클라이언트(프론트엔드)에서 전송된 폼 데이터를 받습니다.
    email = request.form.get('email')
    password = request.form.get('password')
    username = request.form.get('username') 

    if not email or not password or not username:
        return jsonify({"error": "이메일, 비밀번호, 닉네임을 모두 입력해주세요."}), 400

    try:
        # 1. Supabase 인증 시스템에 회원가입 요청
        response = supabase.auth.sign_up(
            {
                "email": email, 
                "password": password
            },
            # 2. DB 트리거가 profiles 테이블에 자동 저장할 데이터를 전달
            data={"username": username} 
        )
        
        # 회원가입 성공 처리 (일반적으로 이메일 확인이 필요할 수 있습니다.)
        if response.user:
             # 성공적으로 auth.users에 저장되었고, 트리거가 profiles 테이블에도 데이터를 넣었음.
             return jsonify({"message": "회원가입 성공! 이메일을 확인해주세요."}), 200
        else:
             # API 호출은 성공했으나, Supabase 내부에서 에러(예: 이메일 중복) 발생
             # Supabase Auth API 응답 구조에 따라 에러 처리 로직을 더 정교하게 만들 수 있습니다.
             return jsonify({"error": "회원가입 처리 중 문제가 발생했습니다. (이메일 중복 확인)"}), 400


    # requests 라이브러리 에러 등 네트워크/서버 통신 오류
    except requests.exceptions.HTTPError as http_err:
        # Supabase에서 구체적인 에러 메시지(예: 비밀번호 규칙 위반)가 응답될 경우 처리
        error_json = http_err.response.json()
        error_msg = error_json.get("error_description", http_err.response.text)
        return jsonify({"error": f"인증 서버 오류: {error_msg}"}), 400

    except Exception as e:
        # 기타 예상치 못한 서버 오류
        return jsonify({"error": f"서버 오류 발생: {e}"}), 500


# =================================================================
# ⚙️ API 엔드포인트: 로그인 처리 로직
# =================================================================

@app.route('/api/login', methods=['POST'])
def handle_login():
    if supabase is None:
        return jsonify({"error": "Supabase 서버 연결 실패"}), 500
        
    email = request.form.get('email')
    password = request.form.get('password')

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email, 
            "password": password
        })

        if response.session:
            # 로그인 성공 시, JWT 토큰을 반환 (프론트엔드가 이를 저장하여 인증된 요청에 사용)
            return jsonify({
                "message": "로그인 성공!", 
                "access_token": response.session.access_token
            }), 200
        else:
            # Supabase API 호출은 성공했으나 로그인 실패 (잘못된 자격 증명)
            return jsonify({"error": "이메일 또는 비밀번호가 올바르지 않습니다."}), 401

    except requests.exceptions.HTTPError:
        # 인증 서버에서 400/401 에러를 보냈을 경우
        return jsonify({"error": "이메일 또는 비밀번호가 올바르지 않습니다."}), 401

    except Exception as e:
        return jsonify({"error": f"서버 오류 발생: {e}"}), 500


# =================================================================
# 🚀 Flask 서버 실행
# =================================================================
if __name__ == '__main__':
    # debug=True: 코드를 수정하면 서버가 자동으로 재시작됩니다.
    app.run(debug=True)