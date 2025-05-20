from flask import Blueprint, request, jsonify
from ..models import Hotel,Room,Reservation
from ..extensions import db
from datetime import datetime

hotels_bp = Blueprint('hotels', __name__)

@hotels_bp.route('/', methods = ['GET'])
def get_hotels():
    hotels = Hotel.query.all()
    return jsonify([hotel.to_dict() for hotel in hotels])
@hotels_bp.route('/<int:hotel_id>', methods = ['GET'])
def get_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    return jsonify(hotel.to_dict())
@hotels_bp.route('/', methods = ['POST'])
def send_hotel():
    name = request.json.get('name')
    address = request.json.get('address')
    city = request.json.get('city')
    new_hotel = Hotel(name=name, address=address, city=city )
    db.session.add(new_hotel)
    db.session.commit()
    return jsonify([new_hotel.to_dict()]),201
@hotels_bp.route('/delete/<int:hotel_id>', methods = ['DELETE'])
def del_hotel(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    db.session.delete(hotel)
    db.session.commit()
    return (f"Hotel {hotel_id} został usunięty"),200
