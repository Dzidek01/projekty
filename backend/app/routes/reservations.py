from flask import Blueprint, request, jsonify
from ..models import Reservation, Hotel, User, Room
from ..extensions import db
from datetime import datetime

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('/<int:hotel_id>', methods=['GET'])
def get_reservations(hotel_id):
    try:
        reservations = db.session.query(
            Reservation.id,
            User.first_name,
            User.last_name,
            Room.room_number,
            Reservation.start_date,
            Reservation.end_date,
            Reservation.is_paid,
        ).join(User, Reservation.user_id == User.id).join(Room, Reservation.room_id == Room.id).filter(Reservation.hotel_id == hotel_id).all()
        
        result = [  
            {        
                'id': reservation.id,
                'first_name': reservation.first_name,
                'last_name': reservation.last_name,
                'room_number': reservation.room_number,
                'start_date': reservation.start_date.strftime('%Y-%m-%d'),
                'end_date': reservation.end_date.strftime('%Y-%m-%d'),
                'is_paid': reservation.is_paid,
            }
            for reservation in reservations     
        ]

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reservations_bp.route('/<int:hotel_id>', methods = ['POST'])
def create_reservation(hotel_id):
    data = request.get_json()

    start_date = datetime.strptime(data['start_date'],'%Y-%m-%d')
    end_date = datetime.strptime(data['end_date'],'%Y-%m-%d')

    user = User(
        first_name=data['first_name'],
        last_name=data['last_name']
    )

    room = Room.query.filter_by(room_number = data['room_number'], hotel_id=hotel_id).first()
    if not room:
        return jsonify({'error':'Nie znaleziono pokoju'}), 404
    
    db.session.add(user)
    db.session.flush()
    
    reservation = Reservation(
        user_id=user.id,
        hotel_id=hotel_id,
        room_id=room.id,
        start_date=start_date,
        end_date=end_date,
        is_paid=False
    )

    room.available_beds -= 1
    db.session.add(reservation)
    db.session.commit()

    if room.available_beds < 1:
        return jsonify({'error':'Brak dostępnych łóżek'}), 400

    return "Rezerwacja została dodana"

@reservations_bp.route('/<int:hotel_id>/<int:reservation_id>', methods=['PUT'])
def update_reservation(hotel_id, reservation_id):
    data = request.get_json()
    reservation = Reservation.query.filter_by(id=reservation_id, hotel_id=hotel_id).first()
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    room = Room.query.filter_by(room_number=data['room_number'], hotel_id=hotel_id).first()
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    reservation.room_id = room.id
    reservation.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    reservation.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
    db.session.commit()
    return jsonify({'reservation': {
                   'id': reservation.id,
                   'start_date': reservation.start_date.strftime('%Y-%m-%d'),
                   'end_date': reservation.end_date.strftime('%Y-%m-%d'),
                    'is_paid': reservation.is_paid
    }
    }), 200
@reservations_bp.route('/<int:hotel_id>/<int:reservation_id>', methods=['DELETE']) 
def delete_reservation(hotel_id, reservation_id):
    reservation = Reservation.query.filter_by(id=reservation_id, hotel_id=hotel_id).first()
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    room = Room.query.filter_by(id=reservation.room_id).first()
    room.available_beds += 1
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation deleted successfully'}), 200
@reservations_bp.route('/<int:hotel_id>/<int:reservation_id>', methods=['PATCH'])
def patch_reservation(hotel_id, reservation_id):
    data = request.get_json()
    reservation = Reservation.query.filter_by(id=reservation_id, hotel_id=hotel_id).first()
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    if 'start_date' in data:
        reservation.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    if 'end_date' in data:
        reservation.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
    if 'is_paid' in data:
        reservation.is_paid = data['is_paid']
    if 'note' in data:
        reservation.note = data['note']
    db.session.commit()
    return jsonify({'reservation': {
                   'id': reservation.id,
                   'start_date': reservation.start_date.strftime('%Y-%m-%d'),
                   'end_date': reservation.end_date.strftime('%Y-%m-%d'),
                    'is_paid': reservation.is_paid,
                    'note': reservation.note
    }
    }), 200
@reservations_bp.route('/<int:hotel_id>/<int:reservation_id>', methods=['GET'])
def getNote(hotel_id, reservation_id):
    reservation = Reservation.query.filter_by(id=reservation_id, hotel_id=hotel_id).first()
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    return (jsonify({'note': reservation.note})), 200
