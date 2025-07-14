# Alarm handler idea

You **cannot** use a simple JavaScript `setInterval` or `setTimeout` for this. The moment your app is closed or the phone goes to sleep, the operating system (iOS or Android) will freeze or kill your app's JavaScript process to save battery. Your timer will stop.

To reliably trigger an event at a specific time, even when your app is in the background or closed, you must use the **native operating system's alarm or task scheduling tools**.

In Expo, the way to do this is with the **`expo-task-manager`** and **`expo-notifications`** libraries working together.

---

### The Core Concept: The "Wake Up Call" Analogy

Think of it like this:

1.  **You (The App):** You can't stay awake all night waiting for 7:00 AM. You'll run out of energy (battery).
2.  **The Hotel Front Desk (The OS):** You need to tell someone else who is *always* awake—the hotel front desk (the operating system)—to wake you up.
3.  **The Wake-Up Call:** You call the front desk and say, "Please give me a wake-up call at exactly 7:00 AM." This is you **scheduling a local notification**.
4.  **Going to Sleep:** You can now safely close your app and the phone can go to sleep. The OS has taken note of your request.
5.  **The Phone Rings:** At exactly 7:00 AM, the OS (the front desk) makes the "call." This "call" is a **local notification**. It can show a message to the user, play a sound, and—most importantly—it can **wake up a small, specific part of your app** to run some code in the background.

This background code is what will start your light-up sequence.

---

### The Logic and Flow: How to Implement This

Here is the high-level process you need to follow.

#### Part 1: Setting Up the "Background Task"

This is a one-time setup. You need to define what code should run when the "wake-up call" comes in.

1.  **Define the Task:** Using `expo-task-manager`, you will define a background task. You give it a unique name, like `'WAKE_UP_CYCLE_TASK'`.
2.  **Write the Task's Code:** You write the function that will be executed. This function will receive the notification data. Its job is simple: get the alarm details (like the IP address of the lamp) and start sending the `fetch` requests to the lamp to begin the gradual light-up process.
    *   **Crucially:** This background task is a very restricted environment. It runs for a very short period (e.g., 30 seconds). You cannot do heavy processing or UI updates here. It's just for starting a process like your fetch loop.

#### Part 2: Scheduling the "Wake-Up Call"

This happens whenever a user creates or enables an alarm.

1.  **Ask for Permission:** The very first time, you must ask the user for permission to send them notifications. You use `Notifications.requestPermissionsAsync()`.
2.  **Calculate the Trigger Time:** When the user sets an alarm for 7:00 AM, you calculate the trigger time.
3.  **Schedule the Notification:** You use `Notifications.scheduleNotificationAsync()`. This is you telling the OS, "At this specific `trigger` time, please deliver this notification."
    *   In the notification's `content`, you can include a `data` object. This is where you'll put the alarm's ID or the device's IP address. This data will be passed to your background task.
4.  **Cancel Old Notifications:** It's very important that if a user *changes* or *disables* an alarm, you must find and cancel the previously scheduled notification using `Notifications.cancelScheduledNotificationAsync()`.

#### Part 3: The Event Unfolds

1.  The user sets an alarm for 7:00 AM. Your app schedules a local notification for that time with the lamp's IP address in the `data` payload. The user closes the app.
2.  The phone's clock hits 7:00 AM.
3.  The **Operating System** wakes up. It sees the scheduled notification.
4.  It delivers the notification. The user might see a banner that says "Time to wake up!"
5.  Simultaneously, the OS sees that this notification is linked to your background task (`'WAKE_UP_CYCLE_TASK'`).
6.  The OS gives your app a few seconds of background processing time and runs the function you defined for that task.
7.  Your task code executes. It gets the lamp's IP from the notification's data and starts the `while` loop that gradually increases the brightness by sending a series of `fetch` requests.

### In Summary: Your Mental Model

| Your Goal | The Wrong Way (Won't Work) | The Right Way (Native Scheduling) |
| :--- | :--- | :--- |
| **Trigger at a specific time** | `setTimeout` or `setInterval` in your main app code. | Schedule a **Local Notification** with a specific `trigger` time using `expo-notifications`. |
| **Run code in the background** | A `while` loop running inside a React component. | Define a **Background Task** using `expo-task-manager`. |
| **Connect the two** | N/A | The scheduled notification itself triggers the background task to run when the time is met. |

This is the only reliable way to build a wake-up alarm or any app that needs to perform a precise, time-based action when it's not in the foreground.