from flask import Blueprint, request, jsonify
from ..models import Admin
from ..extensions import db, bcrypt, jwt
from flask_jwt_extended import create_access_token



admins_bp = Blueprint('admins', __name__)

@admins_bp.route('/register', methods=['POST'])
def create_admin():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_admin = Admin(
        username=data['username'],
        password=hashed_password,
        role=data['role']
    )
    db.session.add(new_admin)
    db.session.commit()
    return jsonify(new_admin.to_dict()), 201
@admins_bp.route('/login', methods=['POST'])
def login_admin():
    data = request.get_json()
    admin = Admin.query.filter_by(username=data['username']).first()
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    if not bcrypt.check_password_hash(admin.password, data['password']):
        return jsonify({'error': 'Invalid password'}), 401
    access_token = create_access_token(identity={'username': admin.username, 'role': admin.role})
    return jsonify(token=access_token), 200
