from flask import Flask, jsonify, render_template
from .extensions import db, jwt, bcrypt
from .config import Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app,supports_credentials=True , origins=[""])


    @app.route('/')
    def index():
        return "<h1>Hello World</h1>"

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from .routes.hotels import hotels_bp
    from .routes.reservations import reservations_bp
    from .routes.rooms import rooms_bp
    from .routes.admin import admins_bp

    
    app.register_blueprint(hotels_bp, url_prefix = '/hotels')
    app.register_blueprint(reservations_bp, url_prefix = '/reservations')
    app.register_blueprint(rooms_bp, url_prefix = '/rooms')
    app.register_blueprint(admins_bp, url_prefix = '/admins')

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Not found'}), 404

    return app
