from flask import Flask, send_file, request

app = Flask(__name__)

@app.route("/generate", methods=["GET"])
def send_image():
    #filename = request.args.get("filename", "default.jpg")
    try:
        file_path = "output/ComfyUI_00016_.png"
        return send_file(file_path, mimetype="image/png")
    except Exception as e:
        return str(e), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=6969)

