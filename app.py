import os
import json
from flask import Flask, render_template, request, jsonify
from database import get_db_connection, init_db, seed_db

app = Flask(__name__)

# Ensure DB is initialized
if not os.path.exists('journey.db'):
    init_db()
    seed_db()

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/analytics')
def get_analytics():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Total Users
    c.execute('SELECT COUNT(*) FROM customers')
    total_users = c.fetchone()[0]
    
    # Churn Rate
    c.execute('SELECT COUNT(*) FROM customers WHERE churned = 1')
    churned_users = c.fetchone()[0]
    churn_rate = (churned_users / total_users * 100) if total_users > 0 else 0
    
    # Drop-offs by channel
    c.execute('''
        SELECT channel, COUNT(*) as count 
        FROM events 
        WHERE event_type = 'Dropped Off' 
        GROUP BY channel
    ''')
    drop_offs = [dict(row) for row in c.fetchall()]
    
    # Escalations by channel
    c.execute('''
        SELECT channel, COUNT(*) as count 
        FROM events 
        WHERE status = 'Escalated' 
        GROUP BY channel
    ''')
    escalations = [dict(row) for row in c.fetchall()]
    
    conn.close()
    
    return jsonify({
        'total_users': total_users,
        'churn_rate': round(churn_rate, 2),
        'drop_offs': drop_offs,
        'escalations': escalations
    })

@app.route('/api/customers')
def get_customers():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM customers LIMIT 50')
    customers = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(customers)

@app.route('/api/customers/<customer_id>/journey')
def get_customer_journey(customer_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM events WHERE customer_id = ? ORDER BY timestamp ASC', (customer_id,))
    events = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(events)

@app.route('/api/ingest', methods=['POST'])
def ingest_event():
    data = request.json
    
    identifier = data.get('identifier')
    identifier_type = data.get('identifier_type') # e.g., email, phone, cookie
    channel = data.get('channel')
    event_type = data.get('event_type')
    status = data.get('status', 'Completed')
    details = json.dumps(data.get('details', {}))
    
    conn = get_db_connection()
    c = conn.cursor()
    
    # Identity Resolution
    c.execute('SELECT customer_id FROM identity_map WHERE identifier_value = ?', (identifier,))
    result = c.fetchone()
    
    if result:
        customer_id = result[0]
    else:
        # Create new customer if not found
        customer_id = f"CUST-NEW-{len(identifier)}" # Simple ID generation
        c.execute('INSERT INTO customers (id) VALUES (?)', (customer_id,))
        c.execute('INSERT INTO identity_map (identifier_value, identifier_type, customer_id) VALUES (?, ?, ?)',
                  (identifier, identifier_type, customer_id))
    
    # Record Event
    c.execute('''
        INSERT INTO events (customer_id, channel, event_type, status, timestamp, details)
        VALUES (?, ?, ?, ?, datetime('now'), ?)
    ''', (customer_id, channel, event_type, status, details))
    
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success", "customer_id": customer_id})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
