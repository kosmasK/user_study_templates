from flask import Flask, render_template, request, jsonify
import json
import glob
from natsort import natsorted
import os

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def index():
    # serve the main html document
    return render_template("index.html")

@app.route('/postmethod', methods=['POST'])
def postmethod():
    print("Incoming data... ")
    # Receive post request from client. 
    # Message data in json format
    data = request.get_json()
    print(data)

    # Specify path to save answers 
    answers_path = "./answers"

    # Secify id number for the currently received answer
    json_lst = glob.glob(answers_path+"/*.json")
    sorted_json_lst = natsorted(json_lst)
    f_idx = len(sorted_json_lst)+1
    filename = answers_path+'/'+str(f_idx)+'.json'

    # Save answer
    with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    # Sending response to client
    return jsonify("DONE")


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=1994 ,debug=True)
    # app.run(host='0.0.0.0', port=1994 ,debug=True, ssl_context="adhoc")