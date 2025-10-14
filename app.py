from flask import Flask, render_template

# Flask 애플리케이션 객체를 생성합니다.
app = Flask(__name__)

# '/' 경로(메인 페이지)에 접속하면 실행될 함수를 정의합니다.
@app.route('/')
def home():
    # 이 문자열이 웹 브라우저에 표시됩니다.
    return render_template('index.html')

# 이 파일을 직접 실행할 때 서버를 띄우도록 합니다.
if __name__ == '__main__':
    # debug=True: 코드를 수정하면 서버가 자동으로 재시작됩니다.
    app.run(debug=True)