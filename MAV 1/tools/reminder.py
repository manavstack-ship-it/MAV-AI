import sqlite3
import dateparser

DATABASE = "data/reminders.db"

def create_database():
    conn = sqlite3.connect(DATABASE)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS reminders(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            datetime TEXT,
            message TEXT
        )
    """)
    conn.commit()
    conn.close()

def add_reminder(time_text, message):
    dt = dateparser.parse(time_text)

    if dt is None:
        return "Invalid date."

    conn = sqlite3.connect(DATABASE)
    conn.execute(
        "INSERT INTO reminders(datetime, message) VALUES (?, ?)",
        (dt.isoformat(), message)
    )
    conn.commit()
    conn.close()

    return "Reminder added."

def list_reminders():
    conn = sqlite3.connect(DATABASE)
    rows = conn.execute("SELECT * FROM reminders").fetchall()
    conn.close()
    return rows

def delete_reminder(reminder_id):
    conn = sqlite3.connect(DATABASE)
    conn.execute("DELETE FROM reminders WHERE id=?", (reminder_id,))
    conn.commit()
    conn.close()
    return "Reminder deleted."

create_database()