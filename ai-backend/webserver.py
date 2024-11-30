from flask import Flask, send_file, request
from genutils import Generator

STYLE = {
        "still": {
            "ckpt": "liberteRedmond_v10.safetensors",
            "prompt": "best quality, real photo, professional still-life photography, RAW image",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        "anime": {
            "ckpt": "CounterfeitV30_v30.safetensors",
            "prompt": "best quality, simple, girl, headshot",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        "real": {
            "ckpt": "majicmixRealistic_v7.safetensors",
            "prompt": "best quality, real photo, professional photography, RAW image, model posing, adult woman",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        }

gen = Generator(ckpt_name="majicmixRealistic_v7.safetensors")

app = Flask(__name__)

@app.route("/generate", methods=["GET"])
def send_image():
    global gen
    style = request.args.get("style", "anime")
    try:
        gen(**STYLE[style])
        return send_file("images/image.png", mimetype="image/png")
    except Exception as e:
        return str(e), 404

@app.route("/lineart", methods=["GET"])
def send_lineart():
    try:
        return send_file("images/lineart.png", mimetype="image/png")
    except Exception as e:
        return str(e), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=6969)

