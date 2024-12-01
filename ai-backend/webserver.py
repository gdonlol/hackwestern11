from flask import Flask, send_file, jsonify, request
from genutils import Generator
from evalutils import Scorer
import base64
import os

STYLE = {
        "stillreal": {
            "ckpt": "liberteRedmond_v10.safetensors",
            "prompt": "best quality, real photo, professional still-life photography, RAW image, white background, light mode",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature, imaginary objects, disfigured objects, warped objects",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        "stillanime": {
            "ckpt": "CounterfeitV30_v30.safetensors",
            "prompt": "best quality, real photo, professional still-life photography, RAW image, every day items",
            "negative": "worst quality, NSFW, porn, suggestive image, girl, text, watermark, signature, imaginary objects, disfigured objects, warped objects, sci-fi",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        "bodyanime": {
            "ckpt": "CounterfeitV30_v30.safetensors",
            "prompt": "best quality, simple, girl, posing",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature, hands, feet, sci-fi",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        "faceanime": {
            "ckpt": "CounterfeitV30_v30.safetensors",
            "prompt": "best quality, simple, girl, headshot",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        "bodyreal": {
            "ckpt": "majicmixRealistic_v7.safetensors",
            "prompt": "best quality, real photo, professional photography, RAW image, model posing, adult woman",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature, hands, feet",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        "facereal": {
            "ckpt": "majicmixRealistic_v7.safetensors",
            "prompt": "best quality, real photo, professional photography, RAW image, adult woman, headshot photo",
            "negative": "worst quality, NSFW, porn, suggestive image, text, watermark, signature, hands, feet",
            "sampler": "euler",
            "steps": 20,
            "cfg": 8,
            },
        }

gen = Generator(ckpt_name="majicmixRealistic_v7.safetensors")
scorer = Scorer()

app = Flask(__name__)

@app.route("/generate", methods=["GET"])
def send_image():
    global gen
    style = request.args.get("style", "anime")
    try:
        print(f"Generating {style}...")
        gen(**STYLE[style])
        with open('images/original.png', 'rb') as img1, open('images/lineart.png', 'rb') as img2:
            original_base64 = base64.b64encode(img1.read()).decode('utf-8')
            lineart_base64 = base64.b64encode(img2.read()).decode('utf-8')

        return jsonify({
            'original': original_base64,
            'lineart': lineart_base64
        })

    except Exception as e:
        return str(e), 404

@app.route("/lineart", methods=["GET"])
def send_lineart():
    try:
        return send_file("images/lineart.png", mimetype="image/png")
    except Exception as e:
        return str(e), 404

@app.route("/original", methods=["GET"])
def send_original():
    try:
        return send_file("images/original.png", mimetype="image/png")
    except Exception as e:
        return str(e), 404


@app.route('/score', methods=['POST'])
def score_images():
    data = request.get_json()
    
    lineart_base64 = data.get('lineart')
    drawing_base64 = data.get('drawing')

    if not lineart_base64 or not drawing_base64:
        return {"error": "Both lineart and drawing are required"}, 400

    lineart_data = base64.b64decode(lineart_base64)
    drawing_data = base64.b64decode(drawing_base64)

    with open("compare/lineart.png", 'wb') as f:
        f.write(lineart_data)
    with open("compare/drawing.png", 'wb') as f:
        f.write(drawing_data)

    score, loss = scorer()
    with open('compare/difmap.png', 'rb') as img:
        difmap_base64 = base64.b64encode(img.read()).decode('utf-8')

    return jsonify({
        'score': score,
        'loss': loss,
        'difmap': difmap_base64
    })
    """
    except Exception as e:
        return {"error": str(e)}, 500
    """



if __name__ == "__main__":
    app.run(debug=True, use_reloader=False, host="0.0.0.0", port=6969)

