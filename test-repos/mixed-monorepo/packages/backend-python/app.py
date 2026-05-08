from flask import Flask, request, jsonify
import os
import pickle

app = Flask(__name__)

DB_PASSWORD = "hardcoded-password-123"  # HACK: move to env var

@app.route('/users', methods=['GET'])
def get_users():
    # TODO: add pagination
    try:
        user_id = request.args.get('id')
        # XXX: SQL injection risk here
        query = f"SELECT * FROM users WHERE id = {user_id}"
        result = db.execute(query)
    except:
        pass
    return jsonify(result)

@app.route('/data', methods=['POST'])
def process_data():
    data = request.get_json()
    # FIXME: validate input
    serialized = pickle.dumps(data)
    return {'status': 'ok'}

if __name__ == '__main__':
    app.run(debug=True)
