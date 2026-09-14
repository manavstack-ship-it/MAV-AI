from brain.llm import ask_mav

from tools.clock import get_time

from tools.reminder import (
    add_reminder,
    list_reminders,
    delete_reminder
)


print("=" * 50)
print("MAV v0.2")
print("Type 'exit' to quit")
print("=" * 50)

while True:

    user = input("\nYou: ")

    if user.lower() == "exit":
        break

    if user.lower() == "time":

        t = get_time()

        print(f"\nDate : {t['date']}")
        print(f"Time : {t['time']}")
        print(f"Day  : {t['weekday']}")

        continue

    elif user.lower().startswith("remind"):

        print("\nExample:")
        print("tomorrow 5pm|Call Mom")

        data = input("\nReminder: ")

        try:
            time_text, message = data.split("|", 1)

            print(add_reminder(time_text.strip(), message.strip()))

        except:
            print("Format should be:")
            print("tomorrow 5pm|Call Mom")

        continue

    elif user.lower() == "list reminders":

        reminders = list_reminders()

        if not reminders:
            print("No reminders.")
        else:
            for r in reminders:
                print(r)

        continue

    elif user.lower().startswith("delete reminder"):

        try:
            rid = int(user.split()[-1])

            print(delete_reminder(rid))

        except:
            print("Example: delete reminder 2")

        continue

    print("\nMAV:", ask_mav(user))

print("Goodbye!")