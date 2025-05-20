from app.extensions import db
from datetime import datetime

#tabeli jest 5 - hotels, rooms, users, reservations, admins

class Hotel(db.Model):
    __tablename__= 'hotels'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))

    rooms = db.relationship('Room', back_populates = 'hotel')
    reservations = db.relationship('Reservation', back_populates = 'hotel')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'city': self.city
        }

class Reservation(db.Model):
    __tablename__= 'reservations'
    id = db.Column(db.Integer, primary_key = True)
    start_date = db.Column(db.DateTime, nullable = False)
    end_date = db.Column(db.DateTime, nullable = False)
    is_paid = db.Column(db.Boolean, default = False)
    note = db.Column(db.Text)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))

    user = db.relationship('User', back_populates = 'reservations')
    room = db.relationship('Room', back_populates = 'reservations')
    hotel = db.relationship('Hotel', back_populates = 'reservations')
    
    def to_dict(self):
        return {
            'id':self.id,
            'user_id':self.user_id,
            'room_id':self.room_id,
            'hotel_id':self.hotel_id,
            'start_date':self.start_date,
            'end_date':self.end_date,
            'is_paid':self.is_paid,
            'note':self.note
        }

class Room(db.Model):
    __tablename__= 'rooms'
    id = db.Column(db.Integer, primary_key = True)
    room_number = db.Column(db.Integer, nullable=False)
    total_beds = db.Column(db.Integer, nullable=False)
    available_beds = db.Column(db.Integer, nullable=False)

    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))

    hotel = db.relationship('Hotel', back_populates = 'rooms')
    reservations = db.relationship('Reservation', back_populates ='room')

    def to_dict(self):
        return {
            'id':self.id,
            'room_number':self.room_number,
            'total_beds':self.total_beds,
            'available_beds':self.available_beds
        }
class User(db.Model):
    __tablename__= 'users'
    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String(100), nullable = False)
    last_name = db.Column(db.String(100), nullable = False)
    email = db.Column(db.String(100), unique=True, nullable = False)

    reservations = db.relationship('Reservation', back_populates = 'user')

    def to_dict(self):
        return {
            'id':self.id,
            'first_name':self.first_name,
            'last_name':self.last_name,
            'email':self.email
        }
class Admin(db.Model):
    __tablename__= 'admins'
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(100), unique=True, nullable = False)
    password = db.Column(db.String(200), nullable = False)
    role = db.Column(db.String(50), nullable = False) # admin, manager, etc.

    def to_dict(self):
        return {
            'id':self.id,
            'username':self.username,
            'role':self.role
        }