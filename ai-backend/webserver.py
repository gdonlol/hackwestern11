from flask import Flask, send_file, request
from genutils import Generator

gen = Generator()

app = Flask(__name__)

@app.route("/generate", methods=["GET"])
def send_image():
    global gen
    #filename = request.args.get("filename", "default.jpg")
    try:
        gen()
        file_path = "images/image.png"
        return send_file(file_path, mimetype="image/png")
    except Exception as e:
        return str(e), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=6969)

