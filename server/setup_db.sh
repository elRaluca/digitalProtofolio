#!/bin/bash

# Importa structura bazei de date
mysql -u root -p  digital_portfolio < database_structure.sql

# Importa datele bazei de date
mysql -u root -p  digital_portfolio < database_data.sql
