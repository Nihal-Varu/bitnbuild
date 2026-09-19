import os
import json
from flask import Flask, render_template, request, jsonify
from database import get_db_connection, init_db, seed_db

app = Flask(__name__)

# Ensure DB is initialized
if not os.path.exists('journey.db'):
    init_db()
    seed_db()

# --- Page Routes ---
@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/dropoffs')
def dropoffs_page():
    return render_template('dropoffs.html')

@app.route('/support')
def support_page():
    return render_template('support.html')

@app.route('/churn')
def churn_page():
    return render_template('churn.html')

@app.route('/ingestion')
def ingestion_page():
    return render_template('ingestion.html')

# --- API Routes ---

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

@app.route('/api/analytics/dropoffs')
def get_dropoff_analytics():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute("SELECT channel, COUNT(*) as count FROM events WHERE event_type = 'Dropped Off' OR status = 'Failed' GROUP BY channel")
    by_channel = [dict(row) for row in c.fetchall()]
    
    # Fake funnel logic based on seeded data events prior to dropping off
    c.execute("SELECT event_type as stage, COUNT(*) as count FROM events WHERE event_type IN ('Login', 'Viewed Product', 'Added to Cart', 'Checkout', 'Dropped Off') GROUP BY event_type")
    raw_stages = {row['stage']: row['count'] for row in c.fetchall()}
    by_stage = [
        {"stage": "Login", "count": raw_stages.get('Login', 0)},
        {"stage": "Viewed Product", "count": raw_stages.get('Viewed Product', 0)},
        {"stage": "Added to Cart", "count": raw_stages.get('Added to Cart', 0)},
        {"stage": "Checkout", "count": raw_stages.get('Checkout', 0)},
        {"stage": "Dropped Off", "count": raw_stages.get('Dropped Off', 0)}
    ]
    # Sort funnel descending
    by_stage.sort(key=lambda x: x['count'], reverse=True)
    
    c.execute("SELECT timestamp, customer_id, channel, event_type FROM events WHERE event_type = 'Dropped Off' OR status = 'Failed' ORDER BY timestamp DESC LIMIT 10")
    recent = [dict(row) for row in c.fetchall()]
    
    conn.close()
    return jsonify({"by_channel": by_channel, "by_stage": by_stage, "recent": recent})

@app.route('/api/analytics/support')
def get_support_analytics():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute("SELECT status, COUNT(*) as count FROM events WHERE event_type = 'Support Call' OR event_type = 'Complaint' GROUP BY status")
    status_raw = c.fetchall()
    status_breakdown = {row['status']: row['count'] for row in status_raw}
    
    c.execute("SELECT COUNT(*) FROM events WHERE status = 'Escalated'")
    total_escalations = c.fetchone()[0]
    
    c.execute("SELECT COUNT(*) FROM events WHERE status = 'Unresolved' OR status = 'Dropped' AND (event_type = 'Support Call' OR event_type = 'Complaint')")
    total_unresolved = c.fetchone()[0]
    
    c.execute('''
        SELECT COUNT(*) FROM (
            SELECT customer_id, COUNT(*) as c FROM events 
            WHERE event_type = 'Support Call' OR event_type = 'Complaint' 
            GROUP BY customer_id HAVING c > 2
        )
    ''')
    repeat_contacts = c.fetchone()[0]
    
    c.execute("SELECT customer_id, channel, timestamp FROM events WHERE status = 'Unresolved' OR (status = 'Dropped' AND event_type = 'Support Call') ORDER BY timestamp DESC LIMIT 15")
    unresolved_cases = [dict(row) for row in c.fetchall()]
    
    conn.close()
    return jsonify({
        "status_breakdown": status_breakdown,
        "total_escalations": total_escalations,
        "total_unresolved": total_unresolved,
        "repeat_contacts": repeat_contacts,
        "unresolved_cases": unresolved_cases
    })

@app.route('/api/analytics/churn')
def get_churn_analytics():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Baseline
    c.execute('SELECT COUNT(*) FROM customers')
    total = c.fetchone()[0]
    c.execute('SELECT COUNT(*) FROM customers WHERE churned = 1')
    churned = c.fetchone()[0]
    baseline = round((churned / total * 100), 2) if total > 0 else 0
    
    # Churn w/ Escalation
    c.execute('''
        SELECT COUNT(DISTINCT c.id) FROM customers c
        JOIN events e ON c.id = e.customer_id
        WHERE e.status = 'Escalated'
    ''')
    total_esc = c.fetchone()[0]
    
    c.execute('''
        SELECT COUNT(DISTINCT c.id) FROM customers c
        JOIN events e ON c.id = e.customer_id
        WHERE e.status = 'Escalated' AND c.churned = 1
    ''')
    churn_esc = c.fetchone()[0]
    escalation_churn = round((churn_esc / total_esc * 100), 2) if total_esc > 0 else 0
    
    # Churn w/ Drop-off
    c.execute('''
        SELECT COUNT(DISTINCT c.id) FROM customers c
        JOIN events e ON c.id = e.customer_id
        WHERE e.event_type = 'Dropped Off'
    ''')
    total_drop = c.fetchone()[0]
    
    c.execute('''
        SELECT COUNT(DISTINCT c.id) FROM customers c
        JOIN events e ON c.id = e.customer_id
        WHERE e.event_type = 'Dropped Off' AND c.churned = 1
    ''')
    churn_drop = c.fetchone()[0]
    dropoff_churn = round((churn_drop / total_drop * 100), 2) if total_drop > 0 else 0
    
    conn.close()
    return jsonify({
        "baseline": baseline,
        "escalation_churn": escalation_churn,
        "dropoff_churn": dropoff_churn
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
        c.execute('INSERT INTO customers (id, email) VALUES (?, ?)', (customer_id, identifier if identifier_type == 'email' else None))
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
