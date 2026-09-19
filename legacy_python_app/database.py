import sqlite3
import json
import random
from datetime import datetime, timedelta

def get_db_connection():
    conn = sqlite3.connect('journey.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Create tables
    c.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            email TEXT,
            phone TEXT,
            device_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            churned BOOLEAN DEFAULT FALSE
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT,
            channel TEXT, 
            event_type TEXT,
            status TEXT,
            timestamp DATETIME,
            details TEXT,
            FOREIGN KEY(customer_id) REFERENCES customers(id)
        )
    ''')
    
    # Create identity map to handle resolution
    c.execute('''
        CREATE TABLE IF NOT EXISTS identity_map (
            identifier_value TEXT PRIMARY KEY,
            identifier_type TEXT,
            customer_id TEXT,
            FOREIGN KEY(customer_id) REFERENCES customers(id)
        )
    ''')
    
    conn.commit()
    conn.close()

def seed_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Check if empty
    c.execute('SELECT COUNT(*) FROM customers')
    if c.fetchone()[0] > 0:
        return
        
    print("Seeding database...")
    channels = ['Web', 'Mobile App', 'Call Center', 'Physical Store']
    event_types = ['Login', 'Viewed Product', 'Added to Cart', 'Checkout', 'Payment Failed', 'Support Call', 'Complaint', 'Resolved', 'Dropped Off']
    
    for i in range(1, 51):
        cust_id = f"CUST-{i:04d}"
        churned = random.choice([True, False, False, False]) # 25% churn rate
        c.execute('INSERT INTO customers (id, email, phone, churned) VALUES (?, ?, ?, ?)', 
                 (cust_id, f"user{i}@example.com", f"555-01{i:02d}", churned))
        
        # Add identities
        c.execute('INSERT INTO identity_map (identifier_value, identifier_type, customer_id) VALUES (?, ?, ?)',
                 (f"user{i}@example.com", 'email', cust_id))
        
        # Generate some events
        num_events = random.randint(3, 15)
        base_time = datetime.now() - timedelta(days=random.randint(1, 30))
        
        for j in range(num_events):
            channel = random.choice(channels)
            evt = random.choice(event_types)
            status = "Completed"
            if evt == 'Support Call':
                status = random.choice(['Resolved', 'Escalated', 'Dropped'])
            if evt == 'Checkout' and random.random() < 0.3:
                evt = 'Dropped Off'
                status = 'Failed'
                
            event_time = base_time + timedelta(hours=j*random.randint(1, 12))
            
            c.execute('''
                INSERT INTO events (customer_id, channel, event_type, status, timestamp, details)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (cust_id, channel, evt, status, event_time.strftime("%Y-%m-%d %H:%M:%S"), json.dumps({"note": "seeded data"})))
            
    conn.commit()
    conn.close()
    print("Seeding complete.")

if __name__ == '__main__':
    init_db()
    seed_db()
