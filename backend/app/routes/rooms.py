from flask import Blueprint, request, jsonify
from ..models import Room
from ..extensions import db

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/<int:hotel_id>', methods = ['GET'])
def get_rooms(hotel_id):
    rooms = Room.query.filter_by(hotel_id = hotel_id).all()
    return jsonify([room.to_dict() for room in rooms])
@rooms_bp.route('/<int:hotel_id>', methods=['POST'])
def create_room(hotel_id):
    data = request.get_json()
    
    # Walidacja danych wejściowych
    if not data or 'room_number' not in data or 'total_beds' not in data:
        return jsonify({'error': 'Wymagane pola: room_number i total_beds'}), 400

    try:
        new_room = Room(
            room_number=data['room_number'],
            total_beds=data['total_beds'],
            available_beds=data['total_beds'], 
            hotel_id=hotel_id
        )
        db.session.add(new_room)
        db.session.commit()
        return jsonify(new_room.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@rooms_bp.route('/<int:hotel_id>/<int:room_id>', methods = ['PUT'])
def update_room(hotel_id, room_id):
    data = request.get_json()
    room = Room.query.filter_by(id = room_id, hotel_id = hotel_id).first()

    if not room:
        return jsonify({'error': 'Room not found'}), 404

    room.room_number = data['room_number']
    room.total_beds = data['total_beds']
    room.available_beds = data['available_beds']

    db.session.commit()

    return jsonify(room.to_dict()), 200
@rooms_bp.route('/<int:hotel_id>/<int:room_id>', methods = ['DELETE'])
def delete_room(hotel_id, room_id):
    room = Room.query.filter_by(id = room_id, hotel_id = hotel_id).first()

    if not room:
        return jsonify({'error': 'Room not found'}), 404

    db.session.delete(room)
    db.session.commit()

    return jsonify({'message': 'Room deleted successfully'}), 200
@rooms_bp.route('/<int:hotel_id>/<int:room_id>', methods = ['PATCH'])
def patch_room(hotel_id, room_id):
    data = request.get_json()
    room = Room.query.filter_by(id = room_id, hotel_id = hotel_id).first()

    if not room:
        return jsonify({'error': 'Room not found'}), 404

    if 'room_number' in data:
        room.room_number = data['room_number']
    if 'total_beds' in data:
        room.total_beds = data['total_beds']
    if 'available_beds' in data:
        room.available_beds = data['available_beds']

    db.session.commit()

    return jsonify(room.to_dict()), 200