from api.app import db, ma
from datetime import datetime
import sqlalchemy as sa

class Account(db.Model):
    __tablename__ = "accounts"

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.Text, nullable=False)
    customer = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.true())
    developer = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.false())
    admin = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.false())
    active = db.Column(db.Boolean, nullable=False, server_default=sa.sql.expression.true())

    def __init__(self, firstname, lastname, username, password):
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.password = password

class AccountSchema(ma.ModelSchema):
    class Meta:
        model = Account

account_schema = AccountSchema()
accounts_schema = AccountSchema(many=True)